import Link from "next/link";
import { desc, ilike, or, sql, eq, and, type SQL } from "drizzle-orm";
import { Download, Search } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { applications, type Application } from "@/server/db/schema";
import { StatusPill } from "./StatusPill";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const statusFilter = params.status ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const db = getDb();

  const filters: SQL[] = [];
  if (query) {
    filters.push(
      or(
        ilike(applications.firstName, `%${query}%`),
        ilike(applications.lastName, `%${query}%`),
        ilike(applications.email, `%${query}%`),
        ilike(applications.phone, `%${query}%`),
        ilike(applications.city, `%${query}%`),
      )!,
    );
  }
  if (["pending", "reviewed", "accepted", "rejected"].includes(statusFilter)) {
    filters.push(
      eq(
        applications.status,
        statusFilter as "pending" | "reviewed" | "accepted" | "rejected",
      ),
    );
  }
  const where = filters.length > 0 ? and(...filters) : undefined;

  const [rows, total] = await Promise.all([
    db
      .select()
      .from(applications)
      .where(where)
      .orderBy(desc(applications.receivedAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(applications)
      .where(where),
  ]);

  const totalCount = total[0]?.n ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const exportHref = (() => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (statusFilter) p.set("status", statusFilter);
    const qs = p.toString();
    return `/api/admin/applications.csv${qs ? `?${qs}` : ""}`;
  })();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Submissions
          </p>
          <h1 className="mt-1 font-serif text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {totalCount} total · page {page} of {totalPages}
          </p>
        </div>
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-medium shadow-soft transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          <Download size={14} />
          Export CSV
        </a>
      </header>

      {/* Filters */}
      <form method="get" className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[14rem]">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Name, email, phone, city…"
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>
        <select
          name="status"
          defaultValue={statusFilter}
          className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Received</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Course</th>
                <th className="px-4 py-3 text-left font-medium">City</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-[var(--color-muted)]"
                  >
                    No applications match the filters.
                  </td>
                </tr>
              ) : (
                rows.map((r: Application) => (
                  <tr
                    key={r.id}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="px-4 py-3 text-[var(--color-muted)] tabular-nums">
                      {r.receivedAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/applications/${r.id}`}
                        className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] hover:underline"
                      >
                        {r.firstName} {r.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-foreground-soft)]">
                      {r.courseSlug}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-foreground-soft)]">
                      {r.city}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-foreground-soft)]">
                      <div className="truncate">{r.email}</div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {r.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-2 text-sm">
          <PagerLink
            to={page - 1}
            disabled={page <= 1}
            query={query}
            status={statusFilter}
          >
            ← Previous
          </PagerLink>
          <p className="text-[var(--color-muted)]">
            Page {page} of {totalPages}
          </p>
          <PagerLink
            to={page + 1}
            disabled={page >= totalPages}
            query={query}
            status={statusFilter}
          >
            Next →
          </PagerLink>
        </nav>
      ) : null}
    </div>
  );
}

function PagerLink({
  to,
  disabled,
  query,
  status,
  children,
}: {
  to: number;
  disabled: boolean;
  query: string;
  status: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[var(--color-muted)]">
        {children}
      </span>
    );
  }
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  if (status) p.set("status", status);
  p.set("page", String(to));
  return (
    <Link
      href={`/admin/applications?${p.toString()}`}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {children}
    </Link>
  );
}
