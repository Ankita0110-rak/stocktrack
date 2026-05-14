import { StockStatus } from "@/backend";

interface StockBadgeProps {
  status: StockStatus;
  className?: string;
}

const statusConfig: Record<
  StockStatus,
  { label: string; style: React.CSSProperties }
> = {
  [StockStatus.inStock]: {
    label: "In Stock",
    style: {
      background: "oklch(0.93 0.07 134)",
      color: "oklch(0.35 0.12 134)",
      border: "1px solid oklch(0.75 0.12 134)",
    },
  },
  [StockStatus.lowStock]: {
    label: "Low Stock",
    style: {
      background: "oklch(0.95 0.05 66)",
      color: "oklch(0.42 0.12 66)",
      border: "1px solid oklch(0.72 0.10 66)",
    },
  },
  [StockStatus.outOfStock]: {
    label: "Out of Stock",
    style: {
      background: "oklch(0.95 0.05 28)",
      color: "oklch(0.40 0.18 28)",
      border: "1px solid oklch(0.70 0.15 28)",
    },
  },
};

import type React from "react";

export function StockBadge({ status, className = "" }: StockBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${className}`}
      style={config.style}
      data-ocid={`stock-badge.${status}`}
    >
      {config.label}
    </span>
  );
}
