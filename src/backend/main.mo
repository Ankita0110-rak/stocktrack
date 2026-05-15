import Map "mo:core/Map";
import List "mo:core/List";
import InvTypes "types/inventory";
import POTypes "types/purchase-orders";
import SupTypes "types/suppliers";
import CommonTypes "types/common";
import InventoryApi "mixins/inventory-api";
import SuppliersApi "mixins/suppliers-api";
import PurchaseOrdersApi "mixins/purchase-orders-api";
import InventoryLib "lib/inventory";



actor {
  // ── Inventory state ───────────────────────────────────────────────────────
  let products = Map.empty<InvTypes.ProductId, InvTypes.ProductInternal>();
  let stockHistory = List.empty<InvTypes.StockHistoryEntry>();
  let invConfig = {
    var globalLowStockThreshold : Nat = 10;
    var nextProductId : Nat = 0;
    var nextHistoryId : Nat = 0;
  };

  // ── Suppliers state ───────────────────────────────────────────────────────
  let suppliers = Map.empty<SupTypes.SupplierId, SupTypes.SupplierInternal>();
  let supplierProducts = Map.empty<SupTypes.SupplierId, List.List<CommonTypes.ProductId>>();
  let supplierConfig = { var nextSupplierId : Nat = 0 };

  // ── Purchase orders state ─────────────────────────────────────────────────
  let purchaseOrders = Map.empty<POTypes.POId, POTypes.PurchaseOrderInternal>();
  let poConfig = { var nextPOId : Nat = 0 };

  // ── Mixin includes ────────────────────────────────────────────────────────
  include InventoryApi(products, stockHistory, invConfig);
  include SuppliersApi(suppliers, supplierProducts, supplierConfig);
  include PurchaseOrdersApi(purchaseOrders, products, stockHistory, poConfig, invConfig);

  // ── Dashboard override: augments pendingPOCount and pendingPOValue ─────────
  public query func getDashboardMetrics() : async InvTypes.DashboardMetrics {
    let base = InventoryLib.getDashboardMetrics({ products; stockHistory; config = invConfig });
    var pendingPOCount : Nat = 0;
    var pendingPOValue : Nat = 0;
    purchaseOrders.forEach(func(_id, po) {
      switch (po.status) {
        case (#draft or #sent or #partiallyReceived) {
          pendingPOCount += 1;
          pendingPOValue += po.totalAmount;
        };
        case _ {};
      };
    });
    { base with pendingPOCount; pendingPOValue };
  };
};
