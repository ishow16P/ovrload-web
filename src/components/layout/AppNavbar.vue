<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import AppLogo from './AppLogo.vue'
import MobileNav from './MobileNav.vue'
import UserMenu from './UserMenu.vue'
import { isNavActive, visibleLinks } from './nav'

const route = useRoute()
const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-black/90 backdrop-blur">
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <AppLogo />
      <div class="hidden items-center gap-8 md:flex">
        <nav class="flex items-center gap-6 lg:gap-8">
          <RouterLink
            v-for="link in visibleLinks(!!user)"
            :key="link.to"
            :to="link.to"
            :class="cn(
              'nav-underline relative py-2 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors duration-200 hover:text-white',
              isNavActive(link.to, route.path) && 'is-active text-white',
            )"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <div v-if="user" class="border-l border-white/10 pl-4 lg:pl-6">
          <UserMenu :user="user" />
        </div>
        <div v-else class="flex items-center gap-2">
          <Button variant="outline" size="sm" as-child>
            <RouterLink :to="{ path: '/login', query: route.meta.guestOnly ? route.query : undefined }">Log in</RouterLink>
          </Button>
          <Button size="sm" as-child>
            <RouterLink to="/register">Join</RouterLink>
          </Button>
        </div>
      </div>
      <MobileNav />
    </div>
  </header>
</template>
