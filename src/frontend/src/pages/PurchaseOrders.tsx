import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCancelPO, useListPOs } from "@/hooks/use-backend";
import type { POStatus, PurchaseOrder } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ClipboardList,
  PackagePlus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "partiallyReceived", label: "Partially Received" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" },
];

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
  });
}

function StatusBadge({ status }: { status: POStatus }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "badge-neutral" },
    sent: {
      label: "Sent",
      cls: "bg-primary/10 text-primary border border-primary/30 inline-flex px-2 py-0.5 rounded text-xs font-medium",
    },
    partiallyReceived: { label: "Partial", cls: "badge-warning" },
    received: { label: "Received", cls: "badge-success" },
    cancelled: { label: "Cancelled", cls: "badge-destructive" },
  };
  const cfg = map[status] ?? map.draft;
  return <span className={cfg.cls}>{cfg.label}</span>;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  sub,
}: { label: string; value: string; icon: React.ElementType; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-md flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const poStatusParam =
    statusFilter === "all" ? null : (statusFilter as POStatus);
  const { data: pos = [], isLoading } = useListPOs(poStatusParam);
  const cancelPO = useCancelPO();

  const pendingAmount = pos
    .filter(
      (p) =>
        p.status === "draft" ||
        p.status === "sent" ||
        p.status === "partiallyReceived",
    )
    .reduce((sum, p) => sum + Number(p.totalAmount), 0);

  function handleCancel(po: PurchaseOrder) {
    if (!confirm(`Cancel PO #${po.id}? This cannot be undone.`)) return;
    cancelPO.mutate(po.id, {
      onSuccess: () => toast.success(`PO #${po.id} cancelled`),
      onError: (e) => toast.error(String(e)),
    });
  }

  return (
    <Layout title="Purchase Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Purchase Orders
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage supplier orders and goods receipts
            </p>
          </div>
          <Button
            data-ocid="po.create_button"
            onClick={() => navigate({ to: "/purchase-orders/new" })}
            className="gap-2"
          >
            <PackagePlus className="w-4 h-4" />
            Create Purchase Order
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SummaryCard
            label="Total POs"
            value={String(pos.length)}
            icon={ClipboardList}
            sub={
              statusFilter === "all"
                ? "All time"
                : STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label
            }
          />
          <SummaryCard
            label="Pending Amount"
            value={formatPaise(BigInt(Math.round(pendingAmount)))}
            icon={TrendingUp}
            sub="Draft + Sent + Partial"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-52" data-ocid="po.status_filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {statusFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Clear filter
            </Button>
          )}
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">PO ID</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Total Amount
                </TableHead>
                <TableHead className="font-semibold">
                  Expected Delivery
                </TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"].map((rowKey) => (
                  <TableRow key={rowKey}>
                    {["c0", "c1", "c2", "c3", "c4", "c5", "c6"].map(
                      (colKey) => (
                        <TableCell key={colKey}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
              {!isLoading && pos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div
                      className="flex flex-col items-center py-12 gap-3"
                      data-ocid="po.empty_state"
                    >
                      <div className="p-3 bg-muted rounded-full">
                        <AlertCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        No purchase orders found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Create your first PO to start ordering from suppliers
                      </p>
                      <Button
                        size="sm"
                        onClick={() => navigate({ to: "/purchase-orders/new" })}
                      >
                        <PackagePlus className="w-3.5 h-3.5 mr-1.5" /> Create
                        Purchase Order
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                pos.map((po, idx) => (
                  <TableRow
                    key={String(po.id)}
                    className="hover:bg-muted/30 transition-colors"
                    data-ocid={`po.item.${idx + 1}`}
                  >
                    <TableCell className="font-mono text-sm font-medium text-foreground">
                      #{String(po.id)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {po.supplierName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={po.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-foreground">
                      {formatPaise(po.totalAmount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(po.expectedDeliveryDate)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(po.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          data-ocid={`po.view_button.${idx + 1}`}
                          onClick={() =>
                            navigate({
                              to: "/purchase-orders/$poId",
                              params: { poId: String(po.id) },
                            })
                          }
                        >
                          View
                        </Button>
                        {(po.status === "draft" || po.status === "sent") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            data-ocid={`po.cancel_button.${idx + 1}`}
                            onClick={() => handleCancel(po)}
                            disabled={cancelPO.isPending}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
