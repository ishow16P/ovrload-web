<script setup lang="ts">
import type { WorkoutLog } from '@/types'
import { ArrowLeftIcon, Trash2Icon } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/layout/ConfirmDialog.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import WorkoutSummary from '@/components/workout/WorkoutSummary.vue'
import { api, errorMessage } from '@/lib/api'

const props = defineProps<{ id: string }>()
const router = useRouter()
const log = ref<WorkoutLog>()

onMounted(async () => {
  try {
    log.value = await api.logs.get(props.id)
  }
  catch (err) {
    toast.error(errorMessage(err))
    router.replace('/history')
  }
})

const dateLabel = computed(() => log.value
  ? new Date(log.value.startedAt).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '')

async function remove() {
  try {
    await api.logs.remove(props.id)
    toast.success('Workout deleted')
    router.push('/history')
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
}
</script>

<template>
  <div v-if="!log" class="container-page space-y-4 py-10">
    <Skeleton class="h-32 rounded-sm" />
    <Skeleton v-for="i in 2" :key="i" class="h-40 rounded-sm" />
  </div>

  <template v-else>
    <PageHeader eyebrow="Workout recap" :title="log.programName || 'Workout'" :subtitle="dateLabel">
      <template #actions>
        <Button variant="outline" as-child>
          <RouterLink to="/history">
            <ArrowLeftIcon /> Back
          </RouterLink>
        </Button>
        <ConfirmDialog title="Delete this workout?" description="This can't be undone." confirm-label="Delete" @confirm="remove">
          <Button variant="outline" size="icon" aria-label="Delete workout">
            <Trash2Icon />
          </Button>
        </ConfirmDialog>
      </template>
    </PageHeader>

    <WorkoutSummary :log="log" />

    <section class="container-page py-8 md:py-10">
      <div class="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RedHeaderCard v-for="(entry, i) in log.entries" :key="entry._id" v-reveal="i" :title="entry.exercise?.name ?? 'Deleted exercise'">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                <th class="pb-2 text-left font-bold">
                  Set
                </th>
                <th class="pb-2 text-right font-bold">
                  kg
                </th>
                <th class="pb-2 text-right font-bold">
                  Reps
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(s, i) in entry.sets"
                :key="i"
                :class="['border-t border-white/5', !s.completed && 'text-white/30 line-through']"
              >
                <td class="py-2 font-black" :class="s.completed && 'text-primary'">
                  {{ i + 1 }}
                </td>
                <td class="py-2 text-right tabular-nums">
                  {{ s.weight }}
                </td>
                <td class="py-2 text-right tabular-nums">
                  {{ s.reps }}
                </td>
              </tr>
            </tbody>
          </table>
        </RedHeaderCard>
      </div>
    </section>
  </template>
</template>
