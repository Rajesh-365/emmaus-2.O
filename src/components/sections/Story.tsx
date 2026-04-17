import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { Ornament } from "./Ornament";

export function Story() {
  return (
    <section
      id="jgf"
      className="relative bg-section-cream py-16 md:py-24"
    >
      <div aria-hidden className="absolute inset-0 -z-0 bg-grain opacity-70" />
      <Container className="relative">
        <SectionHeading
          eyebrow="II · Our story"
          title="From John Gospel Fellowship to Emmaus Institute"
          align="center"
        />
        <Ornament className="mt-6" />

        <div className="mx-auto mt-10 max-w-3xl space-y-6 text-[15px] leading-relaxed text-[var(--color-muted)] md:text-base">
          <p>
            John Gospel Fellowship began in October 2018 to carry the Gospel into areas where there were no churches. Over seven years, JGF has served God in more than 500 unreached communities across Andhra Pradesh, Telangana, and Odisha.
          </p>
          <p>
            Gospel ministry is ongoing in Vizianagaram, Chilakaluripet, and the Nallamalla Forest. The fruit of this work — disciples hungry for deeper study and villages asking for trained pastors — is what gave rise to the Emmaus Institute of Theology.
          </p>
          <p>
            Aligned with <em>Genesis 14:14</em> — &ldquo;...he led out his trained men...&rdquo; — Emmaus was founded to prepare and send a band of trained disciples for God&rsquo;s service.
          </p>
        </div>

        <figure className="hover-lift mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--color-gold-400)]/40 bg-[var(--color-background)] p-8 shadow-lift md:p-10">
          <svg aria-hidden className="h-8 w-8 text-[var(--color-gold-500)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.17 11c.51 0 .98.17 1.38.47V9.88c0-2.66 1.73-4.47 4.13-5.27.27-.09.55.07.63.35.09.27-.07.55-.35.63C10.99 6.25 9.77 7.56 9.77 9.88h1.4c.83 0 1.5.67 1.5 1.5v4.5c0 .83-.67 1.5-1.5 1.5H7.17c-.83 0-1.5-.67-1.5-1.5v-4.5c0-.83.67-1.5 1.5-1.5h0zm9.66 0c.51 0 .98.17 1.38.47V9.88c0-2.66 1.73-4.47 4.13-5.27.27-.09.55.07.63.35.09.27-.07.55-.35.63C20.65 6.25 19.43 7.56 19.43 9.88h1.4c.83 0 1.5.67 1.5 1.5v4.5c0 .83-.67 1.5-1.5 1.5h-4c-.83 0-1.5-.67-1.5-1.5v-4.5c0-.83.67-1.5 1.5-1.5h0z" />
          </svg>
          <blockquote className="mt-4 font-serif text-xl leading-snug text-[var(--color-foreground)] md:text-2xl">
            Were not our hearts burning within us while He talked with us on the road and opened the Scriptures to us?
          </blockquote>
          <figcaption className="mt-5 text-xs uppercase tracking-[0.22em] text-[var(--color-gold-500)]">
            Luke 24:32
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
