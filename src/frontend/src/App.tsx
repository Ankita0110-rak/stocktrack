import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const ProductNew = lazy(() => import("@/pages/ProductNew"));
const ProductEdit = lazy(() => import("@/pages/ProductEdit"));
const Settings = lazy(() => import("@/pages/Settings"));
const Suppliers = lazy(() => import("@/pages/Suppliers"));
const SupplierNew = lazy(() => import("@/pages/SupplierNew"));
const SupplierDetail = lazy(() => import("@/pages/SupplierDetail"));
const PurchaseOrders = lazy(() => import("@/pages/PurchaseOrders"));
const PurchaseOrderNew = lazy(() => import("@/pages/PurchaseOrderNew"));
const PurchaseOrderDetail = lazy(() => import("@/pages/PurchaseOrderDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function PageLoader() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

interface ProductsSearch {
  query: string;
  status: string;
  sortField: string;
  sortOrder: string;
  category: string;
  supplierId: string;
}

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    query: String(search.query ?? ""),
    status: String(search.status ?? "all"),
    sortField: String(search.sortField ?? "name"),
    sortOrder: String(search.sortOrder ?? "asc"),
    category: String(search.category ?? "all"),
    supplierId: String(search.supplierId ?? "all"),
  }),
  component: Products,
});

const productNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/new",
  component: ProductNew,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  component: ProductDetail,
});

const productEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId/edit",
  component: ProductEdit,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

const suppliersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/suppliers",
  component: Suppliers,
});

const supplierNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/suppliers/new",
  component: SupplierNew,
});

const supplierDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/suppliers/$supplierId",
  component: SupplierDetail,
});

const purchaseOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/purchase-orders",
  component: PurchaseOrders,
});

interface PONewSearch {
  productId?: string;
  supplierId?: string;
}

const purchaseOrderNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/purchase-orders/new",
  validateSearch: (search: Record<string, unknown>): PONewSearch => ({
    productId: search.productId ? String(search.productId) : undefined,
    supplierId: search.supplierId ? String(search.supplierId) : undefined,
  }),
  component: PurchaseOrderNew,
});

const purchaseOrderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/purchase-orders/$poId",
  component: PurchaseOrderDetail,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productNewRoute,
  productDetailRoute,
  productEditRoute,
  settingsRoute,
  suppliersRoute,
  supplierNewRoute,
  supplierDetailRoute,
  purchaseOrdersRoute,
  purchaseOrderNewRoute,
  purchaseOrderDetailRoute,
]);

const memoryHistory = createMemoryHistory({ initialEntries: ["/"] });

const router = createRouter({ routeTree, history: memoryHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
