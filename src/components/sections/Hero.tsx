"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SnowEffect } from "@/components/effects/SnowEffect";

const verses = [
  {
    book: "Luke",
    chapter: "24",
    verse: "32",
    text: "Were not our hearts burning within us while He opened the Scriptures?",
  },
  {
    book: "Genesis",
    chapter: "14",
    verse: "14",
    text: "...he led out his trained men, three hundred and eighteen of them.",
  },
  {
    book: "Matthew",
    chapter: "28",
    verse: "19",
    text: "Go therefore and make disciples of all nations.",
  },
  {
    book: "Psalm",
    chapter: "119",
    verse: "105",
    text: "Your word is a lamp to my feet and a light to my path.",
  },
];

export function Hero() {
  return (
    <section
      className="hero-section relative isolate flex flex-col overflow-hidden"
      style={{ minHeight: "calc(100dvh - 6.5rem)" }}
    >
      <HeroBackdrop />
      <SnowEffect />

      <Container className="relative flex flex-1 items-center py-10 md:py-14">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <HeroCopy />
          <ScriptureCard />
        </div>
      </Container>

      <StatsBar />
    </section>
  );
}

/* ---------------- Copy block ---------------- */

function HeroCopy() {
  return (
    <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
      <p
        className="reveal-up text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--color-foreground-soft)]"
        style={{ ["--delay" as string]: "80ms" }}
      >
        Genesis 14:14 · Est. 2018 · Guntur
      </p>

      <div
        className="reveal-up mt-4 flex items-center justify-center gap-3 lg:justify-start"
        style={{ ["--delay" as string]: "180ms" }}
      >
        <span
          aria-hidden
          className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-gold-500)]/70 lg:from-[var(--color-gold-500)]/70 lg:to-transparent"
        />
        <Diamond />
        <span
          aria-hidden
          className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-gold-500)]/70 lg:hidden"
        />
      </div>

      <h1 className="mt-6 font-serif leading-[1.04] tracking-[-0.01em] text-[var(--color-foreground)]">
        <span
          className="reveal-up block text-[2.2rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.6rem]"
          style={{ ["--delay" as string]: "300ms" }}
        >
          The Gospel that brings more than hope.
        </span>
        <span
          className="reveal-up mt-3 block italic text-[1.7rem] sm:text-[2.2rem] md:text-[2.6rem] lg:text-[2.85rem]"
          style={{ ["--delay" as string]: "480ms" }}
        >
          <span className="bg-[linear-gradient(90deg,#2563eb,#9333ea,#f59e0b,#9333ea,#2563eb)] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-drift">
            It brings a new beginning.
          </span>
        </span>
      </h1>

      <p
        className="reveal-up mt-6 max-w-xl text-[0.95rem] leading-relaxed text-[var(--color-foreground-soft)] md:text-base"
        style={{ ["--delay" as string]: "680ms" }}
      >
        We have seen the Word of God restore dignity and purpose to entire
        communities. Emmaus exists to equip you to be part of that transformation.
      </p>

      <div
        className="reveal-up mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
        style={{ ["--delay" as string]: "880ms" }}
      >
        <Button href="/apply" size="md">
          Begin your application
          <ArrowRight size={14} />
        </Button>
        <Link
          href="/courses"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:text-[var(--color-accent)]"
        >
          Explore programmes
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <svg
      aria-hidden
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className="text-[var(--color-gold-500)]"
    >
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Bible book with page-turn animation ---------------- */

/* ---------------- Scripture card — special verse presentation ----------------
   An elevated "illuminated scripture" card with gold filigree corners, a
   cross medallion, soft halo, and a smooth reveal transition between verses.
   Not a book mockup — more like a framed scripture plaque. */

function ScriptureCard() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const id = setInterval(() => {
      setIdx((i) => (i + 1) % verses.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  const verse = verses[idx];
  const key = `${verse.book}-${verse.chapter}-${verse.verse}`;

  return (
    <aside
      className="reveal-up relative mx-auto w-full max-w-[26rem]"
      style={{ ["--delay" as string]: "500ms" }}
    >
      {/* Pulsing halo behind the card */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35)_0%,rgba(147,51,234,0.15)_45%,transparent_75%)] opacity-60 blur-3xl animate-pulse-glow dark:opacity-80"
      />

      {/* Card */}
      <div className="relative rounded-[20px] p-[2px] bg-[linear-gradient(135deg,#fbbf24,#9333ea,#2563eb,#fbbf24)] bg-[length:300%_300%] shadow-lift-lg animate-gradient-drift">
        <div
          className="relative overflow-hidden rounded-[18px] px-8 py-10 sm:px-10 sm:py-12"
          style={{
            background:
              "linear-gradient(160deg,#fffaea 0%,#fdf4d0 55%,#fae6a0 100%)",
          }}
        >
          {/* Dark-mode surface swap via overlay (keeps the gold frame stable) */}
          <div
            aria-hidden
            className="absolute inset-0 hidden dark:block"
            style={{
              background:
                "linear-gradient(160deg,#130a28 0%,#1a0f3c 50%,#2a1557 100%)",
            }}
          />

          {/* Subtle paper grain / starlight overlay */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(15,23,42,0.6) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Gilt corner ornaments */}
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />

          {/* Content, keyed so each verse change plays the reveal animation */}
          <div key={key} className="animate-scripture-reveal relative flex min-h-[18rem] flex-col items-center text-center">
            {/* Cross medallion */}
            <div
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background:
                  "radial-gradient(circle,#fde68a 0%,#f59e0b 60%,#b45309 100%)",
                boxShadow:
                  "0 0 0 2px rgba(201,155,60,0.3), 0 4px 10px rgba(245,158,11,0.3)",
              }}
            >
              <svg
                viewBox="0 0 12 14"
                width="12"
                height="14"
                className="text-[#3d1f00] dark:text-[#1a0a00]"
                aria-hidden
              >
                <rect x="5" y="1" width="2" height="12" fill="currentColor" rx="0.5" />
                <rect x="2" y="4" width="8" height="2" fill="currentColor" rx="0.5" />
              </svg>
            </div>

            {/* Reference eyebrow */}
            <p
              className="mt-5 text-[10px] font-bold uppercase tracking-[0.38em] text-[#8b0000] dark:text-[#fbbf24]"
            >
              {verse.book} {verse.chapter}:{verse.verse}
            </p>

            {/* Gold rule + diamond + rule */}
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-12 bg-gradient-to-r from-transparent to-[#c89b3c]/80 dark:to-[#fbbf24]/80"
              />
              <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden>
                <path
                  d="M5 0 L10 5 L5 10 L0 5 Z"
                  fill="#c89b3c"
                  className="dark:fill-[#fbbf24]"
                />
              </svg>
              <span
                aria-hidden
                className="h-px w-12 bg-gradient-to-l from-transparent to-[#c89b3c]/80 dark:to-[#fbbf24]/80"
              />
            </div>

            {/* The verse */}
            <blockquote className="mt-7 flex-1 px-1 font-serif italic leading-[1.4] text-[1.15rem] text-[#2d1f14] dark:text-[#f5e8b8] sm:text-[1.3rem] md:text-[1.45rem]">
              &ldquo;{verse.text}&rdquo;
            </blockquote>

            {/* Bottom signature */}
            <div className="mt-8 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-[#c89b3c]/70 dark:bg-[#fbbf24]/70"
              />
              <p
                className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#6b4a28] dark:text-[#fbbf24]/80"
              >
                Holy Scripture
              </p>
              <span
                aria-hidden
                className="h-px w-8 bg-[#c89b3c]/70 dark:bg-[#fbbf24]/70"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Soft under-card shadow */}
      <div
        aria-hidden
        className="mx-auto mt-4 h-3 w-[70%] rounded-full bg-black/15 blur-md dark:bg-black/45"
      />

      {/* Verse selector dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {verses.map((v, i) => (
          <button
            key={`${v.book}-${v.chapter}-${v.verse}`}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Show ${v.book} ${v.chapter}:${v.verse}`}
            aria-current={i === idx ? "true" : undefined}
            className={`h-1 rounded-full transition-all ${
              i === idx
                ? "w-8 bg-[linear-gradient(90deg,#fbbf24,#b45309)]"
                : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-muted)]"
            }`}
          />
        ))}
      </div>
    </aside>
  );
}

/* Gilded corner flourish — a small L-shaped bracket in gold. */
function CornerOrnament({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const posClass = {
    tl: "top-3 left-3",
    tr: "top-3 right-3 rotate-90",
    bl: "bottom-3 left-3 -rotate-90",
    br: "bottom-3 right-3 rotate-180",
  }[position];

  return (
    <svg
      viewBox="0 0 28 28"
      width="28"
      height="28"
      aria-hidden
      className={`absolute ${posClass} text-[#c89b3c] dark:text-[#fbbf24]`}
    >
      {/* Corner L-shape */}
      <path
        d="M 2 10 Q 2 2, 10 2"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner curl */}
      <path
        d="M 6 10 Q 6 6, 10 6"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Small dot */}
      <circle cx="4" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Stats bar ---------------- */

function StatsBar() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/50 to-transparent"
      />
      <Container className="grid grid-cols-3 py-5">
        <Stat target={500} suffix="+" label="Unreached areas served" />
        <Stat target={7} suffix="+" label="Years in ministry" hasDivider />
        <Stat target={4} label="Programmes offered" hasDivider />
      </Container>
    </div>
  );
}

function Stat({
  target,
  suffix = "",
  label,
  hasDivider,
}: {
  target: number;
  suffix?: string;
  label: string;
  hasDivider?: boolean;
}) {
  const [n, setN] = useState(0);
  const elRef = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || started.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      // Respect OS-level reduced-motion: skip the animation and land on the
      // target value. Can't compute this in the useState initialiser because
      // `window.matchMedia` is client-only and would cause a hydration split.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(target);
      return;
    }

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setN(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={elRef}
      className={`relative flex flex-col items-center gap-1 px-3 text-center ${
        hasDivider
          ? "before:absolute before:left-0 before:top-[20%] before:h-[60%] before:w-px before:bg-[var(--color-gold-500)]/25"
          : ""
      }`}
    >
      <span className="font-serif text-2xl leading-none text-[var(--color-foreground)] sm:text-3xl md:text-4xl">
        {n}
        {suffix}
      </span>
      <span className="text-[9px] font-semibold uppercase leading-tight tracking-[0.24em] text-[var(--color-muted)] sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

/* ---------------- Backdrop ---------------- */

function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* ---------- Light mode ---------- */}
      <div className="absolute inset-0 bg-[var(--color-page)] dark:hidden" />
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, rgba(253,246,221,0) 40%, rgba(253,246,221,0.35) 100%)",
        }}
      />
      <div className="absolute -bottom-[20%] left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[var(--color-gold-400)] opacity-[0.09] blur-3xl dark:hidden" />
      <div className="absolute -left-[8%] -top-[8%] h-[26rem] w-[26rem] rounded-full bg-[var(--color-primary-500)] opacity-[0.06] blur-3xl dark:hidden" />
      <div
        className="absolute inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.5) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* ---------- Dark mode ---------- */}
      <div className="absolute inset-0 hidden bg-[#080d1c] dark:block" />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(55% 55% at 22% 28%, rgba(37,99,235,0.28), transparent 65%), radial-gradient(48% 55% at 80% 22%, rgba(147,51,234,0.24), transparent 70%), radial-gradient(65% 60% at 50% 110%, rgba(245,158,11,0.22), transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 hidden opacity-[0.07] dark:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Shared vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 50%, rgba(0,0,0,0.12) 100%)",
        }}
      />
    </div>
  );
}
