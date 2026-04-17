import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-lift hover:shadow-lift-lg hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] shadow-soft hover:bg-[var(--color-surface-2)] hover:-translate-y-0.5 hover:shadow-lift",
  outline:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:-translate-y-0.5 hover:shadow-soft",
  ghost:
    "text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AsButton = ButtonProps & ComponentProps<"button"> & { href?: undefined };
type AsLink = ButtonProps & ComponentProps<typeof Link> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    return <Link {...(rest as AsLink)} className={classes} />;
  }
  return <button {...(rest as AsButton)} className={classes} />;
}
