import CommonTypes "common";

module {
  public type POId = Nat;
  public type SupplierId = Nat;
  public type ProductId = CommonTypes.ProductId;
  public type Timestamp = CommonTypes.Timestamp;

  public type POStatus = {
    #draft;
    #sent;
    #partiallyReceived;
    #received;
    #cancelled;
  };

  // Internal line item with mutable receivedQty
  public type POLineItemInternal = {
    productId : ProductId;
    productName : Text;
    productSku : Text;
    orderedQty : Nat;
    var receivedQty : Nat;
    unitCostPrice : Nat;
  };

  // Shared/public line item (no var fields)
  public type POLineItem = {
    productId : ProductId;
    productName : Text;
    productSku : Text;
    orderedQty : Nat;
    receivedQty : Nat;
    unitCostPrice : Nat;
  };

  // Internal PO with mutable fields
  public type PurchaseOrderInternal = {
    id : POId;
    supplierId : SupplierId;
    var supplierName : Text;
    var status : POStatus;
    lineItems : [POLineItemInternal];
    var totalAmount : Nat;
    var expectedDeliveryDate : ?Int;
    var notes : ?Text;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  // Shared/public PO (no var fields)
  public type PurchaseOrder = {
    id : POId;
    supplierId : SupplierId;
    supplierName : Text;
    status : POStatus;
    lineItems : [POLineItem];
    totalAmount : Nat;
    expectedDeliveryDate : ?Int;
    notes : ?Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type CreatePOLineItemArgs = {
    productId : ProductId;
    orderedQty : Nat;
    unitCostPrice : Nat;
  };

  public type CreatePOArgs = {
    supplierId : SupplierId;
    supplierName : Text;
    lineItems : [CreatePOLineItemArgs];
    expectedDeliveryDate : ?Int;
    notes : ?Text;
  };

  public type UpdatePOStatusArgs = {
    id : POId;
    status : POStatus;
  };

  public type ReceiveItemArgs = {
    productId : ProductId;
    receivedQty : Nat;
  };
};
