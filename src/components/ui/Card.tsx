import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "hover-lift rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-white to-[var(--color-surface)]/40 p-6 shadow-soft dark:from-[var(--color-background)] dark:to-[var(--color-background)]",
        className
      )}
    >
      {children}
    </div>
  );
}
