import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";
import { Ornament } from "./Ornament";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/server/db/schema";

export function CoursesPreview({ courses }: { courses: Course[] }) {
  return (
    <section className="bg-section-lavender py-16 md:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="IV · Programmes — Foundation to Mastery"
            title="Four paths into ministry"
            description="Each programme builds on the last — begin with a certificate, progress through diploma and bachelor study, and culminate in the flagship Master of Theology."
          />
          <Button href="/courses" variant="outline" size="md">
            All programmes
          </Button>
        </div>
        <Ornament className="mt-8" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}
