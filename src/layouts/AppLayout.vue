<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const route = useRoute()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter
      :class="{
        'pb-20': route.meta.stickyBar === 'always',
        'pb-20 lg:pb-0': route.meta.stickyBar === 'mobile',
      }"
    />
  </div>
</template>
