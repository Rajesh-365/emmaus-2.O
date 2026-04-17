"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  id: number;
  name: string;
  action: (id: number) => Promise<void>;
  confirmLabel?: string;
};

export function DeleteButton({ id, name, action, confirmLabel }: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const label = confirmLabel ?? `Delete "${name}"? This cannot be undone.`;
    if (!confirm(label)) return;
    startTransition(() => action(id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Delete
    </button>
  );
}
