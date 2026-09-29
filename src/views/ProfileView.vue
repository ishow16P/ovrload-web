<script setup lang="ts">
import { LogOutIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import UserBadge from '@/components/layout/UserBadge.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogout } from '@/composables/useLogout'
import { errorMessage } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const logout = useLogout()

// Display name
const name = ref('')
watch(user, u => (name.value = u?.displayName ?? ''), { immediate: true })
const nameChanged = computed(() => !!name.value.trim() && name.value.trim() !== user.value?.displayName)
const savingName = ref(false)
async function saveName() {
  if (!nameChanged.value) return
  savingName.value = true
  try {
    await auth.updateName(name.value.trim())
    toast.success('Name updated')
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
  finally {
    savingName.value = false
  }
}

// Password
const pw = reactive({ current: '', next: '', confirm: '' })
const pwError = ref('')
const savingPw = ref(false)
const pwHint = computed(() => {
  if (pw.next && pw.next.length < 8) return 'At least 8 characters.'
  if (pw.next && pw.next === pw.current) return 'New password must be different.'
  if (pw.confirm && pw.confirm !== pw.next) return 'Passwords don\'t match.'
  return ''
})
const canSavePw = computed(() => pw.current && pw.next.length >= 8 && pw.confirm === pw.next && pw.next !== pw.current)
async function savePassword() {
  if (!canSavePw.value) return
  pwError.value = ''
  savingPw.value = true
  try {
    await auth.changePassword(pw.current, pw.next)
    Object.assign(pw, { current: '', next: '', confirm: '' })
    toast.success('Password updated — other devices were logged out')
  }
  catch (err) {
    pwError.value = errorMessage(err)
  }
  finally {
    savingPw.value = false
  }
}

const memberSince = computed(() => user.value?.createdAt
  ? new Date(user.value.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  : '')
const labelCls = 'text-xs font-bold uppercase tracking-widest'
</script>

<template>
  <PageHeader v-if="user" eyebrow="Account" :title="user.displayName" :subtitle="user.email">
    <template #actions>
      <UserBadge :name="user.displayName" size="lg" />
    </template>
  </PageHeader>

  <section v-if="user" class="container-page py-8 md:py-10">
    <div class="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-2">
      <div class="flex flex-col gap-6">
        <RedHeaderCard v-reveal title="Display name">
          <form class="grid gap-4" @submit.prevent="saveName">
            <div class="grid gap-2">
              <Label for="displayName" :class="labelCls">Name</Label>
              <Input id="displayName" v-model="name" maxlength="40" autocomplete="nickname" required />
              <p class="text-xs text-muted-foreground">
                Shown in the navbar. Up to 40 characters.
              </p>
            </div>
            <Button type="submit" class="justify-self-start" :disabled="!nameChanged || savingName">
              {{ savingName ? 'Saving…' : 'Save name' }}
            </Button>
          </form>
        </RedHeaderCard>

        <RedHeaderCard v-reveal="1" title="Account">
          <dl class="divide-y divide-white/5 text-sm">
            <div class="flex justify-between gap-3 py-2.5">
              <dt class="text-muted-foreground">
                Email
              </dt>
              <dd class="truncate font-bold">
                {{ user.email }}
              </dd>
            </div>
            <div class="flex justify-between gap-3 py-2.5">
              <dt class="text-muted-foreground">
                Member since
              </dt>
              <dd class="font-bold">
                {{ memberSince }}
              </dd>
            </div>
          </dl>
          <Button variant="outline" class="mt-4" @click="logout">
            <LogOutIcon /> Log out
          </Button>
        </RedHeaderCard>
      </div>

      <RedHeaderCard v-reveal="2" title="Change password">
        <form class="grid gap-4" novalidate @submit.prevent="savePassword">
          <input type="text" name="username" autocomplete="username" :value="user.email" class="hidden" readonly>
          <div class="grid gap-2">
            <Label for="currentPassword" :class="labelCls">Current password</Label>
            <PasswordInput id="currentPassword" v-model="pw.current" autocomplete="current-password" />
          </div>
          <div class="grid gap-2">
            <Label for="newPassword" :class="labelCls">New password</Label>
            <PasswordInput id="newPassword" v-model="pw.next" autocomplete="new-password" :minlength="8" />
          </div>
          <div class="grid gap-2">
            <Label for="confirmPassword" :class="labelCls">Confirm new password</Label>
            <PasswordInput id="confirmPassword" v-model="pw.confirm" autocomplete="new-password" :minlength="8" />
          </div>
          <p :class="['text-xs', pwHint ? 'text-primary' : 'text-muted-foreground']">
            {{ pwHint || 'At least 8 characters. Other devices will be logged out.' }}
          </p>
          <p v-if="pwError" role="alert" class="animate-shake rounded-sm border-l-4 border-primary bg-primary/10 px-3 py-2 text-sm text-white">
            {{ pwError }}
          </p>
          <Button type="submit" class="justify-self-start" :disabled="!canSavePw || savingPw">
            {{ savingPw ? 'Updating…' : 'Update password' }}
          </Button>
        </form>
      </RedHeaderCard>
    </div>
  </section>
</template>
