import type { Metadata } from 'next'
import { SettingsView } from '@/components/views/settings-view'
import { isLiveJobsConfigured } from '@/lib/jobs-provider'

export const metadata: Metadata = { title: 'Settings & status' }

export default function Page() {
  return <SettingsView liveJobs={isLiveJobsConfigured()} />
}
