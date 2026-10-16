import 'server-only'
import { sampleJobs } from './sample-jobs'
import { extractSkills } from './skills'
import type { Job, JobsResponse } from './types'

/**
 * Job provider switch.
 * - Default: returns the demo listings in lib/sample-jobs.ts.
 * - Live: set ADZUNA_APP_ID and ADZUNA_APP_KEY (free at developer.adzuna.com)
 *   in your environment. Optional: ADZUNA_COUNTRY (default "in"), ADZUNA_QUERY.
 * Keys are only read on the server and never sent to the browser.
 */
export function isLiveJobsConfigured() {
  return Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY)
}

type AdzunaResult = {
  id: string
  title: string
  description: string
  redirect_url: string
  created: string
  contract_time?: 'full_time' | 'part_time'
  contract_type?: 'permanent' | 'contract'
  salary_min?: number
  salary_max?: number
  company?: { display_name?: string }
  location?: { display_name?: string }
}

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

function formatSalary(min?: number, max?: number) {
  if (!min && !max) return 'Not disclosed'
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN')
  if (min && max && min !== max) return `${fmt(min)}–${fmt(max)} / year`
  return `${fmt((min || max) as number)} / year`
}

function mapAdzuna(r: AdzunaResult): Job {
  const title = stripHtml(r.title)
  const description = stripHtml(r.description)
  const text = `${title} ${description}`
  const mode: Job['mode'] = /\bremote\b/i.test(text) ? 'Remote' : /\bhybrid\b/i.test(text) ? 'Hybrid' : 'Not specified'
  const type =
    r.contract_type === 'contract'
      ? 'Contract'
      : r.contract_time === 'part_time'
        ? 'Part-time'
        : /\bintern(ship)?\b/i.test(title)
          ? 'Internship'
          : 'Full-time'

  return {
    id: `adzuna-${r.id}`,
    title,
    company: r.company?.display_name ?? 'Company not listed',
    location: r.location?.display_name ?? 'Location not listed',
    type,
    mode,
    salary: formatSalary(r.salary_min, r.salary_max),
    experience: 'See listing',
    skills: extractSkills(text),
    description,
    url: r.redirect_url,
    source: 'adzuna',
    postedAt: r.created,
  }
}

export async function getJobs(): Promise<JobsResponse> {
  if (!isLiveJobsConfigured()) {
    return { provider: 'demo', jobs: sampleJobs }
  }

  const country = process.env.ADZUNA_COUNTRY || 'in'
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID!,
    app_key: process.env.ADZUNA_APP_KEY!,
    results_per_page: '30',
    what: process.env.ADZUNA_QUERY || 'developer',
    'content-type': 'application/json',
  })

  try {
    const res = await fetch(`https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`, {
      next: { revalidate: 900 },
    })
    if (!res.ok) throw new Error(`Adzuna responded with ${res.status}`)
    const data = (await res.json()) as { results?: AdzunaResult[] }
    const jobs = (data.results ?? []).map(mapAdzuna)
    if (!jobs.length) throw new Error('No live results returned')
    return { provider: 'adzuna', jobs }
  } catch (error) {
    console.error('[jobs] Live provider failed, falling back to demo listings:', error)
    return {
      provider: 'demo',
      jobs: sampleJobs,
      notice: 'The live job provider could not be reached, so demo listings are shown instead.',
    }
  }
}
