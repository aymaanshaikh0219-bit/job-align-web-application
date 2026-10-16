'use client'

import { ArrowLeft, BookOpen, Check, ExternalLink, MapPin, SearchX, X } from 'lucide-react'
import Link from 'next/link'
import { SaveButton } from '@/components/job-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, DemoBadge, EmptyState, Notice, ProgressRing } from '@/components/ui-kit'
import { useJobs } from '@/hooks/use-jobs'
import { useAppState } from '@/lib/app-store'
import { learningLink, matchJob } from '@/lib/skills'
import { cn } from '@/lib/utils'

export function JobDetailView({ id }: { id: string }) {
  const { jobs, isLoading } = useJobs()
  const { savedJobs, profile } = useAppState()

  const fromList = jobs.find((j) => j.id === id)
  const fromSaved = savedJobs.find((j) => j.id === id)
  const job = fromList ?? (fromSaved ? { ...fromSaved, match: matchJob(fromSaved, profile.skills) } : undefined)

  if (isLoading && !job) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-label="Loading job" />
  }

  if (!job) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="Job not found"
        description="This listing may have expired or is no longer available."
        action={
          <Link href="/jobs" className={cn(buttonVariants(), 'h-10 px-4')}>
            Back to jobs
          </Link>
        }
      />
    )
  }

  const { match } = job

  return (
    <div className="flex flex-col gap-5">
      <Link href="/jobs" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All jobs
      </Link>

      <Card className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted font-semibold text-muted-foreground">
            {job.company.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-pretty text-xl font-semibold tracking-tight sm:text-2xl">{job.title}</h1>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
          {job.source === 'demo' && <DemoBadge label="Demo listing" className="hidden sm:inline-flex" />}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Meta label="Location" value={<span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{job.location}</span>} />
          <Meta label="Type" value={`${job.type}${job.mode !== 'Not specified' ? ` · ${job.mode}` : ''}`} />
          <Meta label="Salary" value={job.salary} />
          <Meta label="Experience" value={job.experience} />
        </dl>

        {job.source === 'demo' && (
          <Notice>
            This is a <strong>sample listing</strong> for demonstration. &quot;View on job platform&quot; opens a general search page, not a real
            application.
          </Notice>
        )}

        <div className="flex flex-wrap gap-2">
          <a href={job.url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-10 px-4')}>
            {job.source === 'demo' ? 'View on job platform' : 'Apply on Adzuna'} <ExternalLink />
          </a>
          <SaveButton job={job} withLabel />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Your match</h2>
          <div className="mt-4 flex items-center gap-4">
            <ProgressRing value={match.score} size={88} stroke={8} label={`${match.score}% match`} />
            <p className="text-sm text-muted-foreground">
              You have <strong className="text-foreground">{match.matched.length}</strong> of{' '}
              <strong className="text-foreground">{job.skills.length}</strong> required skills.
            </p>
          </div>
          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            Match % = skills you have ÷ skills the job needs × 100
          </p>

          <h3 className="mt-5 text-sm font-semibold">You have</h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {match.matched.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-success" aria-hidden="true" /> {s}
              </li>
            ))}
            {match.matched.length === 0 && <li className="text-sm text-muted-foreground">None yet</li>}
          </ul>

          <h3 className="mt-5 text-sm font-semibold">Skill gaps</h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {match.missing.map((s) => (
              <li key={s} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <X className="size-4 text-destructive" aria-hidden="true" /> {s}
                </span>
                <a
                  href={learningLink(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <BookOpen className="size-3.5" /> Learn
                  <span className="sr-only"> {s} (opens in new tab)</span>
                </a>
              </li>
            ))}
            {match.missing.length === 0 && <li className="text-sm text-success">No gaps — you meet every listed skill.</li>}
          </ul>
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="font-semibold">About the role</h2>
          <p className="mt-3 whitespace-pre-line text-pretty text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          <h3 className="mt-5 text-sm font-semibold">Required skills</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs font-medium',
                  match.matched.includes(s) ? 'border-success/30 bg-success/10 text-success' : 'bg-muted',
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  )
}
