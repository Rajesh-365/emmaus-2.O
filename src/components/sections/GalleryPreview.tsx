import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { Ornament } from "./Ornament";
import type { GalleryItem } from "@/server/db/schema";

const PREVIEW_COUNT = 5;

export function GalleryPreview({ items }: { items: GalleryItem[] }) {
  const preview = items.slice(0, PREVIEW_COUNT);

  return (
    <section className="bg-section-cream py-16 md:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="V · From the field"
            title="Moments from the ministry"
            description="A glimpse into Gospel crusades, church plants, and the work of John Gospel Fellowship across Andhra Pradesh, Telangana, and Odisha."
          />
          <Link
            href="/gallery"
            className="hover-lift inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-5 py-2.5 text-sm font-medium shadow-soft hover:border-[var(--color-accent)]"
          >
            <Camera size={14} />
            View full gallery
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <Ornament className="mt-8" />

        {/* Editorial mosaic — first tile spans 2 columns × 2 rows on md+,
            the rest fill the remaining slots in a 4-column 2-row grid. */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
          {preview.map((item, i) => (
            <Link
              key={item.src}
              href="/gallery"
              aria-label={`Open gallery — ${item.alt}`}
              className={`hover-lift group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft ${
                i === 0
                  ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto"
                  : "aspect-[4/3]"
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={
                  i === 0
                    ? "(min-width: 768px) 50vw, 100vw"
                    : "(min-width: 768px) 25vw, 50vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                priority={i === 0}
              />
              {/* Bottom gradient + caption */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-opacity"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold-300)]">
                  {item.category}
                </span>
                <p className={`mt-1 font-serif leading-snug text-white ${i === 0 ? "text-xl md:text-2xl" : "text-sm"}`}>
                  {item.alt}
                </p>
              </div>
              {/* Top-right hover badge */}
              <span className="absolute right-3 top-3 inline-flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full bg-white/90 text-[var(--color-foreground)] opacity-0 shadow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
