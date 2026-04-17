"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/server/db";
import { applications } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
  notes: z.string().max(4000).optional().default(""),
});

export async function updateApplicationStatus(formData: FormData) {
  await requireAdmin();
  const parsed = schema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) {
    throw new Error("Invalid input.");
  }
  const db = getDb();
  await db
    .update(applications)
    .set({
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      reviewedAt: new Date(),
    })
    .where(eq(applications.id, parsed.data.id));

  revalidatePath(`/admin/applications/${parsed.data.id}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
}
