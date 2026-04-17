import Link from "next/link";
import { ArrowUpRight, Church, GraduationCap, Radio } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { Ornament } from "./Ornament";
import { pillars } from "@/data/pillars";
import { cn } from "@/lib/cn";

type PillarPalette = {
  iconBg: string;
  iconText: string;
  tagline: string;
  topbar: string;
};

const palettes: PillarPalette[] = [
  // Proclaim — blue
  {
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]/40",
    iconText: "text-[#1d4ed8] dark:text-[#93c5fd]",
    tagline: "text-[#1d4ed8] dark:text-[#93c5fd]",
    topbar: "bg-gradient-to-r from-[#60a5fa] to-[#1d4ed8]",
  },
  // Plant — purple
  {
    iconBg: "bg-[#ede9fe] dark:bg-[#5b21b6]/40",
    iconText: "text-[#7c3aed] dark:text-[#c4b5fd]",
    tagline: "text-[#7c3aed] dark:text-[#c4b5fd]",
    topbar: "bg-gradient-to-r from-[#a78bfa] to-[#7c3aed]",
  },
  // Equip — gold
  {
    iconBg: "bg-[#fef3c7] dark:bg-[#78350f]/40",
    iconText: "text-[#b45309] dark:text-[#fcd34d]",
    tagline: "text-[#b45309] dark:text-[#fcd34d]",
    topbar: "bg-gradient-to-r from-[#fbbf24] to-[#b45309]",
  },
];

const icons = [Church, GraduationCap, Radio];

export function Pillars() {
  return (
    <section className="bg-section-amber py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="I · Three ministries, one mission"
          title="Proclaim. Plant. Equip."
          description="Emmaus exists at the meeting point of evangelism, the local church, and formal theological education."
          align="center"
        />
        <Ornament className="mt-6" />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = icons[i] ?? Church;
            const p = palettes[i] ?? palettes[0];
            const external = pillar.href.startsWith("http");
            const Tag: React.ElementType = external ? "a" : Link;
            const linkProps = external
              ? { href: pillar.href, target: "_blank", rel: "noreferrer noopener" }
              : { href: pillar.href };

            return (
              <Tag
                key={pillar.title}
                {...linkProps}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift-lg"
              >
                <div aria-hidden className={cn("absolute inset-x-0 top-0 h-1", p.topbar)} />
                <div>
                  <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", p.iconBg, p.iconText)}>
                    <Icon size={20} />
                  </span>
                  <p className={cn("mt-5 text-xs uppercase tracking-wider", p.tagline)}>
                    {pillar.tagline}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight">{pillar.title}</h3>
                  <p className="mt-4 text-sm text-[var(--color-muted)]">{pillar.description}</p>
                </div>
                <span className={cn("mt-8 inline-flex items-center gap-1 text-sm font-medium", p.tagline)}>
                  {pillar.cta}
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Tag>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
