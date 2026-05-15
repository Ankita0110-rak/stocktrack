import { b as useParams, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-DBaupoop.js";
import { c as createLucideIcon, k as useGetSupplier, s as useGetSupplierProducts, t as useListProducts, v as useGetPOsBySupplier, p as useUpdateSupplier, L as Layout, P as Package, C as ClipboardList } from "./use-backend-DzLCpOKH.js";
import { B as Button, u as ue } from "./index-BLCJbqC7.js";
import { I as Input } from "./input-CiXtUUSE.js";
import { L as Label } from "./label-Ci4n_Bjl.js";
import { S as Separator } from "./separator-p_wkqDel.js";
import { S as Switch } from "./switch-C4QiNttw.js";
import { T as Textarea } from "./textarea-BgNnOjjJ.js";
import { A as ArrowLeft } from "./arrow-left-Cel94seg.js";
import { P as Plus } from "./plus-6PClfeNX.js";
import { P as Pencil } from "./pencil-DXxGWUF-.js";
import { X } from "./x-BwOficLe.js";
import "./index-CTV9CTDx.js";
import "./index-t9uGdf6q.js";
import "./index-DuVLGgc_.js";
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function formatAmount(paise) {
  return `₹${(Number(paise) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}
const PO_STATUS_LABEL = {
  draft: "Draft",
  sent: "Sent",
  partiallyReceived: "Partial",
  received: "Received",
  cancelled: "Cancelled"
};
const PO_STATUS_CLASS = {
  draft: "badge-neutral",
  sent: "badge-warning",
  partiallyReceived: "badge-warning",
  received: "badge-success",
  cancelled: "badge-neutral"
};
function buildEditForm(s) {
  return {
    name: s.name,
    contactPerson: s.contactPerson,
    email: s.email,
    phone: s.phone,
    address: s.address,
    paymentTerms: s.paymentTerms,
    isActive: s.isActive
  };
}
function SupplierDetail() {
  const { supplierId } = useParams({ from: "/suppliers/$supplierId" });
  const id = BigInt(supplierId);
  const { data: supplier, isLoading } = useGetSupplier(id);
  const { data: productIds, isLoading: productsLoading } = useGetSupplierProducts(id);
  const { data: allProducts } = useListProducts();
  const { data: pos, isLoading: posLoading } = useGetPOsBySupplier(id);
  const updateSupplier = useUpdateSupplier();
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(null);
  function startEdit() {
    if (supplier) {
      setForm(buildEditForm(supplier));
      setEditing(true);
    }
  }
  function cancelEdit() {
    setEditing(false);
    setForm(null);
  }
  function setField(key, value) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }
  async function handleSave() {
    if (!form) return;
    if (!form.name.trim()) {
      ue.error("Supplier name is required.");
      return;
    }
    if (!form.contactPerson.trim()) {
      ue.error("Contact person is required.");
      return;
    }
    try {
      await updateSupplier.mutateAsync({
        id,
        args: {
          name: form.name.trim(),
          contactPerson: form.contactPerson.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          paymentTerms: form.paymentTerms.trim(),
          isActive: form.isActive
        }
      });
      ue.success("Supplier updated.");
      setEditing(false);
      setForm(null);
    } catch {
      ue.error("Failed to update supplier.");
    }
  }
  const suppliedProducts = (allProducts ?? []).filter(
    (p) => (productIds ?? []).some((pid) => pid === p.id)
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Layout,
      {
        breadcrumbs: [{ label: "Suppliers", to: "/suppliers" }, { label: "…" }],
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col gap-3",
            "data-ocid": "supplier-detail.loading_state",
            children: ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k))
          }
        )
      }
    );
  }
  if (!supplier) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Layout,
      {
        breadcrumbs: [
          { label: "Suppliers", to: "/suppliers" },
          { label: "Not Found" }
        ],
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-20 text-muted-foreground",
            "data-ocid": "supplier-detail.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-12 h-12 mb-4 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Supplier not found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suppliers", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "mt-3", children: "Back to Suppliers" }) })
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      breadcrumbs: [
        { label: "Suppliers", to: "/suppliers" },
        { label: supplier.name }
      ],
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: supplier.name }),
              supplier.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-neutral", children: "Inactive" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Added ",
              formatDate(supplier.createdAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suppliers", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "gap-1.5",
                "data-ocid": "supplier-detail.back_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
                  "Back"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/purchase-orders/new", search: { supplierId }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "gap-1.5",
                "data-ocid": "supplier-detail.create-po_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Create PO"
                ]
              }
            ) }),
            !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                className: "gap-1.5",
                onClick: startEdit,
                "data-ocid": "supplier-detail.edit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                  "Edit"
                ]
              }
            )
          ] })
        ] }),
        editing && form ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-primary/30 rounded p-5 flex flex-col gap-4",
            "data-ocid": "supplier-detail.edit-form.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Edit Supplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-name", children: "Supplier Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "edit-name",
                    value: form.name,
                    onChange: (e) => setField("name", e.target.value),
                    "data-ocid": "supplier-detail.edit-name.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-contact", children: "Contact Person" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "edit-contact",
                    value: form.contactPerson,
                    onChange: (e) => setField("contactPerson", e.target.value),
                    "data-ocid": "supplier-detail.edit-contact.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-email", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-email",
                      type: "email",
                      value: form.email,
                      onChange: (e) => setField("email", e.target.value),
                      "data-ocid": "supplier-detail.edit-email.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-phone", children: "Phone" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-phone",
                      value: form.phone,
                      onChange: (e) => setField("phone", e.target.value),
                      "data-ocid": "supplier-detail.edit-phone.input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-address", children: "Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "edit-address",
                    value: form.address,
                    onChange: (e) => setField("address", e.target.value),
                    rows: 3,
                    "data-ocid": "supplier-detail.edit-address.textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-payment", children: "Payment Terms" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "edit-payment",
                    value: form.paymentTerms,
                    onChange: (e) => setField("paymentTerms", e.target.value),
                    "data-ocid": "supplier-detail.edit-payment.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    id: "edit-active",
                    checked: form.isActive,
                    onCheckedChange: (v) => setField("isActive", v),
                    "data-ocid": "supplier-detail.edit-active.switch"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-active", className: "cursor-pointer", children: "Active supplier" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    className: "gap-1.5",
                    onClick: handleSave,
                    disabled: updateSupplier.isPending,
                    "data-ocid": "supplier-detail.save_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                      updateSupplier.isPending ? "Saving…" : "Save Changes"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    className: "gap-1.5",
                    onClick: cancelEdit,
                    "data-ocid": "supplier-detail.cancel_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                      "Cancel"
                    ]
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded p-4 grid grid-cols-2 gap-x-6 gap-y-3",
            "data-ocid": "supplier-detail.info.card",
            children: [
              [
                ["Contact Person", supplier.contactPerson],
                ["Email", supplier.email || "—"],
                ["Phone", supplier.phone || "—"],
                ["Payment Terms", supplier.paymentTerms || "—"]
              ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: value })
              ] }, label)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: "Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-line", children: supplier.address || "—" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "supplier-detail.products.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Products Supplied" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded overflow-hidden", children: productsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-3 flex flex-col gap-2",
              "data-ocid": "supplier-detail.products.loading_state",
              children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-full" }, k))
            }
          ) : suppliedProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-8 text-center text-sm text-muted-foreground",
              "data-ocid": "supplier-detail.products.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-7 h-7 mx-auto mb-2 opacity-25" }),
                "No products linked to this supplier."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "SKU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: suppliedProducts.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/20",
                "data-ocid": `supplier-detail.products.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell font-medium", children: p.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell font-mono text-xs text-muted-foreground", children: p.sku }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground", children: p.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-right font-mono text-xs", children: Number(p.quantity) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/products/$productId",
                      params: { productId: p.id.toString() },
                      "data-ocid": `supplier-detail.products.view_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2 text-xs",
                          children: "View"
                        }
                      )
                    }
                  ) })
                ]
              },
              p.id.toString()
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "supplier-detail.pos.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Purchase Order History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/purchase-orders/new", search: { supplierId }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "h-7 px-2 text-xs gap-1",
                "data-ocid": "supplier-detail.new-po_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                  "New PO"
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded overflow-hidden", children: posLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-3 flex flex-col gap-2",
              "data-ocid": "supplier-detail.pos.loading_state",
              children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-full" }, k))
            }
          ) : !pos || pos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-8 text-center text-sm text-muted-foreground",
              "data-ocid": "supplier-detail.pos.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-7 h-7 mx-auto mb-2 opacity-25" }),
                "No purchase orders for this supplier yet."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "PO #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pos.map((po, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/20",
                "data-ocid": `supplier-detail.pos.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "data-cell font-mono text-xs", children: [
                    "PO-",
                    po.id.toString().padStart(4, "0")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: PO_STATUS_CLASS[po.status] ?? "badge-neutral",
                      children: PO_STATUS_LABEL[po.status] ?? po.status
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-right font-mono text-xs", children: formatAmount(po.totalAmount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell text-muted-foreground text-xs", children: formatDate(po.createdAt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/purchase-orders/$poId",
                      params: { poId: po.id.toString() },
                      "data-ocid": `supplier-detail.pos.view_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2 text-xs",
                          children: "View"
                        }
                      )
                    }
                  ) })
                ]
              },
              po.id.toString()
            )) })
          ] }) })
        ] })
      ] })
    }
  );
}
export {
  SupplierDetail as default
};
