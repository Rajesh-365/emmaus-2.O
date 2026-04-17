import { Resend } from "resend";
import type { Application } from "./db/schema";

/**
 * Send a plain-HTML notification to admissions when a new application
 * arrives. Fails soft — returns { ok: false, reason } so the caller can log
 * it without blocking the submission response to the applicant.
 */

let _client: Resend | undefined;
function client(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  _client = new Resend(key);
  return _client;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | number | null | undefined): string {
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e6e2d5;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e6e2d5;color:#0f172a;font-size:14px;">${value == null || value === "" ? "—" : escapeHtml(String(value))}</td>
  </tr>`;
}

export type NewApplicationEmailArgs = {
  application: Application;
  adminUrl: string;
};

export async function sendNewApplicationEmail(
  args: NewApplicationEmailArgs,
): Promise<{ ok: true; id: string } | { ok: false; reason: string }> {
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!to) return { ok: false, reason: "ADMIN_EMAIL not set" };
  if (!from) return { ok: false, reason: "RESEND_FROM_EMAIL not set" };

  const a = args.application;
  const fullName = `${a.firstName} ${a.lastName}`;
  const subject = `New application — ${fullName} (${a.courseSlug})`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#fafaf7;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e2d5;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#2563eb,#7e22ce);padding:24px;color:#ffffff;">
      <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;opacity:0.85;">Emmaus Institute · Admissions</p>
      <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;">New application received</h1>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 16px;color:#0f172a;font-size:15px;line-height:1.5;">
        <strong>${escapeHtml(fullName)}</strong> applied for <strong>${escapeHtml(a.courseSlug)}</strong>.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e6e2d5;border-radius:10px;overflow:hidden;">
        ${row("Email", a.email)}
        ${row("Phone", a.phone)}
        ${row("Date of birth", a.dateOfBirth)}
        ${row("Gender", a.gender)}
        ${row("City / State", `${a.city}, ${a.state} — ${a.pincode}`)}
        ${row("Address", a.address)}
        ${row("Programme", a.courseSlug)}
        ${row("Previous education", a.previousEducation)}
        ${row("Church", a.churchAffiliation)}
        ${row("Pastor's reference", a.pastorReference)}
        ${row("Testimony", a.testimony)}
        ${row("Motivation", a.motivation)}
      </table>
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${escapeHtml(args.adminUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;">View in admin panel</a>
      </p>
      <p style="margin:20px 0 0;color:#64748b;font-size:12px;text-align:center;">
        Submission #${a.id} · received ${a.receivedAt.toISOString()}
      </p>
    </div>
  </div>
</body></html>`;

  try {
    const { data, error } = await client().emails.send({
      from,
      to: [to],
      subject,
      html,
      replyTo: a.email,
    });
    if (error) return { ok: false, reason: error.message ?? "Resend error" };
    return { ok: true, id: data?.id ?? "unknown" };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}
