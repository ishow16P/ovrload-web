<script setup lang="ts">
import type { WorkoutSet } from '@/types'
import { CheckIcon, XIcon } from '@lucide/vue'
import { cn } from '@/lib/utils'

const set = defineModel<WorkoutSet>({ required: true })
defineProps<{ index: number, canRemove: boolean }>()
const emit = defineEmits<{ remove: [] }>()

// Empty input → 0; show 0 as blank so the placeholder shows.
function num(v: string, int = false) {
  const n = int ? Number.parseInt(v, 10) : Number.parseFloat(v)
  return Number.isFinite(n) && n >= 0 ? n : 0
}
const inputCls = 'h-11 w-full min-w-0 rounded-sm border border-white/10 bg-background px-2 text-center text-base font-bold tabular-nums outline-none transition-colors placeholder:text-white/25 focus:border-primary'
</script>

<template>
  <div
    :class="cn(
      'grid grid-cols-[2rem_1fr_1fr_2.75rem_2rem] items-center gap-2 rounded-sm px-1 py-1 transition-colors duration-300 sm:grid-cols-[3rem_1fr_1fr_3rem_2.5rem] sm:gap-3',
      set.completed && 'bg-primary/10',
    )"
  >
    <span :class="cn('text-center text-sm font-black', set.completed ? 'text-primary' : 'text-white/50')">{{ index + 1 }}</span>
    <input
      :value="set.weight || ''"
      type="number"
      inputmode="decimal"
      step="0.5"
      min="0"
      placeholder="0"
      :aria-label="`Set ${index + 1} weight in kg`"
      :class="inputCls"
      @input="set = { ...set, weight: num(($event.target as HTMLInputElement).value) }"
    >
    <input
      :value="set.reps || ''"
      type="number"
      inputmode="numeric"
      step="1"
      min="0"
      placeholder="0"
      :aria-label="`Set ${index + 1} reps`"
      :class="inputCls"
      @input="set = { ...set, reps: num(($event.target as HTMLInputElement).value, true) }"
    >
    <button
      type="button"
      :aria-pressed="set.completed"
      :aria-label="`Mark set ${index + 1} done`"
      :class="cn(
        'flex size-11 items-center justify-center rounded-sm border transition-colors duration-200 active:scale-90',
        set.completed ? 'animate-pop border-primary bg-primary text-primary-foreground' : 'border-white/15 text-white/40 hover:border-white/40',
      )"
      @click="set = { ...set, completed: !set.completed }"
    >
      <CheckIcon class="size-5" stroke-width="3" />
    </button>
    <button
      type="button"
      :disabled="!canRemove"
      :aria-label="`Remove set ${index + 1}`"
      class="flex size-8 items-center justify-center text-white/30 transition-colors hover:text-primary disabled:invisible"
      @click="emit('remove')"
    >
      <XIcon class="size-4" />
    </button>
  </div>
</template>
