import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-[var(--color-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
      <div
        aria-hidden
        className={cn(
          "mt-6 h-[3px] w-16 rounded-full bg-gradient-brand",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
