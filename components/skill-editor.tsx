'use client'

import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { getSkillInfo, skillCatalog } from '@/lib/skills'
import { SkillChip } from './ui-kit'

export function SkillEditor({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const listId = useId()

  function add() {
    const raw = draft.trim()
    if (!raw) return
    const name = getSkillInfo(raw)?.name ?? raw
    if (!skills.some((s) => s.toLowerCase() === name.toLowerCase())) onChange([...skills, name])
    setDraft('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <SkillChip key={s} skill={s} onRemove={() => onChange(skills.filter((x) => x !== s))} />
        ))}
        {skills.length === 0 && <span className="text-sm text-muted-foreground">No skills yet.</span>}
      </div>
      <div className="mt-3 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Add a skill</span>
          <input
            list={listId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              add()
            }}
            placeholder="Add a skill, e.g. Python"
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </label>
        <datalist id={listId}>
          {skillCatalog
            .filter((s) => !skills.includes(s.name))
            .map((s) => (
              <option key={s.name} value={s.name} />
            ))}
        </datalist>
        <button
          type="button"
          onClick={add}
          className="inline-flex h-10 items-center gap-1 rounded-lg border bg-card px-3 text-sm font-medium hover:bg-muted"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>
    </div>
  )
}
