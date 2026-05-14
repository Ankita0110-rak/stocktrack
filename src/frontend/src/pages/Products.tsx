import { SortField, SortOrder, StockStatus } from "@/backend";
import { Layout } from "@/components/Layout";
import { StockBadge } from "@/components/StockBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteProduct,
  useListSuppliers,
  useSearchProducts,
} from "@/hooks/use-backend";
import type { SearchFilterArgs } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Package, Pencil, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCallback } from "react";
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

function formatRupees(paise: bigint): string {
  return `\u20B9${(Number(paise) / 100).toFixed(2)}`;
}

export default function Products() {
  const {
    query,
    status: statusFilter,
    sortField,
    sortOrder,
    category: categoryFilter,
    supplierId: supplierIdFilter,
  } = useSearch({ from: "/products" });
  const navigate = useNavigate({ from: "/products" });

  const { data: suppliers } = useListSuppliers(null);

  function setQuery(value: string) {
    navigate({ search: (prev) => ({ ...prev, query: value }) });
  }
  function setStatusFilter(value: string) {
    navigate({ search: (prev) => ({ ...prev, status: value }) });
  }
  function setCategoryFilter(value: string) {
    navigate({ search: (prev) => ({ ...prev, category: value }) });
  }
  function setSupplierFilter(value: string) {
    navigate({ search: (prev) => ({ ...prev, supplierId: value }) });
  }
  function setSortField(value: string) {
    navigate({ search: (prev) => ({ ...prev, sortField: value }) });
  }
  function setSortOrder(value: string) {
    navigate({ search: (prev) => ({ ...prev, sortOrder: value }) });
  }

  const searchArgs: SearchFilterArgs = {
    searchQuery: query || undefined,
    stockStatus:
      statusFilter !== "all" ? (statusFilter as StockStatus) : undefined,
    sortField: sortField as SortField,
    sortOrder: sortOrder as SortOrder,
    supplierId:
      supplierIdFilter && supplierIdFilter !== "all"
        ? BigInt(supplierIdFilter)
        : undefined,
  };

  const { data: allProducts, isLoading } = useSearchProducts(searchArgs);
  const deleteMutation = useDeleteProduct();

  // Client-side category filter (backend doesn't have it in SearchFilterArgs)
  const products =
    allProducts && categoryFilter && categoryFilter !== "all"
      ? allProducts.filter((p) => p.category === categoryFilter)
      : allProducts;

  const handleDelete = useCallback(
    async (id: bigint, name: string) => {
      if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
      try {
        await deleteMutation.mutateAsync(id);
        toast.success(`"${name}" deleted.`);
      } catch {
        toast.error("Failed to delete product.");
      }
    },
    [deleteMutation],
  );

  return (
    <Layout title="Products">
      {/* Toolbar row 1 */}
      <div
        className="flex flex-wrap items-center gap-2 mb-2"
        data-ocid="products.toolbar"
      >
        <Input
          placeholder="Search products\u2026"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-52 h-8 text-sm"
          data-ocid="products.search_input"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="h-8 w-36 text-sm"
            data-ocid="products.status_filter.select"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={StockStatus.inStock}>In Stock</SelectItem>
            <SelectItem value={StockStatus.lowStock}>Low Stock</SelectItem>
            <SelectItem value={StockStatus.outOfStock}>Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter || "all"}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger
            className="h-8 w-40 text-sm"
            data-ocid="products.category_filter.select"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {suppliers && suppliers.length > 0 && (
          <Select
            value={supplierIdFilter || "all"}
            onValueChange={setSupplierFilter}
          >
            <SelectTrigger
              className="h-8 w-40 text-sm"
              data-ocid="products.supplier_filter.select"
            >
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((s) => (
                <SelectItem key={s.id.toString()} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={sortField} onValueChange={setSortField}>
          <SelectTrigger
            className="h-8 w-36 text-sm"
            data-ocid="products.sort_field.select"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortField.name}>Name</SelectItem>
            <SelectItem value={SortField.sku}>SKU</SelectItem>
            <SelectItem value={SortField.quantity}>Quantity</SelectItem>
            <SelectItem value={SortField.price}>Price</SelectItem>
            <SelectItem value={SortField.lastModified}>
              Last Modified
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger
            className="h-8 w-24 text-sm"
            data-ocid="products.sort_order.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortOrder.asc}>Asc</SelectItem>
            <SelectItem value={SortOrder.desc}>Desc</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Link to="/products/new">
          <Button
            size="sm"
            className="h-8 gap-1.5"
            data-ocid="products.add_button"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div
        className="bg-card border border-border rounded overflow-hidden"
        data-ocid="products.table"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                SKU
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                UOM
              </th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Qty
              </th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Sell Price
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              ["a", "b", "c", "d", "e", "f"].map((rowKey) => (
                <tr key={rowKey} className="border-b border-border">
                  {["1", "2", "3", "4", "5", "6", "7", "8"].map((colKey) => (
                    <td key={colKey} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !products || products.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div
                    className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                    data-ocid="products.empty_state"
                  >
                    <Package className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs mt-1">
                      {query ||
                      (statusFilter && statusFilter !== "all") ||
                      (categoryFilter && categoryFilter !== "all")
                        ? "Try adjusting your filters."
                        : "Add your first product to get started."}
                    </p>
                    {!query &&
                      (!statusFilter || statusFilter === "all") &&
                      (!categoryFilter || categoryFilter === "all") && (
                        <Link to="/products/new">
                          <Button
                            size="sm"
                            className="mt-4"
                            data-ocid="products.empty-add_button"
                          >
                            Add Product
                          </Button>
                        </Link>
                      )}
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p, idx) => (
                <tr
                  key={p.id.toString()}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                  data-ocid={`products.item.${idx + 1}`}
                >
                  <td className="data-cell">
                    <span className="data-cell-mono">{p.sku}</span>
                  </td>
                  <td className="data-cell font-medium">
                    <Link
                      to="/products/$productId"
                      params={{ productId: p.id.toString() }}
                      className="hover:text-primary transition-colors"
                      data-ocid={`products.detail-link.${idx + 1}`}
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="data-cell text-muted-foreground">
                    {p.category}
                  </td>
                  <td className="data-cell text-muted-foreground text-xs">
                    {p.unitOfMeasure}
                  </td>
                  <td className="data-cell text-right font-mono text-xs">
                    {Number(p.quantity)}
                  </td>
                  <td className="data-cell text-right font-mono text-xs">
                    {formatRupees(p.sellingPrice)}
                  </td>
                  <td className="data-cell">
                    <StockBadge status={p.stockStatus} />
                  </td>
                  <td className="data-cell">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Link
                        to="/purchase-orders/new"
                        search={{ productId: p.id.toString() }}
                        data-ocid={`products.create-po_button.${idx + 1}`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1 text-primary hover:text-primary"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          PO
                        </Button>
                      </Link>
                      <Link
                        to="/products/$productId/edit"
                        params={{ productId: p.id.toString() }}
                        data-ocid={`products.edit_button.${idx + 1}`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id, p.name)}
                        data-ocid={`products.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
