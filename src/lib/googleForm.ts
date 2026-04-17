import type { ApplyInput } from "./validation";

/**
 * Forward a validated application to a Google Form.
 *
 * Configure via env vars (see GOOGLE_FORM_SETUP.md):
 *   GOOGLE_FORM_ACTION  — the formResponse URL from the Google Form
 *   GOOGLE_FORM_ENTRY_* — one entry ID per field in the ApplyInput schema
 *
 * If GOOGLE_FORM_ACTION is unset we skip silently — useful in development
 * when the Google Form hasn't been created yet.
 */
export async function forwardToGoogleForm(data: ApplyInput): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  const action = process.env.GOOGLE_FORM_ACTION;
  if (!action) return { ok: false, reason: "GOOGLE_FORM_ACTION not set" };

  try {
    const parsed = new URL(action);
    if (parsed.protocol !== "https:") {
      return { ok: false, reason: "GOOGLE_FORM_ACTION must be an HTTPS URL" };
    }
    if (!parsed.hostname.endsWith("google.com")) {
      return { ok: false, reason: "GOOGLE_FORM_ACTION must point to a google.com domain" };
    }
  } catch {
    return { ok: false, reason: "GOOGLE_FORM_ACTION is not a valid URL" };
  }

  const mapping: Record<keyof ApplyInput, string | undefined> = {
    firstName: process.env.GOOGLE_FORM_ENTRY_FIRST_NAME,
    lastName: process.env.GOOGLE_FORM_ENTRY_LAST_NAME,
    email: process.env.GOOGLE_FORM_ENTRY_EMAIL,
    phone: process.env.GOOGLE_FORM_ENTRY_PHONE,
    dateOfBirth: process.env.GOOGLE_FORM_ENTRY_DOB,
    gender: process.env.GOOGLE_FORM_ENTRY_GENDER,
    address: process.env.GOOGLE_FORM_ENTRY_ADDRESS,
    city: process.env.GOOGLE_FORM_ENTRY_CITY,
    state: process.env.GOOGLE_FORM_ENTRY_STATE,
    pincode: process.env.GOOGLE_FORM_ENTRY_PINCODE,
    course: process.env.GOOGLE_FORM_ENTRY_COURSE,
    previousEducation: process.env.GOOGLE_FORM_ENTRY_EDUCATION,
    churchAffiliation: process.env.GOOGLE_FORM_ENTRY_CHURCH,
    pastorReference: process.env.GOOGLE_FORM_ENTRY_PASTOR,
    testimony: process.env.GOOGLE_FORM_ENTRY_TESTIMONY,
    motivation: process.env.GOOGLE_FORM_ENTRY_MOTIVATION,
  };

  const body = new URLSearchParams();
  for (const [field, entry] of Object.entries(mapping) as [keyof ApplyInput, string | undefined][]) {
    if (!entry) continue;
    const value = data[field];
    if (value !== undefined && value !== null && value !== "") {
      body.append(entry, String(value));
    }
  }

  try {
    // Google Forms returns an opaque redirect; any 2xx/3xx means success.
    const res = await fetch(action, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual",
    });

    // 0 + opaqueredirect OR any 2xx/3xx is fine
    if (res.status === 0 || (res.status >= 200 && res.status < 400)) {
      return { ok: true };
    }
    return { ok: false, reason: `Google Form responded with status ${res.status}` };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Unknown network error",
    };
  }
}
