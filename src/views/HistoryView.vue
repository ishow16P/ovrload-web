<script setup lang="ts">
import type { WorkoutLog } from '@/types'
import { ChevronRightIcon } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import PageHeader from '@/components/layout/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import DateBadge from '@/components/workout/DateBadge.vue'
import { api, errorMessage } from '@/lib/api'
import { completedSets, formatDuration, logVolume, numberFmt, plural } from '@/lib/utils'

const logs = ref<WorkoutLog[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    logs.value = await api.logs.list({ limit: 100 })
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
  finally {
    loading.value = false
  }
})

const linkFor = (l: WorkoutLog) => l.status === 'completed' ? `/history/${l._id}` : `/workout/${l._id}`
</script>

<template>
  <PageHeader eyebrow="Logbook" title="History" subtitle="Every session you've put in." />
  <section class="container-page py-8 md:py-10">
    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="i in 4" :key="i" class="h-20 rounded-sm" />
    </div>

    <TransitionGroup v-else-if="logs.length" tag="ul" name="list" appear class="grid gap-3 md:grid-cols-2">
      <li v-for="(l, i) in logs" :key="l._id" :style="{ '--stagger': i }">
        <RouterLink
          :to="linkFor(l)"
          class="card-lift group flex items-center gap-4 rounded-sm border border-white/5 bg-card p-3 hover:border-primary/60 sm:p-4"
        >
          <DateBadge :date="l.startedAt" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-extrabold uppercase group-hover:text-primary">
                {{ l.programName || 'Workout' }}
              </p>
              <Badge v-if="l.status === 'in_progress'" class="shrink-0 rounded-sm bg-primary text-[0.6rem] font-bold uppercase">
                Live
              </Badge>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ plural(completedSets(l), 'set') }} · {{ numberFmt.format(logVolume(l)) }} kg · {{ formatDuration(l) }}
            </p>
          </div>
          <ChevronRightIcon class="size-5 shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
        </RouterLink>
      </li>
    </TransitionGroup>

    <div v-else class="flex flex-col items-center gap-4 py-20 text-center">
      <p class="text-lg font-extrabold uppercase">
        No workouts yet
      </p>
      <p class="text-sm text-muted-foreground">
        Start a program and your sessions will stack up here.
      </p>
      <Button as-child>
        <RouterLink to="/programs">
          Go to programs
        </RouterLink>
      </Button>
    </div>
  </section>
</template>
