"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/server/db";
import { churches } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

const schema = z.object({
  name: z.string().trim().min(1).max(160),
  location: z.string().trim().min(1).max(160),
  pastor: z.string().trim().min(1).max(160),
  phone: z.string().trim().min(1).max(32),
  status: z.enum(["active", "construction"]),
  image: z.string().trim().max(255).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function parseForm(fd: FormData) {
  return schema.safeParse({
    name: fd.get("name"),
    location: fd.get("location"),
    pastor: fd.get("pastor"),
    phone: fd.get("phone"),
    status: fd.get("status"),
    image: fd.get("image") ?? "",
    sortOrder: fd.get("sortOrder") ?? 0,
  });
}

export async function createChurch(fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.insert(churches).values({
    ...parsed.data,
    image: parsed.data.image || null,
  });
  revalidatePath("/admin/churches");
  revalidatePath("/churches");
  redirect("/admin/churches");
}

export async function updateChurch(id: number, fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db
    .update(churches)
    .set({ ...parsed.data, image: parsed.data.image || null })
    .where(eq(churches.id, id));
  revalidatePath("/admin/churches");
  revalidatePath("/churches");
  redirect("/admin/churches");
}

export async function deleteChurch(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.delete(churches).where(eq(churches.id, id));
  revalidatePath("/admin/churches");
  revalidatePath("/churches");
}
