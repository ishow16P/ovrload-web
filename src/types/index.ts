export const MUSCLE_GROUPS = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'calves', 'core', 'full-body'] as const
export type MuscleGroup = typeof MUSCLE_GROUPS[number]

export interface User {
  _id: string
  email: string
  displayName: string
  createdAt: string
}

export interface Exercise {
  _id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: string
  description: string
}

export interface ProgramExercise {
  exercise: Exercise
  order: number
  targetSets: number
  targetWeight?: number
  targetReps?: number
}

export interface Program {
  _id: string
  name: string
  description: string
  exercises: ProgramExercise[]
  createdAt: string
  updatedAt: string
}

export interface ProgramPayload {
  name: string
  description: string
  exercises: { exercise: string, targetSets: number, targetWeight: number, targetReps: number }[]
}

export interface WorkoutSet {
  weight: number
  reps: number
  completed: boolean
}

export interface LogEntry {
  _id: string
  exercise: Exercise
  sets: WorkoutSet[]
}

export interface WorkoutLog {
  _id: string
  program?: string
  programName: string
  startedAt: string
  finishedAt?: string
  status: 'in_progress' | 'completed'
  entries: LogEntry[]
  notes: string
}

export interface SelectedItem {
  exercise: Exercise
  targetSets: number
  targetWeight: number
  targetReps: number
}
