import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { programmes, studentResults } from "@/server/db/schema";
import { ResultForm } from "../ResultForm";
import { updateResult } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const resultId = Number(id);
  if (!Number.isInteger(resultId) || resultId < 1) notFound();

  const db = getDb();
  const [row] = await db
    .select()
    .from(studentResults)
    .where(eq(studentResults.id, resultId))
    .limit(1);
  if (!row) notFound();

  const progs = await db
    .select()
    .from(programmes)
    .orderBy(asc(programmes.year), asc(programmes.code));

  const boundUpdate = updateResult.bind(null, row.id);

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
        <h1 className="mt-1 font-serif text-3xl">{row.name}</h1>
        <p className="text-sm text-[var(--color-muted)]">{row.admissionNo}</p>
      </header>
      <ResultForm initial={row} programmes={progs} action={boundUpdate} />
    </div>
  );
}
