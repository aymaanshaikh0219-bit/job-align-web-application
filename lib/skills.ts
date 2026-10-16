import type { Job } from './types'

export type SkillInfo = {
  name: string
  category: 'Development' | 'Data' | 'Design' | 'Cloud' | 'Professional'
  resource: string
  aliases?: string[]
}

export const skillCatalog: SkillInfo[] = [
  { name: 'HTML', category: 'Development', resource: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', aliases: ['html5'] },
  { name: 'CSS', category: 'Development', resource: 'https://developer.mozilla.org/en-US/docs/Learn/CSS', aliases: ['css3'] },
  { name: 'JavaScript', category: 'Development', resource: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', aliases: ['js', 'es6'] },
  { name: 'TypeScript', category: 'Development', resource: 'https://www.typescriptlang.org/docs/handbook/intro.html', aliases: ['ts'] },
  { name: 'React', category: 'Development', resource: 'https://react.dev/learn', aliases: ['react.js', 'reactjs'] },
  { name: 'Next.js', category: 'Development', resource: 'https://nextjs.org/learn', aliases: ['nextjs'] },
  { name: 'Tailwind CSS', category: 'Development', resource: 'https://tailwindcss.com/docs', aliases: ['tailwind'] },
  { name: 'Node.js', category: 'Development', resource: 'https://nodejs.org/en/learn', aliases: ['node', 'nodejs'] },
  { name: 'REST APIs', category: 'Development', resource: 'https://developer.mozilla.org/en-US/docs/Glossary/REST', aliases: ['rest api', 'rest', 'restful'] },
  { name: 'Python', category: 'Development', resource: 'https://docs.python.org/3/tutorial/' },
  { name: 'Django', category: 'Development', resource: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/' },
  { name: 'Java', category: 'Development', resource: 'https://dev.java/learn/' },
  { name: 'C++', category: 'Development', resource: 'https://www.learncpp.com/', aliases: ['cpp'] },
  { name: 'Git', category: 'Development', resource: 'https://skills.github.com/', aliases: ['github', 'version control'] },
  { name: 'Testing', category: 'Development', resource: 'https://testing-library.com/docs/', aliases: ['unit testing', 'jest'] },
  { name: 'SQL', category: 'Data', resource: 'https://sqlbolt.com/', aliases: ['mysql', 'postgresql', 'postgres'] },
  { name: 'Excel', category: 'Data', resource: 'https://support.microsoft.com/en-us/excel', aliases: ['ms excel', 'microsoft excel'] },
  { name: 'Power BI', category: 'Data', resource: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi/', aliases: ['powerbi'] },
  { name: 'Statistics', category: 'Data', resource: 'https://www.khanacademy.org/math/statistics-probability' },
  { name: 'Pandas', category: 'Data', resource: 'https://pandas.pydata.org/docs/getting_started/index.html' },
  { name: 'Machine Learning', category: 'Data', resource: 'https://developers.google.com/machine-learning/crash-course', aliases: ['ml'] },
  { name: 'Figma', category: 'Design', resource: 'https://help.figma.com/hc/en-us' },
  { name: 'UI Design', category: 'Design', resource: 'https://www.interaction-design.org/literature/topics/ui-design', aliases: ['user interface design'] },
  { name: 'Wireframing', category: 'Design', resource: 'https://www.nngroup.com/articles/wireflows/', aliases: ['wireframes'] },
  { name: 'Prototyping', category: 'Design', resource: 'https://help.figma.com/hc/en-us/articles/360040314193', aliases: ['prototypes'] },
  { name: 'User Research', category: 'Design', resource: 'https://www.nngroup.com/articles/which-ux-research-methods/', aliases: ['ux research'] },
  { name: 'Docker', category: 'Cloud', resource: 'https://docs.docker.com/get-started/' },
  { name: 'AWS', category: 'Cloud', resource: 'https://aws.amazon.com/training/digital/', aliases: ['amazon web services'] },
  { name: 'Linux', category: 'Cloud', resource: 'https://linuxjourney.com/' },
  { name: 'Communication', category: 'Professional', resource: 'https://www.coursera.org/learn/wharton-communication-skills', aliases: ['communication skills'] },
  { name: 'Teamwork', category: 'Professional', resource: 'https://www.atlassian.com/team-playbook', aliases: ['collaboration'] },
]

const catalogByName = new Map(skillCatalog.map((s) => [s.name.toLowerCase(), s]))

export function getSkillInfo(name: string): SkillInfo | undefined {
  return catalogByName.get(name.toLowerCase())
}

export function learningLink(name: string) {
  return (
    getSkillInfo(name)?.resource ??
    `https://www.google.com/search?q=${encodeURIComponent(`learn ${name} free tutorial`)}`
  )
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const matchers = skillCatalog.flatMap((skill) =>
  [skill.name, ...(skill.aliases ?? [])].map((term) => ({
    canonical: skill.name,
    pattern: new RegExp(`(?<![a-z0-9+#])${escapeRegex(term.toLowerCase())}(?![a-z0-9+#])`, 'i'),
  })),
)

/** Finds known skills (and their aliases) in free text using whole-word matching. */
export function extractSkills(text: string): string[] {
  const found = new Set<string>()
  for (const { canonical, pattern } of matchers) {
    if (pattern.test(text)) found.add(canonical)
  }
  return [...found]
}

export type JobMatch = {
  score: number
  matched: string[]
  missing: string[]
}

/** Transparent score: matched required skills / total required skills × 100. */
export function matchJob(job: Job, userSkills: string[]): JobMatch {
  const have = new Set(userSkills.map((s) => s.toLowerCase()))
  const matched = job.skills.filter((s) => have.has(s.toLowerCase()))
  const missing = job.skills.filter((s) => !have.has(s.toLowerCase()))
  const score = job.skills.length ? Math.round((matched.length / job.skills.length) * 100) : 0
  return { score, matched, missing }
}

export type SkillGap = {
  skill: string
  category: string
  demand: number
  avgBoost: number
  jobTitles: string[]
  resource: string
}

/**
 * Ranks missing skills by how many listed jobs require them, plus the average
 * match-score improvement across all jobs if the user learned that skill.
 */
export function analyzeSkillGaps(jobs: Job[], userSkills: string[]): SkillGap[] {
  const have = new Set(userSkills.map((s) => s.toLowerCase()))
  const gaps = new Map<string, SkillGap>()

  for (const job of jobs) {
    if (!job.skills.length) continue
    const perSkillBoost = 100 / job.skills.length
    for (const skill of job.skills) {
      if (have.has(skill.toLowerCase())) continue
      const entry = gaps.get(skill) ?? {
        skill,
        category: getSkillInfo(skill)?.category ?? 'Other',
        demand: 0,
        avgBoost: 0,
        jobTitles: [],
        resource: learningLink(skill),
      }
      entry.demand += 1
      entry.avgBoost += perSkillBoost
      entry.jobTitles.push(job.title)
      gaps.set(skill, entry)
    }
  }

  const total = Math.max(jobs.length, 1)
  return [...gaps.values()]
    .map((g) => ({ ...g, avgBoost: Math.round((g.avgBoost / total) * 10) / 10 }))
    .sort((a, b) => b.demand - a.demand || b.avgBoost - a.avgBoost)
}

export function matchTone(score: number) {
  if (score >= 70) return 'strong' as const
  if (score >= 40) return 'fair' as const
  return 'low' as const
}
