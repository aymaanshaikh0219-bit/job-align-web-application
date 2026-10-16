# JobAlign — AVISHKAR Student Project

A mobile-first career companion that matches a student's resume skills to job listings, shows a match percentage for every role, and recommends which skills to learn next.

## What's real vs. demo

| Feature | Status | Notes |
| --- | --- | --- |
| Resume upload & parsing | Working | PDF/DOCX/TXT text extraction on the server (`app/api/resume`), rule-based skill detection (`lib/resume-parser.ts`). No AI. |
| Match % & skill gaps | Working | Computed from profile skills vs. job skills (`lib/skills.ts`). |
| Dark mode | Working | Saved per browser. |
| Job listings | **Demo** | 12 sample jobs (`lib/sample-jobs.ts`) until a job API is configured. |
| Saved jobs / profile | **Demo storage** | Stored in the browser's localStorage only. |
| Authentication | **Not connected** | There is no sign-in. |

The app labels demo items in the UI (header badge, "Demo listing" tags, Settings → Feature status).

## Demo script (≈3 minutes)

1. **Dashboard:** show the sample profile, average match and top matches.
2. **My resume → "Try the sample resume":** review the detected name, email and skills, then **Save to profile**.
3. **Find jobs:** search, filter by remote/type/minimum match, and sort. Open a job to see matched vs. missing skills.
4. **Skill gaps:** show the ranked skills to learn and how much each would raise your average match.
5. Bookmark a job → **Saved jobs**. Toggle **dark mode**.
6. **Settings → Reset demo data** to start over before the next audience.

## Branding

Edit **`lib/theme.ts`**: app name, tagline, project label and the brand colours for light and dark mode. Every screen reads from this file.

## Connecting real jobs (optional)

The job provider (`lib/jobs-provider.ts`) uses the free [Adzuna API](https://developer.adzuna.com/) when these environment variables are set, and falls back to sample jobs otherwise:

```
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
ADZUNA_COUNTRY=in        # optional, defaults to "in"
ADZUNA_QUERY=developer   # optional search keyword
```

## Deploy

Click **Publish** in v0, or push to GitHub and import the repo on Vercel. No environment variables are needed for demo mode.

## Tech stack

Next.js (App Router, React 19), Tailwind CSS, shadcn/ui, SWR, `unpdf` and `mammoth` for document text extraction.
