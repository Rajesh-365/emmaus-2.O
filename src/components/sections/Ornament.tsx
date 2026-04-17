import { cn } from "@/lib/cn";

/** Elegant section-divider ornament: hairline — diamond — hairline. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "mx-auto flex items-center justify-center gap-4 text-[var(--color-gold-500)]",
        className
      )}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/60 to-[var(--color-gold-500)]" />
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent via-[var(--color-gold-500)]/60 to-[var(--color-gold-500)]" />
    </div>
  );
}
