import {
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/* ---------- Enums ---------- */

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "reviewed",
  "accepted",
  "rejected",
]);

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const educationEnum = pgEnum("education", [
  "10th",
  "12th",
  "diploma",
  "bachelor",
  "master",
  "other",
]);

export const resultCategoryEnum = pgEnum("result_category", [
  "Distinction",
  "1st Class",
  "2nd Class",
  "Pass",
  "Absent",
]);

export const courseLevelEnum = pgEnum("course_level", [
  "Foundation",
  "Intermediate",
  "Advanced",
  "Mastery",
]);

export const churchStatusEnum = pgEnum("church_status", [
  "active",
  "construction",
]);

export const galleryCategoryEnum = pgEnum("gallery_category", [
  "Gospel Crusades",
  "JGF Activities",
  "Churches",
]);

/* ---------- Tables ---------- */

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  lastName: varchar("last_name", { length: 80 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 32 }).notNull(),
  gender: genderEnum("gender").notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  state: varchar("state", { length: 80 }).notNull(),
  pincode: varchar("pincode", { length: 6 }).notNull(),
  courseSlug: varchar("course_slug", { length: 80 }).notNull(),
  previousEducation: educationEnum("previous_education").notNull(),
  churchAffiliation: varchar("church_affiliation", { length: 160 }).notNull(),
  pastorReference: varchar("pastor_reference", { length: 160 }).notNull(),
  testimony: text("testimony").notNull(),
  motivation: text("motivation").notNull(),
  status: applicationStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).unique().notNull(),
  code: varchar("code", { length: 16 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  duration: varchar("duration", { length: 32 }).notNull(),
  semesters: smallint("semesters").notNull(),
  level: courseLevelEnum("level").notNull(),
  tier: smallint("tier").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  highlights: text("highlights").array().notNull().default([]),
  eligibility: text("eligibility").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const programmes = pgTable("programmes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 16 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  year: varchar("year", { length: 8 }).notNull(),
  semesterMax: smallint("semester_max").notNull(),
});

export const studentResults = pgTable("student_results", {
  id: serial("id").primaryKey(),
  programmeId: integer("programme_id")
    .references(() => programmes.id, { onDelete: "cascade" })
    .notNull(),
  admissionNo: varchar("admission_no", { length: 32 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  location: varchar("location", { length: 120 }).notNull(),
  firstSem: smallint("first_sem"),
  secondSem: smallint("second_sem"),
  percentage: smallint("percentage"),
  result: resultCategoryEnum("result"),
  rank: smallint("rank"),
});

export const churches = pgTable("churches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  pastor: varchar("pastor", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  status: churchStatusEnum("status").notNull(),
  image: varchar("image", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  src: varchar("src", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 }).notNull(),
  description: text("description"),
  category: galleryCategoryEnum("category").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const councilMembers = pgTable("council_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 32 }),
  image: varchar("image", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
});

/* ---------- Inferred types ---------- */

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type Programme = typeof programmes.$inferSelect;
export type StudentResultRow = typeof studentResults.$inferSelect;
export type Church = typeof churches.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type CouncilMember = typeof councilMembers.$inferSelect;
