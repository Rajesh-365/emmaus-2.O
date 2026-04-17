"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Programme, StudentResultRow } from "@/server/db/schema";
import { Field } from "../_shared/Field";
import { cancelBtn, errorBox, input, submitBtn } from "../_shared/formStyles";

type Props = {
  initial?: StudentResultRow;
  programmes: Programme[];
  action: (fd: FormData) => Promise<void>;
};

export function ResultForm({ initial, programmes, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await action(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Programme">
        <select
          name="programmeId"
          defaultValue={initial?.programmeId ?? programmes[0]?.id}
          required
          className={input}
        >
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} · {p.name} · {p.year}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Admission no." hint="e.g. EC/008">
          <input
            name="admissionNo"
            required
            defaultValue={initial?.admissionNo}
            className={input}
          />
        </Field>
        <Field label="Name">
          <input name="name" required defaultValue={initial?.name} className={input} />
        </Field>
        <Field label="Location">
          <input name="location" required defaultValue={initial?.location} className={input} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Sem 1 mark" hint="blank = absent">
          <input
            type="number"
            name="firstSem"
            min={0}
            max={200}
            defaultValue={initial?.firstSem ?? ""}
            className={input}
          />
        </Field>
        <Field label="Sem 2 mark">
          <input
            type="number"
            name="secondSem"
            min={0}
            max={200}
            defaultValue={initial?.secondSem ?? ""}
            className={input}
          />
        </Field>
        <Field label="Percentage" hint="0–100">
          <input
            type="number"
            name="percentage"
            min={0}
            max={100}
            defaultValue={initial?.percentage ?? ""}
            className={input}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Classification">
          <select name="result" defaultValue={initial?.result ?? ""} className={input}>
            <option value="">— none —</option>
            <option value="Distinction">Distinction</option>
            <option value="1st Class">1st Class</option>
            <option value="2nd Class">2nd Class</option>
            <option value="Pass">Pass</option>
            <option value="Absent">Absent</option>
          </select>
        </Field>
        <Field label="Rank" hint="1, 2, 3 for medalists">
          <select name="rank" defaultValue={initial?.rank ?? ""} className={input}>
            <option value="">— none —</option>
            <option value="1">1 (gold)</option>
            <option value="2">2 (silver)</option>
            <option value="3">3 (bronze)</option>
          </select>
        </Field>
      </div>

      {error ? <p role="alert" className={errorBox}>{error}</p> : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={submitBtn}>
          {pending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            "Save result"
          )}
        </button>
        <Link href="/admin/results" className={cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
