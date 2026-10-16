import type { Metadata } from 'next'
import { JobsView } from '@/components/views/jobs-view'

export const metadata: Metadata = { title: 'Find jobs' }

export default function Page() {
  return <JobsView />
}
