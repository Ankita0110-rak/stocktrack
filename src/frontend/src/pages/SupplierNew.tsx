import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSupplier } from "@/hooks/use-backend";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

interface FormState {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  contactPerson?: string;
}

export default function SupplierNew() {
  const navigate = useNavigate();
  const createSupplier = useCreateSupplier();

  const [form, setForm] = useState<FormState>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Supplier name is required.";
    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
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
        isActive: form.isActive,
      });
      toast.success(`"${form.name.trim()}" added successfully.`);
      navigate({ to: "/suppliers" });
    } catch {
      toast.error("Failed to create supplier.");
    }
  }

  return (
    <Layout
      breadcrumbs={[
        { label: "Suppliers", to: "/suppliers" },
        { label: "New Supplier" },
      ]}
    >
      <div className="max-w-2xl">
        <h1 className="text-lg font-semibold mb-1">Add New Supplier</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Register a wholesaler, distributor, or FMCG vendor.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-card border border-border rounded p-5 flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">
                Supplier Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Hindustan Unilever Ltd."
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
                data-ocid="supplier-new.name.input"
              />
              {errors.name && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="supplier-new.name.field_error"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactPerson">
                Contact Person <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactPerson"
                placeholder="e.g. Rahul Sharma"
                value={form.contactPerson}
                onChange={(e) => set("contactPerson", e.target.value)}
                className={errors.contactPerson ? "border-destructive" : ""}
                data-ocid="supplier-new.contact-person.input"
              />
              {errors.contactPerson && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="supplier-new.contact-person.field_error"
                >
                  {errors.contactPerson}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vendor@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  data-ocid="supplier-new.email.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  data-ocid="supplier-new.phone.input"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Warehouse / registered office address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                rows={3}
                data-ocid="supplier-new.address.textarea"
              />
            </div>

            {/* Payment Terms */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                placeholder="e.g. Net 30, Net 60, Immediate"
                value={form.paymentTerms}
                onChange={(e) => set("paymentTerms", e.target.value)}
                data-ocid="supplier-new.payment-terms.input"
              />
              <p className="text-xs text-muted-foreground">
                Common terms: Net 30, Net 60, Net 90, Immediate, COD
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 py-1">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(v) => set("isActive", v)}
                data-ocid="supplier-new.active.switch"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active supplier
              </Label>
              <span className="text-xs text-muted-foreground">
                {form.isActive
                  ? "This supplier is available for purchase orders."
                  : "Supplier will be inactive and hidden from PO creation."}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5">
            <Button
              type="submit"
              disabled={createSupplier.isPending}
              data-ocid="supplier-new.submit_button"
            >
              {createSupplier.isPending ? "Saving…" : "Save Supplier"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/suppliers" })}
              data-ocid="supplier-new.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
