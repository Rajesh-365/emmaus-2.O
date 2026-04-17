import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { requireAdmin } from "@/server/session";
import { getDb } from "@/server/db";
import { applications } from "@/server/db/schema";
import { StatusPill } from "../StatusPill";
import { UpdateStatusForm } from "./UpdateStatusForm";
import { updateApplicationStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const applicationId = Number(id);
  if (!Number.isInteger(applicationId) || applicationId < 1) notFound();

  const db = getDb();
  const [app] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!app) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={14} /> All applications
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-500)]">
            Application #{app.id}
          </p>
          <h1 className="mt-1 font-serif text-3xl">
            {app.firstName} {app.lastName}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Received {app.receivedAt.toISOString().replace("T", " ").slice(0, 16)}
          </p>
        </div>
        <StatusPill status={app.status} />
      </header>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Left: details */}
        <div className="space-y-5">
          <Section title="Contact">
            <Field label="Email">
              <a
                href={`mailto:${app.email}`}
                className="inline-flex items-center gap-1.5 text-[var(--color-accent)] hover:underline"
              >
                <Mail size={14} /> {app.email}
              </a>
            </Field>
            <Field label="Phone">
              <a
                href={`tel:${app.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 text-[var(--color-accent)] hover:underline"
              >
                <Phone size={14} /> {app.phone}
              </a>
            </Field>
            <Field label="Date of birth">{app.dateOfBirth}</Field>
            <Field label="Gender" value={app.gender} />
          </Section>

          <Section title="Address">
            <Field label="Address">{app.address}</Field>
            <Field label="City" value={app.city} />
            <Field label="State" value={app.state} />
            <Field label="PIN" value={app.pincode} />
          </Section>

          <Section title="Academic & Church">
            <Field label="Programme" value={app.courseSlug} />
            <Field label="Previous education" value={app.previousEducation} />
            <Field label="Church affiliation" value={app.churchAffiliation} />
            <Field label="Pastor's reference" value={app.pastorReference} />
          </Section>

          <Section title="Testimony">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
              {app.testimony}
            </p>
          </Section>

          <Section title="Motivation">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
              {app.motivation}
            </p>
          </Section>
        </div>

        {/* Right: admin controls */}
        <aside className="space-y-5">
          <Section title="Admin">
            <UpdateStatusForm
              id={app.id}
              currentStatus={app.status}
              currentNotes={app.notes ?? ""}
              action={updateApplicationStatus}
            />
            {app.reviewedAt ? (
              <p className="mt-3 text-xs text-[var(--color-muted)]">
                Last reviewed {app.reviewedAt.toISOString().slice(0, 16).replace("T", " ")}
              </p>
            ) : null}
          </Section>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-soft">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {title}
      </h2>
      <div className="space-y-2 text-sm">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="text-[var(--color-foreground)]">{children ?? value}</dd>
    </div>
  );
}
