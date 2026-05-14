import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePO,
  useListProducts,
  useListSuppliers,
} from "@/hooks/use-backend";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface LineRow {
  id: number;
  productId: string;
  orderedQty: string;
  unitCostPrice: string;
}

function formatRupees(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PurchaseOrderNew() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, string>;
  const preSupplier = search.supplierId ?? "";
  const preProduct = search.productId ?? "";

  const { data: suppliers = [] } = useListSuppliers(true);
  const { data: products = [] } = useListProducts();
  const createPO = useCreatePO();

  const [supplierId, setSupplierId] = useState(preSupplier);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineRow[]>([
    {
      id: Date.now(),
      productId: preProduct,
      orderedQty: "1",
      unitCostPrice: "",
    },
  ]);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!preProduct || products.length === 0) return;
    const prod = products.find((p) => String(p.id) === preProduct);
    if (prod)
      setLines([
        {
          id: Date.now(),
          productId: preProduct,
          orderedQty: "1",
          unitCostPrice: String(Number(prod.costPrice) / 100),
        },
      ]);
  }, [preProduct, products]);

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => String(s.id) === supplierId),
    [suppliers, supplierId],
  );

  function addLine() {
    setLines((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        productId: "",
        orderedQty: "1",
        unitCostPrice: "",
      },
    ]);
  }
  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateLine(idx: number, field: keyof LineRow, value: string) {
    setLines((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const updated = { ...row, [field]: value };
        if (field === "productId") {
          const prod = products.find((p) => String(p.id) === value);
          if (prod)
            updated.unitCostPrice = String(Number(prod.costPrice) / 100);
        }
        return updated;
      }),
    );
  }

  const runningTotal = lines.reduce((sum, row) => {
    return (
      sum + (Number(row.orderedQty) || 0) * (Number(row.unitCostPrice) || 0)
    );
  }, 0);

  const step1Valid = supplierId !== "";
  const step2Valid =
    lines.length > 0 &&
    lines.every(
      (r) =>
        r.productId !== "" &&
        Number(r.orderedQty) > 0 &&
        Number(r.unitCostPrice) > 0,
    );

  function handleSubmit() {
    if (!selectedSupplier) return;
    createPO.mutate(
      {
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.name,
        expectedDeliveryDate: deliveryDate
          ? BigInt(new Date(deliveryDate).getTime() * 1_000_000)
          : undefined,
        notes: notes.trim() || undefined,
        lineItems: lines.map((r) => ({
          productId: BigInt(r.productId),
          orderedQty: BigInt(r.orderedQty),
          unitCostPrice: BigInt(Math.round(Number(r.unitCostPrice) * 100)),
        })),
      },
      {
        onSuccess: (po) => {
          toast.success(`Purchase Order #${po.id} created!`);
          navigate({ to: "/purchase-orders" });
        },
        onError: (e) => toast.error(String(e)),
      },
    );
  }

  return (
    <Layout title="New Purchase Order">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => navigate({ to: "/purchase-orders" })}
            data-ocid="po_new.back_button"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              New Purchase Order
            </h1>
            <p className="text-xs text-muted-foreground">Step {step} of 2</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <span>1</span>
            <span>Supplier &amp; Details</span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <span>2</span>
            <span>Line Items</span>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <h2 className="font-semibold text-foreground">
              Supplier &amp; Order Details
            </h2>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger id="supplier" data-ocid="po_new.supplier_select">
                  <SelectValue placeholder="Select a supplier…" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={String(s.id)} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSupplier && (
                <p className="text-xs text-muted-foreground">
                  Contact: {selectedSupplier.contactPerson} ·{" "}
                  {selectedSupplier.phone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                data-ocid="po_new.delivery_date_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Order notes, special instructions…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-ocid="po_new.notes_input"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                data-ocid="po_new.next_button"
              >
                Next: Add Line Items →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Line Items</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addLine}
                  data-ocid="po_new.add_line_button"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product
                </Button>
              </div>
              {lines.length === 0 && (
                <p
                  className="text-sm text-muted-foreground text-center py-4"
                  data-ocid="po_new.lines_empty_state"
                >
                  No line items yet. Click “Add Product” to add one.
                </p>
              )}
              <div className="space-y-3">
                {lines.map((row, idx) => {
                  const prod = products.find(
                    (p) => String(p.id) === row.productId,
                  );
                  const lineTotal =
                    (Number(row.orderedQty) || 0) *
                    (Number(row.unitCostPrice) || 0);
                  return (
                    <div
                      key={row.id}
                      className="border border-border rounded-md p-4 space-y-3 bg-background"
                      data-ocid={`po_new.line_item.${idx + 1}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Item {idx + 1}
                        </span>
                        {lines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeLine(idx)}
                            data-ocid={`po_new.remove_line_button.${idx + 1}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-3 space-y-1">
                          <Label className="text-xs">Product *</Label>
                          <Select
                            value={row.productId}
                            onValueChange={(v) =>
                              updateLine(idx, "productId", v)
                            }
                          >
                            <SelectTrigger
                              data-ocid={`po_new.product_select.${idx + 1}`}
                            >
                              <SelectValue placeholder="Select product…" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem
                                  key={String(p.id)}
                                  value={String(p.id)}
                                >
                                  {p.name} ({p.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {prod && (
                            <p className="text-xs text-muted-foreground">
                              SKU: {prod.sku} · Stock: {String(prod.quantity)}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Ordered Qty *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={row.orderedQty}
                            onChange={(e) =>
                              updateLine(idx, "orderedQty", e.target.value)
                            }
                            data-ocid={`po_new.qty_input.${idx + 1}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Unit Cost (₹) *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={row.unitCostPrice}
                            onChange={(e) =>
                              updateLine(idx, "unitCostPrice", e.target.value)
                            }
                            data-ocid={`po_new.cost_input.${idx + 1}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Line Total</Label>
                          <div className="h-9 flex items-center px-3 bg-muted/50 rounded-md text-sm font-mono font-medium text-foreground border border-input">
                            {formatRupees(lineTotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Running total */}
            <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {lines.length} item{lines.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Order Total</p>
                <p className="text-xl font-bold text-foreground font-mono">
                  {formatRupees(runningTotal)}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                data-ocid="po_new.back_step_button"
              >
                ← Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: "/purchase-orders" })}
                >
                  Discard
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!step2Valid || createPO.isPending}
                  data-ocid="po_new.submit_button"
                >
                  {createPO.isPending ? "Creating…" : "Create Purchase Order"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
