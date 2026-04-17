import Link from "next/link";
import { asc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { programmes } from "@/server/db/schema";
import { ResultForm } from "../ResultForm";
import { createResult } from "../actions";

export default async function NewResultPage() {
  await requireAdmin();
  const db = getDb();
  const progs = await db
    .select()
    .from(programmes)
    .orderBy(asc(programmes.year), asc(programmes.code));

  if (progs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/admin/results"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft size={14} /> Back to results
        </Link>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-10 text-center text-[var(--color-muted)]">
          Create a programme first on the results page.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/results"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={14} /> Back to results
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
          Academic records
        </p>
        <h1 className="mt-1 font-serif text-3xl">New result</h1>
      </header>
      <ResultForm programmes={progs} action={createResult} />
    </div>
  );
}
