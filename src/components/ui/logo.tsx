import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoSize = "default" | "lg";

export interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  size?: LogoSize;
}

// Native logo aspect ratio is 1060x780 ≈ 1.359. The mark is icon-only (no
// wordmark) so we pair it with the foundation name as text — keeps the brand
// readable without bloating the navbar with a giant square.
const sizeConfig = {
  default: { height: 48, width: 65 },
  lg: { height: 80, width: 109 },
} as const;

export function Logo({ size = "default", className, ...props }: LogoProps) {
  const { width, height } = sizeConfig[size];
  const isLg = size === "lg";

  return (
    <Link
      href="/"
      aria-label="Surgery Care Foundation - Home"
      className={cn(
        "inline-flex items-center gap-3 transition-opacity hover:opacity-80",
        className,
      )}
      {...props}
    >
      <Image
        src="/images/new_logo.png"
        alt="Surgery Care Foundation"
        width={width}
        height={height}
        priority
        className="shrink-0 rounded-lg"
        style={{ height, width: "auto" }}
      />
      <span
        className={cn(
          "hidden font-black leading-tight text-primary sm:flex sm:flex-col",
          isLg ? "text-h4" : "text-btn",
        )}
      >
        <span>Surgery Care</span>
        <span className="text-accent">Foundation</span>
      </span>
    </Link>
  );
}
