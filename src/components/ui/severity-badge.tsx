import { cn } from "@/lib/utils";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";

type Sev = "HIGH" | "MEDIUM" | "LOW";

const MAP: Record<Sev, { label: string; icon: typeof Info; classes: string; dot: string }> = {
  HIGH: {
    label: "Grave / Contraindicada",
    icon: AlertOctagon,
    classes: "bg-severity-high/15 text-severity-high border-severity-high/30",
    dot: "bg-severity-high",
  },
  MEDIUM: {
    label: "Moderada",
    icon: AlertTriangle,
    classes: "bg-severity-medium/15 text-severity-medium border-severity-medium/30",
    dot: "bg-severity-medium",
  },
  LOW: {
    label: "Leve",
    icon: Info,
    classes: "bg-severity-low/15 text-severity-low border-severity-low/30",
    dot: "bg-severity-low",
  },
};

export function SeverityBadge({ severity, className }: { severity: Sev; className?: string }) {
  const s = MAP[severity];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", s.classes, className)}>
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
}

export function SeverityDot({ severity }: { severity: Sev }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", MAP[severity].dot)} />;
}

export const severityLabel = (s: Sev) => MAP[s].label;
