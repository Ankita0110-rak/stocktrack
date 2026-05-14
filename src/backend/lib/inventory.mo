import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/inventory";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  public type State = {
    products : Map.Map<Types.ProductId, Types.ProductInternal>;
    stockHistory : List.List<Types.StockHistoryEntry>;
    config : { var globalLowStockThreshold : Nat; var nextProductId : Nat; var nextHistoryId : Nat };
  };

  // Compute stock status for a product given the global threshold
  public func getStockStatus(
    product : Types.ProductInternal,
    globalThreshold : Nat
  ) : Types.StockStatus {
    let threshold = switch (product.lowStockThreshold) {
      case (?t) t;
      case null globalThreshold;
    };
    if (product.quantity == 0) { #outOfStock }
    else if (product.quantity <= threshold) { #lowStock }
    else { #inStock };
  };

  // Convert internal product to public product
  public func toPublic(
    product : Types.ProductInternal,
    globalThreshold : Nat
  ) : Types.Product {
    {
      id = product.id;
      sku = product.sku;
      name = product.name;
      description = product.description;
      quantity = product.quantity;
      price = product.price;
      costPrice = product.costPrice;
      sellingPrice = product.sellingPrice;
      unitOfMeasure = product.unitOfMeasure;
      reorderQuantity = product.reorderQuantity;
      barcode = product.barcode;
      supplierId = product.supplierId;
      category = product.category;
      lowStockThreshold = product.lowStockThreshold;
      lastModified = product.lastModified;
      stockStatus = getStockStatus(product, globalThreshold);
    };
  };

  // Create a new product; returns error text if SKU already exists
  public func createProduct(
    state : State,
    args : Types.CreateProductArgs,
    now : Types.Timestamp
  ) : { #ok : Types.Product; #err : Text } {
    // Check SKU uniqueness
    let skuExists = state.products.any(func(_id, p) { p.sku == args.sku });
    if (skuExists) { return #err("SKU already exists: " # args.sku) };
    let id = state.config.nextProductId;
    state.config.nextProductId += 1;
    let product : Types.ProductInternal = {
      id;
      var sku = args.sku;
      var name = args.name;
      var description = args.description;
      var quantity = args.quantity;
      var price = args.price;
      var costPrice = args.costPrice;
      var sellingPrice = args.sellingPrice;
      var unitOfMeasure = args.unitOfMeasure;
      var reorderQuantity = args.reorderQuantity;
      var barcode = args.barcode;
      var supplierId = args.supplierId;
      var category = args.category;
      var lowStockThreshold = args.lowStockThreshold;
      var lastModified = now;
    };
    state.products.add(id, product);
    #ok(toPublic(product, state.config.globalLowStockThreshold));
  };

  // Update product details; returns error if not found or SKU conflict
  public func updateProduct(
    state : State,
    args : Types.UpdateProductArgs,
    now : Types.Timestamp
  ) : { #ok : Types.Product; #err : Text } {
    switch (state.products.get(args.id)) {
      case null { #err("Product not found: " # args.id.toText()) };
      case (?product) {
        // Check SKU uniqueness (allow same product to keep its SKU)
        let skuConflict = state.products.any(func(id, p) {
          p.sku == args.sku and id != args.id
        });
        if (skuConflict) { return #err("SKU already in use: " # args.sku) };
        product.sku := args.sku;
        product.name := args.name;
        product.description := args.description;
        product.price := args.price;
        product.costPrice := args.costPrice;
        product.sellingPrice := args.sellingPrice;
        product.unitOfMeasure := args.unitOfMeasure;
        product.reorderQuantity := args.reorderQuantity;
        product.barcode := args.barcode;
        product.supplierId := args.supplierId;
        product.category := args.category;
        product.lowStockThreshold := args.lowStockThreshold;
        product.lastModified := now;
        #ok(toPublic(product, state.config.globalLowStockThreshold));
      };
    };
  };

  // Delete a product by id; returns error if not found
  public func deleteProduct(
    state : State,
    id : Types.ProductId
  ) : { #ok; #err : Text } {
    if (not state.products.containsKey(id)) {
      return #err("Product not found: " # id.toText());
    };
    state.products.remove(id);
    #ok;
  };

  // Get a product by id
  public func getProduct(
    state : State,
    id : Types.ProductId
  ) : ?Types.Product {
    switch (state.products.get(id)) {
      case null null;
      case (?p) ?toPublic(p, state.config.globalLowStockThreshold);
    };
  };

  // List all products
  public func listProducts(state : State) : [Types.Product] {
    state.products.values().map<Types.ProductInternal, Types.Product>(
      func(p) { toPublic(p, state.config.globalLowStockThreshold) }
    ).toArray();
  };

  // Adjust stock (restock or remove); returns error if not found or insufficient stock
  public func adjustStock(
    state : State,
    args : Types.AdjustStockArgs,
    now : Types.Timestamp
  ) : { #ok : Types.Product; #err : Text } {
    switch (state.products.get(args.productId)) {
      case null { #err("Product not found: " # args.productId.toText()) };
      case (?product) {
        switch (args.adjustmentType) {
          case (#restock or #receivedFromPO or #return_ or #recount) {
            product.quantity += args.quantity;
          };
          case (#remove or #damage or #sale) {
            if (args.quantity > product.quantity) {
              return #err("Insufficient stock: have " # product.quantity.toText() # ", need " # args.quantity.toText());
            };
            product.quantity -= args.quantity;
          };
        };
        product.lastModified := now;
        let entry : Types.StockHistoryEntry = {
          id = state.config.nextHistoryId;
          timestamp = now;
          productId = args.productId;
          adjustmentType = args.adjustmentType;
          quantity = args.quantity;
          note = args.note;
          notes = args.note;
        };
        state.config.nextHistoryId += 1;
        state.stockHistory.add(entry);
        #ok(toPublic(product, state.config.globalLowStockThreshold));
      };
    };
  };

  // Get stock history for a product (or all if productId is null)
  public func getStockHistory(
    state : State,
    productId : ?Types.ProductId
  ) : [Types.StockHistoryEntry] {
    switch (productId) {
      case null { state.stockHistory.toArray() };
      case (?pid) {
        state.stockHistory.filter(func(e) { e.productId == pid }).toArray();
      };
    };
  };

  // Get global low-stock threshold
  public func getGlobalThreshold(state : State) : Nat {
    state.config.globalLowStockThreshold;
  };

  // Set global low-stock threshold
  public func setGlobalThreshold(state : State, threshold : Nat) : () {
    state.config.globalLowStockThreshold := threshold;
  };

  // Compute dashboard metrics
  public func getDashboardMetrics(state : State) : Types.DashboardMetrics {
    let threshold = state.config.globalLowStockThreshold;
    var totalValue : Nat = 0;
    var lowStockCount : Nat = 0;
    let catMap = Map.empty<Text, { var count : Nat; var value : Nat }>();
    let lowStockList = List.empty<Types.LowStockSummary>();
    state.products.forEach(func(_id, p) {
      totalValue += p.sellingPrice * p.quantity;
      let status = getStockStatus(p, threshold);
      switch (status) {
        case (#lowStock or #outOfStock) {
          lowStockCount += 1;
          lowStockList.add({
            id = p.id;
            name = p.name;
            sku = p.sku;
            currentStock = p.quantity;
            reorderPoint = switch (p.lowStockThreshold) { case (?t) t; case null threshold };
          });
        };
        case _ {};
      };
      switch (catMap.get(p.category)) {
        case null {
          catMap.add(p.category, { var count = 1; var value = p.sellingPrice * p.quantity });
        };
        case (?cat) {
          cat.count += 1;
          cat.value += p.sellingPrice * p.quantity;
        };
      };
    });
    let categories = catMap.entries().map(
      func((cat, data)) {
        { category = cat; productCount = data.count; totalValue = data.value };
      }
    ).toArray();
    {
      totalProducts = state.products.size();
      totalInventoryValue = totalValue;
      lowStockCount;
      categories;
      pendingPOCount = 0;
      pendingPOValue = 0;
      lowStockProducts = lowStockList.toArray();
    };
  };

  // Search and filter products
  public func searchProducts(
    state : State,
    args : Types.SearchFilterArgs
  ) : [Types.Product] {
    let threshold = state.config.globalLowStockThreshold;
    let results = state.products.values().map(
      func(p) { toPublic(p, threshold) }
    );
    // Apply search query filter
    let filtered = switch (args.searchQuery) {
      case null { results.toArray() };
      case (?q) {
        let lower = q.toLower();
        results.filter(func(p) {
          p.sku.toLower().contains(#text lower) or
          p.name.toLower().contains(#text lower) or
          p.category.toLower().contains(#text lower)
        }).toArray();
      };
    };
    // Apply stock status filter
    let statusFiltered = switch (args.stockStatus) {
      case null { filtered };
      case (?status) {
        filtered.filter(func(p) { p.stockStatus == status });
      };
    };
    // Apply supplier filter
    let supplierFiltered = switch (args.supplierId) {
      case null { statusFiltered };
      case (?sid) {
        statusFiltered.filter(func(p) { p.supplierId == ?sid });
      };
    };
    // Sort
    let sortField = switch (args.sortField) { case (?f) f; case null #name };
    let sortOrder = switch (args.sortOrder) { case (?o) o; case null #asc };
    let compareProducts = func(a : Types.Product, b : Types.Product) : { #less; #equal; #greater } {
      let baseOrder = switch (sortField) {
        case (#name) { Text.compare(a.name, b.name) };
        case (#sku)  { Text.compare(a.sku, b.sku) };
        case (#price) { Nat.compare(a.price, b.price) };
        case (#quantity) { Nat.compare(a.quantity, b.quantity) };
        case (#lastModified) { Int.compare(a.lastModified, b.lastModified) };
      };
      switch (sortOrder) {
        case (#asc) baseOrder;
        case (#desc) {
          switch (baseOrder) {
            case (#less) #greater;
            case (#greater) #less;
            case (#equal) #equal;
          };
        };
      };
    };
    supplierFiltered.sort(compareProducts);
  };
};
