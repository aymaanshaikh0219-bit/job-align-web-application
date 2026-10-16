'use client'

import { Moon, RotateCcw, Sun } from 'lucide-react'
import { useState } from 'react'
import { setDarkMode, useIsDark } from '@/components/theme-toggle'
import { Card, PageHeader } from '@/components/ui-kit'
import { actions } from '@/lib/app-store'
import { theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

type Status = 'live' | 'demo' | 'off'

const statusStyles: Record<Status, string> = {
  live: 'border-success/30 bg-success/10 text-success',
  demo: 'border-warning/30 bg-warning/10 text-warning',
  off: 'border-border bg-muted text-muted-foreground',
}
const statusLabels: Record<Status, string> = { live: 'Live', demo: 'Demo', off: 'Not connected' }

export function SettingsView({ liveJobs }: { liveJobs: boolean }) {
  const dark = useIsDark()
  const [confirmReset, setConfirmReset] = useState(false)

  const features: { name: string; status: Status; detail: string }[] = [
    {
      name: 'Job listings',
      status: liveJobs ? 'live' : 'demo',
      detail: liveJobs
        ? 'Fetching real listings from the Adzuna API (refreshed every 15 minutes).'
        : '12 sample listings. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to switch to live jobs.',
    },
    {
      name: 'Resume parsing',
      status: 'live',
      detail: 'Server-side text extraction for PDF/DOCX/TXT plus a rule-based skill detector. No AI is used.',
    },
    {
      name: 'Match % and skill gaps',
      status: 'live',
      detail: 'Calculated in the browser from your profile skills vs. each job’s required skills.',
    },
    {
      name: 'Authentication',
      status: 'off',
      detail: 'There is no sign-in. Anyone using this browser sees the same profile.',
    },
    {
      name: 'Data storage',
      status: 'demo',
      detail: 'Profile, resume text and saved jobs live in this browser’s localStorage only. Clearing site data erases them.',
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Settings & status" description={`What's real and what's demo in ${theme.brandName}.`} />

      <Card>
        <h2 className="font-semibold">Appearance</h2>
        <div role="radiogroup" aria-label="Color theme" className="mt-3 grid max-w-sm grid-cols-2 gap-2">
          {[
            { value: false, label: 'Light', icon: Sun },
            { value: true, label: 'Dark', icon: Moon },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              role="radio"
              aria-checked={dark === opt.value}
              onClick={() => setDarkMode(opt.value)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium',
                dark === opt.value ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted',
              )}
            >
              <opt.icon className="size-4" /> {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Feature status</h2>
        <ul className="mt-3 flex flex-col divide-y">
          {features.map((f) => (
            <li key={f.name} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex items-center gap-2 sm:w-52 sm:shrink-0">
                <span className="font-medium">{f.name}</span>
                <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-semibold', statusStyles[f.status])}>
                  {statusLabels[f.status]}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{f.detail}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold">Reset demo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Restore the sample profile and clear saved jobs and resume text. Handy before a presentation.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {confirmReset ? (
            <>
              <button
                type="button"
                onClick={() => {
                  actions.resetDemo()
                  setConfirmReset(false)
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-white"
              >
                Yes, reset everything
              </button>
              <button type="button" onClick={() => setConfirmReset(false)} className="h-10 rounded-lg border px-4 text-sm font-medium">
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
            >
              <RotateCcw className="size-4" /> Reset demo data
            </button>
          )}
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        {theme.brandName} · {theme.projectLabel}
      </p>
    </div>
  )
}
