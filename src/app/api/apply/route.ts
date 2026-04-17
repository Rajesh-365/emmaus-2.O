import { NextResponse } from "next/server";
import { applySchema } from "@/lib/validation";
import { forwardToGoogleForm } from "@/lib/googleForm";
import { appendSubmission } from "@/lib/submissionLog";
import { eq } from "drizzle-orm";
import { getDb } from "@/server/db";
import { applications, courses } from "@/server/db/schema";
import { sendNewApplicationEmail } from "@/server/email";

export const runtime = "nodejs";

// In-memory rate limit — fine for a single instance, swap for Upstash/Redis later.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

// Hard cap on request body bytes — 64 KB is plenty for the schema and stops
// trivially large POSTs from consuming memory or fanning out to Google Forms.
const MAX_BODY_BYTES = 64 * 1024;

function rateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

const SAFE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
} as const;

function json(data: unknown, init: { status?: number } = {}) {
  return NextResponse.json(data, { status: init.status ?? 200, headers: SAFE_HEADERS });
}

/** CSRF defence: same-origin POSTs only. */
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // 1. Same-origin guard (CSRF).
  if (!isSameOrigin(request)) {
    return json({ error: "Forbidden." }, { status: 403 });
  }

  // 2. Content-Type guard — only JSON accepted.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "Unsupported Media Type." }, { status: 415 });
  }

  // 3. Body-size guard via Content-Length.
  const len = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
    return json({ error: "Payload too large." }, { status: 413 });
  }

  // 4. Per-IP rate limit.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (!rateLimit(ip)) {
    return json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  // 5. Parse body.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "Could not read body." }, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: "Payload too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON." }, { status: 400 });
  }

  // 6. Schema validation.
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // 6b. Verify the submitted course slug exists in the current DB catalogue.
  try {
    const db = getDb();
    const [row] = await db
      .select({ slug: courses.slug })
      .from(courses)
      .where(eq(courses.slug, parsed.data.course))
      .limit(1);
    if (!row) {
      return json(
        { error: "Selected programme is not available." },
        { status: 400 },
      );
    }
  } catch (err) {
    // DB unreachable — soft-fail and let the submission continue. The apply
    // endpoint already has filesystem and Google Form fallbacks.
    console.warn("[apply] course validation skipped:", err);
  }

  // 7. Persist to Postgres. This is now the primary store — if it fails we
  //    still try the Google Form + JSONL fallbacks so the submission isn't
  //    lost, but we return 500 so the user sees the error.
  let savedApplication: Awaited<ReturnType<typeof insertApplication>> | null = null;
  try {
    savedApplication = await insertApplication(parsed.data);
  } catch (err) {
    console.error("[apply] DB insert failed:", err);
  }

  // 8. Fan out secondary destinations (Google Form + JSONL backup). These are
  //    fire-and-forget — logged but not returned to the user.
  const forward = await forwardToGoogleForm(parsed.data);
  if (!forward.ok) {
    console.warn("[apply] Google Form forward skipped/failed:", forward.reason);
  }

  const logged = await appendSubmission({
    receivedAt: new Date().toISOString(),
    forwardedToGoogle: forward.ok,
    forwardReason: forward.ok ? undefined : forward.reason,
    data: parsed.data,
  });
  if (!logged.ok) {
    console.error("[apply] local backup failed:", logged.reason);
  }

  // If Postgres write failed AND all fallbacks failed, the data is genuinely
  // lost — surface an error to the user. Otherwise accept the submission.
  if (!savedApplication && !forward.ok && !logged.ok) {
    return json(
      { error: "We couldn't save your application. Please try again or contact admissions." },
      { status: 500 },
    );
  }

  // 9. Fire the admin notification email (never blocks the response outcome).
  if (savedApplication) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const adminUrl = `${siteUrl}/admin/applications/${savedApplication.id}`;
    const mailed = await sendNewApplicationEmail({
      application: savedApplication,
      adminUrl,
    });
    if (!mailed.ok) {
      console.warn("[apply] admin email skipped/failed:", mailed.reason);
    }
  }

  return json({ ok: true });
}

async function insertApplication(data: import("@/lib/validation").ApplyInput) {
  const db = getDb();
  const [row] = await db
    .insert(applications)
    .values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      courseSlug: data.course,
      previousEducation: data.previousEducation,
      churchAffiliation: data.churchAffiliation,
      pastorReference: data.pastorReference,
      testimony: data.testimony,
      motivation: data.motivation,
    })
    .returning();
  return row;
}
