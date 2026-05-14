import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics, useListSuppliers } from "@/hooks/use-backend";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronRight,
  ClipboardList,
  IndianRupee,
  Layers,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Truck,
} from "lucide-react";

interface QuickAction {
  to: string;
  search?: Record<string, string>;
  label: string;
  desc: string;
  Icon: React.ElementType;
  iconBg: string;
  ocid: string;
}

const quickActions: QuickAction[] = [
  {
    to: "/products/new",
    label: "Add New Product",
    desc: "Register a new SKU with price and stock details",
    Icon: Package,
    iconBg: "bg-primary/10 text-primary",
    ocid: "dashboard.quick_action.add_product",
  },
  {
    to: "/purchase-orders/new",
    label: "Create Purchase Order",
    desc: "Raise a PO to restock low inventory items",
    Icon: ShoppingCart,
    iconBg: "bg-amber-50 text-amber-600",
    ocid: "dashboard.quick_action.create_po",
  },
  {
    to: "/suppliers/new",
    label: "Add Supplier",
    desc: "Onboard a new vendor or supplier partner",
    Icon: Truck,
    iconBg: "bg-muted text-muted-foreground",
    ocid: "dashboard.quick_action.add_supplier",
  },
  {
    to: "/products",
    search: {
      query: "",
      status: "lowStock",
      sortField: "quantity",
      sortOrder: "asc",
    },
    label: "View Low Stock",
    desc: "Filter all products currently below reorder point",
    Icon: AlertTriangle,
    iconBg: "bg-destructive/10 text-destructive",
    ocid: "dashboard.quick_action.view_low_stock",
  },
];

function formatINR(paise: bigint): string {
  const rupees = Number(paise) / 100;
  if (rupees >= 10_000_000) return `₹${(rupees / 10_000_000).toFixed(1)}Cr`;
  if (rupees >= 100_000) return `₹${(rupees / 100_000).toFixed(1)}L`;
  if (rupees >= 1_000) return `₹${(rupees / 1_000).toFixed(1)}K`;
  return `₹${rupees.toFixed(0)}`;
}

function formatINRFull(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: suppliers } = useListSuppliers(null);

  const totalSuppliers = suppliers?.length ?? 0;
  const lowStockProducts = metrics?.lowStockProducts ?? [];
  const categoryBreakdown = metrics?.categories ?? [];
  const totalCatValue = categoryBreakdown.reduce(
    (s, c) => s + Number(c.totalValue),
    0,
  );

  return (
    <Layout title="Inventory Dashboard">
      {/* ── Hero Stat Cards ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6"
        data-ocid="dashboard.stats"
      >
        {metricsLoading ? (
          [1, 2, 3, 4, 5].map((k) => (
            <Skeleton key={k} className="h-28 rounded-lg" />
          ))
        ) : (
          <>
            <StatCard
              title="Total SKUs"
              value={
                metrics
                  ? Number(metrics.totalProducts).toLocaleString("en-IN")
                  : "—"
              }
              icon={Layers}
              subLabel="Active products"
              accent="default"
              data-ocid="dashboard.stat.total_skus"
            />
            <StatCard
              title="Inventory Value"
              value={metrics ? formatINR(metrics.totalInventoryValue) : "—"}
              icon={IndianRupee}
              subLabel={metrics ? "Cost price basis" : undefined}
              accent="success"
              data-ocid="dashboard.stat.inventory_value"
            />
            <StatCard
              title="Low Stock Items"
              value={metrics ? Number(metrics.lowStockCount) : "—"}
              icon={AlertTriangle}
              subLabel="Below reorder point"
              accent={
                metrics && Number(metrics.lowStockCount) > 0
                  ? "warning"
                  : "default"
              }
              data-ocid="dashboard.stat.low_stock"
            />
            <StatCard
              title="Pending Orders"
              value={metrics ? Number(metrics.pendingPOCount) : "—"}
              icon={ClipboardList}
              subLabel={
                metrics && Number(metrics.pendingPOValue) > 0
                  ? `${formatINR(metrics.pendingPOValue)} value`
                  : "No pending POs"
              }
              accent={
                metrics && Number(metrics.pendingPOCount) > 0
                  ? "warning"
                  : "default"
              }
              data-ocid="dashboard.stat.pending_pos"
            />
            <StatCard
              title="Total Suppliers"
              value={totalSuppliers.toLocaleString("en-IN")}
              icon={Building2}
              subLabel="Active vendors"
              accent="neutral"
              data-ocid="dashboard.stat.suppliers"
            />
          </>
        )}
      </div>

      {/* ── Low Stock Alert Panel ── */}
      {(metricsLoading || lowStockProducts.length > 0) && (
        <div className="mb-6" data-ocid="dashboard.low_stock_panel">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-foreground">
                Low Stock Alerts
              </h2>
              {!metricsLoading && (
                <span className="badge-warning">
                  {lowStockProducts.length} items
                </span>
              )}
            </div>
            <Link
              to="/purchase-orders/new"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              data-ocid="dashboard.create_po_link"
            >
              <Plus className="w-3 h-3" /> Create Purchase Order
            </Link>
          </div>

          <div
            className="bg-card border border-amber-200 rounded-lg overflow-hidden"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: "oklch(0.68 0.14 66)",
            }}
          >
            {metricsLoading ? (
              <div
                className="p-4 flex flex-col gap-2"
                data-ocid="dashboard.low_stock.loading_state"
              >
                {[1, 2, 3].map((k) => (
                  <Skeleton key={k} className="h-9 w-full" />
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-amber-50/60">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Product
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      SKU
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Current Stock
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Reorder Point
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.slice(0, 10).map((p, idx) => (
                    <tr
                      key={p.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-amber-50/40 transition-smooth"
                      data-ocid={`dashboard.low_stock.item.${idx + 1}`}
                    >
                      <td className="px-3 py-2">
                        <Link
                          to="/products/$productId"
                          params={{ productId: p.id.toString() }}
                          className="font-medium text-foreground hover:text-primary transition-colors truncate block max-w-[180px]"
                          data-ocid={`dashboard.low_stock.product_link.${idx + 1}`}
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2 hidden md:table-cell">
                        <span className="data-cell-mono">{p.sku}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            Number(p.currentStock) === 0
                              ? "text-destructive"
                              : "text-amber-600"
                          }`}
                        >
                          {Number(p.currentStock).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right hidden sm:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">
                          {Number(p.reorderPoint).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Link
                          to="/purchase-orders/new"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-smooth"
                          data-ocid={`dashboard.low_stock.create_po_button.${idx + 1}`}
                        >
                          <Plus className="w-3 h-3" /> Raise PO
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom 2-column grid: Category Breakdown + Recent Quick View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div data-ocid="dashboard.category_breakdown">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Category Breakdown
              </h2>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {metricsLoading ? (
              <div
                className="p-4 flex flex-col gap-2"
                data-ocid="dashboard.categories.loading_state"
              >
                {[1, 2, 3, 4].map((k) => (
                  <Skeleton key={k} className="h-8 w-full" />
                ))}
              </div>
            ) : categoryBreakdown.length === 0 ? (
              <div
                className="py-10 flex flex-col items-center text-muted-foreground"
                data-ocid="dashboard.categories.empty_state"
              >
                <BarChart3 className="w-7 h-7 mb-2 opacity-40" />
                <p className="text-sm">No category data yet.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Category
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      SKUs
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Value
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((cat, idx) => {
                    const pct =
                      totalCatValue > 0
                        ? (Number(cat.totalValue) / totalCatValue) * 100
                        : 0;
                    return (
                      <tr
                        key={cat.category}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                        data-ocid={`dashboard.category.item.${idx + 1}`}
                      >
                        <td className="px-3 py-2 font-medium text-foreground">
                          {cat.category}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                          {Number(cat.productCount).toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-xs font-semibold">
                          {formatINRFull(cat.totalValue)}
                        </td>
                        <td className="px-3 py-2 text-right hidden sm:table-cell">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${pct.toFixed(0)}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-muted-foreground w-9 text-right">
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Stock Adjustments placeholder — quick nav shortcuts */}
        <div data-ocid="dashboard.quick_actions">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={
                  action.to as "/products" | "/purchase-orders" | "/suppliers"
                }
                search={action.search}
                className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted/40 transition-smooth group"
                data-ocid={action.ocid}
              >
                <span
                  className={`w-8 h-8 rounded-md flex items-center justify-center ${action.iconBg}`}
                >
                  <action.Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
