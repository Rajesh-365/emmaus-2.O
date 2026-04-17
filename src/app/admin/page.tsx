import Link from "next/link";
import {
  Building2,
  FileText,
  GraduationCap,
  Images,
  Users,
} from "lucide-react";
import { sql } from "drizzle-orm";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import {
  applications,
  churches,
  councilMembers,
  courses,
  galleryItems,
  studentResults,
} from "@/server/db/schema";

export const dynamic = "force-dynamic";

async function fetchCounts() {
  const db = getDb();
  const [apps, pending, results, coursesC, churchesC, councilC, galleryC] =
    await Promise.all([
      db.select({ n: sql<number>`count(*)::int` }).from(applications),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(applications)
        .where(sql`${applications.status} = 'pending'`),
      db.select({ n: sql<number>`count(*)::int` }).from(studentResults),
      db.select({ n: sql<number>`count(*)::int` }).from(courses),
      db.select({ n: sql<number>`count(*)::int` }).from(churches),
      db.select({ n: sql<number>`count(*)::int` }).from(councilMembers),
      db.select({ n: sql<number>`count(*)::int` }).from(galleryItems),
    ]);
  return {
    applications: apps[0]?.n ?? 0,
    pending: pending[0]?.n ?? 0,
    results: results[0]?.n ?? 0,
    courses: coursesC[0]?.n ?? 0,
    churches: churchesC[0]?.n ?? 0,
    council: councilC[0]?.n ?? 0,
    gallery: galleryC[0]?.n ?? 0,
  };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const c = await fetchCounts();

  const cards = [
    {
      href: "/admin/applications",
      label: "Applications",
      primary: c.applications,
      secondary: `${c.pending} pending review`,
      Icon: FileText,
    },
    {
      href: "/admin/courses",
      label: "Courses",
      primary: c.courses,
      secondary: "programmes offered",
      Icon: GraduationCap,
    },
    {
      href: "/admin/results",
      label: "Results",
      primary: c.results,
      secondary: "student records",
      Icon: GraduationCap,
    },
    {
      href: "/admin/churches",
      label: "Churches",
      primary: c.churches,
      secondary: "congregations",
      Icon: Building2,
    },
    {
      href: "/admin/council",
      label: "Council",
      primary: c.council,
      secondary: "members",
      Icon: Users,
    },
    {
      href: "/admin/gallery",
      label: "Gallery",
      primary: c.gallery,
      secondary: "photos",
      Icon: Images,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
          Overview
        </p>
        <h1 className="mt-1 font-serif text-3xl">Admissions dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          A quick view of what&rsquo;s in the system. Open a section to edit.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, primary, secondary, Icon }) => (
          <Link
            key={href}
            href={href}
            className="hover-lift group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                {label}
              </p>
              <Icon size={18} className="text-[var(--color-gold-500)]" />
            </div>
            <p className="font-serif text-4xl text-[var(--color-foreground)] group-hover:text-[var(--color-accent)]">
              {primary}
            </p>
            <p className="text-xs text-[var(--color-muted)]">{secondary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
