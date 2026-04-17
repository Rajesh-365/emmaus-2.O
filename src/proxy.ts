import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/server/session";

/**
 * Next.js 16 proxy (renamed from middleware). Runs on the Node.js runtime
 * and gates /admin/* routes by checking for the presence of the encrypted
 * session cookie. Each admin page additionally re-validates the cookie
 * server-side via getSession() — the proxy is a cheap first pass.
 */

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page and its POST endpoint through unauthenticated.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get(SESSION_COOKIE_NAME);
  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
