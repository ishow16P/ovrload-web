<script setup lang="ts">
import type { Exercise } from '@/types'
import { Badge } from '@/components/ui/badge'

defineProps<{ exercise: Exercise }>()
</script>

<template>
  <article class="card-lift group relative flex flex-col overflow-hidden rounded-sm border border-white/5 bg-card p-5 hover:border-primary/60">
    <span class="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-y-100" />
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-base leading-tight">
        {{ exercise.name }}
      </h3>
      <Badge class="shrink-0 rounded-sm bg-primary/15 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
        {{ exercise.muscleGroup }}
      </Badge>
    </div>
    <p class="mt-2 flex-1 text-sm text-muted-foreground">
      {{ exercise.description }}
    </p>
    <p class="mt-4 text-[0.7rem] font-bold uppercase tracking-widest text-white/40">
      {{ exercise.equipment }}
    </p>
  </article>
</template>
