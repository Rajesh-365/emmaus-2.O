"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/server/db";
import { programmes, studentResults } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

const resultSchema = z.object({
  programmeId: z.coerce.number().int().positive(),
  admissionNo: z.string().trim().min(1).max(32),
  name: z.string().trim().min(1).max(160),
  location: z.string().trim().min(1).max(120),
  firstSem: z
    .union([z.coerce.number().int().min(0).max(200), z.literal("")])
    .transform((v) => (v === "" ? null : (v as number))),
  secondSem: z
    .union([z.coerce.number().int().min(0).max(200), z.literal("")])
    .transform((v) => (v === "" ? null : (v as number))),
  percentage: z
    .union([z.coerce.number().int().min(0).max(100), z.literal("")])
    .transform((v) => (v === "" ? null : (v as number))),
  result: z
    .enum(["Distinction", "1st Class", "2nd Class", "Pass", "Absent", ""])
    .transform((v) => (v === "" ? null : v)),
  rank: z
    .union([z.coerce.number().int().min(1).max(3), z.literal("")])
    .transform((v) => (v === "" ? null : (v as 1 | 2 | 3))),
});

function parseForm(fd: FormData) {
  return resultSchema.safeParse({
    programmeId: fd.get("programmeId"),
    admissionNo: fd.get("admissionNo"),
    name: fd.get("name"),
    location: fd.get("location"),
    firstSem: fd.get("firstSem") ?? "",
    secondSem: fd.get("secondSem") ?? "",
    percentage: fd.get("percentage") ?? "",
    result: fd.get("result") ?? "",
    rank: fd.get("rank") ?? "",
  });
}

export async function createResult(fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.insert(studentResults).values(parsed.data);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  redirect("/admin/results");
}

export async function updateResult(id: number, fd: FormData) {
  await requireAdmin();
  const parsed = parseForm(fd);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.update(studentResults).set(parsed.data).where(eq(studentResults.id, id));
  revalidatePath("/admin/results");
  revalidatePath("/results");
  redirect("/admin/results");
}

export async function deleteResult(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.delete(studentResults).where(eq(studentResults.id, id));
  revalidatePath("/admin/results");
  revalidatePath("/results");
}

/* ---- Programme management (inline — simple enough that we don't need
   dedicated pages for the 1-row programmes table right now) ---- */

const programmeSchema = z.object({
  code: z.string().trim().min(1).max(16),
  name: z.string().trim().min(1).max(160),
  year: z.string().trim().min(1).max(8),
  semesterMax: z.coerce.number().int().min(1).max(200),
});

export async function createProgramme(fd: FormData) {
  await requireAdmin();
  const parsed = programmeSchema.safeParse({
    code: fd.get("code"),
    name: fd.get("name"),
    year: fd.get("year"),
    semesterMax: fd.get("semesterMax"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const db = getDb();
  await db.insert(programmes).values(parsed.data);
  revalidatePath("/admin/results");
}

export async function deleteProgramme(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.delete(programmes).where(eq(programmes.id, id));
  revalidatePath("/admin/results");
  revalidatePath("/results");
}
