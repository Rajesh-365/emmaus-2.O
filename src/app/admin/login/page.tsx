import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/server/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  const { from } = await searchParams;
  if (session.isAdmin) {
    redirect(from && from.startsWith("/admin") ? from : "/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-grain px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 shadow-lift">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Emmaus Institute
          </p>
          <h1 className="mt-2 font-serif text-2xl">Admin login</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Admissions staff only.
          </p>
        </div>
        <div className="mt-8">
          <LoginForm from={from} />
        </div>
      </div>
    </main>
  );
}
