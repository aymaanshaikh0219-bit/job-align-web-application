'use client'

import { ArrowRight, Bookmark, Briefcase, FileText, Target, Upload } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { JobCard, JobCardSkeleton } from '@/components/job-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, Notice, ProgressRing, SkillChip } from '@/components/ui-kit'
import { useJobs } from '@/hooks/use-jobs'
import { useAppState } from '@/lib/app-store'
import { analyzeSkillGaps } from '@/lib/skills'
import { theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const profileFields = ['name', 'email', 'headline', 'location', 'education', 'preferredRoles'] as const

export function DashboardView() {
  const { profile, isSampleProfile, savedJobs, resume } = useAppState()
  const { jobs, isLoading, provider } = useJobs()

  const ranked = useMemo(() => [...jobs].sort((a, b) => b.match.score - a.match.score), [jobs])
  const top = ranked.slice(0, 3)
  const avgTop = top.length ? Math.round(top.reduce((s, j) => s + j.match.score, 0) / top.length) : 0
  const strongCount = jobs.filter((j) => j.match.score >= 70).length
  const gaps = useMemo(() => analyzeSkillGaps(ranked.slice(0, 6), profile.skills).slice(0, 4), [ranked, profile.skills])

  const filled = profileFields.filter((f) => profile[f]?.trim()).length + (profile.skills.length >= 3 ? 1 : 0)
  const completeness = Math.round((filled / (profileFields.length + 1)) * 100)
  const firstName = profile.name.split(' ')[0] || 'there'

  return (
    <div className="flex flex-col gap-5">
      {isSampleProfile && (
        <Notice>
          <strong className="font-semibold">You&apos;re viewing a sample profile.</strong>{' '}
          <Link href="/resume" className="font-medium text-primary underline-offset-2 hover:underline">
            Upload your resume
          </Link>{' '}
          or{' '}
          <Link href="/profile" className="font-medium text-primary underline-offset-2 hover:underline">
            edit your profile
          </Link>{' '}
          to see your own matches.
        </Notice>
      )}

      <section className="overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground sm:p-7">
        <p className="text-sm font-medium opacity-80">{theme.projectLabel}</p>
        <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Hi {firstName}, here&apos;s where you stand.
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-sm opacity-85 sm:text-base">
          {strongCount > 0
            ? `${strongCount} of ${jobs.length} listed roles are a strong match for your skills.`
            : 'Add more skills to unlock stronger job matches.'}{' '}
          {provider === 'demo' && 'Listings shown are demo data.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/jobs"
            className={cn(buttonVariants({ variant: 'secondary' }), 'h-10 px-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90')}
          >
            <Briefcase /> Browse matches
          </Link>
          <Link
            href="/resume"
            className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:bg-transparent')}
          >
            <Upload /> {resume ? 'Update resume' : 'Upload resume'}
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Target />} label="Avg. top-3 match" value={`${avgTop}%`} />
        <Stat icon={<Briefcase />} label="Strong matches" value={`${strongCount}`} hint="70%+" />
        <Stat icon={<Bookmark />} label="Saved jobs" value={`${savedJobs.length}`} href="/saved" />
        <Stat icon={<FileText />} label="Resume" value={resume ? 'Parsed' : 'Not added'} href="/resume" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top matches</h2>
            <Link href="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)
            : top.map((job) => <JobCard key={job.id} job={job} />)}
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <h2 className="font-semibold">Profile strength</h2>
            <div className="mt-4 flex items-center gap-4">
              <ProgressRing value={completeness} label={`Profile ${completeness}% complete`} />
              <div className="text-sm text-muted-foreground">
                <p>
                  {profile.skills.length} skills listed
                  <br />
                  {completeness < 100 ? 'Complete your profile for clearer results.' : 'Your profile looks complete.'}
                </p>
                <Link href="/profile" className="mt-1 inline-block font-medium text-primary hover:underline">
                  Edit profile
                </Link>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Skills to learn next</h2>
              <Link href="/skills" className="text-sm font-medium text-primary hover:underline">
                Details
              </Link>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Based on your top 6 matching roles</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {gaps.map((g) => (
                <li key={g.skill} className="flex items-center justify-between gap-2">
                  <SkillChip skill={g.skill} variant="missing" />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    in {g.demand} role{g.demand > 1 ? 's' : ''}
                  </span>
                </li>
              ))}
              {!isLoading && gaps.length === 0 && (
                <li className="text-sm text-muted-foreground">No gaps found in your top matches.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  hint,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
  href?: string
}) {
  const body = (
    <>
      <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary [&_svg]:size-[18px]">{icon}</span>
      <span className="mt-3 block text-xl font-semibold tabular-nums sm:text-2xl">{value}</span>
      <span className="block text-xs text-muted-foreground">
        {label}
        {hint && <span className="ml-1 opacity-70">({hint})</span>}
      </span>
    </>
  )
  const cls = 'rounded-xl border bg-card p-4 transition-colors'
  return href ? (
    <Link href={href} className={cn(cls, 'hover:bg-muted/50')}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}
