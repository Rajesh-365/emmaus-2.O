"use client";

import { useState, type ComponentType } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Loader2,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { applySchema } from "@/lib/validation";
import type { Course } from "@/server/db/schema";
import { cn } from "@/lib/cn";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  course: "",
  previousEducation: "",
  churchAffiliation: "",
  pastorReference: "",
  testimony: "",
  motivation: "",
};

type FieldKey = keyof typeof initialValues;
type FieldErrors = Partial<Record<FieldKey, string>>;

const educationLevels: { value: string; label: string }[] = [
  { value: "10th", label: "10th Standard" },
  { value: "12th", label: "12th Standard" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "other", label: "Other" },
];

type StepDef = {
  title: string;
  shortTitle: string;
  description: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  fields: readonly FieldKey[];
};

const steps: readonly StepDef[] = [
  {
    title: "Personal information",
    shortTitle: "Personal",
    description: "Tell us who you are — we'll use these details to contact you.",
    Icon: User,
    fields: ["firstName", "lastName", "email", "phone", "dateOfBirth", "gender"],
  },
  {
    title: "Address",
    shortTitle: "Address",
    description: "Where you live. Used for correspondence and student records.",
    Icon: MapPin,
    fields: ["address", "city", "state", "pincode"],
  },
  {
    title: "Academic & church",
    shortTitle: "Academic",
    description: "Your programme choice, prior education, and pastoral reference.",
    Icon: GraduationCap,
    fields: ["course", "previousEducation", "churchAffiliation", "pastorReference"],
  },
  {
    title: "Personal statement",
    shortTitle: "Statement",
    description: "Share your testimony and motivation for ministry in your own words.",
    Icon: Heart,
    fields: ["testimony", "motivation"],
  },
] as const;

// Per-step Zod schemas — enforce completion before the next step appears.
const stepSchemas = [
  applySchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    dateOfBirth: true,
    gender: true,
  }),
  applySchema.pick({ address: true, city: true, state: true, pincode: true }),
  applySchema.pick({
    course: true,
    previousEducation: true,
    churchAffiliation: true,
    pastorReference: true,
  }),
  applySchema.pick({ testimony: true, motivation: true }),
] as const;

export function ApplyForm({
  courses,
  defaultCourse,
}: {
  courses: Course[];
  defaultCourse?: string;
}) {
  const [values, setValues] = useState({
    ...initialValues,
    course: defaultCourse ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  function update<K extends FieldKey>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep(stepIndex: number): boolean {
    const fields = steps[stepIndex].fields;
    const subset = Object.fromEntries(fields.map((f) => [f, values[f]]));
    const parsed = stepSchemas[stepIndex].safeParse(subset);
    if (parsed.success) return true;
    const newErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldKey;
      newErrors[key] = issue.message;
    }
    setErrors((e) => ({ ...e, ...newErrors }));
    return false;
  }

  function goNext() {
    if (!validateStep(currentStep)) return;
    const next = Math.min(currentStep + 1, steps.length - 1);
    setMaxReached((m) => Math.max(m, next));
    setCurrentStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  function goToStep(i: number) {
    if (i <= maxReached) setCurrentStep(i);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validateStep(currentStep)) return;
    const parsed = applySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldKey;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      const firstBad = steps.findIndex((s) => s.fields.some((f) => fieldErrors[f]));
      if (firstBad >= 0) setCurrentStep(firstBad);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-12 text-center shadow-soft">
        <CheckCircle2 size={44} className="mx-auto text-[var(--color-accent)]" />
        <h2 className="mt-6 font-serif text-3xl">Application received</h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Thank you. The admissions team will review your application and respond within a few working days.
        </p>
      </div>
    );
  }

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const percent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div>
      {/* Progress stepper */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-soft md:p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-500)]">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p className="text-xs font-medium text-[var(--color-muted)]">{percent}% complete</p>
        </div>

        <div className="relative h-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-brand transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ol className="mt-4 grid grid-cols-4 gap-1">
          {steps.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const clickable = i <= maxReached;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => goToStep(i)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex w-full flex-col items-center gap-1.5 rounded-md px-1 py-1 text-center transition-colors",
                    clickable
                      ? "cursor-pointer hover:bg-[var(--color-surface)]"
                      : "cursor-not-allowed opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                      done && "border-[var(--color-accent)] bg-[var(--color-accent)] text-white",
                      active &&
                        "border-[var(--color-accent)] bg-[var(--color-background)] text-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/15",
                      !done && !active &&
                        "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)]",
                    )}
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden truncate text-[11px] font-medium sm:block",
                      active
                        ? "text-[var(--color-foreground)]"
                        : done
                          ? "text-[var(--color-foreground-soft)]"
                          : "text-[var(--color-muted)]",
                    )}
                  >
                    {s.shortTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-soft md:p-8">
          <div className="flex items-start gap-4 border-b border-[var(--color-border)] pb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-[var(--color-accent)] ring-1 ring-[var(--color-border)]">
              <step.Icon size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-xl md:text-2xl">{step.title}</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{step.description}</p>
            </div>
          </div>

          <div key={currentStep} className="animate-step-enter pt-6">
            {currentStep === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName}>
                  <input className={inputClass} value={values.firstName} onChange={(e) => update("firstName", e.target.value)} autoComplete="given-name" />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input className={inputClass} value={values.lastName} onChange={(e) => update("lastName", e.target.value)} autoComplete="family-name" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" className={inputClass} value={values.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input type="tel" className={inputClass} value={values.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" />
                </Field>
                <Field label="Date of birth" error={errors.dateOfBirth}>
                  <input type="date" className={inputClass} value={values.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} autoComplete="bday" />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <select className={inputClass} value={values.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <Field label="Full address" error={errors.address}>
                  <textarea rows={3} className={inputClass} value={values.address} onChange={(e) => update("address", e.target.value)} autoComplete="street-address" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" error={errors.city}>
                    <input className={inputClass} value={values.city} onChange={(e) => update("city", e.target.value)} autoComplete="address-level2" />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <input className={inputClass} value={values.state} onChange={(e) => update("state", e.target.value)} autoComplete="address-level1" />
                  </Field>
                  <Field label="PIN code" error={errors.pincode}>
                    <input inputMode="numeric" className={inputClass} value={values.pincode} onChange={(e) => update("pincode", e.target.value)} autoComplete="postal-code" />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Programme" error={errors.course}>
                  <select className={inputClass} value={values.course} onChange={(e) => update("course", e.target.value)}>
                    <option value="">Select a programme</option>
                    {courses.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Previous education" error={errors.previousEducation}>
                  <select className={inputClass} value={values.previousEducation} onChange={(e) => update("previousEducation", e.target.value)}>
                    <option value="">Select</option>
                    {educationLevels.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Church affiliation" error={errors.churchAffiliation}>
                  <input className={inputClass} value={values.churchAffiliation} onChange={(e) => update("churchAffiliation", e.target.value)} />
                </Field>
                <Field label="Pastor's reference" error={errors.pastorReference}>
                  <input className={inputClass} value={values.pastorReference} onChange={(e) => update("pastorReference", e.target.value)} placeholder="Name · phone · email" />
                </Field>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Field label="Testimony of faith" hint="At least a few sentences" error={errors.testimony}>
                  <textarea rows={5} className={inputClass} value={values.testimony} onChange={(e) => update("testimony", e.target.value)} />
                </Field>
                <Field label="Motivation for ministry" hint="At least a few sentences" error={errors.motivation}>
                  <textarea rows={5} className={inputClass} value={values.motivation} onChange={(e) => update("motivation", e.target.value)} />
                </Field>
              </div>
            )}
          </div>
        </div>

        {serverError ? (
          <p
            className="mt-5 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300"
            role="alert"
          >
            {serverError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {isLast ? (
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting…
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(37,99,235,0.7)]"
            >
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-[var(--color-foreground)]">{label}</span>
        {hint ? <span className="text-[11px] text-[var(--color-muted)]">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </label>
  );
}
