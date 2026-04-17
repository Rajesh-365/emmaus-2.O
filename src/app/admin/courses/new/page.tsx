import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { CourseForm } from "../CourseForm";
import { createCourse } from "../actions";

export default async function NewCoursePage() {
  await requireAdmin();
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
        <h1 className="mt-1 font-serif text-3xl">New course</h1>
      </header>
      <CourseForm action={createCourse} />
    </div>
  );
}
