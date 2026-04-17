"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import type { CouncilMember } from "@/server/db/schema";
import { Field } from "../_shared/Field";
import { ImageUploader } from "../_shared/ImageUploader";
import { cancelBtn, errorBox, input, submitBtn } from "../_shared/formStyles";

type Props = {
  initial?: CouncilMember;
  action: (fd: FormData) => Promise<void>;
};

export function CouncilForm({ initial, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string>(initial?.image ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("image", image);
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
      <Field label="Photo" hint="optional — drag & drop or click to browse">
        <ImageUploader
          value={image}
          onChange={setImage}
          folder="council"
          helpText="Portrait photos work best · JPG, PNG, WebP, AVIF — up to 10 MB"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required defaultValue={initial?.name} className={input} />
        </Field>
        <Field label="Role">
          <input name="role" required defaultValue={initial?.role} className={input} />
        </Field>
        <Field label="Phone">
          <input name="phone" required defaultValue={initial?.phone} className={input} />
        </Field>
        <Field label="WhatsApp" hint="optional">
          <input name="whatsapp" defaultValue={initial?.whatsapp ?? ""} className={input} />
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

      {error ? <p role="alert" className={errorBox}>{error}</p> : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={submitBtn}>
          {pending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Upload size={14} /> Save member
            </>
          )}
        </button>
        <Link href="/admin/council" className={cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
