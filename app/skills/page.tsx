import type { Metadata } from 'next'
import { SkillsView } from '@/components/views/skills-view'

export const metadata: Metadata = { title: 'Skill gaps' }

export default function Page() {
  return <SkillsView />
}
