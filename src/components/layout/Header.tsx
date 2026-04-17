"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { Container } from "./Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Admin panel has its own chrome — hide the public header there.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="min-w-0 truncate text-[15px] font-bold tracking-tight sm:text-lg md:text-xl"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors hover:text-[var(--color-foreground)]",
                  isActive
                    ? "font-semibold text-[var(--color-accent)]"
                    : "text-[var(--color-muted)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="hidden items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-background)] px-3.5 py-2 text-sm font-semibold text-[var(--color-foreground)] shadow-soft transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
          >
            <LogIn size={14} />
            Admin
          </Link>
          <Link
            href="/apply"
            className="hidden rounded-md bg-gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.65)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(37,99,235,0.7)] md:inline-flex"
          >
            Apply Now
          </Link>
          <button
            type="button"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--color-border)] transition-[max-height] duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {nav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded px-2 py-2 text-sm hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]",
                  isActive
                    ? "font-semibold text-[var(--color-accent)] bg-[var(--color-surface)]"
                    : "text-[var(--color-muted)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-gradient-brand px-5 py-2 text-center text-sm font-semibold text-white"
          >
            Apply Now
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-background)] px-5 py-2 text-center text-sm font-semibold text-[var(--color-foreground)]"
          >
            <LogIn size={14} />
            Admin Login
          </Link>
        </Container>
      </div>
    </header>
  );
}
