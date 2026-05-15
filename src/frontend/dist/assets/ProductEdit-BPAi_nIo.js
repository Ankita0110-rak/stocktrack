import { b as useParams, c as useRouter, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-DBaupoop.js";
import { h as useGetProduct, m as useUpdateProduct, e as useDeleteProduct, a as useListSuppliers, L as Layout } from "./use-backend-DzLCpOKH.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-HFtJOdaj.js";
import { B as Button, u as ue } from "./index-BLCJbqC7.js";
import { I as Input } from "./input-CiXtUUSE.js";
import { L as Label } from "./label-Ci4n_Bjl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C7UVFkAu.js";
import { T as Textarea } from "./textarea-BgNnOjjJ.js";
import { T as Trash2 } from "./trash-2-BBBL-Xe5.js";
import "./index-t9uGdf6q.js";
import "./index-D4XQ3UmP.js";
import "./Combination-DvpeoIvT.js";
import "./index-CTV9CTDx.js";
import "./index-DuVLGgc_.js";
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
function ProductEdit() {
  const { productId } = useParams({ from: "/products/$productId/edit" });
  const id = BigInt(productId);
  const router = useRouter();
  const { data: product, isLoading } = useGetProduct(id);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { data: suppliers } = useListSuppliers(null);
  async function handleDelete() {
    try {
      await deleteProduct.mutateAsync(id);
      ue.success(`"${product == null ? void 0 : product.name}" deleted.`);
      router.navigate({
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
  const [form, setForm] = reactExports.useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    unitOfMeasure: "units",
    reorderQuantity: "10",
    lowStockThreshold: "",
    barcode: "",
    supplierId: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
    var _a;
    if (product) {
      setForm({
        sku: product.sku,
        name: product.name,
        description: product.description,
        category: product.category,
        costPrice: (Number(product.costPrice) / 100).toFixed(2),
        sellingPrice: (Number(product.sellingPrice) / 100).toFixed(2),
        unitOfMeasure: product.unitOfMeasure,
        reorderQuantity: Number(product.reorderQuantity).toString(),
        lowStockThreshold: product.lowStockThreshold !== void 0 ? Number(product.lowStockThreshold).toString() : "",
        barcode: product.barcode ?? "",
        supplierId: ((_a = product.supplierId) == null ? void 0 : _a.toString()) ?? ""
      });
    }
  }, [product]);
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
    const costPaise = BigInt(
      Math.round(Number.parseFloat(form.costPrice) * 100)
    );
    const sellPaise = BigInt(
      Math.round(Number.parseFloat(form.sellingPrice) * 100)
    );
    try {
      await updateProduct.mutateAsync({
        id,
        sku: form.sku.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: sellPaise,
        costPrice: costPaise,
        sellingPrice: sellPaise,
        unitOfMeasure: form.unitOfMeasure,
        reorderQuantity: BigInt(
          Number.parseInt(form.reorderQuantity || "10", 10)
        ),
        lowStockThreshold: form.lowStockThreshold ? BigInt(Number.parseInt(form.lowStockThreshold, 10)) : void 0,
        barcode: form.barcode.trim() || void 0,
        supplierId: form.supplierId ? BigInt(form.supplierId) : void 0
      });
      ue.success("Product updated.");
      router.navigate({ to: "/products/$productId", params: { productId } });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to update product."
      );
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Layout,
      {
        breadcrumbs: [
          { label: "Products", to: "/products" },
          { label: "Edit" }
        ],
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col gap-3",
            "data-ocid": "product-edit.loading_state",
            children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k))
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      breadcrumbs: [
        { label: "Products", to: "/products" },
        { label: (product == null ? void 0 : product.name) ?? "Edit", to: `/products/${productId}` },
        { label: "Edit" }
      ],
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", "data-ocid": "product-edit.panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold mb-5", children: "Edit Product" }),
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
                  "data-ocid": "product-edit.sku.input"
                }
              ),
              errors.sku && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-edit.sku.field_error",
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
                        "data-ocid": "product-edit.uom.select",
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
                "data-ocid": "product-edit.name.input"
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "product-edit.name.field_error",
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
                      "data-ocid": "product-edit.category.select",
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
                "data-ocid": "product-edit.category.field_error",
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
                "data-ocid": "product-edit.description.textarea"
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
                  "data-ocid": "product-edit.cost-price.input"
                }
              ),
              errors.costPrice && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-edit.cost-price.field_error",
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
                  "data-ocid": "product-edit.selling-price.input"
                }
              ),
              errors.sellingPrice && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "product-edit.selling-price.field_error",
                  children: errors.sellingPrice
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Margin %" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 flex items-center px-3 bg-muted/40 border border-border rounded text-sm font-mono text-muted-foreground", children: marginPct !== null ? `${marginPct}%` : "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
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
                  "data-ocid": "product-edit.reorder-qty.input"
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
                  "data-ocid": "product-edit.low-stock-threshold.input"
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
                  "data-ocid": "product-edit.barcode.input"
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
                        "data-ocid": "product-edit.supplier.select",
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
                disabled: updateProduct.isPending,
                "data-ocid": "product-edit.submit_button",
                children: updateProduct.isPending ? "Saving…" : "Save Changes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => router.navigate({
                  to: "/products/$productId",
                  params: { productId }
                }),
                "data-ocid": "product-edit.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "gap-1.5 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                  "data-ocid": "product-edit.delete_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                    "Delete Product"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "product-edit.delete.dialog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Product?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                    "This will permanently delete",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: product == null ? void 0 : product.name }),
                    " and all its stock history. This action cannot be undone."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "product-edit.delete.cancel_button", children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: handleDelete,
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                      "data-ocid": "product-edit.delete.confirm_button",
                      children: deleteProduct.isPending ? "Deleting…" : "Delete Product"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  ProductEdit as default
};
