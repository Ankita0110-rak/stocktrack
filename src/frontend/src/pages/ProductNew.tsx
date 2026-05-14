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
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct, useListSuppliers } from "@/hooks/use-backend";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Groceries",
  "Personal Care",
  "Home Care",
  "Kitchenware",
  "Clothing & Apparel",
  "Bed & Bath",
  "Electronics",
  "Stationery",
];

const UOM_OPTIONS = ["kg", "liters", "units", "packs", "boxes", "cartons"];

export default function ProductNew() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: suppliers } = useListSuppliers(null);

  const [form, setForm] = useState({
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
    supplierId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const costPriceNum = Number.parseFloat(form.costPrice);
  const sellPriceNum = Number.parseFloat(form.sellingPrice);
  const marginPct =
    !Number.isNaN(costPriceNum) &&
    !Number.isNaN(sellPriceNum) &&
    costPriceNum > 0
      ? (((sellPriceNum - costPriceNum) / costPriceNum) * 100).toFixed(1)
      : null;

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const costPaisae = BigInt(
      Math.round(Number.parseFloat(form.costPrice) * 100),
    );
    const sellPaise = BigInt(
      Math.round(Number.parseFloat(form.sellingPrice) * 100),
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
          Number.parseInt(form.reorderQuantity || "10", 10),
        ),
        lowStockThreshold: form.lowStockThreshold
          ? BigInt(Number.parseInt(form.lowStockThreshold, 10))
          : undefined,
        barcode: form.barcode.trim() || undefined,
        supplierId: form.supplierId ? BigInt(form.supplierId) : undefined,
      });
      toast.success("Product created.");
      router.navigate({
        to: "/products/$productId",
        params: { productId: product.id.toString() },
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    }
  }

  return (
    <Layout
      breadcrumbs={[
        { label: "Products", to: "/products" },
        { label: "Add Product" },
      ]}
    >
      <div className="max-w-xl" data-ocid="product-new.panel">
        <h1 className="text-lg font-semibold mb-5">Add Product</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* SKU + UOM */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sku" className="text-xs">
                SKU *
              </Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.sku.input"
              />
              {errors.sku && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="product-new.sku.field_error"
                >
                  {errors.sku}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="uom" className="text-xs">
                Unit of Measure *
              </Label>
              <Select
                value={form.unitOfMeasure}
                onValueChange={(v) => set("unitOfMeasure", v)}
              >
                <SelectTrigger
                  id="uom"
                  className="h-8 text-sm"
                  data-ocid="product-new.uom.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UOM_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs">
              Product Name *
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="h-8 text-sm"
              data-ocid="product-new.name.input"
            />
            {errors.name && (
              <p
                className="text-xs text-destructive"
                data-ocid="product-new.name.field_error"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category" className="text-xs">
              Category *
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger
                id="category"
                className="h-8 text-sm"
                data-ocid="product-new.category.select"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p
                className="text-xs text-destructive"
                data-ocid="product-new.category.field_error"
              >
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="text-sm resize-none"
              rows={2}
              data-ocid="product-new.description.textarea"
            />
          </div>

          {/* Prices + Margin */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="costPrice" className="text-xs">
                Cost Price (\u20B9) *
              </Label>
              <Input
                id="costPrice"
                type="number"
                min={0}
                step={0.01}
                value={form.costPrice}
                onChange={(e) => set("costPrice", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.cost-price.input"
              />
              {errors.costPrice && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="product-new.cost-price.field_error"
                >
                  {errors.costPrice}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sellingPrice" className="text-xs">
                Selling Price (\u20B9) *
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                min={0}
                step={0.01}
                value={form.sellingPrice}
                onChange={(e) => set("sellingPrice", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.selling-price.input"
              />
              {errors.sellingPrice && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="product-new.selling-price.field_error"
                >
                  {errors.sellingPrice}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Margin %</Label>
              <div className="h-8 flex items-center px-3 bg-muted/40 border border-border rounded text-sm font-mono text-muted-foreground">
                {marginPct !== null ? `${marginPct}%` : "\u2014"}
              </div>
            </div>
          </div>

          {/* Quantity + Reorder + Low Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quantity" className="text-xs">
                Qty in Stock *
              </Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.quantity.input"
              />
              {errors.quantity && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="product-new.quantity.field_error"
                >
                  {errors.quantity}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reorderQty" className="text-xs">
                Reorder Quantity
              </Label>
              <Input
                id="reorderQty"
                type="number"
                min={1}
                value={form.reorderQuantity}
                onChange={(e) => set("reorderQuantity", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.reorder-qty.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lowStockThreshold" className="text-xs">
                Low Stock Alert
              </Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min={0}
                placeholder="Global default"
                value={form.lowStockThreshold}
                onChange={(e) => set("lowStockThreshold", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.low-stock-threshold.input"
              />
            </div>
          </div>

          {/* Barcode + Supplier */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="barcode" className="text-xs">
                Barcode (optional)
              </Label>
              <Input
                id="barcode"
                value={form.barcode}
                onChange={(e) => set("barcode", e.target.value)}
                className="h-8 text-sm font-mono"
                data-ocid="product-new.barcode.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="supplier" className="text-xs">
                Supplier
              </Label>
              <Select
                value={form.supplierId || "none"}
                onValueChange={(v) => set("supplierId", v === "none" ? "" : v)}
              >
                <SelectTrigger
                  id="supplier"
                  className="h-8 text-sm"
                  data-ocid="product-new.supplier.select"
                >
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {(suppliers ?? []).map((s) => (
                    <SelectItem key={s.id.toString()} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={createProduct.isPending}
              data-ocid="product-new.submit_button"
            >
              {createProduct.isPending ? "Creating\u2026" : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                router.navigate({
                  to: "/products",
                  search: {
                    query: "",
                    status: "all",
                    sortField: "name",
                    sortOrder: "asc",
                    category: "all",
                    supplierId: "all",
                  },
                })
              }
              data-ocid="product-new.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
