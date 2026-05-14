import { a as useNavigate, u as useSearch, r as reactExports, j as jsxRuntimeExports } from "./index-D-jPTGcB.js";
import { c as createLucideIcon, a as useListSuppliers, t as useListProducts, y as useCreatePO, L as Layout } from "./use-backend-CGmhALc1.js";
import { B as Button, u as ue } from "./index-BDZG_dbu.js";
import { I as Input } from "./input-DOk1Y-BC.js";
import { L as Label } from "./label-CCJ_q0Gg.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-kXXIZ_pV.js";
import { S as Separator } from "./separator-lzVHINwq.js";
import { T as Textarea } from "./textarea-viXWDMP0.js";
import { A as ArrowLeft } from "./arrow-left-DiW-_gyj.js";
import { P as Plus } from "./plus-DL4IW2cl.js";
import { S as ShoppingCart } from "./shopping-cart-D0vF60SY.js";
import "./index-DQ7vqync.js";
import "./index-DvyOV-KK.js";
import "./Combination-BkxpJwC9.js";
import "./index-2YUJ__Ph.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function formatRupees(rupees) {
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function PurchaseOrderNew() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const preSupplier = search.supplierId ?? "";
  const preProduct = search.productId ?? "";
  const { data: suppliers = [] } = useListSuppliers(true);
  const { data: products = [] } = useListProducts();
  const createPO = useCreatePO();
  const [supplierId, setSupplierId] = reactExports.useState(preSupplier);
  const [deliveryDate, setDeliveryDate] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [lines, setLines] = reactExports.useState([
    {
      id: Date.now(),
      productId: preProduct,
      orderedQty: "1",
      unitCostPrice: ""
    }
  ]);
  const [step, setStep] = reactExports.useState(1);
  reactExports.useEffect(() => {
    if (!preProduct || products.length === 0) return;
    const prod = products.find((p) => String(p.id) === preProduct);
    if (prod)
      setLines([
        {
          id: Date.now(),
          productId: preProduct,
          orderedQty: "1",
          unitCostPrice: String(Number(prod.costPrice) / 100)
        }
      ]);
  }, [preProduct, products]);
  const selectedSupplier = reactExports.useMemo(
    () => suppliers.find((s) => String(s.id) === supplierId),
    [suppliers, supplierId]
  );
  function addLine() {
    setLines((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        productId: "",
        orderedQty: "1",
        unitCostPrice: ""
      }
    ]);
  }
  function removeLine(idx) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateLine(idx, field, value) {
    setLines(
      (prev) => prev.map((row, i) => {
        if (i !== idx) return row;
        const updated = { ...row, [field]: value };
        if (field === "productId") {
          const prod = products.find((p) => String(p.id) === value);
          if (prod)
            updated.unitCostPrice = String(Number(prod.costPrice) / 100);
        }
        return updated;
      })
    );
  }
  const runningTotal = lines.reduce((sum, row) => {
    return sum + (Number(row.orderedQty) || 0) * (Number(row.unitCostPrice) || 0);
  }, 0);
  const step1Valid = supplierId !== "";
  const step2Valid = lines.length > 0 && lines.every(
    (r) => r.productId !== "" && Number(r.orderedQty) > 0 && Number(r.unitCostPrice) > 0
  );
  function handleSubmit() {
    if (!selectedSupplier) return;
    createPO.mutate(
      {
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.name,
        expectedDeliveryDate: deliveryDate ? BigInt(new Date(deliveryDate).getTime() * 1e6) : void 0,
        notes: notes.trim() || void 0,
        lineItems: lines.map((r) => ({
          productId: BigInt(r.productId),
          orderedQty: BigInt(r.orderedQty),
          unitCostPrice: BigInt(Math.round(Number(r.unitCostPrice) * 100))
        }))
      },
      {
        onSuccess: (po) => {
          ue.success(`Purchase Order #${po.id} created!`);
          navigate({ to: "/purchase-orders" });
        },
        onError: (e) => ue.error(String(e))
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "New Purchase Order", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "gap-1.5 text-muted-foreground",
          onClick: () => navigate({ to: "/purchase-orders" }),
          "data-ocid": "po_new.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            " Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground", children: "New Purchase Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Step ",
          step,
          " of 2"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Supplier & Details" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Line Items" })
          ]
        }
      )
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Supplier & Order Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "supplier", children: "Supplier *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: supplierId, onValueChange: setSupplierId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "supplier", "data-ocid": "po_new.supplier_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a supplier…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(s.id), children: s.name }, String(s.id))) })
        ] }),
        selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Contact: ",
          selectedSupplier.contactPerson,
          " ·",
          " ",
          selectedSupplier.phone
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "deliveryDate", children: "Expected Delivery Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deliveryDate",
            type: "date",
            value: deliveryDate,
            onChange: (e) => setDeliveryDate(e.target.value),
            "data-ocid": "po_new.delivery_date_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "notes",
            placeholder: "Order notes, special instructions…",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            rows: 3,
            "data-ocid": "po_new.notes_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setStep(2),
          disabled: !step1Valid,
          "data-ocid": "po_new.next_button",
          children: "Next: Add Line Items →"
        }
      ) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Line Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: addLine,
              "data-ocid": "po_new.add_line_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1.5" }),
                " Add Product"
              ]
            }
          )
        ] }),
        lines.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-muted-foreground text-center py-4",
            "data-ocid": "po_new.lines_empty_state",
            children: "No line items yet. Click “Add Product” to add one."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: lines.map((row, idx) => {
          const prod = products.find(
            (p) => String(p.id) === row.productId
          );
          const lineTotal = (Number(row.orderedQty) || 0) * (Number(row.unitCostPrice) || 0);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border border-border rounded-md p-4 space-y-3 bg-background",
              "data-ocid": `po_new.line_item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: [
                    "Item ",
                    idx + 1
                  ] }),
                  lines.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive",
                      onClick: () => removeLine(idx),
                      "data-ocid": `po_new.remove_line_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Product *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: row.productId,
                        onValueChange: (v) => updateLine(idx, "productId", v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectTrigger,
                            {
                              "data-ocid": `po_new.product_select.${idx + 1}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select product…" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            SelectItem,
                            {
                              value: String(p.id),
                              children: [
                                p.name,
                                " (",
                                p.sku,
                                ")"
                              ]
                            },
                            String(p.id)
                          )) })
                        ]
                      }
                    ),
                    prod && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "SKU: ",
                      prod.sku,
                      " · Stock: ",
                      String(prod.quantity)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Ordered Qty *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: "1",
                        value: row.orderedQty,
                        onChange: (e) => updateLine(idx, "orderedQty", e.target.value),
                        "data-ocid": `po_new.qty_input.${idx + 1}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Unit Cost (₹) *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        placeholder: "0.00",
                        value: row.unitCostPrice,
                        onChange: (e) => updateLine(idx, "unitCostPrice", e.target.value),
                        "data-ocid": `po_new.cost_input.${idx + 1}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Line Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 flex items-center px-3 bg-muted/50 rounded-md text-sm font-mono font-medium text-foreground border border-input", children: formatRupees(lineTotal) })
                  ] })
                ] })
              ]
            },
            row.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
            lines.length,
            " item",
            lines.length !== 1 ? "s" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Order Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground font-mono", children: formatRupees(runningTotal) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setStep(1),
            "data-ocid": "po_new.back_step_button",
            children: "← Back"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: () => navigate({ to: "/purchase-orders" }),
              children: "Discard"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSubmit,
              disabled: !step2Valid || createPO.isPending,
              "data-ocid": "po_new.submit_button",
              children: createPO.isPending ? "Creating…" : "Create Purchase Order"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  PurchaseOrderNew as default
};
