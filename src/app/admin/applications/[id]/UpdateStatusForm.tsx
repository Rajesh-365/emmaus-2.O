"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import type { Application } from "@/server/db/schema";

type Props = {
  id: number;
  currentStatus: Application["status"];
  currentNotes: string;
  action: (formData: FormData) => Promise<void>;
};

export function UpdateStatusForm({
  id,
  currentStatus,
  currentNotes,
  action,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSaved(false);
    startTransition(async () => {
      await action(fd);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="id" value={id} />

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Status
        </span>
        <select
          name="status"
          defaultValue={currentStatus}
          className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-accent)]"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Internal notes
        </span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={currentNotes}
          placeholder="Interview notes, follow-ups, etc."
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-opacity disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Saving…
          </>
        ) : saved ? (
          <>
            <Check size={14} /> Saved
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}
