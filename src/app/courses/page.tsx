import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CourseCard } from "@/components/sections/CourseCard";
import { CallToAction } from "@/components/sections/CallToAction";
import { getAllCourses } from "@/server/queries";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Four theological programmes at Emmaus Institute: Certificate (C.Th), Diploma (D.Th), Bachelor (B.Th) and Master (M.Th) of Theology.",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getAllCourses();
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-grain">
        <Container className="py-14 md:py-20">
          <SectionHeading
            eyebrow="Academic programmes"
            title="Study Scripture. Serve the Church."
            description="Every programme combines classroom rigor with field ministry. Choose the level that fits where you are today — and progress from there."
          />
        </Container>
      </section>

      {/* Journey rail — visually communicates progression from beginner to mastery */}
      <section className="pt-10">
        <Container>
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            {courses.map((c, i) => (
              <div key={c.slug} className="flex min-w-max items-center gap-3">
                <span className="font-serif text-lg text-[var(--color-foreground)]">{c.code}</span>
                <span>{c.level}</span>
                {i < courses.length - 1 ? (
                  <ArrowRight size={14} className="text-[var(--color-muted)]/60" />
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}
