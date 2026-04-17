import type { Metadata } from "next";
import { Mail, MessageCircle, Video, MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Emmaus Institute of Theology.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-section-lavender">
        <div aria-hidden className="absolute inset-0 bg-grain opacity-90" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-[var(--color-secondary-400)] to-[var(--color-primary-500)] opacity-25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gradient-to-tr from-[var(--color-gold-400)] to-[var(--color-secondary-500)] opacity-20 blur-3xl"
        />
        <Container className="relative py-16 md:py-24">
          <SectionHeading
            eyebrow="Contact"
            title="Talk to the Emmaus team"
            description="For admissions, ministry partnership, or Gospel programme requests, reach out through any of the channels below."
          />
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              icon={<Mail size={20} />}
              label="Email"
              value={site.contact.email}
              href={`mailto:${site.contact.email}`}
              tone="blue"
            />
            <ContactCard
              icon={<MessageCircle size={20} />}
              label="WhatsApp"
              value="Message admissions"
              href={`https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`}
              external
              tone="green"
            />
            <ContactCard
              icon={<Video size={20} />}
              label="YouTube"
              value="Emmaus TV"
              href={site.social.youtube}
              external
              tone="red"
            />
            <ContactCard
              icon={<MapPin size={20} />}
              label="Based in"
              value="Andhra Pradesh, India"
              tone="gold"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

type Tone = "blue" | "green" | "red" | "gold";

const tones: Record<Tone, { iconBg: string; iconText: string; topbar: string; ring: string }> = {
  blue: {
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]/40",
    iconText: "text-[#1d4ed8] dark:text-[#93c5fd]",
    topbar: "bg-gradient-to-r from-[#60a5fa] to-[#1d4ed8]",
    ring: "hover:border-[#1d4ed8] dark:hover:border-[#60a5fa]",
  },
  green: {
    iconBg: "bg-[#dcfce7] dark:bg-[#14532d]/40",
    iconText: "text-[#15803d] dark:text-[#86efac]",
    topbar: "bg-gradient-to-r from-[#4ade80] to-[#15803d]",
    ring: "hover:border-[#15803d] dark:hover:border-[#4ade80]",
  },
  red: {
    iconBg: "bg-[#fee2e2] dark:bg-[#7f1d1d]/40",
    iconText: "text-[#b91c1c] dark:text-[#fca5a5]",
    topbar: "bg-gradient-to-r from-[#f87171] to-[#b91c1c]",
    ring: "hover:border-[#b91c1c] dark:hover:border-[#f87171]",
  },
  gold: {
    iconBg: "bg-[#fef3c7] dark:bg-[#78350f]/40",
    iconText: "text-[#b45309] dark:text-[#fcd34d]",
    topbar: "bg-gradient-to-r from-[#fbbf24] to-[#b45309]",
    ring: "hover:border-[#b45309] dark:hover:border-[#fbbf24]",
  },
};

function ContactCard({
  icon,
  label,
  value,
  href,
  external,
  tone = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  tone?: Tone;
}) {
  const t = tones[tone];
  const inner = (
    <>
      <div aria-hidden className={`absolute inset-x-0 top-0 h-1 ${t.topbar}`} />
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.iconBg} ${t.iconText}`}>
        {icon}
      </div>
      <p className="mt-5 text-xs uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-serif text-lg leading-snug break-words">{value}</p>
    </>
  );
  const className = `hover-lift relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-white to-[var(--color-surface)]/50 p-6 shadow-soft dark:from-[var(--color-background)] dark:to-[var(--color-background)] ${t.ring}`;
  return href ? (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}
