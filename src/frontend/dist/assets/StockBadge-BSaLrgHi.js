import { j as jsxRuntimeExports } from "./index-DBaupoop.js";
import { S as StockStatus } from "./use-backend-DzLCpOKH.js";
const statusConfig = {
  [StockStatus.inStock]: {
    label: "In Stock",
    style: {
      background: "oklch(0.93 0.07 134)",
      color: "oklch(0.35 0.12 134)",
      border: "1px solid oklch(0.75 0.12 134)"
    }
  },
  [StockStatus.lowStock]: {
    label: "Low Stock",
    style: {
      background: "oklch(0.95 0.05 66)",
      color: "oklch(0.42 0.12 66)",
      border: "1px solid oklch(0.72 0.10 66)"
    }
  },
  [StockStatus.outOfStock]: {
    label: "Out of Stock",
    style: {
      background: "oklch(0.95 0.05 28)",
      color: "oklch(0.40 0.18 28)",
      border: "1px solid oklch(0.70 0.15 28)"
    }
  }
};
function StockBadge({ status, className = "" }) {
  const config = statusConfig[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex px-2 py-0.5 rounded text-xs font-semibold ${className}`,
      style: config.style,
      "data-ocid": `stock-badge.${status}`,
      children: config.label
    }
  );
}
export {
  StockBadge as S
};
