"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { z } from "zod";
import { getDb } from "@/server/db";
import { councilMembers } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

/**
 * Best-effort Blob cleanup. No-ops for legacy local paths or when the Blob
 * token isn't set. Errors are swallowed so a failed cleanup never blocks a
 * successful DB write.
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
  name: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  phone: z.string().trim().min(1).max(32),
  whatsapp: z.string().trim().max(32).optional().or(z.literal("")),
  image: z.string().trim().max(255).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function parseForm(fd: FormData) {
  return schema.safeParse({
    name: fd.get("name"),
    role: fd.get("role"),
    phone: fd.get("phone"),
    whatsapp: fd.get("whatsapp") ?? "",
    image: fd.get("image") ?? "",
    sortOrder: fd.get("sortOrder") ?? 0,
  });
}

export async function createCouncilMember(fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.insert(councilMembers).values({
    ...parsed.data,
    whatsapp: parsed.data.whatsapp || null,
    image: parsed.data.image || null,
  });
  revalidatePath("/admin/council");
  revalidatePath("/faculty");
  redirect("/admin/council");
}

export async function updateCouncilMember(id: number, fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  const [existing] = await db
    .select({ image: councilMembers.image })
    .from(councilMembers)
    .where(eq(councilMembers.id, id))
    .limit(1);
  await db
    .update(councilMembers)
    .set({
      ...parsed.data,
      whatsapp: parsed.data.whatsapp || null,
      image: parsed.data.image || null,
    })
    .where(eq(councilMembers.id, id));
  if (existing && existing.image && existing.image !== (parsed.data.image || null)) {
    await cleanupBlob(existing.image);
  }
  revalidatePath("/admin/council");
  revalidatePath("/faculty");
  redirect("/admin/council");
}

export async function deleteCouncilMember(id: number) {
  await requireAdmin();
  const db = getDb();
  const [existing] = await db
    .select({ image: councilMembers.image })
    .from(councilMembers)
    .where(eq(councilMembers.id, id))
    .limit(1);
  await db.delete(councilMembers).where(eq(councilMembers.id, id));
  if (existing) await cleanupBlob(existing.image);
  revalidatePath("/admin/council");
  revalidatePath("/faculty");
}
