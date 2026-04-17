"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  FileText,
  GraduationCap,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", Icon: FileText },
  { href: "/admin/courses", label: "Courses", Icon: GraduationCap },
  { href: "/admin/results", label: "Results", Icon: GraduationCap },
  { href: "/admin/churches", label: "Churches", Icon: Building2 },
  { href: "/admin/council", label: "Council", Icon: Users },
  { href: "/admin/gallery", label: "Gallery", Icon: Images },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 md:hidden">
        <p className="font-serif text-lg">Emmaus · Admin</p>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 hover:bg-[var(--color-surface)]"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-[var(--color-border)] bg-[var(--color-surface)] md:sticky md:top-0 md:block md:h-dvh md:w-60",
          open ? "block" : "hidden md:block",
        )}
      >
        <div className="hidden p-5 md:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Emmaus Institute
          </p>
          <p className="mt-1 font-serif text-xl">Admin</p>
        </div>

        <nav aria-label="Admin" className="space-y-1 p-3">
          {nav.map(({ href, label, Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[var(--color-background)] font-semibold text-[var(--color-accent)] shadow-soft"
                    : "text-[var(--color-foreground-soft)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-[var(--color-border)] p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-foreground-soft)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-[var(--color-page)] p-4 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
