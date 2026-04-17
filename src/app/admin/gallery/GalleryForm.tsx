"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import type { GalleryItem } from "@/server/db/schema";
import { Field } from "../_shared/Field";
import { ImageUploader } from "../_shared/ImageUploader";
import { cancelBtn, errorBox, input, submitBtn, textarea } from "../_shared/formStyles";

type Props = {
  initial?: GalleryItem;
  action: (fd: FormData) => Promise<void>;
};

export function GalleryForm({ initial, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [src, setSrc] = useState<string>(initial?.src ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!src) {
      setError("Please upload an image first.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    fd.set("src", src);
    startTransition(async () => {
      try {
        await action(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Image" hint="drag & drop or click to browse">
        <ImageUploader value={src} onChange={setSrc} folder="gallery" />
      </Field>

      <Field label="Alt text" hint="describe the image for screen readers">
        <input name="alt" required defaultValue={initial?.alt} className={input} />
      </Field>

      <Field label="Description" hint="optional — shown on hover on the public gallery">
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={textarea}
          maxLength={500}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            name="category"
            defaultValue={initial?.category ?? "Gospel Crusades"}
            className={input}
          >
            <option value="Gospel Crusades">Gospel Crusades</option>
            <option value="JGF Activities">JGF Activities</option>
            <option value="Churches">Churches</option>
          </select>
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            name="sortOrder"
            min={0}
            defaultValue={initial?.sortOrder ?? 0}
            className={input}
          />
        </Field>
      </div>

      {error ? (
        <p role="alert" className={errorBox}>
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={submitBtn}>
          {pending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Upload size={14} /> Save item
            </>
          )}
        </button>
        <Link href="/admin/gallery" className={cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
