import { j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-D-jPTGcB.js";
import { c as createLucideIcon, u as useDashboardMetrics, a as useListSuppliers, L as Layout, C as ClipboardList, P as Package, T as Truck, b as ChevronRight } from "./use-backend-CGmhALc1.js";
import { P as Plus } from "./plus-DL4IW2cl.js";
import { T as TrendingUp } from "./trending-up-D6pDyWGh.js";
import { S as ShoppingCart } from "./shopping-cart-D0vF60SY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function StatCard({
  title,
  value,
  icon: Icon,
  subLabel,
  accent = "default",
  "data-ocid": dataOcid
}) {
  const iconBg = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-50 text-amber-600",
    success: "bg-primary/10 text-primary",
    destructive: "bg-destructive/10 text-destructive",
    neutral: "bg-muted text-muted-foreground"
  };
  const valueCls = {
    default: "text-foreground",
    warning: "text-amber-600",
    success: "text-primary",
    destructive: "text-destructive",
    neutral: "text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:shadow-sm transition-smooth",
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${iconBg[accent]}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4", "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-2xl font-bold tracking-tight font-display ${valueCls[accent]}`,
              children: value
            }
          ),
          subLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: subLabel })
        ] })
      ]
    }
  );
}
const quickActions = [
  {
    to: "/products/new",
    label: "Add New Product",
    desc: "Register a new SKU with price and stock details",
    Icon: Package,
    iconBg: "bg-primary/10 text-primary",
    ocid: "dashboard.quick_action.add_product"
  },
  {
    to: "/purchase-orders/new",
    label: "Create Purchase Order",
    desc: "Raise a PO to restock low inventory items",
    Icon: ShoppingCart,
    iconBg: "bg-amber-50 text-amber-600",
    ocid: "dashboard.quick_action.create_po"
  },
  {
    to: "/suppliers/new",
    label: "Add Supplier",
    desc: "Onboard a new vendor or supplier partner",
    Icon: Truck,
    iconBg: "bg-muted text-muted-foreground",
    ocid: "dashboard.quick_action.add_supplier"
  },
  {
    to: "/products",
    search: {
      query: "",
      status: "lowStock",
      sortField: "quantity",
      sortOrder: "asc"
    },
    label: "View Low Stock",
    desc: "Filter all products currently below reorder point",
    Icon: TriangleAlert,
    iconBg: "bg-destructive/10 text-destructive",
    ocid: "dashboard.quick_action.view_low_stock"
  }
];
function formatINR(paise) {
  const rupees = Number(paise) / 100;
  if (rupees >= 1e7) return `₹${(rupees / 1e7).toFixed(1)}Cr`;
  if (rupees >= 1e5) return `₹${(rupees / 1e5).toFixed(1)}L`;
  if (rupees >= 1e3) return `₹${(rupees / 1e3).toFixed(1)}K`;
  return `₹${rupees.toFixed(0)}`;
}
function formatINRFull(paise) {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(rupees);
}
function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: suppliers } = useListSuppliers(null);
  const totalSuppliers = (suppliers == null ? void 0 : suppliers.length) ?? 0;
  const lowStockProducts = (metrics == null ? void 0 : metrics.lowStockProducts) ?? [];
  const categoryBreakdown = (metrics == null ? void 0 : metrics.categories) ?? [];
  const totalCatValue = categoryBreakdown.reduce(
    (s, c) => s + Number(c.totalValue),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Inventory Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6",
        "data-ocid": "dashboard.stats",
        children: metricsLoading ? [1, 2, 3, 4, 5].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-lg" }, k)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "Total SKUs",
              value: metrics ? Number(metrics.totalProducts).toLocaleString("en-IN") : "—",
              icon: Layers,
              subLabel: "Active products",
              accent: "default",
              "data-ocid": "dashboard.stat.total_skus"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "Inventory Value",
              value: metrics ? formatINR(metrics.totalInventoryValue) : "—",
              icon: IndianRupee,
              subLabel: metrics ? "Cost price basis" : void 0,
              accent: "success",
              "data-ocid": "dashboard.stat.inventory_value"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "Low Stock Items",
              value: metrics ? Number(metrics.lowStockCount) : "—",
              icon: TriangleAlert,
              subLabel: "Below reorder point",
              accent: metrics && Number(metrics.lowStockCount) > 0 ? "warning" : "default",
              "data-ocid": "dashboard.stat.low_stock"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "Pending Orders",
              value: metrics ? Number(metrics.pendingPOCount) : "—",
              icon: ClipboardList,
              subLabel: metrics && Number(metrics.pendingPOValue) > 0 ? `${formatINR(metrics.pendingPOValue)} value` : "No pending POs",
              accent: metrics && Number(metrics.pendingPOCount) > 0 ? "warning" : "default",
              "data-ocid": "dashboard.stat.pending_pos"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "Total Suppliers",
              value: totalSuppliers.toLocaleString("en-IN"),
              icon: Building2,
              subLabel: "Active vendors",
              accent: "neutral",
              "data-ocid": "dashboard.stat.suppliers"
            }
          )
        ] })
      }
    ),
    (metricsLoading || lowStockProducts.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-ocid": "dashboard.low_stock_panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-amber-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Low Stock Alerts" }),
          !metricsLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-warning", children: [
            lowStockProducts.length,
            " items"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/purchase-orders/new",
            className: "text-xs font-medium text-primary hover:underline flex items-center gap-1",
            "data-ocid": "dashboard.create_po_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
              " Create Purchase Order"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card border border-amber-200 rounded-lg overflow-hidden",
          style: {
            borderLeftWidth: "4px",
            borderLeftColor: "oklch(0.68 0.14 66)"
          },
          children: metricsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-4 flex flex-col gap-2",
              "data-ocid": "dashboard.low_stock.loading_state",
              children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" }, k))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-amber-50/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "SKU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Current Stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Reorder Point" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Action" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lowStockProducts.slice(0, 10).map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-amber-50/40 transition-smooth",
                "data-ocid": `dashboard.low_stock.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/products/$productId",
                      params: { productId: p.id.toString() },
                      className: "font-medium text-foreground hover:text-primary transition-colors truncate block max-w-[180px]",
                      "data-ocid": `dashboard.low_stock.product_link.${idx + 1}`,
                      children: p.name
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-cell-mono", children: p.sku }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `font-mono text-sm font-semibold ${Number(p.currentStock) === 0 ? "text-destructive" : "text-amber-600"}`,
                      children: Number(p.currentStock).toLocaleString("en-IN")
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: Number(p.reorderPoint).toLocaleString("en-IN") }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/purchase-orders/new",
                      className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-smooth",
                      "data-ocid": `dashboard.low_stock.create_po_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                        " Raise PO"
                      ]
                    }
                  ) })
                ]
              },
              p.id.toString()
            )) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.category_breakdown", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Category Breakdown" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: metricsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-4 flex flex-col gap-2",
            "data-ocid": "dashboard.categories.loading_state",
            children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k))
          }
        ) : categoryBreakdown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "py-10 flex flex-col items-center text-muted-foreground",
            "data-ocid": "dashboard.categories.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-7 h-7 mb-2 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No category data yet." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "SKUs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Share" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: categoryBreakdown.map((cat, idx) => {
            const pct = totalCatValue > 0 ? Number(cat.totalValue) / totalCatValue * 100 : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/20 transition-smooth",
                "data-ocid": `dashboard.category.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: cat.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono text-xs text-muted-foreground", children: Number(cat.productCount).toLocaleString("en-IN") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono text-xs font-semibold", children: formatINRFull(cat.totalValue) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full bg-primary rounded-full",
                        style: { width: `${pct.toFixed(0)}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground w-9 text-right", children: [
                      pct.toFixed(1),
                      "%"
                    ] })
                  ] }) })
                ]
              },
              cat.category
            );
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.quick_actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Quick Actions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-lg p-4 flex flex-col gap-2", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: action.to,
            search: action.search,
            className: "flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted/40 transition-smooth group",
            "data-ocid": action.ocid,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `w-8 h-8 rounded-md flex items-center justify-center ${action.iconBg}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(action.Icon, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: action.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: action.desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth" })
            ]
          },
          action.to
        )) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
