import type { Exercise, Program, ProgramPayload, User, WorkoutLog } from '@/types'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  withCredentials: true, // httpOnly session cookie
})

// Called on 401 from a protected endpoint (session expired). Set by main.ts to avoid a store/router import cycle.
let onUnauthorized: (() => void) | undefined
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}
http.interceptors.response.use(undefined, (err) => {
  const url: string = err.config?.url ?? ''
  if (err.response?.status === 401 && !url.startsWith('/auth/')) onUnauthorized?.()
  return Promise.reject(err)
})

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) return err.response?.data?.message ?? err.message
  return err instanceof Error ? err.message : 'Something went wrong'
}

export const api = {
  auth: {
    me: () => http.get<User>('/auth/me').then(r => r.data),
    login: (body: { email: string, password: string }) => http.post<User>('/auth/login', body).then(r => r.data),
    register: (body: { email: string, password: string, displayName: string }) => http.post<User>('/auth/register', body).then(r => r.data),
    logout: () => http.post('/auth/logout'),
    updateMe: (body: { displayName: string }) => http.patch<User>('/auth/me', body).then(r => r.data),
    changePassword: (body: { currentPassword: string, newPassword: string }) => http.put('/auth/password', body),
  },
  exercises: {
    list: () => http.get<Exercise[]>('/exercises').then(r => r.data),
  },
  programs: {
    list: () => http.get<Program[]>('/programs').then(r => r.data),
    get: (id: string) => http.get<Program>(`/programs/${id}`).then(r => r.data),
    create: (body: ProgramPayload) => http.post<Program>('/programs', body).then(r => r.data),
    update: (id: string, body: ProgramPayload) => http.put<Program>(`/programs/${id}`, body).then(r => r.data),
    remove: (id: string) => http.delete(`/programs/${id}`),
  },
  logs: {
    list: (params?: { status?: string, limit?: number }) => http.get<WorkoutLog[]>('/logs', { params }).then(r => r.data),
    get: (id: string) => http.get<WorkoutLog>(`/logs/${id}`).then(r => r.data),
    start: (programId: string) => http.post<WorkoutLog>('/logs', { programId }).then(r => r.data),
    update: (id: string, body: Pick<WorkoutLog, 'entries' | 'notes'>) => http.put<WorkoutLog>(`/logs/${id}`, body).then(r => r.data),
    finish: (id: string) => http.patch<WorkoutLog>(`/logs/${id}/finish`).then(r => r.data),
    remove: (id: string) => http.delete(`/logs/${id}`),
  },
}
