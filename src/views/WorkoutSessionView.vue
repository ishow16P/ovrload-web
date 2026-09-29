<script setup lang="ts">
import type { WorkoutLog } from '@/types'
import { useDebounceFn } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/layout/ConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ExerciseLogCard from '@/components/workout/ExerciseLogCard.vue'
import SessionHeader from '@/components/workout/SessionHeader.vue'
import { api, errorMessage } from '@/lib/api'

const props = defineProps<{ logId: string }>()
const router = useRouter()
const log = ref<WorkoutLog>()
const saving = ref(false)
const dirty = ref(false)

onMounted(async () => {
  try {
    const data = await api.logs.get(props.logId)
    if (data.status === 'completed') return router.replace(`/history/${data._id}`)
    log.value = data
  }
  catch (err) {
    toast.error(errorMessage(err))
    router.replace('/programs')
  }
})

async function save() {
  if (!log.value || !dirty.value) return
  dirty.value = false
  saving.value = true
  try {
    await api.logs.update(log.value._id, { entries: log.value.entries, notes: log.value.notes })
  }
  catch (err) {
    dirty.value = true
    toast.error(`Autosave failed: ${errorMessage(err)}`)
  }
  finally {
    saving.value = false
  }
}
const debouncedSave = useDebounceFn(save, 800)

// Skip the initial load, then autosave on any set change.
watch(() => log.value?.entries, (_, old) => {
  if (!old) return
  dirty.value = true
  debouncedSave()
}, { deep: true })

onBeforeUnmount(() => { save() })

async function finish() {
  if (!log.value) return
  try {
    await save()
    const done = await api.logs.finish(log.value._id)
    toast.success('Workout complete. Beast mode 🔥')
    router.push(`/history/${done._id}`)
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
}

async function discard() {
  if (!log.value) return
  try {
    dirty.value = false
    await api.logs.remove(log.value._id)
    router.push('/programs')
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
}
</script>

<template>
  <div v-if="!log" class="container-page space-y-4 py-10">
    <Skeleton class="h-24 rounded-sm" />
    <Skeleton v-for="i in 3" :key="i" class="h-56 rounded-sm" />
  </div>

  <template v-else>
    <SessionHeader :log="log" :saving="saving" />

    <section class="container-page py-6 md:py-8">
      <div class="grid items-start gap-6 lg:grid-cols-2">
        <ExerciseLogCard v-for="(entry, i) in log.entries" :key="entry._id" v-model="log.entries[i]!" v-reveal="i" />
      </div>
    </section>

    <!-- Sticky action bar — thumb reach on phones -->
    <div class="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/95 backdrop-blur">
      <div class="container-page flex gap-3 py-3">
        <ConfirmDialog
          title="Discard workout?"
          description="This session and every set in it will be deleted."
          confirm-label="Discard"
          @confirm="discard"
        >
          <Button variant="outline" size="lg" class="shrink-0">
            Discard
          </Button>
        </ConfirmDialog>
        <ConfirmDialog
          title="Finish workout?"
          description="Only sets marked done count toward your volume."
          confirm-label="Finish"
          @confirm="finish"
        >
          <Button size="lg" class="flex-1">
            Finish workout
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  </template>
</template>
