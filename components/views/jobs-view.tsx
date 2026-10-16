'use client'

import { Search, SearchX } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { JobCard, JobCardSkeleton } from '@/components/job-card'
import { DemoBadge, EmptyState, Notice, PageHeader } from '@/components/ui-kit'
import { useJobs } from '@/hooks/use-jobs'
import { cn } from '@/lib/utils'

const modes = ['All', 'Remote', 'Hybrid', 'On-site'] as const
const sorts = { match: 'Best match', title: 'Title A–Z' } as const

export function JobsView() {
  const { jobs, isLoading, error, provider, notice } = useJobs()
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<(typeof modes)[number]>('All')
  const [type, setType] = useState('All')
  const [minMatch, setMinMatch] = useState(0)
  const [sort, setSort] = useState<keyof typeof sorts>('match')
  const deferredQuery = useDeferredValue(query)

  const types = useMemo(() => ['All', ...new Set(jobs.map((j) => j.type))], [jobs])

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return jobs
      .filter((j) => mode === 'All' || j.mode === mode)
      .filter((j) => type === 'All' || j.type === type)
      .filter((j) => j.match.score >= minMatch)
      .filter(
        (j) =>
          !q ||
          [j.title, j.company, j.location, ...j.skills].some((v) => v.toLowerCase().includes(q)),
      )
      .sort((a, b) => (sort === 'match' ? b.match.score - a.match.score : a.title.localeCompare(b.title)))
  }, [jobs, deferredQuery, mode, type, minMatch, sort])

  return (
    <div>
      <PageHeader
        title="Find jobs"
        description={
          provider === 'demo' ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              Showing sample listings for demonstration <DemoBadge />
            </span>
          ) : (
            'Live listings from Adzuna, ranked by how well they match your skills.'
          )
        }
      />

      {notice && <Notice className="mb-4">{notice}</Notice>}

      <div className="mb-4 flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4">
        <label className="relative block">
          <span className="sr-only">Search jobs</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company, location or skill"
            className="h-11 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Work mode" className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <Select label="Job type" value={type} onChange={setType} options={types.map((t) => [t, t === 'All' ? 'All types' : t])} />
          <Select
            label="Minimum match"
            value={String(minMatch)}
            onChange={(v) => setMinMatch(Number(v))}
            options={[
              ['0', 'Any match'],
              ['40', '40%+'],
              ['70', '70%+'],
            ]}
          />
          <Select
            label="Sort by"
            value={sort}
            onChange={(v) => setSort(v as keyof typeof sorts)}
            options={Object.entries(sorts)}
          />
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        {isLoading ? 'Loading jobs…' : `${filtered.length} of ${jobs.length} jobs`}
      </p>

      {error ? (
        <EmptyState icon={<SearchX />} title="Couldn't load jobs" description="Please refresh the page and try again." />
      ) : isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="No jobs match these filters"
          description="Try a broader search or lower the minimum match."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <label className="text-xs">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border bg-background px-2.5 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
