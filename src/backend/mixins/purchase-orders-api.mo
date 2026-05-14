import List "mo:core/List";
import Map "mo:core/Map";
import POLib "../lib/purchase-orders";
import Types "../types/purchase-orders";
import InvTypes "../types/inventory";

mixin (
  pos : Map.Map<Types.POId, Types.PurchaseOrderInternal>,
  products : Map.Map<Types.ProductId, InvTypes.ProductInternal>,
  stockHistory : List.List<InvTypes.StockHistoryEntry>,
  poConfig : { var nextPOId : Nat },
  invConfig : { var nextHistoryId : Nat; var globalLowStockThreshold : Nat; var nextProductId : Nat }
) {

  public shared func createPO(args : Types.CreatePOArgs) : async Types.PurchaseOrder {
    POLib.createPO(pos, poConfig, args);
  };

  public shared query func getPO(id : Types.POId) : async ?Types.PurchaseOrder {
    POLib.getPO(pos, id);
  };

  public shared func updatePOStatus(args : Types.UpdatePOStatusArgs) : async ?Types.PurchaseOrder {
    POLib.updatePOStatus(pos, args);
  };

  public shared func receivePO(
    id : Types.POId,
    receivedItems : [Types.ReceiveItemArgs]
  ) : async ?Types.PurchaseOrder {
    POLib.receivePO(pos, products, stockHistory, invConfig, id, receivedItems);
  };

  public shared query func listPOs(statusFilter : ?Types.POStatus) : async [Types.PurchaseOrder] {
    POLib.listPOs(pos, statusFilter);
  };

  public shared query func getPOsBySupplier(supplierId : Types.SupplierId) : async [Types.PurchaseOrder] {
    POLib.getPOsBySupplier(pos, supplierId);
  };

  public shared func cancelPO(id : Types.POId) : async ?Types.PurchaseOrder {
    POLib.cancelPO(pos, id);
  };
};
