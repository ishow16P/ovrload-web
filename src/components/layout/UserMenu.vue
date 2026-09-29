<script setup lang="ts">
import type { User } from '@/types'
import { ChevronDownIcon, LogOutIcon, UserIcon } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/composables/useLogout'
import { cn } from '@/lib/utils'
import UserBadge from './UserBadge.vue'

defineProps<{ user: User }>()
const route = useRoute()
const router = useRouter()
const logout = useLogout()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label="Account menu"
      :title="user.displayName"
      class="group flex items-center gap-1.5 rounded-sm p-1 outline-none"
    >
      <!-- Single indicator: the avatar ring shows keyboard focus, open state or current page -->
      <UserBadge
        :name="user.displayName"
        :class="cn(
          'ring-offset-2 ring-offset-black transition-shadow duration-200 group-hover:ring-2 group-hover:ring-white/30 group-focus-visible:ring-2 group-focus-visible:ring-primary group-data-[state=open]:ring-2 group-data-[state=open]:ring-primary',
          route.path === '/profile' && 'ring-2 ring-primary',
        )"
      />
      <ChevronDownIcon class="size-4 text-white/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" :side-offset="8" class="w-60 rounded-sm border-t-4 border-t-primary bg-card p-1">
      <DropdownMenuLabel class="flex items-center gap-3 px-2 py-2 font-normal">
        <UserBadge :name="user.displayName" />
        <span class="min-w-0">
          <span class="block truncate text-sm font-bold text-white">{{ user.displayName }}</span>
          <span class="block truncate text-xs text-muted-foreground">{{ user.email }}</span>
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer gap-2 py-2" @select="router.push('/profile')">
        <UserIcon class="size-4" /> Profile
      </DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer gap-2 py-2" @select="logout">
        <LogOutIcon class="size-4" /> Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
