import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ApplyForm } from "@/components/ApplyForm";
import { getAllCourses } from "@/server/queries";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply for admission to the Emmaus Institute of Theology. Every programme requires a pastor's reference.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ course?: string }>;

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const courses = await getAllCourses();
  const { course } = await searchParams;
  const defaultCourse = courses.some((c) => c.slug === course) ? course : undefined;

  return (
    <>
      <section className="border-b border-[var(--color-border)]">
        <Container className="py-14 md:py-20">
          <SectionHeading
            eyebrow="Admissions"
            title="Apply to Emmaus"
            description="Every application is reviewed by the Dean of Studies. A pastor's reference is required for every programme."
          />
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container className="max-w-3xl">
          <ApplyForm courses={courses} defaultCourse={defaultCourse} />
        </Container>
      </section>
    </>
  );
}
