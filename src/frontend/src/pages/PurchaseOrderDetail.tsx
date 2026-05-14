import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCancelPO,
  useGetPO,
  useReceivePO,
  useUpdatePOStatus,
} from "@/hooks/use-backend";
import type { POLineItem, POStatus, ReceiveItemArgs } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Package,
  Send,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function formatPaise(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(ts: bigint | undefined): string {
  if (!ts) return "—";
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(ts: bigint | undefined): string {
  if (!ts) return "—";
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: POStatus }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "badge-neutral" },
    sent: {
      label: "Sent",
      cls: "bg-primary/10 text-primary border border-primary/30 inline-flex px-2 py-0.5 rounded text-xs font-medium",
    },
    partiallyReceived: { label: "Partially Received", cls: "badge-warning" },
    received: { label: "Received", cls: "badge-success" },
    cancelled: { label: "Cancelled", cls: "badge-destructive" },
  };
  const cfg = map[status] ?? map.draft;
  return <span className={`text-sm font-medium ${cfg.cls}`}>{cfg.label}</span>;
}

interface ReceiveRow {
  productId: bigint;
  productName: string;
  productSku: string;
  orderedQty: bigint;
  receivedQty: string;
}

export default function PurchaseOrderDetail() {
  const navigate = useNavigate();
  const { poId } = useParams({ strict: false }) as { poId: string };
  const poIdBig = useMemo(() => (poId ? BigInt(poId) : null), [poId]);

  const { data: po, isLoading, refetch } = useGetPO(poIdBig);
  const updateStatus = useUpdatePOStatus();
  const receivePO = useReceivePO();
  const cancelPO = useCancelPO();

  const [receiveOpen, setReceiveOpen] = useState(false);
  const [receiveRows, setReceiveRows] = useState<ReceiveRow[]>([]);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  useEffect(() => {
    if (po && receiveOpen) {
      setReceiveRows(
        po.lineItems.map((li) => ({
          productId: li.productId,
          productName: li.productName,
          productSku: li.productSku,
          orderedQty: li.orderedQty,
          receivedQty: String(Number(li.orderedQty) - Number(li.receivedQty)),
        })),
      );
    }
  }, [po, receiveOpen]);

  function handleMarkSent() {
    if (!po) return;
    updateStatus.mutate(
      { id: po.id, status: "sent" as POStatus },
      {
        onSuccess: () => {
          toast.success("PO marked as Sent");
          refetch();
        },
        onError: (e) => toast.error(String(e)),
      },
    );
  }

  function handleReceiveSubmit() {
    if (!po) return;
    const items: ReceiveItemArgs[] = receiveRows
      .filter((r) => Number(r.receivedQty) > 0)
      .map((r) => ({
        productId: r.productId,
        receivedQty: BigInt(Math.max(0, Math.round(Number(r.receivedQty)))),
      }));
    if (items.length === 0) {
      toast.warning("Enter at least one received quantity");
      return;
    }
    receivePO.mutate(
      { id: po.id, receivedItems: items },
      {
        onSuccess: () => {
          toast.success("Goods received! Inventory updated.");
          setReceiveOpen(false);
          refetch();
        },
        onError: (e) => toast.error(String(e)),
      },
    );
  }

  function handleCancel() {
    if (!po) return;
    cancelPO.mutate(po.id, {
      onSuccess: () => {
        toast.success(`PO #${po.id} cancelled`);
        setCancelConfirmOpen(false);
        refetch();
      },
      onError: (e) => toast.error(String(e)),
    });
  }

  if (isLoading) {
    return (
      <Layout title="Purchase Order">
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!po) {
    return (
      <Layout title="Not Found">
        <div
          className="p-6 flex flex-col items-center gap-4 py-20"
          data-ocid="po_detail.error_state"
        >
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-lg font-semibold text-foreground">
            Purchase Order not found
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/purchase-orders" })}
          >
            Back to Purchase Orders
          </Button>
        </div>
      </Layout>
    );
  }

  const canMarkSent = po.status === "draft";
  const canReceive = po.status === "sent" || po.status === "partiallyReceived";
  const canCancel = po.status === "draft" || po.status === "sent";

  return (
    <Layout title={`PO #${po.id}`}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => navigate({ to: "/purchase-orders" })}
            data-ocid="po_detail.back_button"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <h1 className="flex-1 text-xl font-bold text-foreground min-w-0 truncate">
            Purchase Order #{String(po.id)}
          </h1>
          <StatusBadge status={po.status} />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: User, label: "Supplier", value: po.supplierName },
            {
              icon: Package,
              label: "Total Amount",
              value: formatPaise(po.totalAmount),
            },
            {
              icon: Calendar,
              label: "Expected Delivery",
              value: formatDateShort(po.expectedDeliveryDate),
            },
            {
              icon: Calendar,
              label: "Created",
              value: formatDate(po.createdAt),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5" /> {label}
              </div>
              <p className="font-semibold text-sm text-foreground truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {po.notes && (
          <div className="bg-muted/40 border border-border rounded-lg p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="text-sm text-foreground">{po.notes}</p>
          </div>
        )}

        {/* Line items table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-sm text-foreground">
              Line Items ({po.lineItems.length})
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold text-right">
                  Ordered
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Received
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Unit Cost
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Line Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {po.lineItems.map((li: POLineItem, idx: number) => {
                const lineTotal =
                  Number(li.orderedQty) * Number(li.unitCostPrice);
                const fullyReceived =
                  Number(li.receivedQty) >= Number(li.orderedQty);
                const partiallyReceived =
                  Number(li.receivedQty) > 0 && !fullyReceived;
                return (
                  <TableRow
                    key={String(li.productId)}
                    data-ocid={`po_detail.line_item.${idx + 1}`}
                  >
                    <TableCell className="font-medium text-foreground">
                      {li.productName}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {li.productSku}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {String(li.orderedQty)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          fullyReceived
                            ? "text-green-600 font-semibold"
                            : partiallyReceived
                              ? "text-amber-600 font-semibold"
                              : "text-muted-foreground"
                        }
                      >
                        {String(li.receivedQty)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPaise(li.unitCostPrice)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatPaise(BigInt(lineTotal))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-lg font-bold text-foreground font-mono">
                {formatPaise(po.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span>Created: {formatDate(po.createdAt)}</span>
          <span>Updated: {formatDate(po.updatedAt)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          {canMarkSent && (
            <Button
              className="gap-2"
              onClick={handleMarkSent}
              disabled={updateStatus.isPending}
              data-ocid="po_detail.mark_sent_button"
            >
              <Send className="w-4 h-4" />
              {updateStatus.isPending ? "Updating…" : "Mark as Sent"}
            </Button>
          )}
          {canReceive && (
            <Button
              className="gap-2"
              onClick={() => setReceiveOpen(true)}
              data-ocid="po_detail.receive_button"
            >
              <CheckCircle2 className="w-4 h-4" /> Receive Goods
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setCancelConfirmOpen(true)}
              data-ocid="po_detail.cancel_po_button"
            >
              <XCircle className="w-4 h-4" /> Cancel PO
            </Button>
          )}
        </div>
      </div>

      {/* Receive Goods Modal */}
      <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
        <DialogContent
          className="max-w-2xl"
          data-ocid="po_detail.receive_dialog"
        >
          <DialogHeader>
            <DialogTitle>Receive Goods — PO #{String(po.id)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Enter the quantity received for each item. Stock will be
              automatically updated.
            </p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {receiveRows.map((row, idx) => (
                <div
                  key={String(row.productId)}
                  className="flex items-center gap-4 border border-border rounded-md p-3 bg-muted/20"
                  data-ocid={`po_detail.receive_row.${idx + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {row.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {row.productSku} · Ordered: {String(row.orderedQty)}
                    </p>
                  </div>
                  <div className="space-y-1 flex-shrink-0">
                    <Label htmlFor={`recv-${idx}`} className="text-xs">
                      Qty Received
                    </Label>
                    <Input
                      id={`recv-${idx}`}
                      type="number"
                      min="0"
                      max={String(row.orderedQty)}
                      className="w-28"
                      value={row.receivedQty}
                      onChange={(e) =>
                        setReceiveRows((prev) =>
                          prev.map((r, i) =>
                            i === idx
                              ? { ...r, receivedQty: e.target.value }
                              : r,
                          ),
                        )
                      }
                      data-ocid={`po_detail.receive_qty_input.${idx + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setReceiveOpen(false)}
                data-ocid="po_detail.receive_cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReceiveSubmit}
                disabled={receivePO.isPending}
                data-ocid="po_detail.receive_confirm_button"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {receivePO.isPending ? "Processing…" : "Confirm Receipt"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent data-ocid="po_detail.cancel_dialog">
          <DialogHeader>
            <DialogTitle>Cancel Purchase Order?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel PO{" "}
              <span className="font-semibold text-foreground">
                #{String(po.id)}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setCancelConfirmOpen(false)}
                data-ocid="po_detail.cancel_dialog_close_button"
              >
                Keep PO
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelPO.isPending}
                data-ocid="po_detail.cancel_confirm_button"
              >
                {cancelPO.isPending ? "Cancelling…" : "Yes, Cancel PO"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
