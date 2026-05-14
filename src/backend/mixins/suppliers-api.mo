import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/suppliers";
import Common "../types/common";
import SuppliersLib "../lib/suppliers";

mixin (
  suppliers : Map.Map<Types.SupplierId, Types.SupplierInternal>,
  supplierProducts : Map.Map<Types.SupplierId, List.List<Common.ProductId>>,
  config : { var nextSupplierId : Nat },
) {
  public func createSupplier(args : Types.CreateSupplierArgs) : async Types.Supplier {
    SuppliersLib.createSupplier(suppliers, config, args);
  };

  public query func getSupplier(id : Types.SupplierId) : async ?Types.Supplier {
    SuppliersLib.getSupplier(suppliers, id);
  };

  public func updateSupplier(id : Types.SupplierId, args : Types.UpdateSupplierArgs) : async ?Types.Supplier {
    SuppliersLib.updateSupplier(suppliers, id, args);
  };

  public func deleteSupplier(id : Types.SupplierId) : async Bool {
    SuppliersLib.deleteSupplier(suppliers, id);
  };

  public query func listSuppliers(isActiveFilter : ?Bool) : async [Types.Supplier] {
    SuppliersLib.listSuppliers(suppliers, isActiveFilter);
  };

  public query func getSupplierProducts(id : Types.SupplierId) : async [Common.ProductId] {
    SuppliersLib.getSupplierProducts(supplierProducts, id);
  };
};
