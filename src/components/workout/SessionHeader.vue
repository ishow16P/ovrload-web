<script setup lang="ts">
import type { WorkoutLog } from '@/types'
import { useIntervalFn, useNow } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{ log: WorkoutLog, saving: boolean }>()
const now = useNow({ scheduler: cb => useIntervalFn(cb, 1000) })

const elapsed = computed(() => {
  const s = Math.max(0, Math.floor((+now.value - +new Date(props.log.startedAt)) / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  const h = Math.floor(s / 3600)
  return `${h ? `${h}:` : ''}${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
})
const totals = computed(() => {
  const sets = props.log.entries.flatMap(e => e.sets)
  return { done: sets.filter(s => s.completed).length, all: sets.length }
})
</script>

<template>
  <section class="border-b border-white/5 bg-black">
    <div class="container-page py-6 md:py-8">
      <div class="flex flex-wrap items-center gap-3">
        <span class="eyebrow">Live session</span>
        <span class="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">{{ saving ? 'Saving…' : 'Saved' }}</span>
      </div>
      <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 class="text-3xl leading-none text-white sm:text-4xl md:text-5xl">
          {{ log.programName || 'Workout' }}
        </h1>
        <div class="flex gap-6 text-right">
          <div>
            <p class="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">
              Time
            </p>
            <p class="text-2xl font-black tabular-nums text-primary">
              {{ elapsed }}
            </p>
          </div>
          <div>
            <p class="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">
              Sets
            </p>
            <p class="text-2xl font-black tabular-nums">
              {{ totals.done }}<span class="text-white/40">/{{ totals.all }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 h-1 w-full bg-white/10">
        <div class="h-full bg-primary transition-all" :style="{ width: `${totals.all ? (totals.done / totals.all) * 100 : 0}%` }" />
      </div>
    </div>
  </section>
</template>
