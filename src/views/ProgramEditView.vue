<script setup lang="ts">
import type { Program, ProgramPayload } from '@/types'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import PageHeader from '@/components/layout/PageHeader.vue'
import ProgramBuilder from '@/components/program/ProgramBuilder.vue'
import { api, errorMessage } from '@/lib/api'
import { useExerciseStore } from '@/stores/exercises'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const store = useExerciseStore()
const { items } = storeToRefs(store)
const initial = ref<Program>()
const saving = ref(false)

onMounted(async () => {
  try {
    await store.load()
    if (props.id) initial.value = await api.programs.get(props.id)
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
})

async function save(payload: ProgramPayload) {
  saving.value = true
  try {
    if (props.id) await api.programs.update(props.id, payload)
    else await api.programs.create(payload)
    toast.success(`${payload.name} saved`)
    router.push('/programs')
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <PageHeader
    eyebrow="Program builder"
    :title="id ? 'Edit program' : 'New program'"
    subtitle="Name it, stack your moves, set sets, starting kg and reps."
  />
  <section class="container-page py-8 md:py-10">
    <ProgramBuilder :exercises="items" :initial="initial" :saving="saving" @save="save" />
  </section>
</template>
