import { u as useSearch, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-D-jPTGcB.js";
import { a as useListSuppliers, d as useSearchProducts, e as useDeleteProduct, L as Layout, S as StockStatus, f as SortField, g as SortOrder, P as Package } from "./use-backend-CGmhALc1.js";
import { S as StockBadge } from "./StockBadge-Buej7vPW.js";
import { u as ue, B as Button } from "./index-BDZG_dbu.js";
import { I as Input } from "./input-DOk1Y-BC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-kXXIZ_pV.js";
import { P as Plus } from "./plus-DL4IW2cl.js";
import { S as ShoppingCart } from "./shopping-cart-D0vF60SY.js";
import { P as Pencil } from "./pencil-Bjn3VFxN.js";
import { T as Trash2 } from "./trash-2-B-YyNGSe.js";
import "./index-DvyOV-KK.js";
import "./Combination-BkxpJwC9.js";
import "./index-2YUJ__Ph.js";
const CATEGORIES = [
  "Groceries",
  "Personal Care",
  "Home Care",
  "Kitchenware",
  "Clothing & Apparel",
  "Bed & Bath",
  "Electronics",
  "Stationery"
];
function formatRupees(paise) {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}
function Products() {
  const {
    query,
    status: statusFilter,
    sortField,
    sortOrder,
    category: categoryFilter,
    supplierId: supplierIdFilter
  } = useSearch({ from: "/products" });
  const navigate = useNavigate({ from: "/products" });
  const { data: suppliers } = useListSuppliers(null);
  function setQuery(value) {
    navigate({ search: (prev) => ({ ...prev, query: value }) });
  }
  function setStatusFilter(value) {
    navigate({ search: (prev) => ({ ...prev, status: value }) });
  }
  function setCategoryFilter(value) {
    navigate({ search: (prev) => ({ ...prev, category: value }) });
  }
  function setSupplierFilter(value) {
    navigate({ search: (prev) => ({ ...prev, supplierId: value }) });
  }
  function setSortField(value) {
    navigate({ search: (prev) => ({ ...prev, sortField: value }) });
  }
  function setSortOrder(value) {
    navigate({ search: (prev) => ({ ...prev, sortOrder: value }) });
  }
  const searchArgs = {
    searchQuery: query || void 0,
    stockStatus: statusFilter !== "all" ? statusFilter : void 0,
    sortField,
    sortOrder,
    supplierId: supplierIdFilter && supplierIdFilter !== "all" ? BigInt(supplierIdFilter) : void 0
  };
  const { data: allProducts, isLoading } = useSearchProducts(searchArgs);
  const deleteMutation = useDeleteProduct();
  const products = allProducts && categoryFilter && categoryFilter !== "all" ? allProducts.filter((p) => p.category === categoryFilter) : allProducts;
  const handleDelete = reactExports.useCallback(
    async (id, name) => {
      if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
      try {
        await deleteMutation.mutateAsync(id);
        ue.success(`"${name}" deleted.`);
      } catch {
        ue.error("Failed to delete product.");
      }
    },
    [deleteMutation]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Products", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center gap-2 mb-2",
        "data-ocid": "products.toolbar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search products\\u2026",
              value: query,
              onChange: (e) => setQuery(e.target.value),
              className: "w-52 h-8 text-sm",
              "data-ocid": "products.search_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-36 text-sm",
                "data-ocid": "products.status_filter.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: StockStatus.inStock, children: "In Stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: StockStatus.lowStock, children: "Low Stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: StockStatus.outOfStock, children: "Out of Stock" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: categoryFilter || "all",
              onValueChange: setCategoryFilter,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 w-40 text-sm",
                    "data-ocid": "products.category_filter.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Categories" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Categories" }),
                  CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
                ] })
              ]
            }
          ),
          suppliers && suppliers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: supplierIdFilter || "all",
              onValueChange: setSupplierFilter,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 w-40 text-sm",
                    "data-ocid": "products.supplier_filter.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Suppliers" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Suppliers" }),
                  suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id.toString(), children: s.name }, s.id.toString()))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sortField, onValueChange: setSortField, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-36 text-sm",
                "data-ocid": "products.sort_field.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort by" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortField.name, children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortField.sku, children: "SKU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortField.quantity, children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortField.price, children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortField.lastModified, children: "Last Modified" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sortOrder, onValueChange: setSortOrder, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-24 text-sm",
                "data-ocid": "products.sort_order.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortOrder.asc, children: "Asc" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: SortOrder.desc, children: "Desc" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "h-8 gap-1.5",
              "data-ocid": "products.add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add Product"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border border-border rounded overflow-hidden",
        "data-ocid": "products.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "UOM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Sell Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["a", "b", "c", "d", "e", "f"].map((rowKey) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["1", "2", "3", "4", "5", "6", "7", "8"].map((colKey) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, colKey)) }, rowKey)) : !products || products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-muted-foreground",
              "data-ocid": "products.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10 mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No products found" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: query || statusFilter && statusFilter !== "all" || categoryFilter && categoryFilter !== "all" ? "Try adjusting your filters." : "Add your first product to get started." }),
                !query && (!statusFilter || statusFilter === "all") && (!categoryFilter || categoryFilter === "all") && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "mt-4",
                    "data-ocid": "products.empty-add_button",
                    children: "Add Product"
                  }
                ) })
              ]
            }
          ) }) }) : products.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/20",
              "data-ocid": `products.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-cell-mono", children: p.sku }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/products/$productId",
                    params: { productId: p.id.toString() },
                    className: "hover:text-primary transition-colors",
                    "data-ocid": `products.detail-link.${idx + 1}`,
                    children: p.name
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground", children: p.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground text-xs", children: p.unitOfMeasure }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-right font-mono text-xs", children: Number(p.quantity) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-right font-mono text-xs", children: formatRupees(p.sellingPrice) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StockBadge, { status: p.stockStatus }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/purchase-orders/new",
                      search: { productId: p.id.toString() },
                      "data-ocid": `products.create-po_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2 text-xs gap-1 text-primary hover:text-primary",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3 h-3" }),
                            "PO"
                          ]
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/products/$productId/edit",
                      params: { productId: p.id.toString() },
                      "data-ocid": `products.edit_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2 text-xs gap-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" }),
                            "Edit"
                          ]
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive",
                      onClick: () => handleDelete(p.id, p.name),
                      "data-ocid": `products.delete_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                        "Delete"
                      ]
                    }
                  )
                ] }) })
              ]
            },
            p.id.toString()
          )) })
        ] })
      }
    )
  ] });
}
export {
  Products as default
};
