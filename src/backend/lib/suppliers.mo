import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/suppliers";
import Common "../types/common";

module {
  public func createSupplier(
    suppliers : Map.Map<Types.SupplierId, Types.SupplierInternal>,
    config : { var nextSupplierId : Nat },
    args : Types.CreateSupplierArgs,
  ) : Types.Supplier {
    let id = config.nextSupplierId;
    config.nextSupplierId += 1;
    let supplier : Types.SupplierInternal = {
      id;
      name = args.name;
      contactPerson = args.contactPerson;
      email = args.email;
      phone = args.phone;
      address = args.address;
      paymentTerms = args.paymentTerms;
      isActive = args.isActive;
      createdAt = Time.now();
    };
    suppliers.add(id, supplier);
    supplier;
  };

  public func getSupplier(
    suppliers : Map.Map<Types.SupplierId, Types.SupplierInternal>,
    id : Types.SupplierId,
  ) : ?Types.Supplier {
    suppliers.get(id);
  };

  public func updateSupplier(
    suppliers : Map.Map<Types.SupplierId, Types.SupplierInternal>,
    id : Types.SupplierId,
    args : Types.UpdateSupplierArgs,
  ) : ?Types.Supplier {
    switch (suppliers.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.SupplierInternal = {
          existing with
          name = switch (args.name) { case (?v) v; case null existing.name };
          contactPerson = switch (args.contactPerson) { case (?v) v; case null existing.contactPerson };
          email = switch (args.email) { case (?v) v; case null existing.email };
          phone = switch (args.phone) { case (?v) v; case null existing.phone };
          address = switch (args.address) { case (?v) v; case null existing.address };
          paymentTerms = switch (args.paymentTerms) { case (?v) v; case null existing.paymentTerms };
          isActive = switch (args.isActive) { case (?v) v; case null existing.isActive };
        };
        suppliers.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteSupplier(
    suppliers : Map.Map<Types.SupplierId, Types.SupplierInternal>,
    id : Types.SupplierId,
  ) : Bool {
    switch (suppliers.get(id)) {
      case null false;
      case (?_) {
        suppliers.remove(id);
        true;
      };
    };
  };

  public func listSuppliers(
    suppliers : Map.Map<Types.SupplierId, Types.SupplierInternal>,
    isActiveFilter : ?Bool,
  ) : [Types.Supplier] {
    let iter = switch (isActiveFilter) {
      case null suppliers.values();
      case (?active) suppliers.values().filter(func(s) { s.isActive == active });
    };
    iter.toArray();
  };

  public func getSupplierProducts(
    supplierProducts : Map.Map<Types.SupplierId, List.List<Common.ProductId>>,
    id : Types.SupplierId,
  ) : [Common.ProductId] {
    switch (supplierProducts.get(id)) {
      case null [];
      case (?list) list.toArray();
    };
  };
};
