"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/server/db";
import { courses } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

const courseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  code: z.string().trim().min(1).max(16),
  name: z.string().trim().min(1).max(160),
  duration: z.string().trim().min(1).max(32),
  semesters: z.coerce.number().int().min(1).max(12),
  level: z.enum(["Foundation", "Intermediate", "Advanced", "Mastery"]),
  tier: z.coerce.number().int().min(1).max(4),
  summary: z.string().trim().min(1).max(400),
  description: z.string().trim().min(1).max(4000),
  highlights: z
    .string()
    .transform((s) =>
      s
        .split(/\n+/)
        .map((x) => x.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(200)).max(20)),
  eligibility: z.string().trim().min(1).max(800),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function parseForm(formData: FormData) {
  return courseSchema.safeParse({
    slug: formData.get("slug"),
    code: formData.get("code"),
    name: formData.get("name"),
    duration: formData.get("duration"),
    semesters: formData.get("semesters"),
    level: formData.get("level"),
    tier: formData.get("tier"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    highlights: formData.get("highlights") ?? "",
    eligibility: formData.get("eligibility"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.insert(courses).values(parsed.data);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

export async function updateCourse(id: number, formData: FormData) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.update(courses).set(parsed.data).where(eq(courses.id, id));
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/courses");
  revalidatePath(`/courses/${parsed.data.slug}`);
  redirect("/admin/courses");
}

export async function deleteCourse(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.delete(courses).where(eq(courses.id, id));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}
