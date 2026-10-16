'use client'

import { Bookmark } from 'lucide-react'
import Link from 'next/link'
import { JobCard } from '@/components/job-card'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState, PageHeader } from '@/components/ui-kit'
import { useAppState } from '@/lib/app-store'
import { matchJob } from '@/lib/skills'
import { cn } from '@/lib/utils'

export function SavedView() {
  const { savedJobs, profile } = useAppState()

  return (
    <div>
      <PageHeader
        title="Saved jobs"
        description="Saved in this browser only — they won't follow you to another device until accounts are connected."
      />
      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark />}
          title="No saved jobs yet"
          description="Tap the bookmark on any job to keep it here for later."
          action={
            <Link href="/jobs" className={cn(buttonVariants(), 'h-10 px-4')}>
              Browse jobs
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={{ ...job, match: matchJob(job, profile.skills) }} />
          ))}
        </div>
      )}
    </div>
  )
}
