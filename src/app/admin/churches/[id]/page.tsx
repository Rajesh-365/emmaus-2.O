import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { churches } from "@/server/db/schema";
import { ChurchForm } from "../ChurchForm";
import { updateChurch } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditChurchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const churchId = Number(id);
  if (!Number.isInteger(churchId) || churchId < 1) notFound();

  const db = getDb();
  const [row] = await db.select().from(churches).where(eq(churches.id, churchId)).limit(1);
  if (!row) notFound();

  const boundUpdate = updateChurch.bind(null, row.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/churches"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={14} /> Back to churches
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
          Congregations
        </p>
        <h1 className="mt-1 font-serif text-3xl">{row.name}</h1>
      </header>
      <ChurchForm initial={row} action={boundUpdate} />
    </div>
  );
}
