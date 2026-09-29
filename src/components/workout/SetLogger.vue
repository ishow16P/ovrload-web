<script setup lang="ts">
import type { WorkoutSet } from '@/types'
import { PlusIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import SetRow from './SetRow.vue'

const sets = defineModel<WorkoutSet[]>({ required: true })

function addSet() {
  const last = sets.value.at(-1)
  // Carry over last set's numbers — most sets repeat the same load.
  sets.value = [...sets.value, { weight: last?.weight ?? 0, reps: last?.reps ?? 0, completed: false }]
}
</script>

<template>
  <div>
    <div class="grid grid-cols-[2rem_1fr_1fr_2.75rem_2rem] gap-2 px-1 pb-2 text-center text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground sm:grid-cols-[3rem_1fr_1fr_3rem_2.5rem] sm:gap-3">
      <span>Set</span><span>kg</span><span>Reps</span><span>Done</span><span />
    </div>
    <TransitionGroup tag="div" name="list" class="space-y-1.5">
      <SetRow
        v-for="(_, i) in sets"
        :key="i"
        v-model="sets[i]!"
        :index="i"
        :can-remove="sets.length > 1"
        @remove="sets = sets.filter((_, j) => j !== i)"
      />
    </TransitionGroup>
    <Button type="button" variant="ghost" size="sm" class="mt-3 w-full border border-dashed border-white/15 text-white/70" @click="addSet">
      <PlusIcon /> Add set
    </Button>
  </div>
</template>
