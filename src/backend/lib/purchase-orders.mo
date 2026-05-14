import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import InvLib "../lib/inventory";
import Types "../types/purchase-orders";
import InvTypes "../types/inventory";

module {
  public type POId = Types.POId;
  public type SupplierId = Types.SupplierId;
  public type ProductId = Types.ProductId;
  public type PurchaseOrder = Types.PurchaseOrder;
  public type PurchaseOrderInternal = Types.PurchaseOrderInternal;
  public type POStatus = Types.POStatus;
  public type CreatePOArgs = Types.CreatePOArgs;
  public type UpdatePOStatusArgs = Types.UpdatePOStatusArgs;
  public type ReceiveItemArgs = Types.ReceiveItemArgs;

  // Convert internal PO to shared PO
  func toPublic(po : PurchaseOrderInternal) : PurchaseOrder {
    let items = po.lineItems.map(
      func(li) {
        {
          productId = li.productId;
          productName = li.productName;
          productSku = li.productSku;
          orderedQty = li.orderedQty;
          receivedQty = li.receivedQty;
          unitCostPrice = li.unitCostPrice;
        }
      }
    );
    {
      id = po.id;
      supplierId = po.supplierId;
      supplierName = po.supplierName;
      status = po.status;
      lineItems = items;
      totalAmount = po.totalAmount;
      expectedDeliveryDate = po.expectedDeliveryDate;
      notes = po.notes;
      createdAt = po.createdAt;
      updatedAt = po.updatedAt;
    };
  };

  public func createPO(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    config : { var nextPOId : Nat },
    args : CreatePOArgs
  ) : PurchaseOrder {
    let now = Time.now();
    let id = config.nextPOId;
    config.nextPOId += 1;
    // Build line items from args, looking up product info from args
    let lineItemsBuf = List.empty<Types.POLineItemInternal>();
    var totalAmount : Nat = 0;
    for (li in args.lineItems.values()) {
      totalAmount += li.orderedQty * li.unitCostPrice;
      lineItemsBuf.add({
        productId = li.productId;
        productName = "";
        productSku = "";
        orderedQty = li.orderedQty;
        var receivedQty = 0;
        unitCostPrice = li.unitCostPrice;
      });
    };
    let lineItems = lineItemsBuf.toArray();
    let po : PurchaseOrderInternal = {
      id;
      supplierId = args.supplierId;
      var supplierName = args.supplierName;
      var status = #draft;
      lineItems;
      var totalAmount;
      var expectedDeliveryDate = args.expectedDeliveryDate;
      var notes = args.notes;
      createdAt = now;
      var updatedAt = now;
    };
    pos.add(id, po);
    toPublic(po);
  };

  public func getPO(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    id : POId
  ) : ?PurchaseOrder {
    switch (pos.get(id)) {
      case null null;
      case (?po) ?toPublic(po);
    };
  };

  public func updatePOStatus(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    args : UpdatePOStatusArgs
  ) : ?PurchaseOrder {
    switch (pos.get(args.id)) {
      case null null;
      case (?po) {
        po.status := args.status;
        po.updatedAt := Time.now();
        ?toPublic(po);
      };
    };
  };

  public func cancelPO(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    id : POId
  ) : ?PurchaseOrder {
    switch (pos.get(id)) {
      case null null;
      case (?po) {
        po.status := #cancelled;
        po.updatedAt := Time.now();
        ?toPublic(po);
      };
    };
  };

  public func receivePO(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    products : Map.Map<ProductId, InvTypes.ProductInternal>,
    stockHistory : List.List<InvTypes.StockHistoryEntry>,
    invConfig : { var nextHistoryId : Nat; var globalLowStockThreshold : Nat; var nextProductId : Nat },
    id : POId,
    receivedItems : [ReceiveItemArgs]
  ) : ?PurchaseOrder {
    switch (pos.get(id)) {
      case null null;
      case (?po) {
        let now = Time.now();
        // Update each line item's receivedQty
        for (recv in receivedItems.values()) {
          for (li in po.lineItems.values()) {
            if (li.productId == recv.productId) {
              li.receivedQty := li.receivedQty + recv.receivedQty;
            };
          };
          // Update stock via inventory lib
          let invState : InvLib.State = {
            products;
            stockHistory;
            config = invConfig;
          };
          ignore InvLib.adjustStock(
            invState,
            {
              productId = recv.productId;
              adjustmentType = #receivedFromPO;
              quantity = recv.receivedQty;
              note = ?("Received from PO #" # id.toText());
            },
            now
          );
        };
        // Determine new status: all items fully received → #received, else #partiallyReceived
        let allReceived = po.lineItems.all(
          func(li) { li.receivedQty >= li.orderedQty }
        );
        po.status := if (allReceived) #received else #partiallyReceived;
        po.updatedAt := now;
        ?toPublic(po);
      };
    };
  };

  public func listPOs(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    statusFilter : ?POStatus
  ) : [PurchaseOrder] {
    // Collect all matching POs
    let result = List.empty<PurchaseOrder>();
    pos.forEach(func(_id, po) {
      let matches = switch (statusFilter) {
        case null true;
        case (?s) po.status == s;
      };
      if (matches) { result.add(toPublic(po)) };
    });
    // Sort by createdAt descending
    result.sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) }).toArray();
  };

  public func getPOsBySupplier(
    pos : Map.Map<POId, PurchaseOrderInternal>,
    supplierId : SupplierId
  ) : [PurchaseOrder] {
    let result = List.empty<PurchaseOrder>();
    pos.forEach(func(_id, po) {
      if (po.supplierId == supplierId) { result.add(toPublic(po)) };
    });
    result.toArray();
  };
};
