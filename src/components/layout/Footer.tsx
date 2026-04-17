import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "./Container";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { footerQuickLinks, footerExploreLinks, site } from "@/lib/site";
import { cn } from "@/lib/cn";

const socials = [
  { label: "WhatsApp", href: site.social.whatsapp, Icon: WhatsAppIcon, hover: "hover:text-[#16a34a]" },
  { label: "Email", href: site.social.email, Icon: Mail, hover: "hover:text-[var(--color-primary-600)]" },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon, hover: "hover:text-[#dc2626]" },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon, hover: "hover:text-[#2563eb]" },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon, hover: "hover:text-[#be185d]" },
];

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative bg-[var(--color-surface)]">
      {/* Gold hairline ornament at the very top */}
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-gold-400)] to-transparent" />

      {/* Scripture ribbon */}
      <div className="relative border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40">
        <Container className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            A blessing for the road
          </p>
          <p className="max-w-2xl font-serif text-lg italic leading-snug text-[var(--color-foreground)] md:text-xl">
            &ldquo;The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit be with you all.&rdquo;
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            2 Corinthians 13:14
          </p>
        </Container>
      </div>

      {/* Main grid */}
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {/* Column 1 — Brand */}
        <div className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--color-border)]">
              <Image
                src="/logos/eit.png"
                alt="Emmaus Institute of Theology logo"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <p
              className="text-base font-bold leading-tight tracking-tight text-[var(--color-foreground)]"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {site.name}
            </p>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
            Training disciples and spreading the Gospel since 2018. Equipping believers for ministry in unreached areas across India.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map(({ label, href, Icon, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold-400)]",
                  hover
                )}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 — Contact */}
        <div>
          <FooterHeading>Connect with us</FooterHeading>

          <div className="mt-4 border-l-2 border-[var(--color-gold-400)] pl-4">
            <p className="font-serif text-base text-[var(--color-foreground)]">
              {site.contact.name}
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
              {site.contact.role}
            </p>
          </div>

          <ul className="mt-5 space-y-3 text-sm">
            <ContactRow Icon={MessageCircle} label="WhatsApp" href={site.social.whatsapp} external>
              {site.contact.whatsapp}
            </ContactRow>
            <ContactRow Icon={Phone} label="Call" href={`tel:+${site.contact.phoneDigits}`}>
              {site.contact.phone}
            </ContactRow>
            <ContactRow Icon={Mail} label="Email" href={site.social.email}>
              {site.contact.email}
            </ContactRow>
            <ContactRow Icon={MapPin} label="Address" href={site.contact.mapUrl} external>
              {site.contact.address}
            </ContactRow>
          </ul>
        </div>

        {/* Column 3 — Quick Links */}
        <div>
          <FooterHeading>Quick Links</FooterHeading>
          <ul className="mt-4 space-y-2 text-sm">
            {footerQuickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-baseline gap-2 text-[var(--color-foreground-soft)] transition-colors hover:text-[var(--color-accent)]"
                >
                  <span className="text-[var(--color-gold-500)]">›</span>
                  <span className="underline-offset-4 group-hover:underline">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Also explore */}
        <div>
          <FooterHeading>Also explore</FooterHeading>
          <ul className="mt-4 space-y-2 text-sm">
            {footerExploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-baseline gap-2 text-[var(--color-foreground-soft)] transition-colors hover:text-[var(--color-accent)]"
                >
                  <span className="text-[var(--color-gold-500)]">›</span>
                  <span className="underline-offset-4 group-hover:underline">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Emmaus road at dawn — two disciples walking with the risen Christ
          toward the cross on the horizon. Luke 24 made visible, and our
          mission to India's unreached painted as a sunrise journey. */}
      <div className="relative h-44 w-full overflow-hidden border-t border-[var(--color-border)] sm:h-52 md:h-60 lg:h-64">
        <EmmausRoadArt />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[var(--color-surface)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/60 to-transparent"
        />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-3 px-4 text-center">
          <p className="mx-auto max-w-xl font-serif text-sm italic leading-snug text-[var(--color-foreground)] md:text-base">
            &ldquo;Were not our hearts burning within us while he talked with us on the road?&rdquo;
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Luke 24:32 &middot; The road to Emmaus
          </p>
        </figcaption>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-border)]">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-[var(--color-muted)] lg:flex-row lg:text-left">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5">
            <span>Designed &amp; developed by</span>
            <a
              href="https://www.linkedin.com/in/ratna-rajesh-veesa-0625501a5"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-semibold text-[var(--color-foreground)] transition-colors hover:text-[#0a66c2]"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-[#0a66c2] text-white transition-transform group-hover:scale-110">
                <LinkedInIcon size={10} />
              </span>
              <span className="text-[var(--color-muted)] group-hover:text-[#0a66c2]">Rajesh Veesa</span>
            </a>
          </p>
          <p>
            Built with <span className="text-[#ef4444]">❤️</span> for spreading the Gospel
          </p>
        </Container>
      </div>
    </footer>
  );
}

/* ---------------- sub-components ---------------- */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-serif text-lg tracking-tight text-[var(--color-foreground)]">
        {children}
      </h3>
      <div aria-hidden className="mt-2 h-px w-10 bg-[var(--color-gold-500)]" />
    </div>
  );
}

function ContactRow({
  Icon,
  label,
  href,
  external,
  children,
}: {
  Icon: React.ElementType;
  label: string;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-start gap-3 text-[var(--color-foreground-soft)] transition-colors hover:text-[var(--color-accent)]"
      >
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-gold-500)] transition-colors group-hover:border-[var(--color-gold-400)]">
          <Icon size={13} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {label}
          </span>
          <span className="block truncate text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-accent)]">
            {children}
          </span>
        </span>
      </a>
    </li>
  );
}

/**
 * Emmaus Road at Dawn — a hand-crafted SVG landscape.
 *
 * The scene: a winding path leads from the viewer's feet toward a hill on
 * the horizon where a lone cross stands silhouetted against a rising sun.
 * Two small pilgrims walk the road together — a nod to Luke 24, where the
 * risen Christ joined the disciples on their walk to Emmaus. In light mode
 * the sky is a warm amber dawn; in dark mode it deepens to a gilded dusk
 * so the cross catches the light.
 *
 * All fills use CSS custom properties defined in globals.css, so the art
 * re-tints automatically when the theme changes.
 */
function EmmausRoadArt() {
  return (
    <svg
      viewBox="0 0 1200 280"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="emmaus-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--illus-sky-from)" }} />
          <stop offset="100%" style={{ stopColor: "var(--illus-sky-to)" }} />
        </linearGradient>
        <radialGradient id="emmaus-sun" cx="0.5" cy="0.58" r="0.42">
          <stop offset="0%" style={{ stopColor: "var(--illus-sun)", stopOpacity: 0.85 }} />
          <stop offset="45%" style={{ stopColor: "var(--illus-sun)", stopOpacity: 0.25 }} />
          <stop offset="100%" style={{ stopColor: "var(--illus-sun)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1200" height="280" fill="url(#emmaus-sky)" />

      {/* Sun halo behind the horizon */}
      <circle cx="600" cy="160" r="220" fill="url(#emmaus-sun)" />

      {/* Light rays — fanning out from the cross */}
      <g
        opacity="0.28"
        stroke="var(--illus-sun)"
        strokeLinecap="round"
      >
        <line x1="600" y1="155" x2="120" y2="55" strokeWidth="1.2" />
        <line x1="600" y1="155" x2="280" y2="30" strokeWidth="1" />
        <line x1="600" y1="155" x2="460" y2="10" strokeWidth="1" />
        <line x1="600" y1="155" x2="600" y2="5" strokeWidth="1.2" />
        <line x1="600" y1="155" x2="740" y2="10" strokeWidth="1" />
        <line x1="600" y1="155" x2="920" y2="30" strokeWidth="1" />
        <line x1="600" y1="155" x2="1080" y2="55" strokeWidth="1.2" />
      </g>

      {/* Sun disc */}
      <circle cx="600" cy="162" r="26" fill="var(--illus-sun)" opacity="0.35" />

      {/* Distant mountain range — soft, layered */}
      <path
        d="M 0 200 Q 100 175 220 188 T 440 184 Q 540 168 600 176 Q 680 164 780 184 T 990 190 Q 1100 174 1200 192 L 1200 280 L 0 280 Z"
        fill="var(--illus-mountain-far)"
        opacity="0.7"
      />

      {/* Mid hills */}
      <path
        d="M 0 222 Q 160 208 320 218 Q 480 206 600 214 Q 720 222 880 212 Q 1040 202 1200 218 L 1200 280 L 0 280 Z"
        fill="var(--illus-mountain-mid)"
      />

      {/* Cross silhouette standing on the central hill */}
      <g transform="translate(600, 170)">
        <rect x="-1.8" y="-38" width="3.6" height="44" rx="0.6" fill="var(--illus-cross)" />
        <rect x="-11" y="-28" width="22" height="3.6" rx="0.6" fill="var(--illus-cross)" />
      </g>

      {/* Foreground road — a tapered path winding to the cross */}
      <path
        d="M 520 280 L 596 176 L 604 176 L 680 280 Z"
        fill="var(--illus-road)"
        opacity="0.85"
      />
      {/* Dashed centre line along the road */}
      <line
        x1="600"
        y1="178"
        x2="600"
        y2="278"
        stroke="var(--illus-road-mark)"
        strokeWidth="1.2"
        strokeDasharray="3 6"
        opacity="0.45"
      />

      {/* Two pilgrims walking the road — tiny silhouettes */}
      <g fill="var(--illus-figure)" transform="translate(578, 244)">
        <circle cx="0" cy="-8" r="2.4" />
        <path d="M -2.8 -6 Q -3.6 2 -4.2 10 L -2 12 L 2 12 L 4.2 10 Q 3.6 2 2.8 -6 Z" />
      </g>
      <g fill="var(--illus-figure)" transform="translate(596, 250)">
        <circle cx="0" cy="-8" r="2.4" />
        <path d="M -2.8 -6 Q -3.6 2 -4.2 10 L -2 12 L 2 12 L 4.2 10 Q 3.6 2 2.8 -6 Z" />
      </g>

      {/* Birds in flight — tiny V strokes */}
      <g
        stroke="var(--illus-bird)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="1.3"
        opacity="0.55"
      >
        <path d="M 180 85 q 4 -4 8 0 q 4 -4 8 0" />
        <path d="M 268 62 q 3 -3 6 0 q 3 -3 6 0" />
        <path d="M 928 72 q 3 -3 6 0 q 3 -3 6 0" />
        <path d="M 1006 96 q 4 -4 8 0 q 4 -4 8 0" />
      </g>
    </svg>
  );
}

