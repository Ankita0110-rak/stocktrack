import { createActor } from "@/backend";
import type {
  AdjustStockArgs,
  CreatePOArgs,
  CreateProductArgs,
  CreateSupplierArgs,
  DashboardMetrics,
  POStatus,
  Product,
  PurchaseOrder,
  ReceiveItemArgs,
  SearchFilterArgs,
  StockHistoryEntry,
  Supplier,
  SupplierId,
  UpdateProductArgs,
  UpdateSupplierArgs,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBackendActor() {
  return useActor(createActor);
}

export function useDashboardMetrics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchProducts(args: SearchFilterArgs) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products", "search", args],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(args);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useStockHistory(productId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StockHistoryEntry[]>({
    queryKey: ["stockHistory", productId?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockHistory(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGlobalLowStockThreshold() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["globalLowStockThreshold"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getGlobalLowStockThreshold();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreateProductArgs) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createProduct(args);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: UpdateProductArgs) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateProduct(args);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useAdjustStock() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: AdjustStockArgs) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adjustStock(args);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({
        queryKey: ["product", vars.productId.toString()],
      });
      qc.invalidateQueries({
        queryKey: ["stockHistory", vars.productId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useSetGlobalLowStockThreshold() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (threshold: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setGlobalLowStockThreshold(threshold);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["globalLowStockThreshold"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ─── Supplier Hooks ───────────────────────────────────────────────────────────

export function useListSuppliers(isActiveFilter: boolean | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Supplier[]>({
    queryKey: ["suppliers", isActiveFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSuppliers(isActiveFilter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSupplier(id: SupplierId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Supplier | null>({
    queryKey: ["supplier", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getSupplier(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateSupplier() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreateSupplierArgs) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSupplier(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      args,
    }: { id: SupplierId; args: UpdateSupplierArgs }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSupplier(id, args);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      qc.invalidateQueries({ queryKey: ["supplier", vars.id.toString()] });
    },
  });
}

export function useDeleteSupplier() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: SupplierId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSupplier(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

// ─── Purchase Order Hooks ────────────────────────────────────────────────────

export function useListPOs(statusFilter: POStatus | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PurchaseOrder[]>({
    queryKey: ["purchaseOrders", statusFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPOs(statusFilter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPO(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PurchaseOrder | null>({
    queryKey: ["purchaseOrder", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPO(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreatePO() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreatePOArgs) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPO(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useUpdatePOStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: POStatus }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePOStatus({ id, status });
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["purchaseOrder", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useReceivePO() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      receivedItems,
    }: { id: bigint; receivedItems: ReceiveItemArgs[] }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.receivePO(id, receivedItems);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["purchaseOrder", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useCancelPO() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.cancelPO(id);
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["purchaseOrder", id.toString()] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useGetSupplierProducts(supplierId: SupplierId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint[]>({
    queryKey: ["supplierProducts", supplierId?.toString()],
    queryFn: async () => {
      if (!actor || supplierId === null) return [];
      return actor.getSupplierProducts(supplierId);
    },
    enabled: !!actor && !isFetching && supplierId !== null,
  });
}

export function useGetPOsBySupplier(supplierId: SupplierId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PurchaseOrder[]>({
    queryKey: ["supplierPOs", supplierId?.toString()],
    queryFn: async () => {
      if (!actor || supplierId === null) return [];
      return actor.getPOsBySupplier(supplierId);
    },
    enabled: !!actor && !isFetching && supplierId !== null,
  });
}
