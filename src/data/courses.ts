import type { Course as DbCourse } from "@/server/db/schema";

export type CourseLevel = "Foundation" | "Intermediate" | "Advanced" | "Mastery";

/** Re-export of the DB-inferred Course type so consumers don't import from
 *  the server package directly. */
export type Course = DbCourse;

/** Visual treatment per tier. Kept as a pure data map so the UI stays
 *  declarative — this config is design intent, not content. */
export const tierStyle: Record<
  1 | 2 | 3 | 4,
  {
    ring: string;
    badge: string;
    codeGrad: string;
    accent: string;
    bar: number;
    featured?: boolean;
  }
> = {
  1: {
    ring: "border-[var(--color-border)]",
    badge:
      "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-600)]/15 dark:text-[var(--color-primary-400)]",
    codeGrad: "from-[#60a5fa] to-[#3b82f6]",
    accent: "bg-[var(--color-primary-500)]",
    bar: 1,
  },
  2: {
    ring: "border-[var(--color-border)]",
    badge:
      "bg-[#eef2ff] text-[#4338ca] dark:bg-[#4338ca]/20 dark:text-[#a5b4fc]",
    codeGrad: "from-[#4f46e5] to-[#6366f1]",
    accent: "bg-[#4f46e5]",
    bar: 2,
  },
  3: {
    ring: "border-[var(--color-border)]",
    badge:
      "bg-[#f5f3ff] text-[#7e22ce] dark:bg-[#7e22ce]/20 dark:text-[#c084fc]",
    codeGrad: "from-[#7c3aed] to-[#a855f7]",
    accent: "bg-[#7c3aed]",
    bar: 3,
  },
  4: {
    ring: "border-[var(--color-gold-400)]/60",
    badge:
      "bg-[linear-gradient(135deg,#fbbf24,#f59e0b)] text-[#7c2d12]",
    codeGrad: "from-[#f59e0b] via-[#a855f7] to-[#2563eb]",
    accent: "bg-gradient-brand",
    bar: 4,
    featured: true,
  },
};
