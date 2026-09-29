<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '@/components/auth/AuthShell.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { errorMessage } from '@/lib/api'
import { safeRedirect } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const displayName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const pwTooShort = computed(() => password.value.length > 0 && password.value.length < 8)

async function submit() {
  if (pwTooShort.value) return
  error.value = ''
  loading.value = true
  try {
    await auth.register(email.value, password.value, displayName.value)
    router.replace(safeRedirect(route.query.redirect))
  }
  catch (err) {
    error.value = errorMessage(err)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Join Ovrload" headline="Start the grind." tagline="Free account. Build programs, log every set, watch the numbers climb.">
    <form class="grid gap-4" novalidate @submit.prevent="submit">
      <div class="grid gap-2">
        <Label for="name" class="text-xs font-bold uppercase tracking-widest">Display name</Label>
        <Input id="name" v-model="displayName" autocomplete="nickname" maxlength="40" placeholder="What should we call you?" />
      </div>
      <div class="grid gap-2">
        <Label for="email" class="text-xs font-bold uppercase tracking-widest">Email</Label>
        <Input id="email" v-model="email" type="email" autocomplete="email" inputmode="email" required />
      </div>
      <div class="grid gap-2">
        <Label for="password" class="text-xs font-bold uppercase tracking-widest">Password</Label>
        <PasswordInput id="password" v-model="password" autocomplete="new-password" :minlength="8" />
        <p :class="['text-xs', pwTooShort ? 'text-primary' : 'text-muted-foreground']">
          At least 8 characters.
        </p>
      </div>
      <p v-if="error" role="alert" class="rounded-sm border-l-4 border-primary bg-primary/10 px-3 py-2 text-sm text-white">
        {{ error }}
      </p>
      <Button type="submit" size="lg" class="mt-2 w-full" :disabled="loading || !email || password.length < 8">
        {{ loading ? 'Creating account…' : 'Create account' }}
      </Button>
      <p class="text-center text-sm text-muted-foreground">
        Already have an account?
        <RouterLink :to="{ path: '/login', query: route.query }" class="font-bold text-primary">
          Log in
        </RouterLink>
      </p>
    </form>
  </AuthShell>
</template>
