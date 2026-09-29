import type { Exercise } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'

// Master list is static-ish → fetch once, reuse across views.
export const useExerciseStore = defineStore('exercises', () => {
  const items = ref<Exercise[]>([])
  const loading = ref(false)
  let loaded = false

  async function load(force = false) {
    if (loaded && !force) return
    loading.value = true
    try {
      items.value = await api.exercises.list()
      loaded = true
    }
    finally {
      loading.value = false
    }
  }

  return { items, loading, load }
})
