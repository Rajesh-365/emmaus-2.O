"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import type { Programme } from "@/server/db/schema";
import { DeleteButton } from "../_shared/DeleteButton";
import { cancelBtn, input, submitBtn } from "../_shared/formStyles";
import { createProgramme, deleteProgramme } from "./actions";

type Props = {
  programmes: Programme[];
  selected: number | null;
};

export function ProgrammeEditor({ programmes, selected }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    router.push(`/admin/results?programme=${id}`);
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createProgramme(fd);
        setAdding(false);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Programme
        </label>
        <select
          value={selected ?? ""}
          onChange={handleSelectChange}
          className="h-9 min-w-[16rem] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm"
          disabled={programmes.length === 0}
        >
          {programmes.length === 0 ? (
            <option>— none —</option>
          ) : (
            programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name} · {p.year}
              </option>
            ))
          )}
        </select>

        {selected ? (
          <DeleteButton
            id={selected}
            name={
              programmes.find((p) => p.id === selected)?.code ?? "programme"
            }
            action={deleteProgramme}
            confirmLabel="Delete this programme AND all its student results? This cannot be undone."
          />
        ) : null}

        <div className="ml-auto">
          {adding ? null : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Plus size={12} /> Add programme
            </button>
          )}
        </div>
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input name="code" required placeholder="Code (e.g. C.Th)" className={input} />
          <input name="name" required placeholder="Name" className={input} />
          <input name="year" required placeholder="Year (e.g. 2024)" className={input} />
          <input
            type="number"
            name="semesterMax"
            required
            placeholder="Sem max (e.g. 50)"
            min={1}
            max={200}
            className={input}
          />
          <div className="sm:col-span-4 flex items-center gap-2">
            <button type="submit" disabled={pending} className={submitBtn}>
              {pending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Adding…
                </>
              ) : (
                "Add"
              )}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className={cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
