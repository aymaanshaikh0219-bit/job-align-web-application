'use client'

import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { SkillEditor } from '@/components/skill-editor'
import { buttonVariants } from '@/components/ui/button'
import { Card, Notice, PageHeader } from '@/components/ui-kit'
import { actions, useAppState } from '@/lib/app-store'
import type { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'

const fields: { key: Exclude<keyof Profile, 'skills'>; label: string; type?: string; placeholder?: string; wide?: boolean }[] = [
  { key: 'name', label: 'Full name', placeholder: 'Your name' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: 'Optional' },
  { key: 'location', label: 'Location', placeholder: 'City, Country' },
  { key: 'headline', label: 'Headline', placeholder: 'e.g. Aspiring data analyst', wide: true },
  { key: 'education', label: 'Education', placeholder: 'Degree — Institution' },
  { key: 'experience', label: 'Experience level', placeholder: 'e.g. Fresher, 1+ years' },
  { key: 'preferredRoles', label: 'Preferred roles', placeholder: 'Comma separated', wide: true },
]

export function ProfileView() {
  const { profile, isSampleProfile } = useAppState()
  const [form, setForm] = useState<Profile>(profile)
  const [saved, setSaved] = useState(false)
  const [syncedFrom, setSyncedFrom] = useState(profile)

  // Re-sync the form when the stored profile changes (e.g. after hydration or a resume import).
  if (syncedFrom !== profile) {
    setSyncedFrom(profile)
    setForm(profile)
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(profile)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        actions.updateProfile(form)
        setSaved(true)
      }}
      className="flex flex-col gap-5"
    >
      <PageHeader
        title="Profile"
        description="Your skills drive every match score and skill-gap result."
        action={
          <button type="submit" disabled={!dirty} className={cn(buttonVariants(), 'h-10 px-5')}>
            Save changes
          </button>
        }
      />

      {isSampleProfile && <Notice>This is sample data for demonstration. Edit and save to make it yours.</Notice>}
      {saved && !dirty && (
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
          <CircleCheck className="size-4" /> Saved to this browser.
        </p>
      )}

      <Card>
        <h2 className="font-semibold">Skills</h2>
        <p className="mb-3 text-sm text-muted-foreground">Pick from suggestions to keep names consistent with job listings.</p>
        <SkillEditor
          skills={form.skills}
          onChange={(skills) => {
            setForm({ ...form, skills })
            setSaved(false)
          }}
        />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Personal details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className={cn('text-sm', f.wide && 'sm:col-span-2')}>
              <span className="font-medium">{f.label}</span>
              <input
                type={f.type ?? 'text'}
                value={form[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => {
                  setForm({ ...form, [f.key]: e.target.value })
                  setSaved(false)
                }}
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </label>
          ))}
        </div>
      </Card>

      <div className="sm:hidden">
        <button type="submit" disabled={!dirty} className={cn(buttonVariants(), 'h-11 w-full')}>
          Save changes
        </button>
      </div>
    </form>
  )
}
