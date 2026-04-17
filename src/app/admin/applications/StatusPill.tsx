import { cn } from "@/lib/cn";
import type { Application } from "@/server/db/schema";

export function StatusPill({ status }: { status: Application["status"] }) {
  const style: Record<Application["status"], string> = {
    pending:
      "bg-[var(--color-gold-400)]/15 text-[var(--color-gold-500)] border-[var(--color-gold-400)]/30",
    reviewed:
      "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-700)]/20 dark:bg-[var(--color-primary-600)]/15 dark:text-[var(--color-primary-400)]",
    accepted: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        style[status],
      )}
    >
      {status}
    </span>
  );
}
