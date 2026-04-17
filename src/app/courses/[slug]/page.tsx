import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getCourseBySlug, getCourseSlugs } from "@/server/queries";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getCourseSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // DB not available at build (e.g. missing DATABASE_URL in preview) —
    // return empty; pages will render on-demand.
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.name} (${course.code})`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <section className="py-20">
      <Container>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft size={14} /> All programmes
        </Link>

        <div className="mt-8 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-serif text-5xl text-[var(--color-accent)]">{course.code}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{course.name}</h1>
            <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <Clock size={14} /> {course.duration} · {course.semesters} semesters
            </p>
            <p className="mt-8 text-base leading-relaxed text-[var(--color-muted)]">
              {course.description}
            </p>
            <div className="mt-10">
              <Button href={`/apply?course=${course.slug}`} size="lg">
                Apply for the {course.code}
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="hover-lift rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-7 shadow-soft">
              <h2 className="font-serif text-xl">Key areas</h2>
              <ul className="mt-4 space-y-3">
                {course.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hover-lift rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-7 shadow-soft">
              <h2 className="font-serif text-xl">Eligibility</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                {course.eligibility}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
