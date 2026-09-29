<script setup lang="ts">
import type { MuscleGroup } from '@/types'
import { MUSCLE_GROUPS } from '@/types'
import { cn } from '@/lib/utils'

defineProps<{ counts?: Partial<Record<MuscleGroup | '', number>> }>()
const model = defineModel<MuscleGroup | ''>({ default: '' })
</script>

<template>
  <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
    <button
      v-for="g in ['', ...MUSCLE_GROUPS] as const"
      :key="g"
      type="button"
      :class="cn(
        'h-9 shrink-0 rounded-sm border px-3 text-[0.7rem] font-bold uppercase tracking-widest transition-colors',
        model === g ? 'border-primary bg-primary text-primary-foreground' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white',
      )"
      @click="model = g"
    >
      {{ g || 'All' }}<span v-if="counts?.[g] !== undefined" class="ml-1.5 opacity-60">{{ counts[g] }}</span>
    </button>
  </div>
</template>
