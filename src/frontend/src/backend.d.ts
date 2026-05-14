import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateProductArgs {
    sku: string;
    unitOfMeasure: string;
    lowStockThreshold?: bigint;
    name: string;
    reorderQuantity: bigint;
    sellingPrice: bigint;
    description: string;
    barcode?: string;
    quantity: bigint;
    category: string;
    price: bigint;
    costPrice: bigint;
    supplierId?: SupplierId;
}
export type Timestamp = bigint;
export interface POLineItem {
    receivedQty: bigint;
    orderedQty: bigint;
    productSku: string;
    productId: ProductId;
    productName: string;
    unitCostPrice: bigint;
}
export interface CategorySummary {
    totalValue: bigint;
    productCount: bigint;
    category: string;
}
export type POId = bigint;
export interface StockHistoryEntry {
    id: bigint;
    note?: string;
    productId: ProductId;
    notes?: string;
    timestamp: Timestamp;
    quantity: bigint;
    adjustmentType: AdjustmentType;
}
export interface CreatePOArgs {
    lineItems: Array<CreatePOLineItemArgs>;
    expectedDeliveryDate?: bigint;
    supplierName: string;
    notes?: string;
    supplierId: SupplierId;
}
export interface LowStockSummary {
    id: ProductId;
    sku: string;
    reorderPoint: bigint;
    name: string;
    currentStock: bigint;
}
export interface UpdateProductArgs {
    id: ProductId;
    sku: string;
    unitOfMeasure: string;
    lowStockThreshold?: bigint;
    name: string;
    reorderQuantity: bigint;
    sellingPrice: bigint;
    description: string;
    barcode?: string;
    category: string;
    price: bigint;
    costPrice: bigint;
    supplierId?: SupplierId;
}
export interface SearchFilterArgs {
    sortField?: SortField;
    stockStatus?: StockStatus;
    sortOrder?: SortOrder;
    searchQuery?: string;
    supplierId?: SupplierId;
}
export interface UpdateSupplierArgs {
    name?: string;
    contactPerson?: string;
    isActive?: boolean;
    email?: string;
    address?: string;
    paymentTerms?: string;
    phone?: string;
}
export interface CreatePOLineItemArgs {
    orderedQty: bigint;
    productId: ProductId;
    unitCostPrice: bigint;
}
export interface ReceiveItemArgs {
    receivedQty: bigint;
    productId: ProductId;
}
export interface CreateSupplierArgs {
    name: string;
    contactPerson: string;
    isActive: boolean;
    email: string;
    address: string;
    paymentTerms: string;
    phone: string;
}
export interface AdjustStockArgs {
    note?: string;
    productId: ProductId;
    quantity: bigint;
    adjustmentType: AdjustmentType;
}
export type SupplierId = bigint;
export interface UpdatePOStatusArgs {
    id: POId;
    status: POStatus;
}
export type ProductId = bigint;
export interface Supplier {
    id: SupplierId;
    name: string;
    createdAt: Timestamp;
    contactPerson: string;
    isActive: boolean;
    email: string;
    address: string;
    paymentTerms: string;
    phone: string;
}
export interface PurchaseOrder {
    id: POId;
    status: POStatus;
    lineItems: Array<POLineItem>;
    expectedDeliveryDate?: bigint;
    supplierName: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    totalAmount: bigint;
    notes?: string;
    supplierId: SupplierId;
}
export interface Product {
    id: ProductId;
    sku: string;
    unitOfMeasure: string;
    lowStockThreshold?: bigint;
    stockStatus: StockStatus;
    name: string;
    reorderQuantity: bigint;
    sellingPrice: bigint;
    description: string;
    lastModified: Timestamp;
    barcode?: string;
    quantity: bigint;
    category: string;
    price: bigint;
    costPrice: bigint;
    supplierId?: SupplierId;
}
export interface DashboardMetrics {
    categories: Array<CategorySummary>;
    totalProducts: bigint;
    pendingPOValue: bigint;
    totalInventoryValue: bigint;
    pendingPOCount: bigint;
    lowStockCount: bigint;
    lowStockProducts: Array<LowStockSummary>;
}
export enum AdjustmentType {
    remove = "remove",
    return_ = "return",
    damage = "damage",
    recount = "recount",
    sale = "sale",
    receivedFromPO = "receivedFromPO",
    restock = "restock"
}
export enum POStatus {
    cancelled = "cancelled",
    sent = "sent",
    partiallyReceived = "partiallyReceived",
    draft = "draft",
    received = "received"
}
export enum SortField {
    sku = "sku",
    name = "name",
    lastModified = "lastModified",
    quantity = "quantity",
    price = "price"
}
export enum SortOrder {
    asc = "asc",
    desc = "desc"
}
export enum StockStatus {
    inStock = "inStock",
    outOfStock = "outOfStock",
    lowStock = "lowStock"
}
export interface backendInterface {
    adjustStock(args: AdjustStockArgs): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelPO(id: POId): Promise<PurchaseOrder | null>;
    createPO(args: CreatePOArgs): Promise<PurchaseOrder>;
    createProduct(args: CreateProductArgs): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createSupplier(args: CreateSupplierArgs): Promise<Supplier>;
    deleteProduct(id: ProductId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteSupplier(id: SupplierId): Promise<boolean>;
    getDashboardMetrics(): Promise<DashboardMetrics>;
    getGlobalLowStockThreshold(): Promise<bigint>;
    getPO(id: POId): Promise<PurchaseOrder | null>;
    getPOsBySupplier(supplierId: SupplierId): Promise<Array<PurchaseOrder>>;
    getProduct(id: ProductId): Promise<Product | null>;
    getStockHistory(productId: ProductId | null): Promise<Array<StockHistoryEntry>>;
    getSupplier(id: SupplierId): Promise<Supplier | null>;
    getSupplierProducts(id: SupplierId): Promise<Array<ProductId>>;
    listPOs(statusFilter: POStatus | null): Promise<Array<PurchaseOrder>>;
    listProducts(): Promise<Array<Product>>;
    listSuppliers(isActiveFilter: boolean | null): Promise<Array<Supplier>>;
    receivePO(id: POId, receivedItems: Array<ReceiveItemArgs>): Promise<PurchaseOrder | null>;
    searchProducts(args: SearchFilterArgs): Promise<Array<Product>>;
    setGlobalLowStockThreshold(threshold: bigint): Promise<void>;
    updatePOStatus(args: UpdatePOStatusArgs): Promise<PurchaseOrder | null>;
    updateProduct(args: UpdateProductArgs): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSupplier(id: SupplierId, args: UpdateSupplierArgs): Promise<Supplier | null>;
}
