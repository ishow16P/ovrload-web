import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { api, errorMessage } from '@/lib/api'

export function useStartWorkout() {
  const router = useRouter()
  const starting = ref(false)

  async function start(programId: string) {
    starting.value = true
    try {
      const log = await api.logs.start(programId)
      await router.push(`/workout/${log._id}`)
    }
    catch (err) {
      toast.error(errorMessage(err))
    }
    finally {
      starting.value = false
    }
  }

  return { start, starting }
}
