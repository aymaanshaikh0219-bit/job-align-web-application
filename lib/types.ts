export type JobSource = 'demo' | 'adzuna'

export type Job = {
  id: string
  title: string
  company: string
  location: string
  type: string
  mode: 'Remote' | 'Hybrid' | 'On-site' | 'Not specified'
  salary: string
  experience: string
  skills: string[]
  description: string
  url: string
  source: JobSource
  postedAt?: string
}

export type JobsResponse = {
  provider: JobSource
  jobs: Job[]
  notice?: string
}

export type Profile = {
  name: string
  email: string
  phone: string
  headline: string
  location: string
  education: string
  experience: string
  preferredRoles: string
  skills: string[]
}

export type ParsedResume = {
  name?: string
  email?: string
  phone?: string
  education?: string
  experience: string
  skills: string[]
}

export type ResumeRecord = {
  fileName: string
  text: string
  parsedAt: string
}
