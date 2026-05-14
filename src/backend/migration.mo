import Map "mo:core/Map";
import List "mo:core/List";
import InvTypes "types/inventory";
import POTypes "types/purchase-orders";
import SupTypes "types/suppliers";
import CommonTypes "types/common";

module {
  // ── Old schema types (inline, matching backend.most exactly) ─────────────────
  // Old stable fields from .old/src/backend/dist/backend.most:
  //   stable config : { var globalLowStockThreshold : Nat; var nextHistoryId : Nat; var nextProductId : Nat }
  //   stable products : Map.Map<Nat, OldProductInternal>
  //   stable stockHistory : List.List<OldStockHistoryEntry>

  type OldAdjustmentType = { #restock; #remove };

  // Matches ProductInternal__551325612 in backend.most (fields in alphabetical order as in .most)
  type OldProductInternal = {
    var category : Text;
    var description : Text;
    id : Nat;                       // ProductId__6435572 = Nat
    var lastModified : Int;         // Timestamp__288252184 = Int
    var lowStockThreshold : ?Nat;
    var name : Text;
    var price : Nat;
    var quantity : Nat;
    var sku : Text;
  };

  // Matches StockHistoryEntry__403027874 in backend.most (fields in alphabetical order as in .most)
  type OldStockHistoryEntry = {
    adjustmentType : OldAdjustmentType;
    id : Nat;
    note : ?Text;
    productId : Nat;                // ProductId__6435572 = Nat
    quantity : Nat;
    timestamp : Int;                // Timestamp__288252184 = Int
  };

  // The mops EOP compiler wraps all stable fields into a single `_state` record.
  // OldActor must define `_state` AND the individual top-level stable fields
  // (as seen in backend.most) so the migration explicitly consumes them all.
  type OldActor = {
    _state : {
      config : {
        var globalLowStockThreshold : Nat;
        var nextHistoryId : Nat;
        var nextProductId : Nat;
      };
      products : Map.Map<Nat, OldProductInternal>;
      stockHistory : List.List<OldStockHistoryEntry>;
    };
    // Individual top-level stable fields also present in old actor (backend.most)
    config : {
      var globalLowStockThreshold : Nat;
      var nextHistoryId : Nat;
      var nextProductId : Nat;
    };
    products : Map.Map<Nat, OldProductInternal>;
    stockHistory : List.List<OldStockHistoryEntry>;
  };

  // ── New schema types (matching new main.mo stable fields exactly) ─────────────

  type NewActor = {
    products : Map.Map<InvTypes.ProductId, InvTypes.ProductInternal>;
    stockHistory : List.List<InvTypes.StockHistoryEntry>;
    invConfig : {
      var globalLowStockThreshold : Nat;
      var nextProductId : Nat;
      var nextHistoryId : Nat;
    };
    suppliers : Map.Map<SupTypes.SupplierId, SupTypes.SupplierInternal>;
    supplierProducts : Map.Map<SupTypes.SupplierId, List.List<CommonTypes.ProductId>>;
    supplierConfig : { var nextSupplierId : Nat };
    purchaseOrders : Map.Map<POTypes.POId, POTypes.PurchaseOrderInternal>;
    poConfig : { var nextPOId : Nat };
  };

  // ── Migration function ────────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // The old actor exposes stable state via `_state` wrapper (EOP pattern)
    let s = old._state;

    // Migrate products: extend with new fields absent in old schema
    let products = s.products.map<Nat, OldProductInternal, InvTypes.ProductInternal>(
      func(_id, p) {
        {
          id = p.id;
          var sku = p.sku;
          var name = p.name;
          var description = p.description;
          var category = p.category;
          var quantity = p.quantity;
          var price = p.price;
          var costPrice = p.price;           // default cost = old price
          var sellingPrice = p.price;        // default selling = old price
          var unitOfMeasure = "units";       // default unit of measure
          var reorderQuantity = 5;           // sensible default
          var barcode = null : ?Text;        // no barcode in old schema
          var supplierId = null : ?CommonTypes.SupplierId;
          var lowStockThreshold = p.lowStockThreshold;
          var lastModified = p.lastModified;
        };
      }
    );

    // Migrate stock history: map to new type
    let stockHistory = s.stockHistory.map<OldStockHistoryEntry, InvTypes.StockHistoryEntry>(
      func(e) {
        {
          id = e.id;
          productId = e.productId;
          adjustmentType = switch (e.adjustmentType) {
            case (#restock) #restock;
            case (#remove) #remove;
          };
          quantity = e.quantity;
          note = e.note;
          notes = null : ?Text;   // new extended notes field
          timestamp = e.timestamp;
        };
      }
    );

    // Rename config -> invConfig (preserving all values)
    let invConfig = {
      var globalLowStockThreshold = s.config.globalLowStockThreshold;
      var nextProductId = s.config.nextProductId;
      var nextHistoryId = s.config.nextHistoryId;
    };

    {
      products;
      stockHistory;
      invConfig;
      suppliers = Map.empty<SupTypes.SupplierId, SupTypes.SupplierInternal>();
      supplierProducts = Map.empty<SupTypes.SupplierId, List.List<CommonTypes.ProductId>>();
      supplierConfig = { var nextSupplierId = 0 };
      purchaseOrders = Map.empty<POTypes.POId, POTypes.PurchaseOrderInternal>();
      poConfig = { var nextPOId = 0 };
    };
  };
};
