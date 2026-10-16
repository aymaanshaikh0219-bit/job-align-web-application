'use client'

import { useSyncExternalStore } from 'react'
import { sampleProfile } from './sample-data'
import type { Job, Profile, ResumeRecord } from './types'

/**
 * DEMO STORAGE — profile, resume text, and saved jobs are kept in this
 * browser's localStorage only. Nothing is sent to a database and there is no
 * user account. Replace with a real backend + auth before public use.
 */
export type AppState = {
  profile: Profile
  isSampleProfile: boolean
  savedJobs: Job[]
  resume: ResumeRecord | null
}

const STORAGE_KEY = 'jobalign-demo-state-v1'

const defaultState: AppState = {
  profile: sampleProfile,
  isSampleProfile: true,
  savedJobs: [],
  resume: null,
}

let state: AppState = defaultState
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) state = { ...defaultState, ...JSON.parse(raw) }
  } catch {
    state = defaultState
  }
}

function setState(updater: (prev: AppState) => AppState) {
  load()
  state = updater(state)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be full or disabled (private mode); state still works in memory.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAppState() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load()
      return state
    },
    () => defaultState,
  )
}

export const actions = {
  updateProfile(patch: Partial<Profile>) {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch }, isSampleProfile: false }))
  },
  setResume(resume: ResumeRecord) {
    setState((s) => ({ ...s, resume }))
  },
  clearResume() {
    setState((s) => ({ ...s, resume: null }))
  },
  toggleSaved(job: Job) {
    setState((s) => {
      const exists = s.savedJobs.some((j) => j.id === job.id)
      return {
        ...s,
        savedJobs: exists ? s.savedJobs.filter((j) => j.id !== job.id) : [job, ...s.savedJobs],
      }
    })
  },
  resetDemo() {
    setState(() => defaultState)
  },
}
