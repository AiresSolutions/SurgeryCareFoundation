import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoSize = "default" | "lg";

export interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  size?: LogoSize;
}

// Native logo aspect ratio is 815x366 ≈ 2.227. Sizes below are tuned so the
// logo never crowds the navbar and stays crisp when downscaled by next/image.
const sizeConfig = {
  default: { height: 48, width: 107 },
  lg: { height: 96, width: 214 },
} as const;

export function Logo({ size = "default", className, ...props }: LogoProps) {
  const { width, height } = sizeConfig[size];

  return (
    <Link
      href="/"
      aria-label="Surgery Care Foundation - Home"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-80",
        className,
      )}
      {...props}
    >
      <Image
        src="/images/logo.png"
        alt="Surgery Care Foundation"
        width={width}
        height={height}
        priority
        className="h-auto w-auto"
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
