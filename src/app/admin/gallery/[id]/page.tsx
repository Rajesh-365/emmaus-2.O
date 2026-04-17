import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { galleryItems } from "@/server/db/schema";
import { GalleryForm } from "../GalleryForm";
import { updateGalleryItem } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId) || itemId < 1) notFound();

  const db = getDb();
  const [row] = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, itemId))
    .limit(1);
  if (!row) notFound();

  const boundUpdate = updateGalleryItem.bind(null, row.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={14} /> Back to gallery
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
          Photos
        </p>
        <h1 className="mt-1 font-serif text-3xl">Edit item</h1>
      </header>
      <GalleryForm initial={row} action={boundUpdate} />
    </div>
  );
}
