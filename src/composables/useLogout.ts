import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'

export function useLogout() {
  const auth = useAuthStore()
  const router = useRouter()
  return async () => {
    await auth.logout().catch(() => {})
    toast.success('Logged out. See you next session 💪')
    router.push('/')
  }
}
