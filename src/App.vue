<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import AppLayout from '@/layouts/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <!-- wrapper: views render multiple roots, Transition needs one element -->
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </AppLayout>
  <Toaster position="top-center" theme="dark" />
</template>
