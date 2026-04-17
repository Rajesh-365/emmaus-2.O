import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Lazy DB singleton. We construct the client on first use so that module
 * imports never fail at build time if DATABASE_URL is not yet set (e.g. the
 * Vercel build step for a preview deploy without env vars wired up).
 *
 * The Neon HTTP driver is stateless — one connection per query, no pool —
 * which is exactly what Vercel serverless functions want.
 */

let _db: NeonHttpDatabase<typeof schema> | undefined;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  _db = drizzle(neon(url), { schema });
  return _db;
}

export { schema };
