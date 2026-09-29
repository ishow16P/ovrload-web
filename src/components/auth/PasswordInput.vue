<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from '@lucide/vue'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'

const model = defineModel<string>({ default: '' })
defineProps<{ id: string, autocomplete: string, minlength?: number }>()
const visible = ref(false)
</script>

<template>
  <div class="relative">
    <Input
      :id="id"
      v-model="model"
      :type="visible ? 'text' : 'password'"
      :autocomplete="autocomplete"
      :minlength="minlength"
      required
      class="pr-11"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-white/50 hover:text-white"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      @click="visible = !visible"
    >
      <EyeOffIcon v-if="visible" class="size-4" />
      <EyeIcon v-else class="size-4" />
    </button>
  </div>
</template>
