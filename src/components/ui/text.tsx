import { cn } from "@/lib/utils";

export type TextVariant = "default" | "secondary" | "muted" | "on-dark";
export type TextSize = "body" | "body-lg" | "label";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  size?: TextSize;
  as?: React.ElementType;
}

const variantStyles: Record<TextVariant, string> = {
  default: "text-slate",
  secondary: "text-slate-medium",
  muted: "text-slate-light",
  "on-dark": "text-white/78",
};

const sizeStyles: Record<TextSize, string> = {
  body: "text-body",
  "body-lg": "text-body-lg",
  label: "text-label uppercase",
};

export function Text({
  variant = "default",
  size = "body",
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
