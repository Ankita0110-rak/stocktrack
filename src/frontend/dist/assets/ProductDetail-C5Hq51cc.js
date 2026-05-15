import { b as useParams, a as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-DBaupoop.js";
import { h as useGetProduct, i as useStockHistory, j as useAdjustStock, e as useDeleteProduct, k as useGetSupplier, A as AdjustmentType, L as Layout, P as Package } from "./use-backend-DzLCpOKH.js";
import { S as StockBadge } from "./StockBadge-BSaLrgHi.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-HFtJOdaj.js";
import { B as Button, u as ue } from "./index-BLCJbqC7.js";
import { I as Input } from "./input-CiXtUUSE.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C7UVFkAu.js";
import { S as Separator } from "./separator-p_wkqDel.js";
import { T as Textarea } from "./textarea-BgNnOjjJ.js";
import { S as ShoppingCart } from "./shopping-cart-yo9Q2tPc.js";
import { P as Pencil } from "./pencil-DXxGWUF-.js";
import { T as Trash2 } from "./trash-2-BBBL-Xe5.js";
import { T as TrendingUp } from "./trending-up-DSfS7g6J.js";
import "./index-t9uGdf6q.js";
import "./index-D4XQ3UmP.js";
import "./Combination-DvpeoIvT.js";
import "./index-DuVLGgc_.js";
import "./index-CTV9CTDx.js";
function formatRupees(paise) {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleString();
}
const ADJUSTMENT_OPTIONS = [
  { value: AdjustmentType.receivedFromPO, label: "Received" },
  { value: AdjustmentType.return_, label: "Return" },
  { value: AdjustmentType.damage, label: "Damage" },
  { value: AdjustmentType.recount, label: "Recount" },
  { value: AdjustmentType.sale, label: "Sale" },
  { value: AdjustmentType.restock, label: "Restock" },
  { value: AdjustmentType.remove, label: "Remove" }
];
const HISTORY_LABEL = {
  [AdjustmentType.receivedFromPO]: "Received",
  [AdjustmentType.return_]: "Return",
  [AdjustmentType.damage]: "Damage",
  [AdjustmentType.recount]: "Recount",
  [AdjustmentType.sale]: "Sale",
  [AdjustmentType.restock]: "Restock",
  [AdjustmentType.remove]: "Remove"
};
const HISTORY_STYLE = {
  [AdjustmentType.receivedFromPO]: "badge-success",
  [AdjustmentType.return_]: "badge-warning",
  [AdjustmentType.damage]: "badge-destructive",
  [AdjustmentType.recount]: "badge-neutral",
  [AdjustmentType.sale]: "badge-neutral",
  [AdjustmentType.restock]: "badge-success",
  [AdjustmentType.remove]: "badge-destructive"
};
function ProductDetail() {
  const { productId } = useParams({ from: "/products/$productId" });
  const id = BigInt(productId);
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(id);
  const { data: history, isLoading: historyLoading } = useStockHistory(id);
  const adjustStock = useAdjustStock();
  const deleteProduct = useDeleteProduct();
  const { data: supplier } = useGetSupplier((product == null ? void 0 : product.supplierId) ?? null);
  async function handleDelete() {
    try {
      await deleteProduct.mutateAsync(id);
      ue.success(`"${product == null ? void 0 : product.name}" deleted.`);
      navigate({
        to: "/products",
        search: {
          query: "",
          status: "all",
          sortField: "name",
          sortOrder: "asc",
          category: "all",
          supplierId: "all"
        }
      });
    } catch {
      ue.error("Failed to delete product.");
    }
  }
  const [adjQty, setAdjQty] = reactExports.useState("");
  const [adjNote, setAdjNote] = reactExports.useState("");
  const [adjType, setAdjType] = reactExports.useState(
    AdjustmentType.restock
  );
  async function handleAdjust() {
    const qty = Number.parseInt(adjQty, 10);
    if (!qty || qty <= 0) {
      ue.error("Enter a valid quantity.");
      return;
    }
    try {
      await adjustStock.mutateAsync({
        productId: id,
        quantity: BigInt(qty),
        adjustmentType: adjType,
        note: adjNote || void 0
      });
      ue.success("Stock adjusted.");
      setAdjQty("");
      setAdjNote("");
    } catch {
      ue.error("Stock adjustment failed.");
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Layout,
      {
        breadcrumbs: [
          { label: "Products", to: "/products" },
          { label: "…" }
        ],
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col gap-3",
            "data-ocid": "product-detail.loading_state",
            children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k))
          }
        )
      }
    );
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Layout,
      {
        breadcrumbs: [
          { label: "Products", to: "/products" },
          { label: "Not Found" }
        ],
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-20 text-muted-foreground",
            "data-ocid": "product-detail.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-12 h-12 mb-4 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Product not found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/products",
                  search: {
                    query: "",
                    status: "all",
                    sortField: "name",
                    sortOrder: "asc",
                    category: "all",
                    supplierId: "all"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "mt-3", children: "Back to Products" })
                }
              )
            ]
          }
        )
      }
    );
  }
  const costPriceNum = Number(product.costPrice) / 100;
  const sellPriceNum = Number(product.sellingPrice) / 100;
  const margin = costPriceNum > 0 ? ((sellPriceNum - costPriceNum) / costPriceNum * 100).toFixed(1) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      breadcrumbs: [
        { label: "Products", to: "/products" },
        { label: product.name }
      ],
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StockBadge, { status: product.stockStatus })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono tracking-wider", children: [
              product.sku,
              product.barcode && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-3 opacity-60", children: [
                "Barcode: ",
                product.barcode
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/purchase-orders/new",
                search: { productId: product.id.toString() },
                "data-ocid": "product-detail.create-po_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5" }),
                      "Create PO"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/products/$productId/edit",
                params: { productId },
                "data-ocid": "product-detail.edit_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                      "Edit"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "gap-1.5 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                  "data-ocid": "product-detail.delete_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                    "Delete"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "product-detail.delete.dialog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Product?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                    "This will permanently delete ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: product.name }),
                    " ",
                    "and all its stock history. This action cannot be undone."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "product-detail.delete.cancel_button", children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: handleDelete,
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                      "data-ocid": "product-detail.delete.confirm_button",
                      children: deleteProduct.isPending ? "Deleting…" : "Delete Product"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded p-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4",
            "data-ocid": "product-detail.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: product.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Unit of Measure" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: product.unitOfMeasure })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Quantity in Stock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono", children: Number(product.quantity) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Cost Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono", children: formatRupees(product.costPrice) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Selling Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono", children: formatRupees(product.sellingPrice) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Margin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono flex items-center gap-1", children: margin !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-primary" }),
                  margin,
                  "%"
                ] }) : "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Reorder Quantity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono", children: Number(product.reorderQuantity) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Low Stock Alert" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono", children: product.lowStockThreshold !== void 0 ? Number(product.lowStockThreshold) : "Global default" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Supplier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: supplier ? supplier.name : product.supplierId ? "Loading…" : "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 sm:col-span-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: product.description || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Last Modified" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: formatDate(product.lastModified) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "product-detail.adjust-stock.panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Adjust Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: adjType,
                onValueChange: (v) => setAdjType(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 w-36 text-sm",
                      "data-ocid": "product-detail.adjust-type.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ADJUSTMENT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                placeholder: "Quantity",
                min: 1,
                value: adjQty,
                onChange: (e) => setAdjQty(e.target.value),
                className: "w-28 h-8 text-sm font-mono",
                "data-ocid": "product-detail.adjust-qty.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Notes (optional)",
                value: adjNote,
                onChange: (e) => setAdjNote(e.target.value),
                className: "flex-1 min-w-48 h-8 min-h-0 text-sm py-1.5 resize-none",
                "data-ocid": "product-detail.adjust-note.textarea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                className: "h-8",
                onClick: handleAdjust,
                disabled: adjustStock.isPending,
                "data-ocid": "product-detail.adjust-submit_button",
                children: adjustStock.isPending ? "Saving…" : "Apply Adjustment"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "product-detail.history", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Stock History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded overflow-hidden", children: historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-3 flex flex-col gap-2",
              "data-ocid": "product-detail.history.loading_state",
              children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-full" }, k))
            }
          ) : !history || history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "py-8 text-center text-sm text-muted-foreground",
              "data-ocid": "product-detail.history.empty_state",
              children: "No stock history yet."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Qty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Notes" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: history.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0",
                "data-ocid": `product-detail.history.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground text-xs font-mono", children: formatDate(entry.timestamp) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: HISTORY_STYLE[entry.adjustmentType] ?? "badge-neutral",
                      children: HISTORY_LABEL[entry.adjustmentType] ?? entry.adjustmentType
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-right font-mono text-xs", children: Number(entry.quantity) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground text-xs", children: entry.note ?? entry.notes ?? "—" })
                ]
              },
              entry.id.toString()
            )) })
          ] }) })
        ] })
      ] })
    }
  );
}
export {
  ProductDetail as default
};
