<script setup lang="ts">
import { computed } from 'vue'

// Red square initial — same visual language as DateBadge.
const props = withDefaults(defineProps<{ name: string, size?: 'sm' | 'lg' }>(), { size: 'sm' })
const initial = computed(() => props.name.trim().charAt(0).toUpperCase() || '?')
</script>

<template>
  <span
    :class="[
      'flex shrink-0 items-center justify-center bg-primary font-black text-primary-foreground',
      size === 'lg' ? 'size-16 text-3xl' : 'size-7 text-xs',
    ]"
    aria-hidden="true"
  >{{ initial }}</span>
</template>
