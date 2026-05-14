import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGlobalLowStockThreshold,
  useSetGlobalLowStockThreshold,
} from "@/hooks/use-backend";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { data: threshold, isLoading } = useGlobalLowStockThreshold();
  const setThreshold = useSetGlobalLowStockThreshold();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (threshold !== undefined) {
      setValue(Number(threshold).toString());
    }
  }, [threshold]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n < 0) {
      toast.error("Enter a valid threshold value.");
      return;
    }
    try {
      await setThreshold.mutateAsync(BigInt(n));
      toast.success("Global low-stock threshold updated.");
    } catch {
      toast.error("Failed to update threshold.");
    }
  }

  return (
    <Layout title="Settings">
      <div className="max-w-md" data-ocid="settings.panel">
        <h1 className="text-lg font-semibold mb-5">Settings</h1>

        <div className="bg-card border border-border rounded p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium mb-1">
              Global Low-Stock Threshold
            </p>
            <p className="text-xs text-muted-foreground">
              Products below this quantity are marked as Low Stock, unless they
              have a product-specific threshold set.
            </p>
          </div>

          {isLoading ? (
            <Skeleton className="h-8 w-32" data-ocid="settings.loading_state" />
          ) : (
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="threshold" className="text-xs">
                  Threshold Quantity
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  min={0}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-8 w-28 text-sm font-mono"
                  data-ocid="settings.threshold.input"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={setThreshold.isPending}
                data-ocid="settings.save_button"
              >
                {setThreshold.isPending ? "Saving…" : "Save"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
