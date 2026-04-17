import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { councilMembers } from "@/server/db/schema";
import { CouncilForm } from "../CouncilForm";
import { updateCouncilMember } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCouncilMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const memberId = Number(id);
  if (!Number.isInteger(memberId) || memberId < 1) notFound();

  const db = getDb();
  const [row] = await db
    .select()
    .from(councilMembers)
    .where(eq(councilMembers.id, memberId))
    .limit(1);
  if (!row) notFound();

  const boundUpdate = updateCouncilMember.bind(null, row.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/council"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={14} /> Back to council
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
          Leadership
        </p>
        <h1 className="mt-1 font-serif text-3xl">{row.name}</h1>
      </header>
      <CouncilForm initial={row} action={boundUpdate} />
    </div>
  );
}
