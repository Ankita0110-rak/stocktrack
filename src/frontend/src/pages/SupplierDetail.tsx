import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetPOsBySupplier,
  useGetSupplier,
  useGetSupplierProducts,
  useListProducts,
  useUpdateSupplier,
} from "@/hooks/use-backend";
import type { POStatus, Supplier } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  Package,
  Pencil,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(paise: bigint): string {
  return `₹${(Number(paise) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

const PO_STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  partiallyReceived: "Partial",
  received: "Received",
  cancelled: "Cancelled",
};

const PO_STATUS_CLASS: Record<string, string> = {
  draft: "badge-neutral",
  sent: "badge-warning",
  partiallyReceived: "badge-warning",
  received: "badge-success",
  cancelled: "badge-neutral",
};

interface EditForm {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  isActive: boolean;
}

function buildEditForm(s: Supplier): EditForm {
  return {
    name: s.name,
    contactPerson: s.contactPerson,
    email: s.email,
    phone: s.phone,
    address: s.address,
    paymentTerms: s.paymentTerms,
    isActive: s.isActive,
  };
}

export default function SupplierDetail() {
  const { supplierId } = useParams({ from: "/suppliers/$supplierId" });
  const id = BigInt(supplierId);

  const { data: supplier, isLoading } = useGetSupplier(id);
  const { data: productIds, isLoading: productsLoading } =
    useGetSupplierProducts(id);
  const { data: allProducts } = useListProducts();
  const { data: pos, isLoading: posLoading } = useGetPOsBySupplier(id);
  const updateSupplier = useUpdateSupplier();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm | null>(null);

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

  function setField<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!form) return;
    if (!form.name.trim()) {
      toast.error("Supplier name is required.");
      return;
    }
    if (!form.contactPerson.trim()) {
      toast.error("Contact person is required.");
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
          isActive: form.isActive,
        },
      });
      toast.success("Supplier updated.");
      setEditing(false);
      setForm(null);
    } catch {
      toast.error("Failed to update supplier.");
    }
  }

  const suppliedProducts = (allProducts ?? []).filter((p) =>
    (productIds ?? []).some((pid) => pid === p.id),
  );

  if (isLoading) {
    return (
      <Layout
        breadcrumbs={[{ label: "Suppliers", to: "/suppliers" }, { label: "…" }]}
      >
        <div
          className="flex flex-col gap-3"
          data-ocid="supplier-detail.loading_state"
        >
          {["a", "b", "c", "d", "e"].map((k) => (
            <Skeleton key={k} className="h-8 w-full" />
          ))}
        </div>
      </Layout>
    );
  }

  if (!supplier) {
    return (
      <Layout
        breadcrumbs={[
          { label: "Suppliers", to: "/suppliers" },
          { label: "Not Found" },
        ]}
      >
        <div
          className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          data-ocid="supplier-detail.error_state"
        >
          <Package className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm font-medium">Supplier not found.</p>
          <Link to="/suppliers">
            <Button type="button" variant="ghost" size="sm" className="mt-3">
              Back to Suppliers
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      breadcrumbs={[
        { label: "Suppliers", to: "/suppliers" },
        { label: supplier.name },
      ]}
    >
      <div className="max-w-3xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold">{supplier.name}</h1>
              {supplier.isActive ? (
                <span className="badge-success">Active</span>
              ) : (
                <span className="badge-neutral">Inactive</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Added {formatDate(supplier.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/suppliers">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5"
                data-ocid="supplier-detail.back_button"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            </Link>
            <Link to="/purchase-orders/new" search={{ supplierId: supplierId }}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                data-ocid="supplier-detail.create-po_button"
              >
                <Plus className="w-3.5 h-3.5" />
                Create PO
              </Button>
            </Link>
            {!editing && (
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={startEdit}
                data-ocid="supplier-detail.edit_button"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Details / Edit Form */}
        {editing && form ? (
          <div
            className="bg-card border border-primary/30 rounded p-5 flex flex-col gap-4"
            data-ocid="supplier-detail.edit-form.panel"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Edit Supplier
            </p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-name">Supplier Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                data-ocid="supplier-detail.edit-name.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                value={form.contactPerson}
                onChange={(e) => setField("contactPerson", e.target.value)}
                data-ocid="supplier-detail.edit-contact.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  data-ocid="supplier-detail.edit-email.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  data-ocid="supplier-detail.edit-phone.input"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                rows={3}
                data-ocid="supplier-detail.edit-address.textarea"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-payment">Payment Terms</Label>
              <Input
                id="edit-payment"
                value={form.paymentTerms}
                onChange={(e) => setField("paymentTerms", e.target.value)}
                data-ocid="supplier-detail.edit-payment.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="edit-active"
                checked={form.isActive}
                onCheckedChange={(v) => setField("isActive", v)}
                data-ocid="supplier-detail.edit-active.switch"
              />
              <Label htmlFor="edit-active" className="cursor-pointer">
                Active supplier
              </Label>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={handleSave}
                disabled={updateSupplier.isPending}
                data-ocid="supplier-detail.save_button"
              >
                <Save className="w-3.5 h-3.5" />
                {updateSupplier.isPending ? "Saving…" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={cancelEdit}
                data-ocid="supplier-detail.cancel_button"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="bg-card border border-border rounded p-4 grid grid-cols-2 gap-x-6 gap-y-3"
            data-ocid="supplier-detail.info.card"
          >
            {(
              [
                ["Contact Person", supplier.contactPerson],
                ["Email", supplier.email || "—"],
                ["Phone", supplier.phone || "—"],
                ["Payment Terms", supplier.paymentTerms || "—"],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-sm">{value}</p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                Address
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {supplier.address || "—"}
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Products Supplied */}
        <div data-ocid="supplier-detail.products.section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Products Supplied
          </h2>
          <div className="bg-card border border-border rounded overflow-hidden">
            {productsLoading ? (
              <div
                className="p-3 flex flex-col gap-2"
                data-ocid="supplier-detail.products.loading_state"
              >
                {["a", "b", "c"].map((k) => (
                  <Skeleton key={k} className="h-7 w-full" />
                ))}
              </div>
            ) : suppliedProducts.length === 0 ? (
              <div
                className="py-8 text-center text-sm text-muted-foreground"
                data-ocid="supplier-detail.products.empty_state"
              >
                <Package className="w-7 h-7 mx-auto mb-2 opacity-25" />
                No products linked to this supplier.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Product
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      SKU
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Category
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Stock
                    </th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {suppliedProducts.map((p, idx) => (
                    <tr
                      key={p.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20"
                      data-ocid={`supplier-detail.products.item.${idx + 1}`}
                    >
                      <td className="data-cell font-medium">{p.name}</td>
                      <td className="data-cell font-mono text-xs text-muted-foreground">
                        {p.sku}
                      </td>
                      <td className="data-cell text-muted-foreground">
                        {p.category}
                      </td>
                      <td className="data-cell text-right font-mono text-xs">
                        {Number(p.quantity)}
                      </td>
                      <td className="data-cell">
                        <Link
                          to="/products/$productId"
                          params={{ productId: p.id.toString() }}
                          data-ocid={`supplier-detail.products.view_button.${idx + 1}`}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <Separator />

        {/* Purchase Order History */}
        <div data-ocid="supplier-detail.pos.section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Purchase Order History
            </h2>
            <Link to="/purchase-orders/new" search={{ supplierId: supplierId }}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs gap-1"
                data-ocid="supplier-detail.new-po_button"
              >
                <Plus className="w-3 h-3" />
                New PO
              </Button>
            </Link>
          </div>
          <div className="bg-card border border-border rounded overflow-hidden">
            {posLoading ? (
              <div
                className="p-3 flex flex-col gap-2"
                data-ocid="supplier-detail.pos.loading_state"
              >
                {["a", "b", "c"].map((k) => (
                  <Skeleton key={k} className="h-7 w-full" />
                ))}
              </div>
            ) : !pos || pos.length === 0 ? (
              <div
                className="py-8 text-center text-sm text-muted-foreground"
                data-ocid="supplier-detail.pos.empty_state"
              >
                <ClipboardList className="w-7 h-7 mx-auto mb-2 opacity-25" />
                No purchase orders for this supplier yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      PO #
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Created
                    </th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {pos.map((po, idx) => (
                    <tr
                      key={po.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20"
                      data-ocid={`supplier-detail.pos.item.${idx + 1}`}
                    >
                      <td className="data-cell font-mono text-xs">
                        PO-{po.id.toString().padStart(4, "0")}
                      </td>
                      <td className="data-cell">
                        <span
                          className={
                            PO_STATUS_CLASS[po.status as string] ??
                            "badge-neutral"
                          }
                        >
                          {PO_STATUS_LABEL[po.status as string] ?? po.status}
                        </span>
                      </td>
                      <td className="data-cell text-right font-mono text-xs">
                        {formatAmount(po.totalAmount)}
                      </td>
                      <td className="data-cell text-muted-foreground text-xs">
                        {formatDate(po.createdAt)}
                      </td>
                      <td className="data-cell">
                        <Link
                          to="/purchase-orders/$poId"
                          params={{ poId: po.id.toString() }}
                          data-ocid={`supplier-detail.pos.view_button.${idx + 1}`}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
