<script setup lang="ts">
import type { WorkoutLog } from '@/types'
import { ClockIcon, LayersIcon, TrophyIcon } from '@lucide/vue'
import { computed } from 'vue'
import CountUp from '@/components/layout/CountUp.vue'
import { completedSets, formatDuration, logVolume } from '@/lib/utils'

const props = defineProps<{ log: WorkoutLog }>()
const tiles = computed(() => [
  { icon: TrophyIcon, label: 'Volume', count: logVolume(props.log), suffix: ' kg' },
  { icon: LayersIcon, label: 'Sets done', count: completedSets(props.log), suffix: '' },
  { icon: ClockIcon, label: 'Duration', text: formatDuration(props.log) },
])
</script>

<template>
  <div class="grid grid-cols-3 divide-x divide-white/15 bg-primary text-primary-foreground">
    <div v-for="(t, i) in tiles" :key="t.label" :style="{ '--stagger': i }" class="animate-fade-up flex flex-col items-center gap-1 px-2 py-5 text-center sm:py-6">
      <component :is="t.icon" class="size-5 opacity-80" />
      <p class="text-lg font-black tabular-nums sm:text-2xl">
        <template v-if="t.count !== undefined">
          <CountUp :value="t.count" />{{ t.suffix }}
        </template>
        <template v-else>
          {{ t.text }}
        </template>
      </p>
      <p class="text-[0.6rem] font-bold uppercase tracking-widest opacity-80 sm:text-xs">
        {{ t.label }}
      </p>
    </div>
  </div>
</template>
