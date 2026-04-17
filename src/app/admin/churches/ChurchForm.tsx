"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Church } from "@/server/db/schema";
import { Field } from "../_shared/Field";
import { cancelBtn, errorBox, input, submitBtn } from "../_shared/formStyles";

type Props = {
  initial?: Church;
  action: (fd: FormData) => Promise<void>;
};

export function ChurchForm({ initial, action }: Props) {
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required defaultValue={initial?.name} className={input} />
        </Field>
        <Field label="Pastor">
          <input name="pastor" required defaultValue={initial?.pastor} className={input} />
        </Field>
        <Field label="Location">
          <input name="location" required defaultValue={initial?.location} className={input} />
        </Field>
        <Field label="Phone">
          <input name="phone" required defaultValue={initial?.phone} className={input} />
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={initial?.status ?? "active"}
            className={input}
          >
            <option value="active">Active</option>
            <option value="construction">Under construction</option>
          </select>
        </Field>
        <Field label="Sort order" hint="lower = first">
          <input
            type="number"
            name="sortOrder"
            min={0}
            defaultValue={initial?.sortOrder ?? 0}
            className={input}
          />
        </Field>
      </div>

      <Field label="Image path" hint="e.g. /images/churches/foo.png">
        <input name="image" defaultValue={initial?.image ?? ""} className={input} />
      </Field>

      {error ? <p role="alert" className={errorBox}>{error}</p> : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={submitBtn}>
          {pending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            "Save church"
          )}
        </button>
        <Link href="/admin/churches" className={cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
