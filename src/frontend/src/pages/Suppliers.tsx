import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteSupplier,
  useListSuppliers,
  useUpdateSupplier,
} from "@/hooks/use-backend";
import type { Supplier } from "@/types";
import { Link } from "@tanstack/react-router";
import { Eye, Plus, Trash2, Truck } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="badge-success">Active</span>
  ) : (
    <span className="badge-neutral">Inactive</span>
  );
}

export default function Suppliers() {
  const [search, setSearch] = useState("");

  const { data: suppliers, isLoading } = useListSuppliers(null);
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const filtered = useMemo(() => {
    if (!suppliers) return [];
    const q = search.toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, search]);

  const handleToggleActive = useCallback(
    async (s: Supplier) => {
      try {
        await updateSupplier.mutateAsync({
          id: s.id,
          args: { isActive: !s.isActive },
        });
        toast.success(
          `"${s.name}" marked as ${!s.isActive ? "Active" : "Inactive"}.`,
        );
      } catch {
        toast.error("Failed to update supplier status.");
      }
    },
    [updateSupplier],
  );

  const handleDelete = useCallback(
    async (s: Supplier) => {
      if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
      try {
        await deleteSupplier.mutateAsync(s.id);
        toast.success(`"${s.name}" deleted.`);
      } catch {
        toast.error("Failed to delete supplier.");
      }
    },
    [deleteSupplier],
  );

  return (
    <Layout title="Suppliers">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 mb-4"
        data-ocid="suppliers.toolbar"
      >
        <Input
          placeholder="Search suppliers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 h-8 text-sm"
          data-ocid="suppliers.search_input"
        />
        <div className="flex-1" />
        {suppliers && (
          <span className="text-xs text-muted-foreground">
            {filtered.length} supplier{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
        <Link to="/suppliers/new">
          <Button
            size="sm"
            className="h-8 gap-1.5"
            data-ocid="suppliers.add_button"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Supplier
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div
        className="bg-card border border-border rounded overflow-hidden"
        data-ocid="suppliers.table"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Contact Person
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Phone
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Payment Terms
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              ["a", "b", "c", "d", "e"].map((k) => (
                <tr key={k} className="border-b border-border">
                  {["1", "2", "3", "4", "5", "6", "7"].map((c) => (
                    <td key={c} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div
                    className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                    data-ocid="suppliers.empty_state"
                  >
                    <Truck className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      {search
                        ? "No suppliers match your search."
                        : "No suppliers yet."}
                    </p>
                    {!search && (
                      <Link to="/suppliers/new">
                        <Button
                          size="sm"
                          className="mt-4"
                          data-ocid="suppliers.empty-add_button"
                        >
                          Add Supplier
                        </Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => (
                <tr
                  key={s.id.toString()}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                  data-ocid={`suppliers.item.${idx + 1}`}
                >
                  <td className="data-cell font-medium">
                    <Link
                      to="/suppliers/$supplierId"
                      params={{ supplierId: s.id.toString() }}
                      className="hover:text-primary transition-colors"
                      data-ocid={`suppliers.detail-link.${idx + 1}`}
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="data-cell text-muted-foreground">
                    {s.contactPerson}
                  </td>
                  <td className="data-cell text-muted-foreground text-xs">
                    {s.email || "—"}
                  </td>
                  <td className="data-cell font-mono text-xs">
                    {s.phone || "—"}
                  </td>
                  <td className="data-cell">
                    <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                      {s.paymentTerms || "—"}
                    </span>
                  </td>
                  <td className="data-cell">
                    <StatusBadge isActive={s.isActive} />
                  </td>
                  <td className="data-cell">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        to="/suppliers/$supplierId"
                        params={{ supplierId: s.id.toString() }}
                        data-ocid={`suppliers.view_button.${idx + 1}`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleToggleActive(s)}
                        data-ocid={`suppliers.toggle_button.${idx + 1}`}
                      >
                        {s.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(s)}
                        data-ocid={`suppliers.delete_button.${idx + 1}`}
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
