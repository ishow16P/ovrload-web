import type { User } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  let pending: Promise<void> | null = null

  // Resolve the session once per page load; guards await this.
  function fetchMe() {
    pending ??= api.auth.me()
      .then((u) => { user.value = u })
      .catch(() => { user.value = null })
    return pending
  }

  async function login(email: string, password: string) {
    user.value = await api.auth.login({ email, password })
  }

  async function register(email: string, password: string, displayName: string) {
    user.value = await api.auth.register({ email, password, displayName })
  }

  async function logout() {
    try {
      await api.auth.logout()
    }
    finally {
      clear()
    }
  }

  async function updateName(displayName: string) {
    user.value = await api.auth.updateMe({ displayName })
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await api.auth.changePassword({ currentPassword, newPassword })
  }

  function clear() {
    user.value = null
  }

  return { user, fetchMe, login, register, logout, updateName, changePassword, clear }
})
