<script setup lang="ts">
import { LogOutIcon, MenuIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useLogout } from '@/composables/useLogout'
import { useAuthStore } from '@/stores/auth'
import { isNavActive, visibleLinks } from './nav'
import UserBadge from './UserBadge.vue'

const open = ref(false)
const route = useRoute()
const { user } = storeToRefs(useAuthStore())
const logout = useLogout()

function onLogout() {
  open.value = false
  logout()
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" class="md:hidden" aria-label="Open menu">
        <MenuIcon class="size-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" class="w-72 border-l-4 border-l-primary bg-black">
      <SheetHeader>
        <SheetTitle class="text-lg font-black uppercase tracking-[0.25em]">
          Ovrload
        </SheetTitle>
        <RouterLink
          v-if="user"
          to="/profile"
          class="mt-2 flex items-center gap-3 rounded-sm border border-white/10 p-2 transition-colors hover:border-primary"
          @click="open = false"
        >
          <UserBadge :name="user.displayName" />
          <span class="min-w-0">
            <span class="block truncate text-xs font-bold uppercase tracking-widest text-white">{{ user.displayName }}</span>
            <span class="block text-[0.65rem] uppercase tracking-widest text-primary">Edit profile</span>
          </span>
        </RouterLink>
      </SheetHeader>
      <nav class="flex flex-col px-4">
        <RouterLink
          v-for="link in visibleLinks(!!user)"
          :key="link.to"
          :to="link.to"
          class="border-b border-white/10 py-4 text-sm font-bold uppercase tracking-widest text-white/70"
          :class="{ 'text-primary!': isNavActive(link.to, route.path) }"
          @click="open = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="mt-auto grid gap-2 p-4">
        <Button v-if="user" variant="outline" size="lg" @click="onLogout">
          <LogOutIcon /> Log out
        </Button>
        <template v-else>
          <Button size="lg" as-child @click="open = false">
            <RouterLink to="/register">Join Ovrload</RouterLink>
          </Button>
          <Button variant="outline" size="lg" as-child @click="open = false">
            <RouterLink to="/login">Log in</RouterLink>
          </Button>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>
