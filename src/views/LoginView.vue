<script setup lang="ts">
import { ref } from 'vue'
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
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
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
  <AuthShell title="Log in" headline="Welcome back." tagline="Your programs and every set you've logged are waiting.">
    <form class="grid gap-4" novalidate @submit.prevent="submit">
      <div class="grid gap-2">
        <Label for="email" class="text-xs font-bold uppercase tracking-widest">Email</Label>
        <Input id="email" v-model="email" type="email" autocomplete="email" inputmode="email" required />
      </div>
      <div class="grid gap-2">
        <Label for="password" class="text-xs font-bold uppercase tracking-widest">Password</Label>
        <PasswordInput id="password" v-model="password" autocomplete="current-password" />
      </div>
      <p v-if="error" role="alert" class="rounded-sm border-l-4 border-primary bg-primary/10 px-3 py-2 text-sm text-white">
        {{ error }}
      </p>
      <Button type="submit" size="lg" class="mt-2 w-full" :disabled="loading || !email || !password">
        {{ loading ? 'Logging in…' : 'Log in' }}
      </Button>
      <p class="text-center text-sm text-muted-foreground">
        New here?
        <RouterLink :to="{ path: '/register', query: route.query }" class="font-bold text-primary">
          Create an account
        </RouterLink>
      </p>
    </form>
  </AuthShell>
</template>
