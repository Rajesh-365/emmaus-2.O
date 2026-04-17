import Image from "next/image";

/**
 * Root loading screen — a 3D extruded Emmaus Institute logo rotating on its
 * Y-axis. Multiple logo layers at incremental translateZ values stack up
 * into a real slab of depth, so you can see the sides of the logo as it
 * spins. No disc, no halo, just the logo itself.
 */

// 14 layers of the logo, each separated by 1.4 px on the Z axis — enough
// thickness to read as a solid slab without the front/back layers looking
// blurred.
const LAYER_COUNT = 14;

export default function Loading() {
  const mid = (LAYER_COUNT - 1) / 2;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-[var(--color-page)] dark:bg-[#080d1c]">
      {/* 3D logo */}
      <div
        className="relative"
        style={{ perspective: "1400px" }}
        aria-hidden
      >
        <div className="animate-logo-3d-spin relative h-44 w-44 sm:h-52 sm:w-52">
          {Array.from({ length: LAYER_COUNT }).map((_, i) => {
            const z = (i - mid) * 1.4;
            const isEdgeLayer = i === 0 || i === LAYER_COUNT - 1;
            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  transform: `translateZ(${z}px)`,
                  // Slight filter on the extreme cap layers gives the
                  // extrusion subtle depth shading without darkening the
                  // body.
                  filter: isEdgeLayer
                    ? "brightness(0.92) contrast(1.05)"
                    : "none",
                }}
              >
                <Image
                  src="/logos/eit.png"
                  alt=""
                  fill
                  priority={i === Math.floor(mid)}
                  sizes="(min-width:640px) 208px, 176px"
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>

        {/* Grounded floor shadow — sits under the rotating logo and pulses
            subtly so the logo feels planted in space. */}
        <div
          className="mx-auto mt-8 h-3 w-32 rounded-full bg-black/25 blur-md dark:bg-black/55 sm:w-40"
          aria-hidden
        />
      </div>

      {/* Label */}
      <div className="relative flex flex-col items-center gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--color-gold-500)]">
          Emmaus Institute
        </p>
        <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-foreground-soft)]">
          <span>Loading</span>
          <span className="flex gap-0.5">
            <span
              className="animate-dot-bounce h-1 w-1 rounded-full bg-[var(--color-gold-500)]"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="animate-dot-bounce h-1 w-1 rounded-full bg-[var(--color-gold-500)]"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="animate-dot-bounce h-1 w-1 rounded-full bg-[var(--color-gold-500)]"
              style={{ animationDelay: "300ms" }}
            />
          </span>
        </div>
      </div>

      <span role="status" className="sr-only">
        Loading Emmaus Institute of Theology
      </span>
    </div>
  );
}
