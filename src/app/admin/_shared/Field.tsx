import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
        {label}
        {hint ? (
          <span className="text-[10px] normal-case tracking-normal">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
