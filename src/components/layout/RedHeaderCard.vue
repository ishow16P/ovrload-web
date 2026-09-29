<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

// Card with solid red title strip — the "WORKING HOURS / CONTACT US" boxes in the ref.
const props = defineProps<{ title: string, class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('flex flex-col overflow-hidden rounded-sm bg-card shadow-lg shadow-black/40', props.class)">
    <div class="flex items-center justify-between gap-2 bg-primary px-4 py-2.5">
      <h3 class="truncate text-xs font-extrabold tracking-widest text-primary-foreground sm:text-sm">
        {{ title }}
      </h3>
      <slot name="action" />
    </div>
    <div class="flex-1 p-4">
      <slot />
    </div>
  </div>
</template>
