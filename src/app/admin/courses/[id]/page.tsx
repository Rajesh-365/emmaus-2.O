import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { courses } from "@/server/db/schema";
import { CourseForm } from "../CourseForm";
import { updateCourse } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const courseId = Number(id);
  if (!Number.isInteger(courseId) || courseId < 1) notFound();

  const db = getDb();
  const [row] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!row) notFound();

  const boundUpdate = updateCourse.bind(null, row.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={14} /> Back to courses
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
          Programmes
        </p>
        <h1 className="mt-1 font-serif text-3xl">{row.name}</h1>
        <p className="text-sm text-[var(--color-muted)]">/{row.slug}</p>
      </header>
      <CourseForm initial={row} action={boundUpdate} />
    </div>
  );
}
