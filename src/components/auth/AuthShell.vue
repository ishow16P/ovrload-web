<script setup lang="ts">
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import { HERO_IMG } from '@/lib/constants'

defineProps<{ title: string, headline: string, tagline: string }>()
</script>

<template>
  <section class="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
    <!-- Photo panel (tablet+: banner, desktop: left half) -->
    <div class="relative isolate hidden overflow-hidden bg-black md:block">
      <div class="absolute inset-0 -z-10 bg-cover bg-center opacity-55 grayscale" :style="{ backgroundImage: `url(${HERO_IMG})` }" />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-black/10 lg:bg-gradient-to-r" />
      <div class="flex h-full min-h-56 flex-col justify-end p-8 lg:justify-center lg:p-14">
        <span class="eyebrow self-start">Ovrload</span>
        <h1 class="mt-4 max-w-md text-4xl leading-[0.95] text-white lg:text-6xl">
          {{ headline }}
        </h1>
        <p class="mt-4 max-w-sm text-sm text-white/70">
          {{ tagline }}
        </p>
      </div>
    </div>

    <div class="flex items-center justify-center bg-background px-4 py-10 md:py-14">
      <RedHeaderCard :title="title" class="w-full max-w-md">
        <div class="p-2">
          <slot />
        </div>
      </RedHeaderCard>
    </div>
  </section>
</template>
