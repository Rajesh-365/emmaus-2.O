import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

/**
 * Single-admin session. We store only a boolean flag + login timestamp in
 * the encrypted cookie — no user identity needed since there's exactly one
 * admissions login.
 */

export type AdminSession = {
  isAdmin?: true;
  loggedInAt?: number;
};

export const SESSION_COOKIE_NAME = "emmaus_admin_session";

function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set and at least 32 characters long.",
    );
  }
  return {
    password,
    cookieName: SESSION_COOKIE_NAME,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // 12 hours — admin has to log back in each work day.
      maxAge: 60 * 60 * 12,
    },
  };
}

/**
 * Reads the session from the request cookies. Use inside Server Components,
 * Server Actions, and Route Handlers (all are Next.js 16 "async cookies"
 * contexts, so we `await cookies()`).
 */
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions());
}

/** Hard guard — throws if not authenticated. Use in server contexts. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) {
    throw new Error("Unauthorized");
  }
  return session;
}
