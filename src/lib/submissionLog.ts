import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { ApplyInput } from "./validation";

/**
 * Append an application submission to a local JSONL log file.
 *
 * This runs alongside the Google Form forward as an always-on backup — so
 * submissions are never lost even if the Google Form is unconfigured, the
 * upstream is unreachable, or a field ID is wrong. The file lives outside
 * /public (not web-accessible) and is gitignored.
 *
 * Caveat: on serverless hosts (Vercel, Netlify) the filesystem is ephemeral
 * and this log won't survive cold starts — deploy to a traditional server
 * or VM if you rely on this as a primary store.
 */

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "submissions.jsonl");

type LogEntry = {
  receivedAt: string;
  forwardedToGoogle: boolean;
  forwardReason?: string;
  data: ApplyInput;
};

export async function appendSubmission(
  entry: LogEntry,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Unknown filesystem error",
    };
  }
}
