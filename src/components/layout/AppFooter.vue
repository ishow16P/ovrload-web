<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import AppLogo from './AppLogo.vue'
import { visibleLinks } from './nav'

const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <footer class="border-t-4 border-primary bg-black">
    <div class="container-page flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col gap-2">
        <AppLogo class="self-start" />
        <p class="text-xs text-white/50">
          Lift heavier. Log smarter. Built for the Gen Z grind.
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-6 gap-y-2">
        <RouterLink
          v-for="link in visibleLinks(!!user)"
          :key="link.to"
          :to="link.to"
          class="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-primary"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>
    <div class="border-t border-white/5 py-4 text-center text-[0.7rem] uppercase tracking-widest text-white/40">
      © {{ new Date().getFullYear() }} Ovrload
    </div>
  </footer>
</template>
