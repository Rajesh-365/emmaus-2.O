import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { churches } from "@/server/db/schema";
import { DeleteButton } from "../_shared/DeleteButton";
import { deleteChurch } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminChurchesPage() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(churches).orderBy(asc(churches.sortOrder));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Congregations
          </p>
          <h1 className="mt-1 font-serif text-3xl">Churches</h1>
        </div>
        <Link
          href="/admin/churches/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={14} /> New church
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Pastor</th>
              <th className="px-4 py-3 text-left font-medium">Location</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-muted)]">
                  No churches yet.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/churches/${c.id}`}
                      className="font-medium hover:text-[var(--color-accent)] hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-foreground-soft)]">{c.pastor}</td>
                  <td className="px-4 py-3 text-[var(--color-foreground-soft)]">{c.location}</td>
                  <td className="px-4 py-3 text-[var(--color-foreground-soft)] capitalize">
                    {c.status}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/churches/${c.id}`}
                        className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={c.id} name={c.name} action={deleteChurch} />
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
