import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { programmes, studentResults } from "@/server/db/schema";
import { DeleteButton } from "../_shared/DeleteButton";
import { deleteResult } from "./actions";
import { ProgrammeEditor } from "./ProgrammeEditor";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string }>;
}) {
  await requireAdmin();
  const db = getDb();
  const progs = await db
    .select()
    .from(programmes)
    .orderBy(asc(programmes.year), asc(programmes.code));

  const { programme } = await searchParams;
  const selectedProgrammeId = programme
    ? Number(programme)
    : progs[0]?.id ?? null;

  const rows = selectedProgrammeId
    ? await db
        .select()
        .from(studentResults)
        .where(eq(studentResults.programmeId, selectedProgrammeId))
        .orderBy(asc(studentResults.admissionNo))
    : [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Academic records
          </p>
          <h1 className="mt-1 font-serif text-3xl">Results</h1>
        </div>
        {selectedProgrammeId ? (
          <Link
            href={`/admin/results/new?programme=${selectedProgrammeId}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
          >
            <Plus size={14} /> New result
          </Link>
        ) : null}
      </header>

      {/* Programme switcher + editor */}
      <ProgrammeEditor programmes={progs} selected={selectedProgrammeId} />

      {!selectedProgrammeId ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-10 text-center text-[var(--color-muted)]">
          Create a programme above to start adding results.
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-10 text-center text-[var(--color-muted)]">
          No results yet for this programme.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Adm. no.</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-right font-medium">Sem 1</th>
                <th className="px-4 py-3 text-right font-medium">Sem 2</th>
                <th className="px-4 py-3 text-right font-medium">%</th>
                <th className="px-4 py-3 text-left font-medium">Result</th>
                <th className="px-4 py-3 text-right font-medium">Rank</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-2 font-mono text-xs">{r.admissionNo}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/results/${r.id}`}
                      className="font-medium hover:text-[var(--color-accent)] hover:underline"
                    >
                      {r.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-[var(--color-foreground-soft)]">{r.location}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.firstSem ?? "—"}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.secondSem ?? "—"}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.percentage ?? "—"}</td>
                  <td className="px-4 py-2 text-[var(--color-foreground-soft)]">{r.result ?? "—"}</td>
                  <td className="px-4 py-2 text-right">{r.rank ?? "—"}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/results/${r.id}`}
                        className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={r.id} name={r.name} action={deleteResult} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
