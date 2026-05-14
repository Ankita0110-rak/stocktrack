import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subLabel?: string;
  accent?: "default" | "warning" | "success" | "destructive" | "neutral";
  "data-ocid"?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subLabel,
  accent = "default",
  "data-ocid": dataOcid,
}: StatCardProps) {
  const iconBg: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-50 text-amber-600",
    success: "bg-primary/10 text-primary",
    destructive: "bg-destructive/10 text-destructive",
    neutral: "bg-muted text-muted-foreground",
  };
  const valueCls: Record<string, string> = {
    default: "text-foreground",
    warning: "text-amber-600",
    success: "text-primary",
    destructive: "text-destructive",
    neutral: "text-muted-foreground",
  };
  return (
    <div
      className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:shadow-sm transition-smooth"
      data-ocid={dataOcid}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
          {title}
        </span>
        <span
          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${iconBg[accent]}`}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className={`text-2xl font-bold tracking-tight font-display ${valueCls[accent]}`}
        >
          {value}
        </span>
        {subLabel && (
          <span className="text-xs text-muted-foreground truncate">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
