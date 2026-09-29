<script setup lang="ts">
import type { LogEntry } from '@/types'
import { computed } from 'vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import SetLogger from './SetLogger.vue'

const entry = defineModel<LogEntry>({ required: true })
const done = computed(() => entry.value.sets.filter(s => s.completed).length)
</script>

<template>
  <RedHeaderCard :title="entry.exercise?.name ?? 'Deleted exercise'">
    <template #action>
      <span class="shrink-0 text-[0.65rem] font-bold uppercase tracking-widest text-white/85">{{ done }}/{{ entry.sets.length }} done</span>
    </template>
    <SetLogger v-model="entry.sets" />
  </RedHeaderCard>
</template>
