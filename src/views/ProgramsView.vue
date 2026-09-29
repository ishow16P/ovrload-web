<script setup lang="ts">
import type { Program } from '@/types'
import { PlusIcon } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import PageHeader from '@/components/layout/PageHeader.vue'
import ProgramCard from '@/components/program/ProgramCard.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useStartWorkout } from '@/composables/useStartWorkout'
import { api, errorMessage } from '@/lib/api'

const programs = ref<Program[]>([])
const loading = ref(true)
const { start, starting } = useStartWorkout()

onMounted(async () => {
  try {
    programs.value = await api.programs.list()
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
  finally {
    loading.value = false
  }
})

async function remove(t: Program) {
  try {
    await api.programs.remove(t._id)
    programs.value = programs.value.filter(x => x._id !== t._id)
    toast.success(`${t.name} deleted`)
  }
  catch (err) {
    toast.error(errorMessage(err))
  }
}
</script>

<template>
  <PageHeader eyebrow="Your splits" title="Programs" subtitle="Pick one and start training. Or build a new split.">
    <template #actions>
      <Button size="lg" as-child>
        <RouterLink to="/programs/new">
          <PlusIcon /> New program
        </RouterLink>
      </Button>
    </template>
  </PageHeader>

  <section class="container-page py-8 md:py-10">
    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton v-for="i in 3" :key="i" class="h-64 rounded-sm" />
    </div>
    <TransitionGroup v-else tag="div" name="list" appear class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProgramCard
        v-for="(t, i) in programs"
        :key="t._id"
        :style="{ '--stagger': i }"
        :program="t"
        :starting="starting"
        @start="start(t._id)"
        @remove="remove(t)"
      />
    </TransitionGroup>
    <div v-if="!loading && !programs.length" class="flex flex-col items-center gap-4 py-20 text-center">
      <p class="text-lg font-extrabold uppercase">
        No programs yet
      </p>
      <p class="text-sm text-muted-foreground">
        Create your first split, e.g. "Pull Day".
      </p>
      <Button as-child>
        <RouterLink to="/programs/new">
          Create program
        </RouterLink>
      </Button>
    </div>
  </section>
</template>
