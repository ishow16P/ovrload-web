<script setup lang="ts">
import type { Exercise } from '@/types'
import { CheckIcon, PlusIcon, SearchIcon } from '@lucide/vue'
import { toRef } from 'vue'
import { Input } from '@/components/ui/input'
import { useExerciseFilter } from '@/composables/useExerciseFilter'
import { cn } from '@/lib/utils'
import MuscleGroupFilter from './MuscleGroupFilter.vue'

const props = defineProps<{ exercises: Exercise[], selectedIds: Set<string> }>()
const emit = defineEmits<{ toggle: [exercise: Exercise] }>()
const { query, group, filtered } = useExerciseFilter(toRef(props, 'exercises'))
</script>

<template>
  <div class="flex min-h-0 flex-col gap-3">
    <div class="relative">
      <SearchIcon class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input v-model="query" placeholder="Search exercises" class="pl-9" />
    </div>
    <MuscleGroupFilter v-model="group" />
    <ul class="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
      <li v-for="e in filtered" :key="e._id">
        <button
          type="button"
          :aria-pressed="selectedIds.has(e._id)"
          :class="cn(
            'flex min-h-14 w-full items-center gap-3 rounded-sm border px-3 py-2 text-left transition-colors',
            selectedIds.has(e._id) ? 'border-primary bg-primary/10' : 'border-white/10 bg-background hover:border-white/30',
          )"
          @click="emit('toggle', e)"
        >
          <span
            :class="cn(
              'flex size-7 shrink-0 items-center justify-center rounded-sm',
              selectedIds.has(e._id) ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white/70',
            )"
          >
            <CheckIcon v-if="selectedIds.has(e._id)" class="size-4" />
            <PlusIcon v-else class="size-4" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-bold">{{ e.name }}</span>
            <span class="block text-[0.65rem] uppercase tracking-widest text-muted-foreground">{{ e.muscleGroup }} · {{ e.equipment }}</span>
          </span>
        </button>
      </li>
      <li v-if="!filtered.length" class="py-8 text-center text-sm text-muted-foreground">
        No exercises match.
      </li>
    </ul>
  </div>
</template>
