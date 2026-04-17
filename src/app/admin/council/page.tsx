import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { councilMembers } from "@/server/db/schema";
import { DeleteButton } from "../_shared/DeleteButton";
import { deleteCouncilMember } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCouncilPage() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(councilMembers).orderBy(asc(councilMembers.sortOrder));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Leadership
          </p>
          <h1 className="mt-1 font-serif text-3xl">Council</h1>
        </div>
        <Link
          href="/admin/council/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={14} /> New member
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[var(--color-muted)]">
                  No council members yet.
                </td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr key={m.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/council/${m.id}`}
                      className="font-medium hover:text-[var(--color-accent)] hover:underline"
                    >
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-foreground-soft)]">{m.role}</td>
                  <td className="px-4 py-3 text-[var(--color-foreground-soft)]">{m.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/council/${m.id}`}
                        className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={m.id} name={m.name} action={deleteCouncilMember} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
