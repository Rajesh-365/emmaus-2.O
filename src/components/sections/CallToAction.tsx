import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export function CallToAction() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand px-8 py-14 text-white md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--color-gold-400)] opacity-20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-300)]">
              Ready to begin?
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Train for Gospel service. Apply to Emmaus.
            </h2>
            <p className="mt-5 max-w-xl text-white/85">
              Admissions are reviewed by the Dean of Studies. A pastor&rsquo;s reference is required for every programme.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                href="/apply"
                size="lg"
                variant="secondary"
                className="border-transparent bg-white text-[var(--color-primary-700)] hover:bg-white/95"
              >
                Start your application
              </Button>
              <Button
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                Talk to admissions
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
