import { a as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-DBaupoop.js";
import { c as createLucideIcon, w as useListPOs, x as useCancelPO, L as Layout, C as ClipboardList } from "./use-backend-DzLCpOKH.js";
import { B as Button, u as ue } from "./index-BLCJbqC7.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C7UVFkAu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B5wGBF_n.js";
import { T as TrendingUp } from "./trending-up-DSfS7g6J.js";
import "./index-t9uGdf6q.js";
import "./Combination-DvpeoIvT.js";
import "./index-DuVLGgc_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 16h6", key: "100bgy" }],
  ["path", { d: "M19 13v6", key: "85cyf1" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackagePlus = createLucideIcon("package-plus", __iconNode);
const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "partiallyReceived", label: "Partially Received" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" }
];
function formatPaise(paise) {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatDate(ts) {
  if (!ts) return "—";
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function StatusBadge({ status }) {
  const map = {
    draft: { label: "Draft", cls: "badge-neutral" },
    sent: {
      label: "Sent",
      cls: "bg-primary/10 text-primary border border-primary/30 inline-flex px-2 py-0.5 rounded text-xs font-medium"
    },
    partiallyReceived: { label: "Partial", cls: "badge-warning" },
    received: { label: "Received", cls: "badge-success" },
    cancelled: { label: "Cancelled", cls: "badge-destructive" }
  };
  const cfg = map[status] ?? map.draft;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cfg.cls, children: cfg.label });
}
function SummaryCard({
  label,
  value,
  icon: Icon,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-md flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground mt-0.5", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] });
}
function PurchaseOrders() {
  var _a;
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const poStatusParam = statusFilter === "all" ? null : statusFilter;
  const { data: pos = [], isLoading } = useListPOs(poStatusParam);
  const cancelPO = useCancelPO();
  const pendingAmount = pos.filter(
    (p) => p.status === "draft" || p.status === "sent" || p.status === "partiallyReceived"
  ).reduce((sum, p) => sum + Number(p.totalAmount), 0);
  function handleCancel(po) {
    if (!confirm(`Cancel PO #${po.id}? This cannot be undone.`)) return;
    cancelPO.mutate(po.id, {
      onSuccess: () => ue.success(`PO #${po.id} cancelled`),
      onError: (e) => ue.error(String(e))
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Purchase Orders", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Purchase Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage supplier orders and goods receipts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "po.create_button",
          onClick: () => navigate({ to: "/purchase-orders/new" }),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { className: "w-4 h-4" }),
            "Create Purchase Order"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          label: "Total POs",
          value: String(pos.length),
          icon: ClipboardList,
          sub: statusFilter === "all" ? "All time" : (_a = STATUS_OPTIONS.find((s) => s.value === statusFilter)) == null ? void 0 : _a.label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          label: "Pending Amount",
          value: formatPaise(BigInt(Math.round(pendingAmount))),
          icon: TrendingUp,
          sub: "Draft + Sent + Partial"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-52", "data-ocid": "po.status_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
      ] }),
      statusFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setStatusFilter("all"),
          children: "Clear filter"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "PO ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Supplier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right", children: "Total Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Expected Delivery" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        isLoading && ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"].map((rowKey) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: ["c0", "c1", "c2", "c3", "c4", "c5", "c6"].map(
          (colKey) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, colKey)
        ) }, rowKey)),
        !isLoading && pos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-12 gap-3",
            "data-ocid": "po.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-muted rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No purchase orders found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create your first PO to start ordering from suppliers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => navigate({ to: "/purchase-orders/new" }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { className: "w-3.5 h-3.5 mr-1.5" }),
                    " Create Purchase Order"
                  ]
                }
              )
            ]
          }
        ) }) }),
        !isLoading && pos.map((po, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "hover:bg-muted/30 transition-colors",
            "data-ocid": `po.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-sm font-medium text-foreground", children: [
                "#",
                String(po.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: po.supplierName }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: po.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-medium text-foreground", children: formatPaise(po.totalAmount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDate(po.expectedDeliveryDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDate(po.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": `po.view_button.${idx + 1}`,
                    onClick: () => navigate({
                      to: "/purchase-orders/$poId",
                      params: { poId: String(po.id) }
                    }),
                    children: "View"
                  }
                ),
                (po.status === "draft" || po.status === "sent") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "text-destructive border-destructive/30 hover:bg-destructive/10",
                    "data-ocid": `po.cancel_button.${idx + 1}`,
                    onClick: () => handleCancel(po),
                    disabled: cancelPO.isPending,
                    children: "Cancel"
                  }
                )
              ] }) })
            ]
          },
          String(po.id)
        ))
      ] })
    ] }) })
  ] }) });
}
export {
  PurchaseOrders as default
};
