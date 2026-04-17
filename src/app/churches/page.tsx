import type { Metadata } from "next";
import { MapPin, User, Phone, Construction, Church as ChurchIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getAllChurches } from "@/server/queries";

export const metadata: Metadata = {
  title: "Churches",
  description:
    "Churches planted through John Gospel Fellowship across Andhra Pradesh and the Nallamalla Forest.",
};

export const dynamic = "force-dynamic";

function digits(s: string) {
  return s.replace(/\D/g, "");
}

export default async function ChurchesPage() {
  const churches = await getAllChurches();
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-grain">
        <Container className="py-14 md:py-20">
          <SectionHeading
            eyebrow="Church plants"
            title="Where the Gospel has taken root"
            description="Through seven years of ministry God allowed us to plant two congregations, with a third under construction in the Nallamalla Forest."
          />
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {churches.map((c) => (
              <article
                key={c.name}
                className="hover-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft"
              >
                <div className="relative flex h-48 items-center justify-center bg-gradient-brand text-white">
                  <ChurchIcon size={56} strokeWidth={1.25} />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--color-gold-400)] opacity-25 blur-2xl"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {c.status === "construction" ? (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-gold-400)]/15 px-3 py-1 text-xs font-medium text-[var(--color-gold-500)]">
                      <Construction size={12} /> Under construction
                    </span>
                  ) : (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> Active congregation
                    </span>
                  )}

                  <h3 className="mt-4 font-serif text-xl leading-snug">{c.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                    <MapPin size={13} /> {c.location}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-muted)]">
                    <p className="flex items-center gap-2">
                      <User size={14} /> <span className="font-medium text-[var(--color-foreground)]">{c.pastor}</span>
                    </p>
                    <a
                      href={`tel:${digits(c.phone)}`}
                      className="flex items-center gap-2 hover:text-[var(--color-accent)]"
                    >
                      <Phone size={14} /> {c.phone}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
