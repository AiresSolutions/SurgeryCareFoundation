import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  ...props
}: ProgressBarProps) {
  const rawPct = Math.min(Math.max((value / max) * 100, 0), 100);
  // When something has been raised but the ratio is so small it would
  // be sub-pixel (e.g. ₹20 of a ₹15,00,000 goal), force a small visible
  // sliver. Keeps the bar honest: 0 raised = empty, anything > 0 shows.
  const displayPct = value > 0 && rawPct < 1.5 ? 1.5 : rawPct;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-border", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-cta-gradient transition-all duration-500 ease-out"
        style={{ width: `${displayPct}%` }}
      />
    </div>
  );
}
