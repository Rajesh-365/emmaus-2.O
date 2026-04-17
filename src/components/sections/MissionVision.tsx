import { Compass, Eye, Target } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { Ornament } from "./Ornament";
import { missionPillars } from "@/data/pillars";
import { cn } from "@/lib/cn";

type Palette = { iconBg: string; iconText: string; ref: string; topbar: string };

const palettes: Palette[] = [
  // Mission — blue
  {
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]/40",
    iconText: "text-[#1d4ed8] dark:text-[#93c5fd]",
    ref: "text-[#1d4ed8] dark:text-[#93c5fd]",
    topbar: "bg-gradient-to-r from-[#60a5fa] to-[#1d4ed8]",
  },
  // Vision — purple
  {
    iconBg: "bg-[#ede9fe] dark:bg-[#5b21b6]/40",
    iconText: "text-[#7c3aed] dark:text-[#c4b5fd]",
    ref: "text-[#7c3aed] dark:text-[#c4b5fd]",
    topbar: "bg-gradient-to-r from-[#a78bfa] to-[#7c3aed]",
  },
  // Method — gold
  {
    iconBg: "bg-[#fef3c7] dark:bg-[#78350f]/40",
    iconText: "text-[#b45309] dark:text-[#fcd34d]",
    ref: "text-[#b45309] dark:text-[#fcd34d]",
    topbar: "bg-gradient-to-r from-[#fbbf24] to-[#b45309]",
  },
];

const icons = [Target, Eye, Compass];

export function MissionVision() {
  return (
    <section className="bg-section-sky py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="III · Mission, vision, method"
          title="Why Emmaus exists"
          description="Three short statements that shape every class, every mission trip, and every church plant."
          align="center"
        />
        <Ornament className="mt-6" />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {missionPillars.map((m, i) => {
            const Icon = icons[i] ?? Target;
            const p = palettes[i] ?? palettes[0];
            return (
              <div
                key={m.title}
                className="group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift-lg"
              >
                <div aria-hidden className={cn("absolute inset-x-0 top-0 h-1", p.topbar)} />
                <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", p.iconBg, p.iconText)}>
                  <Icon size={20} />
                </span>
                <p className={cn("mt-5 text-xs uppercase tracking-wider", p.ref)}>
                  {m.reference}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{m.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
                  {m.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
