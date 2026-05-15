import { r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-DBaupoop.js";
import { c as createLucideIcon, a as useListSuppliers, p as useUpdateSupplier, q as useDeleteSupplier, L as Layout, T as Truck } from "./use-backend-DzLCpOKH.js";
import { u as ue, B as Button } from "./index-BLCJbqC7.js";
import { I as Input } from "./input-CiXtUUSE.js";
import { P as Plus } from "./plus-6PClfeNX.js";
import { T as Trash2 } from "./trash-2-BBBL-Xe5.js";
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
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
function StatusBadge({ isActive }) {
  return isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-neutral", children: "Inactive" });
}
function Suppliers() {
  const [search, setSearch] = reactExports.useState("");
  const { data: suppliers, isLoading } = useListSuppliers(null);
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const filtered = reactExports.useMemo(() => {
    if (!suppliers) return [];
    const q = search.toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, search]);
  const handleToggleActive = reactExports.useCallback(
    async (s) => {
      try {
        await updateSupplier.mutateAsync({
          id: s.id,
          args: { isActive: !s.isActive }
        });
        ue.success(
          `"${s.name}" marked as ${!s.isActive ? "Active" : "Inactive"}.`
        );
      } catch {
        ue.error("Failed to update supplier status.");
      }
    },
    [updateSupplier]
  );
  const handleDelete = reactExports.useCallback(
    async (s) => {
      if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
      try {
        await deleteSupplier.mutateAsync(s.id);
        ue.success(`"${s.name}" deleted.`);
      } catch {
        ue.error("Failed to delete supplier.");
      }
    },
    [deleteSupplier]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Suppliers", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 mb-4",
        "data-ocid": "suppliers.toolbar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search suppliers…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-64 h-8 text-sm",
              "data-ocid": "suppliers.search_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          suppliers && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            filtered.length,
            " supplier",
            filtered.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suppliers/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "h-8 gap-1.5",
              "data-ocid": "suppliers.add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add Supplier"
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
        "data-ocid": "suppliers.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Contact Person" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Payment Terms" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["1", "2", "3", "4", "5", "6", "7"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, c)) }, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-muted-foreground",
              "data-ocid": "suppliers.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-10 h-10 mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: search ? "No suppliers match your search." : "No suppliers yet." }),
                !search && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suppliers/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "mt-4",
                    "data-ocid": "suppliers.empty-add_button",
                    children: "Add Supplier"
                  }
                ) })
              ]
            }
          ) }) }) : filtered.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/20",
              "data-ocid": `suppliers.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/suppliers/$supplierId",
                    params: { supplierId: s.id.toString() },
                    className: "hover:text-primary transition-colors",
                    "data-ocid": `suppliers.detail-link.${idx + 1}`,
                    children: s.name
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground", children: s.contactPerson }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground text-xs", children: s.email || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell font-mono text-xs", children: s.phone || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded", children: s.paymentTerms || "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { isActive: s.isActive }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/suppliers/$supplierId",
                      params: { supplierId: s.id.toString() },
                      "data-ocid": `suppliers.view_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2 text-xs gap-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                            "View"
                          ]
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 px-2 text-xs",
                      onClick: () => handleToggleActive(s),
                      "data-ocid": `suppliers.toggle_button.${idx + 1}`,
                      children: s.isActive ? "Deactivate" : "Activate"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive",
                      onClick: () => handleDelete(s),
                      "data-ocid": `suppliers.delete_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                        "Delete"
                      ]
                    }
                  )
                ] }) })
              ]
            },
            s.id.toString()
          )) })
        ] })
      }
    )
  ] });
}
export {
  Suppliers as default
};
