import Image from "next/image";
import { Container } from "./Container";
import { site } from "@/lib/site";

export function TopBrandBar() {
  return (
    <div className="border-b border-[var(--color-border)] bg-gradient-brand-soft">
      <Container className="flex items-center justify-center gap-x-5 py-2 sm:gap-x-10">
        {site.brands.map((b, i) => (
          <div key={b.name} className="flex items-center gap-3">
            {i > 0 ? (
              <span aria-hidden className="hidden h-4 w-px bg-[var(--color-border)] sm:inline-block" />
            ) : null}
            <Image
              src={b.src}
              alt={b.alt}
              width={80}
              height={24}
              className="h-5 w-auto object-contain sm:h-6"
              priority
            />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-foreground)] sm:inline sm:text-xs">
              {b.name}
            </span>
          </div>
        ))}
      </Container>
    </div>
  );
}
