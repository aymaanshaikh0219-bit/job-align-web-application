'use client'

import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { MatchedJob } from '@/hooks/use-jobs'
import { actions, useAppState } from '@/lib/app-store'
import { cn } from '@/lib/utils'
import { DemoBadge, MatchBadge, SkillChip } from './ui-kit'

export function SaveButton({ job, withLabel = false }: { job: MatchedJob; withLabel?: boolean }) {
  const { savedJobs } = useAppState()
  const saved = savedJobs.some((j) => j.id === job.id)
  const Icon = saved ? BookmarkCheck : Bookmark
  return (
    <button
      type="button"
      onClick={() => {
        const { match: _match, ...plain } = job
        actions.toggleSaved(plain)
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${job.title} from saved` : `Save ${job.title}`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors',
        withLabel ? 'h-10 px-4' : 'size-9',
        saved ? 'border-primary/30 bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {withLabel && (saved ? 'Saved' : 'Save job')}
    </button>
  )
}

export function JobCard({ job }: { job: MatchedJob }) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground"
        >
          {job.company.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-snug">
            <Link href={`/jobs/${encodeURIComponent(job.id)}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {job.title}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted-foreground">{job.company}</p>
        </div>
        <MatchBadge score={job.match.score} />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden="true" />
          {job.location}
        </span>
        <span>{job.type}</span>
        {job.mode !== 'Not specified' && <span>{job.mode}</span>}
        <span className="font-medium text-foreground">{job.salary}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 6).map((s) => (
          <SkillChip key={s} skill={s} variant={job.match.matched.includes(s) ? 'have' : 'neutral'} />
        ))}
        {job.skills.length === 0 && <span className="text-xs text-muted-foreground">No recognised skills in listing</span>}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        {job.source === 'demo' ? <DemoBadge label="Demo listing" /> : <span className="text-xs text-muted-foreground">via Adzuna</span>}
        <div className="relative z-10">
          <SaveButton job={job} />
        </div>
      </div>
    </article>
  )
}

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5" aria-hidden="true">
      <div className="flex gap-3">
        <div className="size-10 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      <div className="flex gap-2">
        <div className="h-6 w-14 animate-pulse rounded bg-muted" />
        <div className="h-6 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
