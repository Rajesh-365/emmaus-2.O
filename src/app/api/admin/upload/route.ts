import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/server/session";

/**
 * Admin image upload → Vercel Blob.
 *
 * Runs on the Node.js runtime (default) so `requireAdmin()` can read the
 * iron-session cookie. The proxy (/src/proxy.ts) already gates this route
 * behind a session cookie check; `requireAdmin()` here is defence-in-depth.
 *
 * Returns `{ url, pathname }` — the absolute Blob URL is what gets stored
 * in `galleryItems.src`.
 */

const ACCEPTED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Allow-list of Blob key prefixes the admin uploader can write to. Anything
// else is rejected so the `folder` field can't become a path-traversal vector.
const ALLOWED_FOLDERS = new Set(["gallery", "council"]);

export async function POST(request: NextRequest) {
  await requireAdmin();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Upload is not configured. Set BLOB_READ_WRITE_TOKEN in your environment (Vercel Dashboard → Storage → Blob).",
      },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const folderRaw = form.get("folder");
  const folder = typeof folderRaw === "string" && ALLOWED_FOLDERS.has(folderRaw)
    ? folderRaw
    : "gallery";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ACCEPTED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}` },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 413 },
    );
  }

  // Preserve extension for a nice URL tail. `addRandomSuffix` makes the key
  // unique so two uploads of `photo.jpg` don't collide.
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const pathname = `${folder}/${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
