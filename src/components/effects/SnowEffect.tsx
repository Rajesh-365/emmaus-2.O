/**
 * CSS-only snowfall. Only rendered in dark mode (wrapped in `hidden dark:block`).
 * Flakes are precomputed with a deterministic pseudo-random formula so server
 * and client render the same markup — no hydration mismatch.
 */
const FLAKE_COUNT = 60;

// Tiny deterministic pseudo-random so every flake is different but stable.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type Flake = {
  left: number;     // 0..100 (vw %)
  size: number;     // px
  duration: number; // s
  delay: number;    // s (negative start so animation begins already in-flight)
  drift: number;    // px horizontal drift at end
  opacity: number;  // 0..1
  blur: number;     // px — a little depth
};

const flakes: Flake[] = Array.from({ length: FLAKE_COUNT }, (_, i) => {
  const r1 = rand(i + 1);
  const r2 = rand(i + 101);
  const r3 = rand(i + 201);
  const r4 = rand(i + 301);
  const r5 = rand(i + 401);
  return {
    left: r1 * 100,
    size: 2 + r2 * 4,              // 2 – 6 px
    duration: 12 + r3 * 14,        // 12 – 26 s
    delay: -(r4 * 20),             // stagger so some are already falling
    drift: -60 + r5 * 120,         // -60 … +60 px
    opacity: 0.45 + rand(i + 501) * 0.5, // 0.45 – 0.95
    blur: rand(i + 601) < 0.35 ? 1 : 0,  // ~35 % of flakes slightly blurred
  };
});

export function SnowEffect() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: f.opacity,
            filter: f.blur ? `blur(${f.blur}px)` : undefined,
            // passed through to the keyframes for horizontal drift
            // (CSS vars work in inline style on non-typed SVG too)
            ["--drift" as string]: `${f.drift}px`,
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.55)",
          }}
        />
      ))}
    </div>
  );
}
