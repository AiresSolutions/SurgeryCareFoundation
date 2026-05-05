import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/types/campaign";

interface UrgencyBadgeProps {
  level: UrgencyLevel | string | null | undefined;
  // "compact" hides the trailing word (just colour-coded dot + level)
  // for narrow card chrome; default shows the full pill.
  variant?: "default" | "compact";
  className?: string;
}

// Keep all four levels colour-coded so the eye instantly knows priority
// without reading the word. Critical also pulses to draw attention.
const LEVEL_CONFIG: Record<
  UrgencyLevel,
  { label: string; pill: string; dot: string; pulse: boolean }
> = {
  critical: {
    label: "Critical",
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
    pulse: true,
  },
  high: {
    label: "High Urgency",
    pill: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    dot: "bg-orange-500",
    pulse: false,
  },
  medium: {
    label: "Moderate",
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    pulse: false,
  },
  low: {
    label: "Low Urgency",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    pulse: false,
  },
};

function isUrgencyLevel(v: unknown): v is UrgencyLevel {
  return v === "critical" || v === "high" || v === "medium" || v === "low";
}

export function UrgencyBadge({ level, variant = "default", className }: UrgencyBadgeProps) {
  if (!isUrgencyLevel(level)) return null;
  const cfg = LEVEL_CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-bold uppercase tracking-wider",
        cfg.pill,
        className,
      )}
      title={`${cfg.label} priority`}
    >
      <span className="relative flex size-2">
        {cfg.pulse && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", cfg.dot)} />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", cfg.dot)} />
      </span>
      {variant === "compact" ? cfg.label.split(" ")[0] : cfg.label}
    </span>
  );
}
