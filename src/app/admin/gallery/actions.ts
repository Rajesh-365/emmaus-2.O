"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { z } from "zod";
import { getDb } from "@/server/db";
import { galleryItems } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

/**
 * Remove a previously-uploaded Vercel Blob. Silently no-ops for legacy
 * local paths (e.g. "/gallery/crusade-01.jpg") so old seed data stays put.
 * Errors are swallowed — a failed Blob cleanup shouldn't block a DB write.
 */
async function cleanupBlob(url: string | null | undefined) {
  if (!url) return;
  if (!url.includes(".public.blob.vercel-storage.com/")) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(url);
  } catch {
    /* best-effort */
  }
}

const schema = z.object({
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(255),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  category: z.enum(["Gospel Crusades", "JGF Activities", "Churches"]),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function parseForm(fd: FormData) {
  return schema.safeParse({
    src: fd.get("src"),
    alt: fd.get("alt"),
    description: fd.get("description") ?? "",
    category: fd.get("category"),
    sortOrder: fd.get("sortOrder") ?? 0,
  });
}

export async function createGalleryItem(fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.insert(galleryItems).values(parsed.data);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function updateGalleryItem(id: number, fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  const [existing] = await db
    .select({ src: galleryItems.src })
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
    .limit(1);
  await db.update(galleryItems).set(parsed.data).where(eq(galleryItems.id, id));
  if (existing && existing.src !== parsed.data.src) {
    await cleanupBlob(existing.src);
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: number) {
  await requireAdmin();
  const db = getDb();
  const [existing] = await db
    .select({ src: galleryItems.src })
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
    .limit(1);
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
  if (existing) await cleanupBlob(existing.src);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
