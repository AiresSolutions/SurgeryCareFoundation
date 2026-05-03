import { cn } from "@/lib/utils";

export type TopBannerProps = React.HTMLAttributes<HTMLDivElement>;

export function TopBanner({ className, ...props }: TopBannerProps) {
  return (
    <div
      className={cn("bg-primary shadow-card", className)}
      {...props}
    >
      <p className="px-6 py-2 text-center text-label uppercase text-surface-green">
        More Care. Less Cost. &mdash; Surgical care for every patient, across India
      </p>
    </div>
  );
}
