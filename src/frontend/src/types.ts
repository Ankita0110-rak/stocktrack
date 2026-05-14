export type {
  AdjustStockArgs,
  AdjustmentType,
  CategorySummary,
  CreatePOArgs,
  CreateProductArgs,
  CreateSupplierArgs,
  DashboardMetrics,
  LowStockSummary,
  POLineItem,
  POStatus,
  Product,
  ProductId,
  PurchaseOrder,
  ReceiveItemArgs,
  SearchFilterArgs,
  SortField,
  SortOrder,
  StockHistoryEntry,
  StockStatus,
  Supplier,
  SupplierId,
  UpdateProductArgs,
  UpdateSupplierArgs,
} from "@/backend";

export type StockStatusLabel = "In Stock" | "Low Stock" | "Out of Stock";

export interface NavItem {
  label: string;
  to: string;
  icon: string;
}
