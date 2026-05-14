import { r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-D-jPTGcB.js";
import { n as useGlobalLowStockThreshold, o as useSetGlobalLowStockThreshold, L as Layout } from "./use-backend-CGmhALc1.js";
import { B as Button, u as ue } from "./index-BDZG_dbu.js";
import { I as Input } from "./input-DOk1Y-BC.js";
import { L as Label } from "./label-CCJ_q0Gg.js";
import "./index-DQ7vqync.js";
function Settings() {
  const { data: threshold, isLoading } = useGlobalLowStockThreshold();
  const setThreshold = useSetGlobalLowStockThreshold();
  const [value, setValue] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (threshold !== void 0) {
      setValue(Number(threshold).toString());
    }
  }, [threshold]);
  async function handleSubmit(e) {
    e.preventDefault();
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n < 0) {
      ue.error("Enter a valid threshold value.");
      return;
    }
    try {
      await setThreshold.mutateAsync(BigInt(n));
      ue.success("Global low-stock threshold updated.");
    } catch {
      ue.error("Failed to update threshold.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md", "data-ocid": "settings.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold mb-5", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded p-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-1", children: "Global Low-Stock Threshold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Products below this quantity are marked as Low Stock, unless they have a product-specific threshold set." })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32", "data-ocid": "settings.loading_state" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex items-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "threshold", className: "text-xs", children: "Threshold Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "threshold",
              type: "number",
              min: 0,
              value,
              onChange: (e) => setValue(e.target.value),
              className: "h-8 w-28 text-sm font-mono",
              "data-ocid": "settings.threshold.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            disabled: setThreshold.isPending,
            "data-ocid": "settings.save_button",
            children: setThreshold.isPending ? "Saving…" : "Save"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  Settings as default
};
