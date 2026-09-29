<script setup lang="ts">
import { SearchIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import ExerciseCard from '@/components/exercise/ExerciseCard.vue'
import MuscleGroupFilter from '@/components/exercise/MuscleGroupFilter.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useExerciseFilter } from '@/composables/useExerciseFilter'
import { errorMessage } from '@/lib/api'
import { useExerciseStore } from '@/stores/exercises'

const store = useExerciseStore()
const { items, loading } = storeToRefs(store)
const { query, group, filtered } = useExerciseFilter(items)
const counts = computed(() => {
  const c: Record<string, number> = { '': items.value.length }
  for (const e of items.value) c[e.muscleGroup] = (c[e.muscleGroup] ?? 0) + 1
  return c
})

onMounted(() => store.load().catch(err => toast.error(errorMessage(err))))
</script>

<template>
  <PageHeader eyebrow="Master list" title="Exercises" :subtitle="`${items.length || 'All'} standard lifts you can build programs from.`" />
  <section class="container-page py-8 md:py-10">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <MuscleGroupFilter v-model="group" :counts="items.length ? counts : undefined" />
      <div class="relative lg:w-72">
        <SearchIcon class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="Search exercises" class="pl-9" />
      </div>
    </div>

    <div v-if="loading && !items.length" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton v-for="i in 6" :key="i" class="h-36 rounded-sm" />
    </div>
    <TransitionGroup v-else tag="div" name="list" appear class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ExerciseCard v-for="(e, i) in filtered" :key="e._id" :exercise="e" :style="{ '--stagger': i }" />
    </TransitionGroup>
    <p v-if="!loading && !filtered.length" class="py-16 text-center text-sm text-muted-foreground">
      No exercises match.
    </p>
  </section>
</template>
