import type { backendInterface } from "../backend";
import {
  AdjustmentType,
  POStatus,
  SortField,
  SortOrder,
  StockStatus,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const mockProducts = [
  {
    id: BigInt(1),
    sku: "GRC-001",
    name: "Basmati Rice 5kg",
    description: "Premium long-grain basmati rice",
    category: "Groceries",
    quantity: BigInt(120),
    price: BigInt(45000),
    costPrice: BigInt(38000),
    sellingPrice: BigInt(45000),
    unitOfMeasure: "bag",
    lowStockThreshold: BigInt(20),
    reorderQuantity: BigInt(100),
    barcode: "8901234567890",
    stockStatus: StockStatus.inStock,
    lastModified: now,
    supplierId: BigInt(1),
  },
  {
    id: BigInt(2),
    sku: "GRC-002",
    name: "Toor Dal 1kg",
    description: "Split pigeon peas",
    category: "Groceries",
    quantity: BigInt(8),
    price: BigInt(12000),
    costPrice: BigInt(9000),
    sellingPrice: BigInt(12000),
    unitOfMeasure: "packet",
    lowStockThreshold: BigInt(15),
    reorderQuantity: BigInt(50),
    stockStatus: StockStatus.lowStock,
    lastModified: now,
    supplierId: BigInt(1),
  },
  {
    id: BigInt(3),
    sku: "PCR-001",
    name: "Head & Shoulders Shampoo 400ml",
    description: "Anti-dandruff shampoo",
    category: "Personal Care",
    quantity: BigInt(0),
    price: BigInt(32000),
    costPrice: BigInt(25000),
    sellingPrice: BigInt(32000),
    unitOfMeasure: "bottle",
    lowStockThreshold: BigInt(10),
    reorderQuantity: BigInt(30),
    stockStatus: StockStatus.outOfStock,
    lastModified: now,
    supplierId: BigInt(2),
  },
  {
    id: BigInt(4),
    sku: "HCR-001",
    name: "Surf Excel 2kg",
    description: "Detergent powder",
    category: "Home Care",
    quantity: BigInt(55),
    price: BigInt(28000),
    costPrice: BigInt(22000),
    sellingPrice: BigInt(28000),
    unitOfMeasure: "pack",
    lowStockThreshold: BigInt(10),
    reorderQuantity: BigInt(40),
    stockStatus: StockStatus.inStock,
    lastModified: now,
    supplierId: BigInt(2),
  },
  {
    id: BigInt(5),
    sku: "ELC-001",
    name: "Philips LED Bulb 9W",
    description: "Energy saving LED bulb",
    category: "Electronics",
    quantity: BigInt(5),
    price: BigInt(18000),
    costPrice: BigInt(14000),
    sellingPrice: BigInt(18000),
    unitOfMeasure: "piece",
    lowStockThreshold: BigInt(10),
    reorderQuantity: BigInt(25),
    stockStatus: StockStatus.lowStock,
    lastModified: now,
    supplierId: BigInt(3),
  },
];

const mockSuppliers = [
  {
    id: BigInt(1),
    name: "AgroFresh Distributors",
    contactPerson: "Rajesh Sharma",
    email: "rajesh@agrofresh.com",
    phone: "+91-9876543210",
    address: "123 Food Market, Mumbai",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: now,
  },
  {
    id: BigInt(2),
    name: "HPC Wholesale Pvt Ltd",
    contactPerson: "Priya Patel",
    email: "priya@hpcwholesale.com",
    phone: "+91-9765432109",
    address: "456 Trade Center, Ahmedabad",
    paymentTerms: "Net 45",
    isActive: true,
    createdAt: now,
  },
  {
    id: BigInt(3),
    name: "TechGoods India",
    contactPerson: "Anil Mehta",
    email: "anil@techgoods.in",
    phone: "+91-9654321098",
    address: "789 Electronics Hub, Bangalore",
    paymentTerms: "Net 15",
    isActive: false,
    createdAt: now,
  },
];

const mockPOs = [
  {
    id: BigInt(1),
    supplierId: BigInt(1),
    supplierName: "AgroFresh Distributors",
    status: POStatus.sent,
    lineItems: [
      {
        productId: BigInt(2),
        productSku: "GRC-002",
        productName: "Toor Dal 1kg",
        orderedQty: BigInt(50),
        receivedQty: BigInt(0),
        unitCostPrice: BigInt(9000),
      },
    ],
    totalAmount: BigInt(450000),
    createdAt: now,
    updatedAt: now,
    expectedDeliveryDate: BigInt(Date.now() + 3 * 86400000) * BigInt(1_000_000),
    notes: "Urgent reorder",
  },
  {
    id: BigInt(2),
    supplierId: BigInt(2),
    supplierName: "HPC Wholesale Pvt Ltd",
    status: POStatus.draft,
    lineItems: [
      {
        productId: BigInt(3),
        productSku: "PCR-001",
        productName: "Head & Shoulders Shampoo 400ml",
        orderedQty: BigInt(30),
        receivedQty: BigInt(0),
        unitCostPrice: BigInt(25000),
      },
    ],
    totalAmount: BigInt(750000),
    createdAt: now,
    updatedAt: now,
  },
];

export const mockBackend: backendInterface = {
  getDashboardMetrics: async () => ({
    totalProducts: BigInt(5),
    totalInventoryValue: BigInt(6890000),
    lowStockCount: BigInt(3),
    pendingPOCount: BigInt(2),
    pendingPOValue: BigInt(1200000),
    lowStockProducts: [
      {
        id: BigInt(2),
        sku: "GRC-002",
        name: "Toor Dal 1kg",
        currentStock: BigInt(8),
        reorderPoint: BigInt(15),
      },
      {
        id: BigInt(3),
        sku: "PCR-001",
        name: "Head & Shoulders Shampoo 400ml",
        currentStock: BigInt(0),
        reorderPoint: BigInt(10),
      },
      {
        id: BigInt(5),
        sku: "ELC-001",
        name: "Philips LED Bulb 9W",
        currentStock: BigInt(5),
        reorderPoint: BigInt(10),
      },
    ],
    categories: [
      { category: "Groceries", productCount: BigInt(2), totalValue: BigInt(2490000) },
      { category: "Personal Care", productCount: BigInt(1), totalValue: BigInt(0) },
      { category: "Home Care", productCount: BigInt(1), totalValue: BigInt(1540000) },
      { category: "Electronics", productCount: BigInt(1), totalValue: BigInt(90000) },
    ],
  }),

  listProducts: async () => mockProducts,

  searchProducts: async (_args) => mockProducts,

  getProduct: async (id) => mockProducts.find((p) => p.id === id) ?? null,

  createProduct: async (args) => ({
    __kind__: "ok" as const,
    ok: {
      ...args,
      id: BigInt(99),
      stockStatus: StockStatus.inStock,
      lastModified: now,
      lowStockThreshold: args.lowStockThreshold,
      barcode: args.barcode,
      supplierId: args.supplierId,
    },
  }),

  updateProduct: async (args) => ({
    __kind__: "ok" as const,
    ok: {
      ...args,
      quantity: BigInt(0),
      stockStatus: StockStatus.inStock,
      lastModified: now,
      lowStockThreshold: args.lowStockThreshold,
      barcode: args.barcode,
      supplierId: args.supplierId,
    },
  }),

  deleteProduct: async (_id) => ({ __kind__: "ok" as const, ok: null }),

  adjustStock: async (_args) => ({
    __kind__: "ok" as const,
    ok: mockProducts[0],
  }),

  getStockHistory: async (_productId) => [
    {
      id: BigInt(1),
      productId: BigInt(1),
      quantity: BigInt(100),
      adjustmentType: AdjustmentType.restock,
      timestamp: now,
      note: "Initial stock",
      notes: "Initial stock",
    },
  ],

  listSuppliers: async (_filter) => mockSuppliers,

  getSupplier: async (id) => mockSuppliers.find((s) => s.id === id) ?? null,

  createSupplier: async (args) => ({
    ...args,
    id: BigInt(99),
    createdAt: now,
  }),

  updateSupplier: async (id, args) => {
    const supplier = mockSuppliers.find((s) => s.id === id);
    if (!supplier) return null;
    return { ...supplier, ...args };
  },

  deleteSupplier: async (_id) => true,

  getSupplierProducts: async (_id) => [BigInt(1), BigInt(2)],

  listPOs: async (_filter) => mockPOs,

  getPO: async (id) => mockPOs.find((p) => p.id === id) ?? null,

  createPO: async (args) => ({
    ...args,
    id: BigInt(99),
    status: POStatus.draft,
    lineItems: args.lineItems.map((li) => ({
      productId: li.productId,
      productSku: "SKU",
      productName: "Product",
      orderedQty: li.orderedQty,
      receivedQty: BigInt(0),
      unitCostPrice: li.unitCostPrice,
    })),
    totalAmount: BigInt(0),
    createdAt: now,
    updatedAt: now,
  }),

  updatePOStatus: async (args) => mockPOs.find((p) => p.id === args.id) ?? null,

  cancelPO: async (id) => mockPOs.find((p) => p.id === id) ?? null,

  receivePO: async (id, _items) => mockPOs.find((p) => p.id === id) ?? null,

  getPOsBySupplier: async (_supplierId) => mockPOs,

  getGlobalLowStockThreshold: async () => BigInt(10),

  setGlobalLowStockThreshold: async (_threshold) => undefined,
};
