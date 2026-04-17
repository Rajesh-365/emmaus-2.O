import Link from "next/link";
import { ArrowRight, Clock, Crown } from "lucide-react";
import { cn } from "@/lib/cn";
import { tierStyle, type Course } from "@/data/courses";

export function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  const tier = (course.tier as 1 | 2 | 3 | 4);
  const s = tierStyle[tier] ?? tierStyle[1];
  const featured = Boolean(s.featured);

  return (
    <div className={cn("relative h-full", featured && "md:-mt-4")}>
      {featured ? (
        <div
          aria-hidden
          className="absolute -inset-1 -z-10 rounded-[1.75rem] bg-[linear-gradient(135deg,#fbbf24,#a855f7,#2563eb)] opacity-70 blur-[2px]"
        />
      ) : null}

      <Link
        href={`/courses/${course.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-[var(--color-background)] p-6 transition-all",
          "shadow-soft hover:-translate-y-1 hover:shadow-lift-lg",
          s.ring,
          featured && "border-2"
        )}
      >
        {featured ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#fbbf24,#f59e0b)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#78350f] shadow-soft">
            <Crown size={10} /> Flagship
          </span>
        ) : null}

        <span className={cn(
          "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
          s.badge
        )}>
          {course.level}
        </span>

        <p className={cn(
          "mt-4 bg-clip-text font-serif text-5xl leading-none text-transparent",
          `bg-gradient-to-br ${s.codeGrad}`
        )}>
          {course.code}
        </p>

        <h3 className="mt-3 font-serif text-xl leading-snug">{course.name}</h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
          <Clock size={12} /> {course.duration} · {course.semesters} semesters
        </p>

        {!compact ? (
          <p className="mt-4 flex-1 text-sm text-[var(--color-muted)]">{course.summary}</p>
        ) : (
          <div className="flex-1" />
        )}

        {/* Tier indicator — pips filled to show hierarchy */}
        <div className="mt-5 flex items-center gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                n <= s.bar ? s.accent : "bg-[var(--color-border)]"
              )}
            />
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
          Learn more
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}
