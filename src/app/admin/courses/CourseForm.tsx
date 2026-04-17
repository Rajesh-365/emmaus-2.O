"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { Course } from "@/server/db/schema";

type Props = {
  initial?: Course;
  action: (formData: FormData) => Promise<void>;
};

const levels = ["Foundation", "Intermediate", "Advanced", "Mastery"] as const;

export function CourseForm({ initial, action }: Props) {
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
        <Field label="Slug (URL)" hint="lowercase-with-hyphens">
          <input name="slug" required defaultValue={initial?.slug} className={input} />
        </Field>
        <Field label="Code" hint="e.g. C.Th">
          <input name="code" required defaultValue={initial?.code} className={input} />
        </Field>
        <Field label="Name">
          <input name="name" required defaultValue={initial?.name} className={input} />
        </Field>
        <Field label="Duration" hint="e.g. 8 months">
          <input name="duration" required defaultValue={initial?.duration} className={input} />
        </Field>
        <Field label="Semesters">
          <input
            type="number"
            name="semesters"
            min={1}
            max={12}
            required
            defaultValue={initial?.semesters ?? 2}
            className={input}
          />
        </Field>
        <Field label="Level">
          <select
            name="level"
            defaultValue={initial?.level ?? "Foundation"}
            className={input}
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tier" hint="1=intro, 4=mastery">
          <select
            name="tier"
            defaultValue={initial?.tier ?? 1}
            className={input}
          >
            {[1, 2, 3, 4].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
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

      <Field label="Summary" hint="One-line blurb">
        <input name="summary" required defaultValue={initial?.summary} className={input} />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initial?.description}
          className={textarea}
        />
      </Field>

      <Field label="Highlights" hint="one per line">
        <textarea
          name="highlights"
          rows={4}
          defaultValue={(initial?.highlights ?? []).join("\n")}
          className={textarea}
        />
      </Field>

      <Field label="Eligibility">
        <textarea
          name="eligibility"
          required
          rows={2}
          defaultValue={initial?.eligibility}
          className={textarea}
        />
      </Field>

      {error ? (
        <p role="alert" className={errorBox}>
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={submitBtn}>
          {pending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            "Save course"
          )}
        </button>
        <Link href="/admin/courses" className={cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
        {label}
        {hint ? <span className="text-[10px] normal-case tracking-normal">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

const input =
  "h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";
const textarea =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";
const submitBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-medium text-white transition-opacity disabled:opacity-60";
const cancelBtn =
  "inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-5 text-sm font-medium hover:border-[var(--color-accent)]";
const errorBox =
  "rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300";
