import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getAllGallery } from "@/server/queries";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from Gospel crusades, the Emmaus Institute opening, and ongoing ministry work in Andhra Pradesh, Telangana, and Odisha.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleryItems = await getAllGallery();
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-grain">
        <Container className="py-14 md:py-20">
          <SectionHeading
            eyebrow="Photographs"
            title="From the field and the classroom"
            description="A selection of images from gospel crusades, JGF outreach, and church plants across Andhra Pradesh, Telangana, and Odisha."
          />
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryItems.map((item) => (
              <figure
                key={item.src}
                className="hover-lift group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold-300)]">
                    {item.category}
                  </span>
                  <p className="mt-1 text-sm font-medium text-white">{item.alt}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs leading-snug text-white/80 line-clamp-3">
                      {item.description}
                    </p>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-[var(--color-muted)]">
            More photographs from our ministry work will be added in the next update.
          </p>
        </Container>
      </section>
    </>
  );
}
