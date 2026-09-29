import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "ghost" | "dark" | "outline";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium tracking-[-0.005em] transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-(--ease-soft) active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  gold: "btn-sheen bg-champagne text-ink shadow-[0_10px_30px_-12px_rgb(207_178_124/0.55)] hover:bg-champagne-light hover:shadow-[0_14px_36px_-12px_rgb(207_178_124/0.7)]",
  ghost:
    "border border-ivory/25 bg-ivory/[0.04] text-ivory backdrop-blur-sm hover:border-ivory/45 hover:bg-ivory/10",
  dark: "bg-ink text-ivory hover:bg-ink-3",
  outline: "border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/[0.04]",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-10 px-4 text-sm",
};

export function buttonClasses(variant: Variant = "gold", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
