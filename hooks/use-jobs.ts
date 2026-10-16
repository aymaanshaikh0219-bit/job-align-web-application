'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { useAppState } from '@/lib/app-store'
import { matchJob, type JobMatch } from '@/lib/skills'
import type { Job, JobsResponse } from '@/lib/types'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to load jobs')
    return r.json() as Promise<JobsResponse>
  })

export type MatchedJob = Job & { match: JobMatch }

export function useJobs() {
  const { data, error, isLoading } = useSWR('/api/jobs', fetcher, { revalidateOnFocus: false })
  const { profile } = useAppState()

  const jobs = useMemo<MatchedJob[]>(
    () => (data?.jobs ?? []).map((job) => ({ ...job, match: matchJob(job, profile.skills) })),
    [data, profile.skills],
  )

  return {
    jobs,
    provider: data?.provider ?? 'demo',
    notice: data?.notice,
    isLoading,
    error,
  }
}
