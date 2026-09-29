<script setup lang="ts">
import { computed } from 'vue'

// Red square date block — "25 JUN" badges in the ref news card.
const props = defineProps<{ date: string }>()
const d = computed(() => new Date(props.date))
</script>

<template>
  <div class="flex size-12 shrink-0 flex-col items-center justify-center bg-primary leading-none text-primary-foreground">
    <span class="text-lg font-black">{{ d.getDate() }}</span>
    <span class="text-[0.6rem] font-bold uppercase tracking-wider">{{ d.toLocaleString('en-US', { month: 'short' }) }}</span>
  </div>
</template>
