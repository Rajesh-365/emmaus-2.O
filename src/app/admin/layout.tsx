import type { Metadata } from "next";
import { getSession } from "@/server/session";
import { AdminShell } from "./AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Unauthenticated — login page renders without the dashboard shell.
  if (!session.isAdmin) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
