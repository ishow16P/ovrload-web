import type { WorkoutLog } from "@/types"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function logVolume(log: WorkoutLog): number {
  return log.entries.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + (set.completed ? set.weight * set.reps : 0), 0),
    0,
  )
}

export function completedSets(log: WorkoutLog): number {
  return log.entries.reduce((sum, e) => sum + e.sets.filter(s => s.completed).length, 0)
}

export function formatDuration(log: WorkoutLog): string {
  if (!log.finishedAt) return '—'
  const mins = Math.max(1, Math.round((+new Date(log.finishedAt) - +new Date(log.startedAt)) / 60000))
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`
}

export const numberFmt = new Intl.NumberFormat('en-US')

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

// Only allow in-app paths from ?redirect= (blocks open redirects like //evil.com).
export function safeRedirect(value: unknown, fallback = '/programs') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : fallback
}
