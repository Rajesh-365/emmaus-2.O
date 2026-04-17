/**
 * Reusable Tailwind class strings for admin form controls. Kept as constants
 * so every entity's form looks identical without repeating 3-line class
 * strings all over the place.
 */

export const input =
  "h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

export const textarea =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

export const submitBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-medium text-white transition-opacity disabled:opacity-60";

export const cancelBtn =
  "inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-5 text-sm font-medium hover:border-[var(--color-accent)]";

export const errorBox =
  "rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300";
