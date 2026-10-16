'use client'

import { CircleCheck, FileText, LoaderCircle, Sparkles, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { SkillEditor } from '@/components/skill-editor'
import { buttonVariants } from '@/components/ui/button'
import { Card, Notice, PageHeader } from '@/components/ui-kit'
import { actions, useAppState } from '@/lib/app-store'
import { parseResume } from '@/lib/resume-parser'
import { sampleResumeText } from '@/lib/sample-data'
import type { ParsedResume } from '@/lib/types'
import { cn } from '@/lib/utils'

type Draft = ParsedResume & { fileName: string; text: string }

export function ResumeView() {
  const { resume, profile, isSampleProfile } = useAppState()
  const [tab, setTab] = useState<'upload' | 'paste'>('upload')
  const [pasted, setPasted] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'applied'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [mergeSkills, setMergeSkills] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setStatus('loading')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/resume', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setDraft({ ...(data.parsed as ParsedResume), fileName: file.name, text: data.text })
      setStatus('idle')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setStatus('idle')
    }
  }

  function parseText(text: string, fileName: string) {
    setError(null)
    if (text.trim().length < 20) {
      setError('Please paste a bit more resume text.')
      return
    }
    setDraft({ ...parseResume(text), fileName, text })
  }

  function apply() {
    if (!draft) return
    const skills = mergeSkills ? [...new Set([...profile.skills, ...draft.skills])] : draft.skills
    actions.updateProfile({
      ...(draft.name && { name: draft.name }),
      ...(draft.email && { email: draft.email }),
      ...(draft.phone && { phone: draft.phone }),
      ...(draft.education && { education: draft.education }),
      experience: draft.experience,
      skills,
    })
    actions.setResume({ fileName: draft.fileName, text: draft.text, parsedAt: new Date().toISOString() })
    setDraft(null)
    setStatus('applied')
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="My resume"
        description="Upload a resume to auto-fill your profile. You review everything before it's saved."
      />

      <Notice tone="info">
        <strong>How parsing works:</strong> text is extracted on the server, then a rule-based parser (no AI) detects contact details,
        education and known skills. The file itself is not stored — only the extracted text is kept in this browser.
      </Notice>

      {status === 'applied' && (
        <Notice tone="info" className="flex items-center gap-2 border-success/30 bg-success/10">
          <CircleCheck className="size-4 shrink-0 text-success" />
          <span>
            Profile updated.{' '}
            <Link href="/jobs" className="font-medium text-primary hover:underline">
              See your new matches
            </Link>
          </span>
        </Notice>
      )}

      {!draft && (
        <Card>
          <div role="tablist" aria-label="Resume input" className="mb-4 inline-flex rounded-lg bg-muted p-1">
            {(['upload', 'paste'] as const).map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  'rounded-md px-4 py-1.5 text-sm font-medium',
                  tab === t ? 'bg-card shadow-sm' : 'text-muted-foreground',
                )}
              >
                {t === 'upload' ? 'Upload file' : 'Paste text'}
              </button>
            ))}
          </div>

          {tab === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) handleFile(file)
              }}
              className={cn(
                'flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors',
                dragging ? 'border-primary bg-primary/5' : 'border-border',
              )}
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                {status === 'loading' ? <LoaderCircle className="size-6 animate-spin" /> : <Upload className="size-6" />}
              </span>
              <p className="mt-3 font-medium">{status === 'loading' ? 'Reading your resume…' : 'Drop your resume here'}</p>
              <p className="mt-1 text-sm text-muted-foreground">PDF, DOCX or TXT · up to 5 MB</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={() => inputRef.current?.click()}
                className={cn(buttonVariants(), 'mt-4 h-10 px-4')}
              >
                Choose file
              </button>
            </div>
          ) : (
            <div>
              <label htmlFor="resume-text" className="text-sm font-medium">
                Resume text
              </label>
              <textarea
                id="resume-text"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                rows={10}
                placeholder="Paste the contents of your resume…"
                className="mt-1.5 w-full rounded-lg border bg-background p-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              />
              <button type="button" onClick={() => parseText(pasted, 'Pasted text')} className={cn(buttonVariants(), 'mt-3 h-10 px-4')}>
                Parse text
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Presenting?
            <button
              type="button"
              onClick={() => parseText(sampleResumeText, 'sample-resume.txt')}
              className="font-medium text-primary hover:underline"
            >
              Try the sample resume
            </button>
          </div>
        </Card>
      )}

      {draft && (
        <Card className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">Review detected details</h2>
              <p className="text-sm text-muted-foreground">From {draft.fileName}. Fix anything the parser missed.</p>
            </div>
            <button type="button" onClick={() => setDraft(null)} className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['name', 'Full name'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['education', 'Education'],
                ['experience', 'Experience level'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="font-medium">{label}</span>
                <input
                  value={draft[key] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  placeholder="Not detected"
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                />
              </label>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-medium">Detected skills ({draft.skills.length})</h3>
            <div className="mt-2">
              <SkillEditor skills={draft.skills} onChange={(skills) => setDraft({ ...draft, skills })} />
            </div>
          </div>

          {!isSampleProfile && profile.skills.length > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={mergeSkills} onChange={(e) => setMergeSkills(e.target.checked)} className="size-4 accent-[var(--primary)]" />
              Keep my existing profile skills too
            </label>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={apply} className={cn(buttonVariants(), 'h-10 px-4')}>
              <CircleCheck /> Save to profile
            </button>
          </div>
        </Card>
      )}

      {resume && !draft && (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">{resume.fileName}</h2>
                <p className="text-xs text-muted-foreground">
                  Parsed {new Date(resume.parsedAt).toLocaleString()} · {resume.text.length.toLocaleString()} characters
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => actions.clearResume()}
              aria-label="Remove saved resume text"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-medium text-primary">Show extracted text</summary>
            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-sans text-xs leading-relaxed">
              {resume.text}
            </pre>
          </details>
        </Card>
      )}
    </div>
  )
}
