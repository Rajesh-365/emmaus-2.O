import type { Metadata } from "next";
import Image from "next/image";
import { Phone, MessageCircle, Award } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getAllCouncil } from "@/server/queries";

export const metadata: Metadata = {
  title: "Faculty & Council",
  description:
    "Meet the executive council and faculty behind the Emmaus Institute of Theology.",
};

export const dynamic = "force-dynamic";

function digits(s: string) {
  return s.replace(/\D/g, "");
}

function initials(name: string) {
  return name
    .replace(/^(Rev\.|K\.)\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export default async function FacultyPage() {
  const council = await getAllCouncil();
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-grain">
        <Container className="py-14 md:py-20">
          <SectionHeading
            eyebrow="Leadership"
            title="The executive council"
            description="A small team of pastors and teachers who oversee the direction, admissions, and academic life of Emmaus."
          />
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {council.map((m) => {
              const wa = digits(m.whatsapp ?? m.phone);
              return (
                <article
                  key={m.name}
                  className="hover-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft"
                >
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-brand">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-serif text-6xl font-light text-white/95">
                        {initials(m.name)}
                      </span>
                    )}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[var(--color-gold-400)] opacity-20 blur-2xl"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-lg leading-snug">{m.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--color-gold-500)]">
                      <Award size={12} /> {m.role}
                    </p>
                    <div className="mt-5 flex gap-2 pt-5 border-t border-[var(--color-border)]">
                      <a
                        href={`tel:${digits(m.phone)}`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                        aria-label={`Call ${m.name}`}
                      >
                        <Phone size={12} /> Call
                      </a>
                      <a
                        href={`https://wa.me/${wa}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                        aria-label={`WhatsApp ${m.name}`}
                      >
                        <MessageCircle size={12} /> Chat
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
