import Types "../types/inventory";
import InventoryLib "../lib/inventory";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  products : Map.Map<Types.ProductId, Types.ProductInternal>,
  stockHistory : List.List<Types.StockHistoryEntry>,
  config : { var globalLowStockThreshold : Nat; var nextProductId : Nat; var nextHistoryId : Nat }
) {

  let _state : InventoryLib.State = { products; stockHistory; config };

  // ── Product Management ────────────────────────────────────────────────────

  public func createProduct(args : Types.CreateProductArgs) : async { #ok : Types.Product; #err : Text } {
    InventoryLib.createProduct(_state, args, Time.now());
  };

  public func updateProduct(args : Types.UpdateProductArgs) : async { #ok : Types.Product; #err : Text } {
    InventoryLib.updateProduct(_state, args, Time.now());
  };

  public func deleteProduct(id : Types.ProductId) : async { #ok; #err : Text } {
    InventoryLib.deleteProduct(_state, id);
  };

  public query func getProduct(id : Types.ProductId) : async ?Types.Product {
    InventoryLib.getProduct(_state, id);
  };

  public query func listProducts() : async [Types.Product] {
    InventoryLib.listProducts(_state);
  };

  // ── Stock Operations ──────────────────────────────────────────────────────

  public func adjustStock(args : Types.AdjustStockArgs) : async { #ok : Types.Product; #err : Text } {
    InventoryLib.adjustStock(_state, args, Time.now());
  };

  public query func getStockHistory(productId : ?Types.ProductId) : async [Types.StockHistoryEntry] {
    InventoryLib.getStockHistory(_state, productId);
  };

  public query func getGlobalLowStockThreshold() : async Nat {
    InventoryLib.getGlobalThreshold(_state);
  };

  public func setGlobalLowStockThreshold(threshold : Nat) : async () {
    InventoryLib.setGlobalThreshold(_state, threshold);
  };

  // ── Search & Filtering ────────────────────────────────────────────────────

  public query func searchProducts(args : Types.SearchFilterArgs) : async [Types.Product] {
    InventoryLib.searchProducts(_state, args);
  };
};
