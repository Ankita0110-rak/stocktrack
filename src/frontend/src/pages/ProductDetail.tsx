import { AdjustmentType } from "@/backend";
import { Layout } from "@/components/Layout";
import { StockBadge } from "@/components/StockBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdjustStock,
  useDeleteProduct,
  useGetProduct,
  useGetSupplier,
  useStockHistory,
} from "@/hooks/use-backend";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Package,
  Pencil,
  ShoppingCart,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatRupees(paise: bigint): string {
  return `\u20B9${(Number(paise) / 100).toFixed(2)}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString();
}

const ADJUSTMENT_OPTIONS: { value: AdjustmentType; label: string }[] = [
  { value: AdjustmentType.receivedFromPO, label: "Received" },
  { value: AdjustmentType.return_, label: "Return" },
  { value: AdjustmentType.damage, label: "Damage" },
  { value: AdjustmentType.recount, label: "Recount" },
  { value: AdjustmentType.sale, label: "Sale" },
  { value: AdjustmentType.restock, label: "Restock" },
  { value: AdjustmentType.remove, label: "Remove" },
];

const HISTORY_LABEL: Record<AdjustmentType, string> = {
  [AdjustmentType.receivedFromPO]: "Received",
  [AdjustmentType.return_]: "Return",
  [AdjustmentType.damage]: "Damage",
  [AdjustmentType.recount]: "Recount",
  [AdjustmentType.sale]: "Sale",
  [AdjustmentType.restock]: "Restock",
  [AdjustmentType.remove]: "Remove",
};

const HISTORY_STYLE: Record<AdjustmentType, string> = {
  [AdjustmentType.receivedFromPO]: "badge-success",
  [AdjustmentType.return_]: "badge-warning",
  [AdjustmentType.damage]: "badge-destructive",
  [AdjustmentType.recount]: "badge-neutral",
  [AdjustmentType.sale]: "badge-neutral",
  [AdjustmentType.restock]: "badge-success",
  [AdjustmentType.remove]: "badge-destructive",
};

export default function ProductDetail() {
  const { productId } = useParams({ from: "/products/$productId" });
  const id = BigInt(productId);
  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProduct(id);
  const { data: history, isLoading: historyLoading } = useStockHistory(id);
  const adjustStock = useAdjustStock();
  const deleteProduct = useDeleteProduct();
  const { data: supplier } = useGetSupplier(product?.supplierId ?? null);

  async function handleDelete() {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success(`"${product?.name}" deleted.`);
      navigate({
        to: "/products",
        search: {
          query: "",
          status: "all",
          sortField: "name",
          sortOrder: "asc",
          category: "all",
          supplierId: "all",
        },
      });
    } catch {
      toast.error("Failed to delete product.");
    }
  }

  const [adjQty, setAdjQty] = useState("");
  const [adjNote, setAdjNote] = useState("");
  const [adjType, setAdjType] = useState<AdjustmentType>(
    AdjustmentType.restock,
  );

  async function handleAdjust() {
    const qty = Number.parseInt(adjQty, 10);
    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity.");
      return;
    }
    try {
      await adjustStock.mutateAsync({
        productId: id,
        quantity: BigInt(qty),
        adjustmentType: adjType,
        note: adjNote || undefined,
      });
      toast.success("Stock adjusted.");
      setAdjQty("");
      setAdjNote("");
    } catch {
      toast.error("Stock adjustment failed.");
    }
  }

  if (isLoading) {
    return (
      <Layout
        breadcrumbs={[
          { label: "Products", to: "/products" },
          { label: "\u2026" },
        ]}
      >
        <div
          className="flex flex-col gap-3"
          data-ocid="product-detail.loading_state"
        >
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <Skeleton key={k} className="h-8 w-full" />
          ))}
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout
        breadcrumbs={[
          { label: "Products", to: "/products" },
          { label: "Not Found" },
        ]}
      >
        <div
          className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          data-ocid="product-detail.error_state"
        >
          <Package className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm font-medium">Product not found.</p>
          <Link
            to="/products"
            search={{
              query: "",
              status: "all",
              sortField: "name",
              sortOrder: "asc",
              category: "all",
              supplierId: "all",
            }}
          >
            <Button type="button" variant="ghost" size="sm" className="mt-3">
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const costPriceNum = Number(product.costPrice) / 100;
  const sellPriceNum = Number(product.sellingPrice) / 100;
  const margin =
    costPriceNum > 0
      ? (((sellPriceNum - costPriceNum) / costPriceNum) * 100).toFixed(1)
      : null;

  return (
    <Layout
      breadcrumbs={[
        { label: "Products", to: "/products" },
        { label: product.name },
      ]}
    >
      <div className="max-w-3xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold">{product.name}</h1>
              <StockBadge status={product.stockStatus} />
            </div>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              {product.sku}
              {product.barcode && (
                <span className="ml-3 opacity-60">
                  Barcode: {product.barcode}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/purchase-orders/new"
              search={{ productId: product.id.toString() }}
              data-ocid="product-detail.create-po_button"
            >
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Create PO
              </Button>
            </Link>
            <Link
              to="/products/$productId/edit"
              params={{ productId }}
              data-ocid="product-detail.edit_button"
            >
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  data-ocid="product-detail.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="product-detail.delete.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{product.name}</strong>{" "}
                    and all its stock history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="product-detail.delete.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    data-ocid="product-detail.delete.confirm_button"
                  >
                    {deleteProduct.isPending ? "Deleting…" : "Delete Product"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Details */}
        <div
          className="bg-card border border-border rounded p-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4"
          data-ocid="product-detail.card"
        >
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Category
            </p>
            <p className="text-sm">{product.category}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Unit of Measure
            </p>
            <p className="text-sm">{product.unitOfMeasure}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Quantity in Stock
            </p>
            <p className="text-sm font-mono">{Number(product.quantity)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Cost Price
            </p>
            <p className="text-sm font-mono">
              {formatRupees(product.costPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Selling Price
            </p>
            <p className="text-sm font-mono">
              {formatRupees(product.sellingPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Margin
            </p>
            <p className="text-sm font-mono flex items-center gap-1">
              {margin !== null ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  {margin}%
                </>
              ) : (
                "\u2014"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Reorder Quantity
            </p>
            <p className="text-sm font-mono">
              {Number(product.reorderQuantity)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Low Stock Alert
            </p>
            <p className="text-sm font-mono">
              {product.lowStockThreshold !== undefined
                ? Number(product.lowStockThreshold)
                : "Global default"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Supplier
            </p>
            <p className="text-sm">
              {supplier
                ? supplier.name
                : product.supplierId
                  ? "Loading\u2026"
                  : "\u2014"}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Description
            </p>
            <p className="text-sm text-muted-foreground">
              {product.description || "\u2014"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Last Modified
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {formatDate(product.lastModified)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Stock Adjustment */}
        <div data-ocid="product-detail.adjust-stock.panel">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Adjust Stock
          </h2>
          <div className="flex flex-wrap items-start gap-3">
            <Select
              value={adjType}
              onValueChange={(v) => setAdjType(v as AdjustmentType)}
            >
              <SelectTrigger
                className="h-8 w-36 text-sm"
                data-ocid="product-detail.adjust-type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Quantity"
              min={1}
              value={adjQty}
              onChange={(e) => setAdjQty(e.target.value)}
              className="w-28 h-8 text-sm font-mono"
              data-ocid="product-detail.adjust-qty.input"
            />
            <Textarea
              placeholder="Notes (optional)"
              value={adjNote}
              onChange={(e) => setAdjNote(e.target.value)}
              className="flex-1 min-w-48 h-8 min-h-0 text-sm py-1.5 resize-none"
              data-ocid="product-detail.adjust-note.textarea"
            />
            <Button
              type="button"
              size="sm"
              className="h-8"
              onClick={handleAdjust}
              disabled={adjustStock.isPending}
              data-ocid="product-detail.adjust-submit_button"
            >
              {adjustStock.isPending ? "Saving\u2026" : "Apply Adjustment"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Stock History */}
        <div data-ocid="product-detail.history">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Stock History
          </h2>
          <div className="bg-card border border-border rounded overflow-hidden">
            {historyLoading ? (
              <div
                className="p-3 flex flex-col gap-2"
                data-ocid="product-detail.history.loading_state"
              >
                {["a", "b", "c", "d"].map((k) => (
                  <Skeleton key={k} className="h-7 w-full" />
                ))}
              </div>
            ) : !history || history.length === 0 ? (
              <div
                className="py-8 text-center text-sm text-muted-foreground"
                data-ocid="product-detail.history.empty_state"
              >
                No stock history yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Qty
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, idx) => (
                    <tr
                      key={entry.id.toString()}
                      className="border-b border-border last:border-0"
                      data-ocid={`product-detail.history.item.${idx + 1}`}
                    >
                      <td className="data-cell text-muted-foreground text-xs font-mono">
                        {formatDate(entry.timestamp)}
                      </td>
                      <td className="data-cell">
                        <span
                          className={
                            HISTORY_STYLE[entry.adjustmentType] ??
                            "badge-neutral"
                          }
                        >
                          {HISTORY_LABEL[entry.adjustmentType] ??
                            entry.adjustmentType}
                        </span>
                      </td>
                      <td className="data-cell text-right font-mono text-xs">
                        {Number(entry.quantity)}
                      </td>
                      <td className="data-cell text-muted-foreground text-xs">
                        {entry.note ?? entry.notes ?? "\u2014"}
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
