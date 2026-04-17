"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Canonical next-themes hydration guard: set a flag post-mount so the
  // toggle renders the themed icon only on the client and avoids an SSR
  // mismatch. The set-state-in-effect lint trips on this specific pattern.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)]"
    >
      {/* Render both icons to keep SSR/CSR markup stable; swap via data attribute once mounted */}
      <span className="sr-only">Toggle theme</span>
      {mounted ? (
        isDark ? <Sun size={16} /> : <Moon size={16} />
      ) : (
        <Moon size={16} aria-hidden />
      )}
    </button>
  );
}
