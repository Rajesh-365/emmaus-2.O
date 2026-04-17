import Link from "next/link";
import Image from "next/image";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { galleryItems } from "@/server/db/schema";
import { DeleteButton } from "../_shared/DeleteButton";
import { deleteGalleryItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Photos
          </p>
          <h1 className="mt-1 font-serif text-3xl">Gallery</h1>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={14} /> New item
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-12 text-center text-[var(--color-muted)]">
          No gallery items yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((g) => (
            <article
              key={g.id}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft"
            >
              <div className="relative aspect-video bg-[var(--color-surface)]">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width:1280px) 25vw, (min-width:640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium" title={g.alt}>
                  {g.alt}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">{g.category}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/gallery/${g.id}`}
                    className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={g.id} name={g.alt} action={deleteGalleryItem} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
