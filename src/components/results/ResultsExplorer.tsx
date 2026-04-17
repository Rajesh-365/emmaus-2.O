"use client";

import { useId, useMemo, useState } from "react";
import { Award, Crown, Medal as MedalIcon, Search, Sparkles, Star, Trophy, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  medalForRank,
  type Medal,
  type Programme,
  type StudentResult,
} from "@/data/results";

/* ---------------- helpers ---------------- */

function normalise(s: string) {
  return s.toLowerCase().trim();
}

function matchesQuery(r: StudentResult, raw: string) {
  const q = normalise(raw);
  if (!q) return false;
  const admission = r.admissionNo.toLowerCase();
  const name = r.name.toLowerCase();
  if (admission.includes(q) || name.includes(q)) return true;
  if (/^\d+$/.test(q)) {
    const padded = q.padStart(3, "0");
    if (admission.endsWith(`/${padded}`)) return true;
  }
  if (q.length === 1 && /[a-z]/.test(q)) {
    const initials = name.split(/\s+/).map((w) => w[0]);
    if (initials.includes(q)) return true;
  }
  return false;
}

const medalTheme: Record<
  Exclude<Medal, null>,
  {
    label: string;
    badgeFrom: string;
    badgeTo: string;
    pill: string;
    podiumGrad: string;
    stepLabel: string;
    glowFrom: string;
    glowTo: string;
  }
> = {
  gold: {
    label: "Gold",
    badgeFrom: "#fde68a",
    badgeTo: "#f59e0b",
    pill: "bg-[linear-gradient(135deg,#fbbf24,#f59e0b)] text-[#78350f]",
    podiumGrad: "from-[#fde68a] to-[#f59e0b]",
    stepLabel: "I",
    glowFrom: "#fbbf24",
    glowTo: "#b45309",
  },
  silver: {
    label: "Silver",
    badgeFrom: "#e2e8f0",
    badgeTo: "#94a3b8",
    pill: "bg-[linear-gradient(135deg,#e2e8f0,#94a3b8)] text-slate-800",
    podiumGrad: "from-[#e2e8f0] to-[#94a3b8]",
    stepLabel: "II",
    glowFrom: "#cbd5e1",
    glowTo: "#64748b",
  },
  bronze: {
    label: "Bronze",
    badgeFrom: "#fed7aa",
    badgeTo: "#b45309",
    pill: "bg-[linear-gradient(135deg,#fdba74,#b45309)] text-white",
    podiumGrad: "from-[#fdba74] to-[#b45309]",
    stepLabel: "III",
    glowFrom: "#fb923c",
    glowTo: "#9a3412",
  },
};

/* ---------------- component ---------------- */

export function ResultsExplorer({
  programme,
  results,
}: {
  programme: Programme;
  results: StudentResult[];
}) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);

  const matches = useMemo(() => {
    if (!query) return [];
    return results.filter((r) => matchesQuery(r, query));
  }, [query, results]);

  const podium = useMemo(() => {
    const groups: Record<1 | 2 | 3, StudentResult[]> = { 1: [], 2: [], 3: [] };
    for (const r of results) if (r.rank === 1 || r.rank === 2 || r.rank === 3) groups[r.rank].push(r);
    return groups;
  }, [results]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(input.trim());
    setTouched(true);
  }

  function handleClear() {
    setInput("");
    setQuery("");
    setTouched(false);
  }

  return (
    <div className="space-y-16">
      {/* ──────────── SEARCH PANEL ──────────── */}
      <section aria-labelledby="search-heading" className="relative">
        <div className="glass-strong relative overflow-hidden rounded-3xl">
          <div aria-hidden className="h-1 bg-[linear-gradient(90deg,#2563eb,#9333ea,#f59e0b)]" />
          <div className="p-6 md:p-10">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              <Search size={12} /> {programme.code} · {programme.year}
            </span>
            <h2
              id="search-heading"
              className="mt-4 font-serif text-3xl leading-tight sm:text-4xl"
            >
              Find your result
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-foreground-soft)]">
              Enter your admission number, name, or single initial. Full class results are not published publicly — only the student who searches sees their record.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch"
            >
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                />
                <input
                  type="search"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="EC/008, 008, Ruthu, or a single initial"
                  aria-label="Search query"
                  className="glass h-12 w-full rounded-full pl-11 pr-10 text-sm outline-none transition-all focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
                />
                {input ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:shadow-lift-lg disabled:opacity-60"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-foreground-soft)]">
              <span className="uppercase tracking-[0.18em]">Try</span>
              {["EC/008", "008", "Ruthu", "R"].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => { setInput(ex); setQuery(ex); setTouched(true); }}
                  className="glass rounded-full px-2.5 py-0.5 font-mono text-[11px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {ex}
                </button>
              ))}
            </div>

            {touched ? (
              matches.length > 0 ? (
                <div className="mt-8 border-t border-white/40 pt-6 dark:border-white/10">
                  <p className="text-xs uppercase tracking-wider text-[var(--color-foreground-soft)]">
                    {matches.length} match{matches.length === 1 ? "" : "es"} for &ldquo;{query}&rdquo;
                  </p>
                  <ul className="mt-4 space-y-3">
                    {matches.map((r) => <ResultCard key={r.admissionNo} r={r} />)}
                  </ul>
                </div>
              ) : (
                <div className="glass mt-8 rounded-2xl p-6 text-center text-sm text-[var(--color-foreground-soft)]">
                  No result matches &ldquo;{query}&rdquo;. Please check your admission number or spelling.
                </div>
              )
            ) : null}
          </div>
        </div>
      </section>

      {/* ──────────── PODIUM ──────────── */}
      <section aria-labelledby="podium-heading" className="relative">
        <header className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#fbbf24,#b45309)] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#3b1c00] shadow-soft">
            <Trophy size={12} /> Honour roll
          </p>
          <h2 id="podium-heading" className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl">
            Top medalists
          </h2>
          <Laurel className="mx-auto mt-4 text-[var(--color-gold-500)]" />
          <p className="mt-3 text-sm text-[var(--color-foreground-soft)]">
            Rank 1, 2 &amp; 3 from {programme.name} ({programme.code}) · {programme.year}
          </p>
        </header>

        {/* ── Desktop podium (lg+): Silver · Gold · Bronze (Gold tallest centre) ── */}
        <div className="mt-16 hidden lg:block">
          <Podium podium={podium} />
        </div>

        {/* ── Mobile + tablet: stacked Gold-first, no faux 3D ── */}
        <div className="mt-12 grid gap-6 lg:hidden">
          <MobileMedalCard medal="gold" rank={1} students={podium[1]} />
          <MobileMedalCard medal="silver" rank={2} students={podium[2]} />
          <MobileMedalCard medal="bronze" rank={3} students={podium[3]} />
        </div>

        <p className="mt-12 text-center text-xs text-[var(--color-foreground-soft)]">
          Full class results are not published on this page. Use the search above to look up an individual result.
        </p>
      </section>
    </div>
  );
}

/* ---------------- 3-tier podium (desktop) ----------------
   Real Olympic-style stage: Silver-left, Gold-centre (tallest), Bronze-right.
   Each medalist sits on a metallic pedestal with an engraved Roman numeral. */

type PodiumGroups = Record<1 | 2 | 3, StudentResult[]>;

const podiumConfig: Record<
  1 | 2 | 3,
  {
    medal: Exclude<Medal, null>;
    height: string;
    cardWidth: string;
    medalSize: number;
    order: string;
    label: string;
    pedestalNumeral: string;
  }
> = {
  1: {
    medal: "gold",
    height: "h-56",
    cardWidth: "max-w-[19rem]",
    medalSize: 120,
    order: "md:order-2",
    label: "First place",
    pedestalNumeral: "I",
  },
  2: {
    medal: "silver",
    height: "h-40",
    cardWidth: "max-w-[16rem]",
    medalSize: 88,
    order: "md:order-1",
    label: "Second place",
    pedestalNumeral: "II",
  },
  3: {
    medal: "bronze",
    height: "h-32",
    cardWidth: "max-w-[16rem]",
    medalSize: 84,
    order: "md:order-3",
    label: "Third place",
    pedestalNumeral: "III",
  },
};

function Podium({ podium }: { podium: PodiumGroups }) {
  return (
    <div className="relative">
      {/* Stage spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 -translate-y-12 rounded-full bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.45),_transparent_65%)] blur-3xl animate-pulse-glow"
      />

      <div className="relative grid grid-cols-3 items-end gap-4 lg:gap-8">
        {([2, 1, 3] as const).map((rank) => (
          <PodiumPillar key={rank} rank={rank} students={podium[rank]} />
        ))}
      </div>

      {/* Marble stage floor — a thin reflective rule across all three columns */}
      <div
        aria-hidden
        className="mt-1 h-2 rounded-b-2xl bg-[linear-gradient(180deg,rgba(15,23,42,0.20),rgba(15,23,42,0.05))] opacity-60 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]"
      />
      <div
        aria-hidden
        className="mx-auto -mt-1 h-px w-3/4 bg-[linear-gradient(90deg,transparent,var(--color-gold-500),transparent)] opacity-70"
      />
    </div>
  );
}

function PodiumPillar({
  rank,
  students,
}: {
  rank: 1 | 2 | 3;
  students: StudentResult[];
}) {
  const cfg = podiumConfig[rank];
  const t = medalTheme[cfg.medal];
  const isGold = rank === 1;
  const top = students[0];

  return (
    <div className={cn("flex flex-col items-center", cfg.order)}>
      {/* ── Floating award card ── */}
      <article
        className={cn(
          "relative w-full",
          cfg.cardWidth,
          isGold && "-translate-y-2"
        )}
      >
        {/* Gold gets sparkles + animated halo */}
        {isGold ? (
          <>
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-[1.8rem] bg-[linear-gradient(135deg,#fbbf24,#f59e0b,#9333ea,#2563eb,#fbbf24)] bg-[length:300%_300%] opacity-80 blur-[2px] animate-gradient-drift"
            />
            <Sparkles
              aria-hidden
              size={16}
              className="absolute -top-3 -right-2 z-20 text-[#f59e0b] animate-pulse-glow"
            />
            <Star
              aria-hidden
              size={12}
              className="absolute -top-1 left-2 z-20 text-[#fbbf24] opacity-80 animate-pulse-glow"
              style={{ animationDelay: "1.2s" }}
            />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute -inset-1 -z-10 rounded-[1.4rem] opacity-50 blur-md"
            style={{
              background: `linear-gradient(135deg, ${t.glowFrom}, ${t.glowTo})`,
            }}
          />
        )}

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-[var(--color-background)] p-4 text-center shadow-lift dark:bg-[#111a2e]",
            isGold ? "border-[var(--color-gold-400)] shadow-lift-lg" : "border-[var(--color-border)]"
          )}
        >
          {/* Top metallic bar */}
          <div
            aria-hidden
            className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", t.podiumGrad)}
          />

          {/* Crown for gold */}
          {isGold ? (
            <div className="absolute left-1/2 top-3 -translate-x-1/2">
              <Crown size={20} className="text-[#f59e0b] drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            </div>
          ) : null}

          {/* Medal — overlapping the top bar */}
          <div className="relative mx-auto -mt-1 flex items-center justify-center">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full opacity-50 blur-xl"
              style={{ background: `radial-gradient(circle, ${t.glowFrom}, transparent 70%)` }}
            />
            <MedalBadge medal={cfg.medal} size={cfg.medalSize} />
          </div>

          {/* Top scorer */}
          <p className={cn(
            "mt-2 font-serif leading-snug text-[var(--color-foreground)]",
            isGold ? "text-xl md:text-2xl" : "text-base md:text-lg"
          )}>
            {top?.name ?? "—"}
          </p>
          <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--color-foreground-soft)]">
            {top?.admissionNo ?? ""} {top?.location ? `· ${top.location}` : ""}
          </p>

          {/* Score chip */}
          <p
            className={cn(
              "mt-3 inline-flex items-center justify-center rounded-full px-4 py-1 font-serif font-bold leading-none shadow-soft",
              t.pill,
              isGold ? "text-2xl" : "text-xl"
            )}
          >
            {top?.percentage ?? "—"}%
          </p>

          {/* Tied students (if any) */}
          {students.length > 1 ? (
            <ul className="mt-4 space-y-1.5 border-t border-dashed border-[var(--color-border)] pt-3 text-left text-xs">
              {students.slice(1).map((r) => (
                <li key={r.admissionNo} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[var(--color-foreground)]">{r.name}</span>
                  <span className="shrink-0 font-mono font-semibold text-[var(--color-foreground-soft)]">
                    {r.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>

      {/* ── Pedestal ── */}
      <div className={cn("relative mt-4 w-full", cfg.height)}>
        {/* Top edge — lighter (catches stage light) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-2 rounded-t-md"
          style={{
            background: `linear-gradient(180deg, ${t.glowFrom}, ${t.glowTo})`,
          }}
        />
        {/* Pedestal body */}
        <div
          className="absolute inset-0 rounded-md border border-black/10 dark:border-white/10"
          style={{
            background: `linear-gradient(180deg, ${t.glowFrom} 0%, ${t.glowTo} 100%)`,
            boxShadow:
              "inset 0 14px 24px -14px rgba(255,255,255,0.55), inset 0 -22px 36px -18px rgba(0,0,0,0.45)",
          }}
        />
        {/* Roman numeral engraving */}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-serif font-extrabold leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]",
            isGold ? "text-7xl md:text-8xl" : "text-6xl md:text-7xl",
            cfg.medal === "bronze" ? "text-white" : "text-[#3b1c00]"
          )}
        >
          {cfg.pedestalNumeral}
        </span>
        {/* Front bevel highlight */}
        <div
          aria-hidden
          className="absolute inset-x-2 bottom-1 h-1 rounded-full bg-white/30"
        />
      </div>
    </div>
  );
}

/* ---------------- mobile medal cards ---------------- */

function MobileMedalCard({
  medal,
  rank,
  students,
}: {
  medal: Exclude<Medal, null>;
  rank: 1 | 2 | 3;
  students: StudentResult[];
}) {
  const t = medalTheme[medal];
  const isGold = rank === 1;
  const top = students[0];

  return (
    <article className="relative">
      {isGold ? (
        <div
          aria-hidden
          className="absolute -inset-2 -z-10 rounded-[1.6rem] bg-[linear-gradient(135deg,#fbbf24,#f59e0b,#9333ea,#2563eb,#fbbf24)] bg-[length:300%_300%] opacity-70 blur-[2px] animate-gradient-drift"
        />
      ) : (
        <div
          aria-hidden
          className="absolute -inset-1 -z-10 rounded-[1.4rem] opacity-40 blur-md"
          style={{ background: `linear-gradient(135deg, ${t.glowFrom}, ${t.glowTo})` }}
        />
      )}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-[var(--color-background)] p-5 shadow-lift dark:bg-[#111a2e]",
          isGold ? "border-[var(--color-gold-400)]" : "border-[var(--color-border)]"
        )}
      >
        <div
          aria-hidden
          className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", t.podiumGrad)}
        />

        <div className="flex items-center gap-4">
          <MedalBadge medal={medal} size={isGold ? 80 : 64} />
          <div className="min-w-0 flex-1">
            <p className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em]", t.pill)}>
              {isGold ? <Crown size={11} /> : <MedalIcon size={11} />} Rank {t.stepLabel}
            </p>
            <p className="mt-2 truncate font-serif text-lg">{top?.name ?? "—"}</p>
            <p className="text-[11px] font-mono text-[var(--color-foreground-soft)]">
              {top?.admissionNo} · {top?.location}
            </p>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
            {top?.percentage ?? "—"}%
          </p>
        </div>

        {students.length > 1 ? (
          <ul className="mt-4 space-y-1.5 border-t border-dashed border-[var(--color-border)] pt-3 text-sm">
            {students.slice(1).map((r) => (
              <li key={r.admissionNo} className="flex items-center justify-between gap-2">
                <span className="truncate">{r.name}</span>
                <span className="shrink-0 font-mono font-semibold text-[var(--color-foreground-soft)]">
                  {r.percentage}%
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

/* ---------------- medal badge SVG ---------------- */

function MedalBadge({ medal, size = 80 }: { medal: Exclude<Medal, null>; size?: number }) {
  const uid = useId();
  const t = medalTheme[medal];
  const gradId = `medal-${uid}`;
  const shineId = `shine-${uid}`;
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={t.badgeFrom} />
          <stop offset="100%" stopColor={t.badgeTo} />
        </linearGradient>
        <radialGradient id={shineId} cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Ribbons */}
      <path d="M22 2 L40 48 L30 48 Z" fill="#dc2626" />
      <path d="M58 2 L40 48 L50 48 Z" fill="#dc2626" />
      <path d="M22 2 L30 2 L40 30 Z" fill="#fecaca" />
      <path d="M58 2 L50 2 L40 30 Z" fill="#fecaca" />

      {/* Circle medal */}
      <circle cx="40" cy="65" r="28" fill={`url(#${gradId})`} stroke={t.badgeTo} strokeWidth="2" />
      <circle cx="40" cy="65" r="28" fill={`url(#${shineId})`} />
      <circle cx="40" cy="65" r="22" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
      <text
        x="40"
        y="74"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontWeight="700"
        fontSize="26"
        fill={medal === "bronze" ? "#ffffff" : "#7c2d12"}
      >
        {t.stepLabel}
      </text>
    </svg>
  );
}

/* ---------------- laurel ornament ---------------- */

function Laurel({ className }: { className?: string }) {
  return (
    <svg width="160" height="26" viewBox="0 0 160 26" aria-hidden className={className}>
      <g fill="currentColor">
        <path d="M80 2 L82 9 L80 7 L78 9 Z" />
        <circle cx="80" cy="17" r="2" />
      </g>
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none">
        <path d="M74 15 Q60 14 52 20" />
        <path d="M72 12 Q58 8 48 12" />
        <path d="M70 10 Q56 4 44 6" />
        <path d="M86 15 Q100 14 108 20" />
        <path d="M88 12 Q102 8 112 12" />
        <path d="M90 10 Q104 4 116 6" />
      </g>
    </svg>
  );
}

/* ---------------- search result card ---------------- */

function ResultCard({ r }: { r: StudentResult }) {
  const medal = medalForRank(r.rank);
  const t = medal ? medalTheme[medal] : null;
  const isGold = medal === "gold";

  return (
    <li
      className={cn(
        "hover-lift relative overflow-hidden rounded-2xl p-4 sm:p-5",
        isGold ? "glass-strong" : "glass"
      )}
    >
      {isGold ? (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#fde68a,#fbbf24,#f59e0b,#fbbf24,#fde68a)] bg-[length:200%_200%] animate-gradient-drift"
        />
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{r.name}</p>
          <p className="text-xs text-[var(--color-foreground-soft)]">
            {r.admissionNo} · {r.location}
          </p>
        </div>
        {t ? (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider", t.pill)}>
            <MedalIcon size={11} /> {t.label}
          </span>
        ) : null}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-white/40 pt-3 text-sm dark:border-white/10">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--color-foreground-soft)]">Sem 1</dt>
          <dd className="font-medium tabular-nums">{r.firstSem ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--color-foreground-soft)]">Sem 2</dt>
          <dd className="font-medium tabular-nums">{r.secondSem ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--color-foreground-soft)]">Total</dt>
          <dd className="font-semibold tabular-nums text-gradient-brand">
            {r.percentage != null ? `${r.percentage}%` : "—"}
          </dd>
        </div>
      </dl>
      <div className="mt-3">
        <ResultPill category={r.result} />
      </div>
    </li>
  );
}

function ResultPill({ category }: { category: StudentResult["result"] }) {
  if (!category) return <span className="text-xs text-[var(--color-muted)]">—</span>;
  const style = (() => {
    switch (category) {
      case "Distinction":
        return "bg-[var(--color-gold-400)]/15 text-[var(--color-gold-500)] border-[var(--color-gold-400)]/30";
      case "1st Class":
        return "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-700)]/20 dark:bg-[var(--color-primary-600)]/15 dark:text-[var(--color-primary-400)]";
      case "2nd Class":
        return "bg-[#f5f3ff] text-[#7e22ce] border-[#7e22ce]/20 dark:bg-[#7e22ce]/20 dark:text-[#c084fc]";
      case "Pass":
        return "bg-[var(--color-surface)] text-[var(--color-foreground-soft)] border-[var(--color-border)]";
      case "Absent":
        return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400";
      default:
        return "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]";
    }
  })();
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", style)}>
      <Award size={11} /> {category}
    </span>
  );
}
