import type { Exercise, MuscleGroup } from '@/types'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export function useExerciseFilter(items: Ref<Exercise[]>) {
  const query = ref('')
  const group = ref<MuscleGroup | ''>('')
  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return items.value.filter(e =>
      (!group.value || e.muscleGroup === group.value)
      && (!q || e.name.toLowerCase().includes(q)))
  })
  return { query, group, filtered }
}
