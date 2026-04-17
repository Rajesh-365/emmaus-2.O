# Google Form integration — setup guide

The admissions page on the website (`/apply`) collects data from the applicant and forwards it to a Google Form you control. Google Forms writes every submission into a Google Sheet automatically, so you get a searchable record and email notifications for free.

This document walks you through connecting the two. Once done, **every submission on the website will appear as a new row in the linked Google Sheet.**

---

## 1. Create the Google Form

1. Go to <https://forms.google.com> and click **Blank form**.
2. Add these fields, in this order, with these exact types:

| # | Field label | Type |
|---|-------------|------|
| 1 | First name | Short answer |
| 2 | Last name | Short answer |
| 3 | Email | Short answer |
| 4 | Phone | Short answer |
| 5 | Date of birth | Short answer |
| 6 | Gender | Short answer |
| 7 | Full address | Paragraph |
| 8 | City | Short answer |
| 9 | State | Short answer |
| 10 | PIN code | Short answer |
| 11 | Programme | Short answer |
| 12 | Previous education | Short answer |
| 13 | Church affiliation | Short answer |
| 14 | Pastor's reference | Short answer |
| 15 | Testimony | Paragraph |
| 16 | Motivation | Paragraph |

> You can make each field **Required** in the Google Form if you want, but our app already validates before sending, so leaving them optional is fine.

3. Click **Responses → Link to Sheets** so every submission is saved into a Google Sheet.

## 2. Get the form action URL

1. Open your form, click the three-dot menu → **Get pre-filled link**.
2. Fill in dummy values in every field, then click **Get link** → **Copy link**.
3. Paste the link somewhere temporarily. It looks like:

   ```
   https://docs.google.com/forms/d/e/1FAIpQLSc........./viewform?usp=pp_url&entry.123456789=John&entry.987654321=Doe...
   ```

4. Change `viewform?usp=pp_url` to `formResponse` — that is the URL the website will POST to.

   Final form:

   ```
   https://docs.google.com/forms/d/e/1FAIpQLSc........./formResponse
   ```

   Put this value into `GOOGLE_FORM_ACTION` in `.env.local`.

## 3. Extract the entry IDs

Every `entry.XXXXXXXX` in the pre-filled link is one field. Match them to our field names in the table below.

> Tip: open the pre-filled link in a browser, then hit **View Page Source**. Search for `entry.` — you'll see all IDs clearly.

Copy each ID into `.env.local`:

| Env variable | Corresponds to |
|---|---|
| `GOOGLE_FORM_ENTRY_FIRST_NAME` | First name |
| `GOOGLE_FORM_ENTRY_LAST_NAME` | Last name |
| `GOOGLE_FORM_ENTRY_EMAIL` | Email |
| `GOOGLE_FORM_ENTRY_PHONE` | Phone |
| `GOOGLE_FORM_ENTRY_DOB` | Date of birth |
| `GOOGLE_FORM_ENTRY_GENDER` | Gender |
| `GOOGLE_FORM_ENTRY_ADDRESS` | Full address |
| `GOOGLE_FORM_ENTRY_CITY` | City |
| `GOOGLE_FORM_ENTRY_STATE` | State |
| `GOOGLE_FORM_ENTRY_PINCODE` | PIN code |
| `GOOGLE_FORM_ENTRY_COURSE` | Programme |
| `GOOGLE_FORM_ENTRY_EDUCATION` | Previous education |
| `GOOGLE_FORM_ENTRY_CHURCH` | Church affiliation |
| `GOOGLE_FORM_ENTRY_PASTOR` | Pastor's reference |
| `GOOGLE_FORM_ENTRY_TESTIMONY` | Testimony |
| `GOOGLE_FORM_ENTRY_MOTIVATION` | Motivation |

## 4. Test it

1. Save `.env.local`.
2. Restart the dev server (`npm run dev`) — env vars are only read at boot.
3. Go to <http://localhost:3000/apply>, fill the form, submit.
4. Open your linked Google Sheet — a new row should appear within a few seconds.

If a field does not show up in the sheet, the entry ID is wrong. Re-check step 3 for that field only.

## 5. Deploy

When you deploy (Vercel, Netlify, your own server), add the same env vars to the hosting platform's dashboard. Never commit `.env.local` — it is already in `.gitignore`.

---

## How it works under the hood

- The browser POSTs the validated form to our own `/api/apply` endpoint.
- The endpoint validates again with the same Zod schema (defence in depth).
- If `GOOGLE_FORM_ACTION` is set, the server forwards the data as `application/x-www-form-urlencoded` to Google Forms.
- Google Forms appends the submission to its response sheet. No extra backend needed.

If `GOOGLE_FORM_ACTION` is unset, submissions are still accepted and logged server-side — the website never fails in front of an applicant.
