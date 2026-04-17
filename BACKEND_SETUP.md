# Backend & database setup

This project now runs on Postgres (Neon) via Drizzle ORM, with an admin panel at `/admin` and email notifications via Resend. Follow these steps to bring it online.

---

## 1. Create a Neon database (5 min)

1. Sign up at <https://neon.tech> (free tier is fine).
2. Create a project called `emmaus`.
3. In the project dashboard, open the **Connection Details** panel.
4. Pick the **Pooled connection** option and copy the full `postgresql://…` URL — this is `DATABASE_URL`.

> **Why Neon?** It's serverless-native, matches Vercel's deployment model, and the HTTP driver we use has zero cold-start cost.

## 2. Create a Resend account (3 min)

1. Sign up at <https://resend.com> (free tier: 100 emails/day).
2. Create an API key → paste into `RESEND_API_KEY`.
3. For testing, `RESEND_FROM_EMAIL` can be `onboarding@resend.dev`. For production, verify your own domain in Resend and use something like `admissions@emmausinst.com`.

## 3. Set up local env vars

Copy `.env.example` to `.env.local` and fill in:

```bash
DATABASE_URL=postgresql://...              # from Neon
SESSION_SECRET=<64-char hex>               # see below
ADMIN_PASSWORD_HASH=<bcrypt hash>          # see below
RESEND_API_KEY=re_...                      # from Resend
RESEND_FROM_EMAIL=onboarding@resend.dev    # or your verified sender
ADMIN_EMAIL=eit.jgf2018@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Generate `SESSION_SECRET`
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate `ADMIN_PASSWORD_HASH`
```bash
npm run admin:hash-password -- "your-strong-password-here"
```
Copy the output line (`ADMIN_PASSWORD_HASH="..."`) into `.env.local`.

> Password must be at least 12 characters. Pick something long and memorable.

## 4. Push the schema to Neon

```bash
npm run db:push
```

This creates all 7 tables in your Neon database from the Drizzle schema. Re-run it anytime you change `src/server/db/schema.ts`.

Alternative for production deploys: `npm run db:generate` → commit the SQL in `drizzle/` → `npm run db:migrate` on each deploy.

## 5. Seed the initial data

```bash
npm run db:seed
```

This copies the seed content (4 courses, 3 churches, 4 council members, 9 gallery items, 37 student results) from `src/server/db/seed-data/` into the database. Idempotent — safe to re-run.

## 6. Start the dev server

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin> → redirects to login
- Log in with the password you hashed in step 3.

Submit a test application at `/apply` and confirm:
- A row appears in the `applications` table (`npm run db:studio` to view).
- An email arrives at `eit.jgf2018@gmail.com`.
- The submission appears in `/admin/applications`.

## 7. Enable image uploads (Vercel Blob)

The admin `/admin/gallery` form uploads images straight from your computer via `@vercel/blob` — required because Vercel's production filesystem is read-only.

1. In Vercel Dashboard, open the project → **Storage** tab → **Create Database** → **Blob**. Name it `emmaus-media` (or anything).
2. After creation, open the **Quickstart** / **`.env.local`** tab on the Blob store and copy `BLOB_READ_WRITE_TOKEN`.
3. Paste it into your local `.env.local`:

   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

4. Add the same variable under the project's **Environment Variables** in Vercel so production works too.

> Free tier: **1 GB storage + 10 GB bandwidth/month** — plenty for a church-media gallery.

Once set, `/admin/gallery/new` accepts drag-and-drop uploads; the Blob URL is saved directly into `gallery_items.src` and served through `next/image`.

## 8. Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Under **Environment Variables**, add every variable from step 3 **and** `BLOB_READ_WRITE_TOKEN` from step 7 (set `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy.
5. Run `npm run db:push` locally against the same Neon database (or add a `postinstall` hook — for now a one-time run is fine).

---

## What's where

| Area | Path |
|---|---|
| DB schema | `src/server/db/schema.ts` |
| DB connection | `src/server/db/index.ts` |
| Read queries | `src/server/queries.ts` |
| Seed script + data | `src/server/db/seed.ts`, `src/server/db/seed-data/` |
| Email notifications | `src/server/email.ts` |
| Admin auth | `src/server/session.ts`, `src/proxy.ts` |
| Admin UI | `src/app/admin/**` |
| Apply API | `src/app/api/apply/route.ts` |
| Password hash tool | `src/server/scripts/hash-password.ts` |

## Everyday admin tasks

- **View applications**: `/admin/applications` — filter, paginate, export CSV.
- **Review an application**: click through → change status (pending / reviewed / accepted / rejected) and add internal notes.
- **Add/edit courses, churches, council, gallery, results**: each has its own section with full CRUD.
- **Add a new academic year's results**: go to `/admin/results` → click **Add programme** → then **New result** for each student.

## Fallback behaviour

If the DB is unreachable at apply time, the API endpoint still:
1. Tries the Google Form forward (if configured)
2. Appends to `data/submissions.jsonl` as a filesystem backup

On Vercel the filesystem is ephemeral, so the Google Form + Neon are your real durability. Keep the Google Form configured as a belt-and-braces backup if you want.

## Changing the admin password

Run `npm run admin:hash-password -- "new-password"` again, paste the new hash into the Vercel env var, redeploy. All existing sessions are invalidated (they were signed with the old `SESSION_SECRET` — if you also rotate that, which is recommended after a compromise).
