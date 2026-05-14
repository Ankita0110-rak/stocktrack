import Common "common";

module {
  public type SupplierId = Nat;

  public type Supplier = {
    id : SupplierId;
    name : Text;
    contactPerson : Text;
    email : Text;
    phone : Text;
    address : Text;
    paymentTerms : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type SupplierInternal = {
    id : SupplierId;
    name : Text;
    contactPerson : Text;
    email : Text;
    phone : Text;
    address : Text;
    paymentTerms : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type CreateSupplierArgs = {
    name : Text;
    contactPerson : Text;
    email : Text;
    phone : Text;
    address : Text;
    paymentTerms : Text;
    isActive : Bool;
  };

  public type UpdateSupplierArgs = {
    name : ?Text;
    contactPerson : ?Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    paymentTerms : ?Text;
    isActive : ?Bool;
  };
};
