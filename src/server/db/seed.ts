/**
 * Seed the database from the existing static TypeScript data files.
 * Idempotent — safe to run multiple times; uses ON CONFLICT DO NOTHING
 * semantics via manual existence checks.
 *
 * Run with: npm run db:seed
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { getDb } from "./index";
import {
  churches,
  councilMembers,
  courses,
  galleryItems,
  programmes,
  studentResults,
} from "./schema";
import { eq } from "drizzle-orm";

import { courses as courseData } from "./seed-data/courses";
import { churches as churchData } from "./seed-data/churches";
import { galleryItems as galleryData } from "./seed-data/gallery";
import { council as councilData } from "./seed-data/council";
import { results as resultData, programme as programmeData } from "./seed-data/results";

async function main() {
  const db = getDb();

  console.log("→ Seeding courses…");
  for (const [i, c] of courseData.entries()) {
    const existing = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.slug, c.slug))
      .limit(1);
    if (existing.length > 0) continue;
    await db.insert(courses).values({
      slug: c.slug,
      code: c.code,
      name: c.name,
      duration: c.duration,
      semesters: c.semesters,
      level: c.level,
      tier: c.tier,
      summary: c.summary,
      description: c.description,
      highlights: [...c.highlights],
      eligibility: c.eligibility,
      sortOrder: i,
    });
  }
  console.log(`  ${courseData.length} courses seeded.`);

  console.log("→ Seeding programmes…");
  let programmeId: number;
  const existingProg = await db
    .select({ id: programmes.id })
    .from(programmes)
    .where(eq(programmes.code, programmeData.code))
    .limit(1);
  if (existingProg.length > 0) {
    programmeId = existingProg[0].id;
  } else {
    const [inserted] = await db
      .insert(programmes)
      .values({
        code: programmeData.code,
        name: programmeData.name,
        year: programmeData.year,
        semesterMax: programmeData.semesterMax,
      })
      .returning({ id: programmes.id });
    programmeId = inserted.id;
  }
  console.log(`  programme ${programmeData.code} · ${programmeData.year} ready.`);

  console.log("→ Seeding student results…");
  let resultsInserted = 0;
  for (const r of resultData) {
    const existing = await db
      .select({ id: studentResults.id })
      .from(studentResults)
      .where(eq(studentResults.admissionNo, r.admissionNo))
      .limit(1);
    if (existing.length > 0) continue;
    await db.insert(studentResults).values({
      programmeId,
      admissionNo: r.admissionNo,
      name: r.name,
      location: r.location,
      firstSem: r.firstSem,
      secondSem: r.secondSem,
      percentage: r.percentage,
      result: r.result,
      rank: r.rank,
    });
    resultsInserted++;
  }
  console.log(`  ${resultsInserted} results inserted (${resultData.length - resultsInserted} already existed).`);

  console.log("→ Seeding churches…");
  for (const [i, c] of churchData.entries()) {
    const existing = await db
      .select({ id: churches.id })
      .from(churches)
      .where(eq(churches.name, c.name))
      .limit(1);
    if (existing.length > 0) continue;
    await db.insert(churches).values({
      name: c.name,
      location: c.location,
      pastor: c.pastor,
      phone: c.phone,
      status: c.status,
      image: c.image,
      sortOrder: i,
    });
  }
  console.log(`  ${churchData.length} churches seeded.`);

  console.log("→ Seeding gallery…");
  for (const [i, g] of galleryData.entries()) {
    const existing = await db
      .select({ id: galleryItems.id })
      .from(galleryItems)
      .where(eq(galleryItems.src, g.src))
      .limit(1);
    if (existing.length > 0) continue;
    await db.insert(galleryItems).values({
      src: g.src,
      alt: g.alt,
      category: g.category,
      sortOrder: i,
    });
  }
  console.log(`  ${galleryData.length} gallery items seeded.`);

  console.log("→ Seeding council…");
  for (const [i, m] of councilData.entries()) {
    const existing = await db
      .select({ id: councilMembers.id })
      .from(councilMembers)
      .where(eq(councilMembers.name, m.name))
      .limit(1);
    if (existing.length > 0) continue;
    await db.insert(councilMembers).values({
      name: m.name,
      role: m.role,
      phone: m.phone,
      whatsapp: m.whatsapp,
      image: m.image,
      sortOrder: i,
    });
  }
  console.log(`  ${councilData.length} council members seeded.`);

  console.log("\n✓ Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
