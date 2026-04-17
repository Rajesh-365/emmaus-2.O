import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { GalleryForm } from "../GalleryForm";
import { createGalleryItem } from "../actions";

export default async function NewGalleryItemPage() {
  await requireAdmin();
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
        <h1 className="mt-1 font-serif text-3xl">New gallery item</h1>
      </header>
      <GalleryForm action={createGalleryItem} />
    </div>
  );
}
