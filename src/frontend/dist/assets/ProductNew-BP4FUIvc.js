import { c as useRouter, r as reactExports, j as jsxRuntimeExports } from "./index-D-jPTGcB.js";
import { l as useCreateProduct, a as useListSuppliers, L as Layout } from "./use-backend-CGmhALc1.js";
import { B as Button, u as ue } from "./index-BDZG_dbu.js";
import { I as Input } from "./input-DOk1Y-BC.js";
import { L as Label } from "./label-CCJ_q0Gg.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-kXXIZ_pV.js";
import { T as Textarea } from "./textarea-viXWDMP0.js";
import "./index-DQ7vqync.js";
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
const UOM_OPTIONS = ["kg", "liters", "units", "packs", "boxes", "cartons"];
function ProductNew() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: suppliers } = useListSuppliers(null);
  const [form, setForm] = reactExports.useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    unitOfMeasure: "units",
    reorderQuantity: "10",
    lowStockThreshold: "",
    barcode: "",
    supplierId: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const costPriceNum = Number.parseFloat(form.costPrice);
  const sellPriceNum = Number.parseFloat(form.sellingPrice);
  const marginPct = !Number.isNaN(costPriceNum) && !Number.isNaN(sellPriceNum) && costPriceNum > 0 ? ((sellPriceNum - costPriceNum) / costPriceNum * 100).toFixed(1) : null;
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function validate() {
    const e = {};
    if (!form.sku.trim()) e.sku = "SKU is required.";
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.category) e.category = "Category is required.";
    const qty = Number.parseInt(form.quantity, 10);
    if (!form.quantity || Number.isNaN(qty) || qty < 0)
      e.quantity = "Enter a valid quantity.";
    const cp = Number.parseFloat(form.costPrice);
    if (!form.costPrice || Number.isNaN(cp) || cp < 0)
      e.costPrice = "Enter a valid cost price.";
    const sp = Number.parseFloat(form.sellingPrice);
    if (!form.sellingPrice || Number.isNaN(sp) || sp < 0)
      e.sellingPrice = "Enter a valid selling price.";
    return e;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const costPaisae = BigInt(
      Math.round(Number.parseFloat(form.costPrice) * 100)
    );
    const sellPaise = BigInt(
      Math.round(Number.parseFloat(form.sellingPrice) * 100)
    );
    try {
      const product = await createProduct.mutateAsync({
        sku: form.sku.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        quantity: BigInt(Number.parseInt(form.quantity, 10)),
        price: sellPaise,
        costPrice: costPaisae,
        sellingPrice: sellPaise,
        unitOfMeasure: form.unitOfMeasure,
        reorderQuantity: BigInt(
          Number.parseInt(form.reorderQuantity || "10", 10)
        ),
        lowStockThreshold: form.lowStockThreshold ? BigInt(Number.parseInt(form.lowStockThreshold, 10)) : void 0,
        barcode: form.barcode.trim() || void 0,
        supplierId: form.supplierId ? BigInt(form.supplierId) : void 0
      });
      ue.success("Product created.");
      router.navigate({
        to: "/products/$productId",
        params: { productId: product.id.toString() }
      });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to create product."
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      breadcrumbs: [
        { label: "Products", to: "/products" },
        { label: "Add Product" }
      ],
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", "data-ocid": "product-new.panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold mb-5", children: "Add Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sku", className: "text-xs", children: "SKU *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "sku",
                  value: form.sku,
                  onChange: (e) => set("sku", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.sku.input"
                }
              ),
              errors.sku && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-new.sku.field_error",
                  children: errors.sku
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "uom", className: "text-xs", children: "Unit of Measure *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.unitOfMeasure,
                  onValueChange: (v) => set("unitOfMeasure", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: "uom",
                        className: "h-8 text-sm",
                        "data-ocid": "product-new.uom.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: UOM_OPTIONS.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u, children: u }, u)) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "text-xs", children: "Product Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "name",
                value: form.name,
                onChange: (e) => set("name", e.target.value),
                className: "h-8 text-sm",
                "data-ocid": "product-new.name.input"
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "product-new.name.field_error",
                children: errors.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", className: "text-xs", children: "Category *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.category,
                onValueChange: (v) => set("category", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "category",
                      className: "h-8 text-sm",
                      "data-ocid": "product-new.category.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
                ]
              }
            ),
            errors.category && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "product-new.category.field_error",
                children: errors.category
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", className: "text-xs", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                value: form.description,
                onChange: (e) => set("description", e.target.value),
                className: "text-sm resize-none",
                rows: 2,
                "data-ocid": "product-new.description.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "costPrice", className: "text-xs", children: "Cost Price (\\u20B9) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "costPrice",
                  type: "number",
                  min: 0,
                  step: 0.01,
                  value: form.costPrice,
                  onChange: (e) => set("costPrice", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.cost-price.input"
                }
              ),
              errors.costPrice && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-new.cost-price.field_error",
                  children: errors.costPrice
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sellingPrice", className: "text-xs", children: "Selling Price (\\u20B9) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "sellingPrice",
                  type: "number",
                  min: 0,
                  step: 0.01,
                  value: form.sellingPrice,
                  onChange: (e) => set("sellingPrice", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.selling-price.input"
                }
              ),
              errors.sellingPrice && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-new.selling-price.field_error",
                  children: errors.sellingPrice
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Margin %" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 flex items-center px-3 bg-muted/40 border border-border rounded text-sm font-mono text-muted-foreground", children: marginPct !== null ? `${marginPct}%` : "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "quantity", className: "text-xs", children: "Qty in Stock *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "quantity",
                  type: "number",
                  min: 0,
                  value: form.quantity,
                  onChange: (e) => set("quantity", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.quantity.input"
                }
              ),
              errors.quantity && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-new.quantity.field_error",
                  children: errors.quantity
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reorderQty", className: "text-xs", children: "Reorder Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "reorderQty",
                  type: "number",
                  min: 1,
                  value: form.reorderQuantity,
                  onChange: (e) => set("reorderQuantity", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.reorder-qty.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lowStockThreshold", className: "text-xs", children: "Low Stock Alert" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "lowStockThreshold",
                  type: "number",
                  min: 0,
                  placeholder: "Global default",
                  value: form.lowStockThreshold,
                  onChange: (e) => set("lowStockThreshold", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.low-stock-threshold.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "barcode", className: "text-xs", children: "Barcode (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "barcode",
                  value: form.barcode,
                  onChange: (e) => set("barcode", e.target.value),
                  className: "h-8 text-sm font-mono",
                  "data-ocid": "product-new.barcode.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "supplier", className: "text-xs", children: "Supplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.supplierId || "none",
                  onValueChange: (v) => set("supplierId", v === "none" ? "" : v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: "supplier",
                        className: "h-8 text-sm",
                        "data-ocid": "product-new.supplier.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "None" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
                      (suppliers ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id.toString(), children: s.name }, s.id.toString()))
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                size: "sm",
                disabled: createProduct.isPending,
                "data-ocid": "product-new.submit_button",
                children: createProduct.isPending ? "Creating…" : "Create Product"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => router.navigate({
                  to: "/products",
                  search: {
                    query: "",
                    status: "all",
                    sortField: "name",
                    sortOrder: "asc",
                    category: "all",
                    supplierId: "all"
                  }
                }),
                "data-ocid": "product-new.cancel_button",
                children: "Cancel"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
export {
  ProductNew as default
};
