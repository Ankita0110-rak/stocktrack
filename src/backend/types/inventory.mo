import CommonTypes "common";

module {
  public type ProductId = CommonTypes.ProductId;
  public type Timestamp = CommonTypes.Timestamp;
  public type SupplierId = CommonTypes.SupplierId;

  public type AdjustmentType = { #restock; #remove; #receivedFromPO; #return_; #damage; #recount; #sale };

  public type StockStatus = { #inStock; #lowStock; #outOfStock };

  public type SortField = { #name; #sku; #price; #quantity; #lastModified };

  public type SortOrder = { #asc; #desc };

  // Internal product with mutable fields
  public type ProductInternal = {
    id : ProductId;
    var sku : Text;
    var name : Text;
    var description : Text;
    var quantity : Nat;
    var price : Nat; // selling price in paisa/cents
    var costPrice : Nat; // cost price in paisa/cents
    var sellingPrice : Nat; // selling price in paisa/cents (alias for price)
    var unitOfMeasure : Text; // kg, liters, units, packs, boxes, cartons
    var reorderQuantity : Nat; // how much to order when restocking
    var barcode : ?Text;
    var supplierId : ?SupplierId;
    var category : Text;
    var lowStockThreshold : ?Nat; // null means use global default
    var lastModified : Timestamp;
  };

  // Shared/public product type (no var fields)
  public type Product = {
    id : ProductId;
    sku : Text;
    name : Text;
    description : Text;
    quantity : Nat;
    price : Nat; // selling price in paisa/cents
    costPrice : Nat; // cost price in paisa/cents
    sellingPrice : Nat; // selling price in paisa/cents
    unitOfMeasure : Text; // kg, liters, units, packs, boxes, cartons
    reorderQuantity : Nat;
    barcode : ?Text;
    supplierId : ?SupplierId;
    category : Text;
    lowStockThreshold : ?Nat;
    lastModified : Timestamp;
    stockStatus : StockStatus;
  };

  public type CreateProductArgs = {
    sku : Text;
    name : Text;
    description : Text;
    quantity : Nat;
    price : Nat; // selling price in paisa/cents
    costPrice : Nat;
    sellingPrice : Nat;
    unitOfMeasure : Text;
    reorderQuantity : Nat;
    barcode : ?Text;
    supplierId : ?SupplierId;
    category : Text;
    lowStockThreshold : ?Nat;
  };

  public type UpdateProductArgs = {
    id : ProductId;
    sku : Text;
    name : Text;
    description : Text;
    price : Nat; // selling price in paisa/cents
    costPrice : Nat;
    sellingPrice : Nat;
    unitOfMeasure : Text;
    reorderQuantity : Nat;
    barcode : ?Text;
    supplierId : ?SupplierId;
    category : Text;
    lowStockThreshold : ?Nat;
  };

  public type StockHistoryEntry = {
    id : Nat;
    timestamp : Timestamp;
    productId : ProductId;
    adjustmentType : AdjustmentType;
    quantity : Nat;
    note : ?Text;
    notes : ?Text; // extended notes field
  };

  public type AdjustStockArgs = {
    productId : ProductId;
    adjustmentType : AdjustmentType;
    quantity : Nat;
    note : ?Text;
  };

  public type CategorySummary = {
    category : Text;
    productCount : Nat;
    totalValue : Nat;
  };

  public type LowStockSummary = {
    id : ProductId;
    name : Text;
    sku : Text;
    currentStock : Nat;
    reorderPoint : Nat;
  };

  public type DashboardMetrics = {
    totalProducts : Nat;
    totalInventoryValue : Nat;
    lowStockCount : Nat;
    categories : [CategorySummary];
    pendingPOCount : Nat;
    pendingPOValue : Nat;
    lowStockProducts : [LowStockSummary];
  };

  public type SearchFilterArgs = {
    searchQuery : ?Text; // matches SKU, name, or category
    stockStatus : ?StockStatus;
    sortField : ?SortField;
    sortOrder : ?SortOrder;
    supplierId : ?SupplierId; // filter by supplier
  };
};
