import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { MissionVision } from "@/components/sections/MissionVision";
import { Story } from "@/components/sections/Story";
import { CallToAction } from "@/components/sections/CallToAction";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how John Gospel Fellowship and the Emmaus Institute of Theology grew out of seven years of Gospel ministry in Andhra Pradesh, Telangana, and Odisha.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-section-sky">
        <div aria-hidden className="absolute inset-0 bg-grain opacity-90" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-secondary-500)] opacity-25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-[var(--color-gold-400)] to-[var(--color-primary-500)] opacity-20 blur-3xl"
        />
        <Container className="relative py-16 md:py-24">
          <SectionHeading
            eyebrow="About Emmaus"
            title="A college born from the mission field"
            description="Emmaus is not an abstract seminary. Every classroom conviction was formed by first walking with unreached communities — and seeing what kind of pastor the Gospel actually requires."
          />
        </Container>
      </section>
      <Story />
      <MissionVision />
      <CallToAction />
    </>
  );
}
