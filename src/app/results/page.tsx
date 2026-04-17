import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ResultsExplorer } from "@/components/results/ResultsExplorer";
import {
  getLatestProgramme,
  getResultsForProgramme,
} from "@/server/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const programme = await getLatestProgramme();
  if (!programme) {
    return { title: "Results" };
  }
  return {
    title: "Results",
    description: `Published results for ${programme.name} (${programme.code}) · ${programme.year}. Gold, silver and bronze medalists plus the full class list.`,
  };
}

export default async function ResultsPage() {
  const programme = await getLatestProgramme();
  const results = programme ? await getResultsForProgramme(programme.id) : [];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--section-sky-from)] via-[var(--color-page)] to-[var(--section-amber-from)] dark:hidden" />
          <div className="absolute inset-0 hidden bg-[#070b18] dark:block" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 60% at 20% 30%, rgba(37,99,235,0.30), transparent 65%), radial-gradient(45% 55% at 80% 20%, rgba(245,158,11,0.28), transparent 70%), radial-gradient(60% 60% at 60% 110%, rgba(147,51,234,0.20), transparent 65%)",
            }}
          />
        </div>
        <Container className="py-14 md:py-20">
          <SectionHeading
            eyebrow={
              programme
                ? `${programme.code} · ${programme.year}`
                : "Published results"
            }
            title="Published examination results"
            description={
              programme
                ? `Results for the ${programme.name} batch of ${programme.year}. Medalists are recognised at the top; search the full list by admission number, name, or initial.`
                : "Results will be published here once examinations are complete."
            }
          />
        </Container>
      </section>

      <section className="relative isolate overflow-hidden py-10 md:py-14">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--section-lavender-from)] via-[var(--color-page)] to-[var(--section-sky-from)] dark:hidden" />
          <div className="absolute inset-0 hidden bg-[#070b18] dark:block" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(40% 40% at 15% 10%, rgba(245,158,11,0.30), transparent 65%), radial-gradient(45% 50% at 85% 25%, rgba(147,51,234,0.30), transparent 70%), radial-gradient(50% 60% at 50% 100%, rgba(37,99,235,0.28), transparent 65%)",
            }}
          />
        </div>
        <Container>
          {programme ? (
            <ResultsExplorer programme={programme} results={results} />
          ) : (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-10 text-center text-[var(--color-muted)]">
              No results have been published yet.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
