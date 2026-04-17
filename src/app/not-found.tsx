import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60dvh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-[var(--color-muted)]">
        The page you were looking for may have moved or never existed. Let us help you find your way back.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/" size="md">Back to home</Button>
        <Button href="/courses" variant="secondary" size="md">View programmes</Button>
      </div>
      <p className="mt-12 text-xs text-[var(--color-muted)]">
        <Link href="/contact" className="underline">Contact us</Link> if you believe this is a broken link.
      </p>
    </Container>
  );
}
