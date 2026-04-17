"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { errorBox } from "./formStyles";

/**
 * Drag-and-drop image uploader for admin forms.
 *
 * Uploads go to `/api/admin/upload` which puts them on Vercel Blob and
 * returns a public URL. The URL becomes the controlled `value` and is
 * propagated to the parent via `onChange` — the parent decides how to
 * submit it (hidden input, Server Action, etc.).
 *
 * `folder` picks the Blob key prefix (gallery/ or council/) and is
 * server-validated in the upload route, so new callers must also be
 * added to the API route's allow-list.
 */

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder: "gallery" | "council";
  /** Rendered hint under the drop zone. */
  helpText?: string;
};

export function ImageUploader({
  value,
  onChange,
  folder,
  helpText = "JPG, PNG, WebP, AVIF — up to 10 MB",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFile(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? `Upload failed (${res.status})`);
      }
      onChange(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div>
      {value ? (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 sm:flex-row sm:items-center">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[var(--color-surface)] sm:h-28 sm:w-48 sm:flex-none">
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="(min-width: 640px) 192px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="truncate text-xs text-[var(--color-muted)]" title={value}>
              {value}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-xs font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-xs font-medium text-red-600 hover:border-red-500 disabled:opacity-60 dark:text-red-400"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFiles(e.dataTransfer.files);
          }}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
              : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
          }`}
        >
          {uploading ? (
            <Loader2 size={28} className="animate-spin text-[var(--color-accent)]" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <ImagePlus size={22} />
            </span>
          )}
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {uploading ? "Uploading…" : "Drop an image here or click to browse"}
          </p>
          <p className="text-xs text-[var(--color-muted)]">{helpText}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      {uploadError ? (
        <p role="alert" className={errorBox + " mt-2"}>
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}
