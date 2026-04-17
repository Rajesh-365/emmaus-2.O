import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { getDb } from "@/server/db";
import { applications } from "@/server/db/schema";
import { getSession } from "@/server/session";

export const runtime = "nodejs";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "string" ? value : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const HEADERS = [
  "id",
  "received_at",
  "first_name",
  "last_name",
  "email",
  "phone",
  "date_of_birth",
  "gender",
  "address",
  "city",
  "state",
  "pincode",
  "course",
  "previous_education",
  "church_affiliation",
  "pastor_reference",
  "testimony",
  "motivation",
  "status",
  "notes",
  "reviewed_at",
] as const;

export async function GET(request: Request) {
  const session = await getSession();
  if (!session.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status") ?? "";

  const filters: SQL[] = [];
  if (q) {
    filters.push(
      or(
        ilike(applications.firstName, `%${q}%`),
        ilike(applications.lastName, `%${q}%`),
        ilike(applications.email, `%${q}%`),
        ilike(applications.phone, `%${q}%`),
        ilike(applications.city, `%${q}%`),
      )!,
    );
  }
  if (["pending", "reviewed", "accepted", "rejected"].includes(status)) {
    filters.push(
      eq(
        applications.status,
        status as "pending" | "reviewed" | "accepted" | "rejected",
      ),
    );
  }
  const where = filters.length > 0 ? and(...filters) : undefined;

  const db = getDb();
  const rows = await db
    .select()
    .from(applications)
    .where(where)
    .orderBy(desc(applications.receivedAt));

  const lines: string[] = [];
  lines.push(HEADERS.join(","));
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.receivedAt.toISOString(),
        r.firstName,
        r.lastName,
        r.email,
        r.phone,
        r.dateOfBirth,
        r.gender,
        r.address,
        r.city,
        r.state,
        r.pincode,
        r.courseSlug,
        r.previousEducation,
        r.churchAffiliation,
        r.pastorReference,
        r.testimony,
        r.motivation,
        r.status,
        r.notes ?? "",
        r.reviewedAt?.toISOString() ?? "",
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  const filename = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
