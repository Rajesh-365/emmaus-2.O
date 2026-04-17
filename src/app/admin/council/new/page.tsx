import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { CouncilForm } from "../CouncilForm";
import { createCouncilMember } from "../actions";

export default async function NewCouncilMemberPage() {
  await requireAdmin();
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
        <h1 className="mt-1 font-serif text-3xl">New member</h1>
      </header>
      <CouncilForm action={createCouncilMember} />
    </div>
  );
}
