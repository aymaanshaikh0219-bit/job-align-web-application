import type { Metadata } from 'next'
import { ResumeView } from '@/components/views/resume-view'

export const metadata: Metadata = { title: 'My resume' }

export default function Page() {
  return <ResumeView />
}
