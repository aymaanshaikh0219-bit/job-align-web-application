import type { Metadata } from 'next'
import { JobDetailView } from '@/components/views/job-detail-view'

export const metadata: Metadata = { title: 'Job details' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <JobDetailView id={decodeURIComponent(id)} />
}
