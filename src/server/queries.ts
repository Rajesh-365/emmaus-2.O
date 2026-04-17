import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  churches,
  councilMembers,
  courses,
  galleryItems,
  programmes,
  studentResults,
} from "./db/schema";

/**
 * Central read-side queries. Public pages call these to render content,
 * admin pages can call them too. Keeping SQL in one place makes it easy
 * to add caching / indexes later.
 */

export async function getAllCourses() {
  return getDb()
    .select()
    .from(courses)
    .orderBy(asc(courses.sortOrder), asc(courses.tier));
}

export async function getCourseBySlug(slug: string) {
  const [row] = await getDb()
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getCourseSlugs(): Promise<string[]> {
  const rows = await getDb().select({ slug: courses.slug }).from(courses);
  return rows.map((r) => r.slug);
}

export async function getAllChurches() {
  return getDb()
    .select()
    .from(churches)
    .orderBy(asc(churches.sortOrder));
}

export async function getAllCouncil() {
  return getDb()
    .select()
    .from(councilMembers)
    .orderBy(asc(councilMembers.sortOrder));
}

export async function getAllGallery() {
  return getDb()
    .select()
    .from(galleryItems)
    .orderBy(asc(galleryItems.sortOrder));
}

/**
 * The most recent programme — used on /results to show the current year's
 * cohort by default. Falls back to `null` if none exist yet.
 */
export async function getLatestProgramme() {
  const [row] = await getDb()
    .select()
    .from(programmes)
    .orderBy(desc(programmes.year), desc(programmes.id))
    .limit(1);
  return row ?? null;
}

export async function getResultsForProgramme(programmeId: number) {
  return getDb()
    .select()
    .from(studentResults)
    .where(eq(studentResults.programmeId, programmeId))
    .orderBy(asc(studentResults.admissionNo));
}
