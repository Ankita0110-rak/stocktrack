import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";

interface NavItemDef {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const NAV_ITEMS: NavItemDef[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, exact: true },
  { label: "Products", to: "/products", icon: Package },
  { label: "Suppliers", to: "/suppliers", icon: Truck },
  { label: "Purchase Orders", to: "/purchase-orders", icon: ClipboardList },
];

const BOTTOM_NAV: NavItemDef[] = [
  { label: "Settings", to: "/settings", icon: Settings },
];

interface LayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: { label: string; to?: string }[];
}

export function Layout({ children, title, breadcrumbs }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  function isActive(item: NavItemDef) {
    if (item.exact) return currentPath === item.to;
    return currentPath.startsWith(item.to);
  }

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      data-ocid="app.shell"
    >
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r border-border"
        style={{ background: "oklch(0.18 0.03 265)" }}
        data-ocid="sidebar"
      >
        {/* Logo Header */}
        <div
          className="px-4 py-4 border-b"
          style={{
            background: "oklch(0.56 0.18 134)",
            borderColor: "oklch(0.48 0.16 134)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "oklch(0.48 0.16 134)" }}
            >
              <Package className="w-4 h-4" style={{ color: "white" }} />
            </div>
            <div>
              <p
                className="font-bold text-sm tracking-wider"
                style={{ color: "white" }}
              >
                StockTrack
              </p>
              <p
                className="text-[10px] tracking-wide"
                style={{ color: "oklch(0.85 0.06 134)" }}
              >
                Retail Inventory
              </p>
            </div>
          </div>
        </div>

        {/* Primary Nav */}
        <nav
          className="flex-1 px-2 py-3 flex flex-col gap-0.5"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 group",
                  active ? "font-semibold" : "hover:opacity-90",
                )}
                style={
                  active
                    ? { background: "oklch(0.56 0.18 134)", color: "white" }
                    : { color: "oklch(0.75 0.02 265)" }
                }
                data-ocid={`nav.${item.label.toLowerCase().replace(/ /g, "-")}`}
              >
                <item.icon
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
                {active && (
                  <ChevronRight
                    className="w-3 h-3 opacity-70"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div
          className="px-2 pb-4 border-t pt-3"
          style={{ borderColor: "oklch(0.28 0.02 265)" }}
        >
          {BOTTOM_NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150",
                  active ? "font-semibold" : "hover:opacity-90",
                )}
                style={
                  active
                    ? { background: "oklch(0.56 0.18 134)", color: "white" }
                    : { color: "oklch(0.75 0.02 265)" }
                }
                data-ocid="nav.settings"
              >
                <item.icon
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div
            className="mt-4 px-3 pt-3 border-t"
            style={{ borderColor: "oklch(0.28 0.02 265)" }}
          >
            <p
              className="text-[10px] leading-relaxed"
              style={{ color: "oklch(0.5 0.02 265)" }}
            >
              &copy; {new Date().getFullYear()} Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "oklch(0.7 0.1 134)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-13 flex-shrink-0 bg-card border-b border-border flex items-center px-6 gap-3">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-sm"
            >
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  {crumb.to ? (
                    <Link
                      to={crumb.to}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          ) : (
            title && (
              <h1 className="text-sm font-semibold text-foreground tracking-wide">
                {title}
              </h1>
            )
          )}
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-background p-6"
          data-ocid="main.content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
