'use client'

import { BookOpen, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Card, MatchBadge, PageHeader, ProgressRing, SkillChip } from '@/components/ui-kit'
import { useJobs } from '@/hooks/use-jobs'
import { useAppState } from '@/lib/app-store'
import { analyzeSkillGaps } from '@/lib/skills'
import { cn } from '@/lib/utils'

const scopes = { top: 'Top 6 matches', all: 'All listed jobs', saved: 'Saved jobs' } as const

export function SkillsView() {
  const { jobs, isLoading } = useJobs()
  const { profile, savedJobs } = useAppState()
  const [scope, setScope] = useState<keyof typeof scopes>('top')

  const ranked = useMemo(() => [...jobs].sort((a, b) => b.match.score - a.match.score), [jobs])
  const scoped = useMemo(() => {
    if (scope === 'all') return ranked
    if (scope === 'saved') return ranked.filter((j) => savedJobs.some((s) => s.id === j.id))
    return ranked.slice(0, 6)
  }, [ranked, scope, savedJobs])

  const gaps = useMemo(() => analyzeSkillGaps(scoped, profile.skills), [scoped, profile.skills])
  const readiness = scoped.length ? Math.round(scoped.reduce((s, j) => s + j.match.score, 0) / scoped.length) : 0

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Skill gap analysis" description="See which skills would raise your match scores the most." />

      <div role="tablist" aria-label="Analyse against" className="inline-flex w-fit flex-wrap rounded-lg bg-muted p-1">
        {(Object.keys(scopes) as (keyof typeof scopes)[]).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={scope === k}
            onClick={() => setScope(k)}
            className={cn('rounded-md px-3 py-1.5 text-sm font-medium', scope === k ? 'bg-card shadow-sm' : 'text-muted-foreground')}
          >
            {scopes[k]}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex items-center gap-4">
          <ProgressRing value={readiness} size={88} stroke={8} label={`Average match ${readiness}%`} />
          <div>
            <h2 className="font-semibold">Average match</h2>
            <p className="text-sm text-muted-foreground">
              Across {scoped.length} job{scoped.length === 1 ? '' : 's'} · {gaps.length} skill gap{gaps.length === 1 ? '' : 's'}
            </p>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your skills ({profile.skills.length})</h2>
            <Link href="/profile" className="text-sm font-medium text-primary hover:underline">
              Edit
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.skills.map((s) => (
              <SkillChip key={s} skill={s} variant="have" />
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">Recommended skills to learn</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ranked by how many roles need it. &quot;Avg. boost&quot; is how much your average match would rise if you learned it.
        </p>

        {isLoading ? (
          <div className="mt-4 h-40 animate-pulse rounded-lg bg-muted" />
        ) : scoped.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {scope === 'saved' ? 'Save some jobs first to analyse them here.' : 'No jobs available.'}
          </p>
        ) : gaps.length === 0 ? (
          <p className="mt-4 text-sm text-success">You already have every skill these roles ask for.</p>
        ) : (
          <ol className="mt-4 flex flex-col divide-y">
            {gaps.map((g, i) => (
              <li key={g.skill} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {g.skill} <span className="ml-1 text-xs font-normal text-muted-foreground">{g.category}</span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">Needed for: {g.jobTitles.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-10 sm:pl-0">
                  <div className="w-28">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(g.demand / scoped.length) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                      {g.demand}/{scoped.length} roles · +{g.avgBoost}%
                    </p>
                  </div>
                  <a
                    href={g.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium hover:bg-muted"
                  >
                    <BookOpen className="size-3.5" /> Learn <ExternalLink className="size-3" />
                    <span className="sr-only">{g.skill} (opens in new tab)</span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      {scoped.length > 0 && (
        <Card>
          <h2 className="font-semibold">Role-by-role breakdown</h2>
          <ul className="mt-3 flex flex-col divide-y">
            {scoped.map((job) => (
              <li key={job.id} className="flex flex-col gap-2 py-3">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/jobs/${encodeURIComponent(job.id)}`} className="min-w-0 font-medium hover:text-primary">
                    <span className="block truncate">{job.title}</span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">{job.company}</span>
                  </Link>
                  <MatchBadge score={job.match.score} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.match.matched.map((s) => (
                    <SkillChip key={s} skill={s} variant="have" />
                  ))}
                  {job.match.missing.map((s) => (
                    <SkillChip key={s} skill={s} variant="missing" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
