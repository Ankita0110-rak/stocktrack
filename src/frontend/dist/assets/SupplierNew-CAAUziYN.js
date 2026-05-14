import { a as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-D-jPTGcB.js";
import { r as useCreateSupplier, L as Layout } from "./use-backend-CGmhALc1.js";
import { B as Button, u as ue } from "./index-BDZG_dbu.js";
import { I as Input } from "./input-DOk1Y-BC.js";
import { L as Label } from "./label-CCJ_q0Gg.js";
import { S as Switch } from "./switch-Bu6Y7SUj.js";
import { T as Textarea } from "./textarea-viXWDMP0.js";
import "./index-DQ7vqync.js";
import "./index-DvyOV-KK.js";
import "./index-2YUJ__Ph.js";
function SupplierNew() {
  const navigate = useNavigate();
  const createSupplier = useCreateSupplier();
  const [form, setForm] = reactExports.useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "",
    isActive: true
  });
  const [errors, setErrors] = reactExports.useState({});
  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: void 0 }));
  }
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Supplier name is required.";
    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createSupplier.mutateAsync({
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        paymentTerms: form.paymentTerms.trim(),
        isActive: form.isActive
      });
      ue.success(`"${form.name.trim()}" added successfully.`);
      navigate({ to: "/suppliers" });
    } catch {
      ue.error("Failed to create supplier.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      breadcrumbs: [
        { label: "Suppliers", to: "/suppliers" },
        { label: "New Supplier" }
      ],
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold mb-1", children: "Add New Supplier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Register a wholesaler, distributor, or FMCG vendor." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded p-5 flex flex-col gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "name", children: [
                "Supplier Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "name",
                  placeholder: "e.g. Hindustan Unilever Ltd.",
                  value: form.name,
                  onChange: (e) => set("name", e.target.value),
                  className: errors.name ? "border-destructive" : "",
                  "data-ocid": "supplier-new.name.input"
                }
              ),
              errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "supplier-new.name.field_error",
                  children: errors.name
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "contactPerson", children: [
                "Contact Person ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "contactPerson",
                  placeholder: "e.g. Rahul Sharma",
                  value: form.contactPerson,
                  onChange: (e) => set("contactPerson", e.target.value),
                  className: errors.contactPerson ? "border-destructive" : "",
                  "data-ocid": "supplier-new.contact-person.input"
                }
              ),
              errors.contactPerson && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "supplier-new.contact-person.field_error",
                  children: errors.contactPerson
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    placeholder: "vendor@example.com",
                    value: form.email,
                    onChange: (e) => set("email", e.target.value),
                    "data-ocid": "supplier-new.email.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "phone",
                    type: "tel",
                    placeholder: "+91 98765 43210",
                    value: form.phone,
                    onChange: (e) => set("phone", e.target.value),
                    "data-ocid": "supplier-new.phone.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "address",
                  placeholder: "Warehouse / registered office address",
                  value: form.address,
                  onChange: (e) => set("address", e.target.value),
                  rows: 3,
                  "data-ocid": "supplier-new.address.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "paymentTerms", children: "Payment Terms" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "paymentTerms",
                  placeholder: "e.g. Net 30, Net 60, Immediate",
                  value: form.paymentTerms,
                  onChange: (e) => set("paymentTerms", e.target.value),
                  "data-ocid": "supplier-new.payment-terms.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Common terms: Net 30, Net 60, Net 90, Immediate, COD" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "isActive",
                  checked: form.isActive,
                  onCheckedChange: (v) => set("isActive", v),
                  "data-ocid": "supplier-new.active.switch"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "isActive", className: "cursor-pointer", children: "Active supplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: form.isActive ? "This supplier is available for purchase orders." : "Supplier will be inactive and hidden from PO creation." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: createSupplier.isPending,
                "data-ocid": "supplier-new.submit_button",
                children: createSupplier.isPending ? "Saving…" : "Save Supplier"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => navigate({ to: "/suppliers" }),
                "data-ocid": "supplier-new.cancel_button",
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
  SupplierNew as default
};
