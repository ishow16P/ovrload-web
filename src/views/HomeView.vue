<script setup lang="ts">
import type { Program, WorkoutLog } from '@/types'
import { ActivityIcon, CalendarCheckIcon, DumbbellIcon, FlameIcon, LayersIcon, TrophyIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import CountUp from '@/components/layout/CountUp.vue'
import SectionHeading from '@/components/layout/SectionHeading.vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import { Button } from '@/components/ui/button'
import DateBadge from '@/components/workout/DateBadge.vue'
import { useStartWorkout } from '@/composables/useStartWorkout'
import { api } from '@/lib/api'
import { HERO_IMG } from '@/lib/constants'
import { completedSets, logVolume, numberFmt, plural } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const { user } = storeToRefs(useAuthStore())
const programs = ref<Program[]>([])
const logs = ref<WorkoutLog[]>([])
const { start, starting } = useStartWorkout()

// Guests get the marketing view — no API calls. Home still renders if API is down → empty stats.
watch(user, async (u) => {
  programs.value = []
  logs.value = []
  if (!u) return
  const [t, l] = await Promise.allSettled([api.programs.list(), api.logs.list({ status: 'completed', limit: 200 })])
  if (t.status === 'fulfilled') programs.value = t.value
  if (l.status === 'fulfilled') logs.value = l.value
}, { immediate: true })

const GUEST_FEATURES = [
  { icon: DumbbellIcon, label: '70+ standard lifts', value: null as number | null, suffix: '', text: 'Chest to calves — a full master list ready to go.' },
  { icon: LayersIcon, label: 'Custom programs', value: null as number | null, suffix: '', text: 'Push, pull, legs, bro split — build yours in a minute.' },
  { icon: CalendarCheckIcon, label: 'Set-by-set logging', value: null as number | null, suffix: '', text: 'kg × reps per set, autosaved while you train.' },
  { icon: TrophyIcon, label: 'Track volume', value: null as number | null, suffix: '', text: 'See total volume and sets crushed grow every week.' },
]

const stats = computed(() => {
  if (!user.value) return GUEST_FEATURES
  const weekAgo = Date.now() - 7 * 864e5
  return [
    { icon: CalendarCheckIcon, label: 'Workouts done', value: logs.value.length, suffix: '', text: 'Every session you finish counts toward the grind.' },
    { icon: FlameIcon, label: 'This week', value: logs.value.filter(l => +new Date(l.startedAt) > weekAgo).length, suffix: '', text: 'Sessions logged in the last 7 days. Keep it lit.' },
    { icon: TrophyIcon, label: 'Total volume', value: logs.value.reduce((s, l) => s + logVolume(l), 0), suffix: ' kg', text: 'Weight × reps across every completed set.' },
    { icon: LayersIcon, label: 'Sets crushed', value: logs.value.reduce((s, l) => s + completedSets(l), 0), suffix: '', text: 'Completed working sets across all sessions.' },
  ]
})

const quickProgram = computed(() => programs.value[0])
</script>

<template>
  <!-- HERO -->
  <section class="relative isolate overflow-hidden bg-black">
    <div
      class="absolute inset-0 -z-10 animate-hero-zoom bg-cover bg-center opacity-60 grayscale"
      :style="{ backgroundImage: `url(${HERO_IMG})` }"
    />
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
    <div class="container-page flex min-h-[70svh] flex-col justify-center py-16 md:min-h-[78svh]">
      <span class="eyebrow animate-fade-up self-start">Gen Z Fitness Club</span>
      <h1 class="mt-5 max-w-3xl animate-fade-up [--stagger:1] text-4xl leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Lift heavier.<br>Log <span class="text-primary">smarter.</span>
      </h1>
      <p class="mt-5 max-w-md animate-fade-up text-sm text-white/70 [--stagger:2] md:text-base">
        Build your split, hit start, and track every set in seconds. No fluff — just progress.
      </p>
      <div class="mt-8 flex animate-fade-up flex-wrap gap-3 [--stagger:3]">
        <template v-if="!user">
          <Button size="lg" as-child>
            <RouterLink to="/register">Join Ovrload</RouterLink>
          </Button>
          <Button size="lg" variant="outline" as-child>
            <RouterLink to="/exercises">Explore exercises</RouterLink>
          </Button>
        </template>
        <Button v-else-if="quickProgram" size="lg" :disabled="starting" @click="start(quickProgram._id)">
          Start {{ quickProgram.name }}
        </Button>
        <Button v-else size="lg" as-child>
          <RouterLink to="/programs/new">Build your first program</RouterLink>
        </Button>
        <Button v-if="user" size="lg" variant="outline" as-child>
          <RouterLink to="/programs">Browse programs</RouterLink>
        </Button>
      </div>
    </div>
    <!-- red notch, like the ref's arrow into the next section -->
    <div class="absolute bottom-0 left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rotate-45 bg-primary" />
  </section>

  <!-- RED BAND -->
  <section class="bg-primary text-primary-foreground">
    <div class="container-page grid items-center gap-10 py-14 md:grid-cols-[1fr_auto_1fr] md:py-16">
      <div v-reveal class="text-center md:text-right">
        <h2 class="text-3xl lg:text-4xl">
          My programs
        </h2>
        <p class="mx-auto mt-3 max-w-xs text-sm text-white/85 md:mr-0">
          Push, pull, legs — or whatever your split is. Pick moves from the master list and save it.
        </p>
        <Button variant="outline" class="mt-5 border-white text-white hover:bg-white hover:text-primary" as-child>
          <RouterLink to="/programs">Open programs</RouterLink>
        </Button>
      </div>
      <div v-reveal="1" class="mx-auto hidden size-40 items-center justify-center rounded-full border-4 border-white/30 bg-black/15 md:flex lg:size-48">
        <DumbbellIcon class="size-20 -rotate-45 lg:size-24" stroke-width="1.5" />
      </div>
      <div v-reveal="2" class="text-center md:text-left">
        <h2 class="text-3xl lg:text-4xl">
          My history
        </h2>
        <p class="mx-auto mt-3 max-w-xs text-sm text-white/85 md:ml-0">
          Every session, every set, every PR. Look back and see how far you've come.
        </p>
        <Button variant="outline" class="mt-5 border-white text-white hover:bg-white hover:text-primary" as-child>
          <RouterLink to="/history">View history</RouterLink>
        </Button>
      </div>
    </div>
  </section>

  <!-- STATS / FEATURES -->
  <section class="bg-[#161616] py-16 md:py-20">
    <div class="container-page">
      <SectionHeading
        :title="user ? 'Your progress' : 'Why Ovrload'"
        :subtitle="user ? 'Numbers don\'t lie. Here\'s what you\'ve put in so far.' : 'Everything you need to train with intent — nothing you don\'t.'"
      />
      <div class="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        <div
          v-for="(s, i) in stats"
          :key="s.label"
          v-reveal="i"
          :class="['flex items-start gap-4', i % 2 === 0 && 'sm:flex-row-reverse sm:text-right']"
        >
          <div class="flex size-12 shrink-0 items-center justify-center bg-primary">
            <component :is="s.icon" class="size-6 text-primary-foreground" />
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-white/60">
              {{ s.label }}
            </p>
            <p v-if="s.value != null" class="mt-1 text-2xl font-black text-white">
              <CountUp :value="s.value" />{{ s.suffix }}
            </p>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ s.text }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="!user" class="mt-12 flex justify-center">
        <Button size="lg" as-child>
          <RouterLink to="/register">Create free account</RouterLink>
        </Button>
      </div>
    </div>
  </section>

  <!-- INFO CARDS -->
  <section class="py-16">
    <div class="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RedHeaderCard v-reveal title="Quick start">
        <p v-if="!user" class="text-sm text-muted-foreground">
          <RouterLink to="/login" class="font-bold text-primary">Log in</RouterLink> to start one of your programs in one tap.
        </p>
        <ul v-else-if="programs.length" class="divide-y divide-white/5">
          <li v-for="t in programs.slice(0, 4)" :key="t._id" class="flex items-center justify-between gap-3 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold uppercase">
                {{ t.name }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ t.exercises.length }} exercises
              </p>
            </div>
            <Button size="sm" :disabled="starting" @click="start(t._id)">
              Go
            </Button>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">
          No programs yet. <RouterLink to="/programs/new" class="font-bold text-primary">Create one →</RouterLink>
        </p>
      </RedHeaderCard>

      <RedHeaderCard v-reveal="1" title="Recent sessions">
        <p v-if="!user" class="text-sm text-muted-foreground">
          <RouterLink to="/login" class="font-bold text-primary">Log in</RouterLink> to track your progress and see your latest sessions.
        </p>
        <ul v-else-if="logs.length" class="space-y-3">
          <li v-for="l in logs.slice(0, 3)" :key="l._id">
            <RouterLink :to="`/history/${l._id}`" class="group flex items-center gap-3">
              <DateBadge :date="l.startedAt" />
              <div class="min-w-0">
                <p class="truncate text-sm font-bold uppercase group-hover:text-primary">
                  {{ l.programName || 'Workout' }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ plural(completedSets(l), 'set') }} · {{ numberFmt.format(logVolume(l)) }} kg
                </p>
              </div>
            </RouterLink>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">
          Nothing logged yet. Your first session will show up here.
        </p>
      </RedHeaderCard>

      <RedHeaderCard v-reveal="2" title="How it works" class="md:col-span-2 lg:col-span-1">
        <ol class="space-y-3 text-sm">
          <li v-for="(step, i) in ['Pick exercises from the master list', 'Save them as a program (e.g. Pull Day)', 'Hit start and log kg × reps per set', 'Finish and watch your volume climb']" :key="step" class="flex gap-3">
            <span class="flex size-6 shrink-0 items-center justify-center bg-white/10 text-xs font-black text-primary">{{ i + 1 }}</span>
            <span class="text-white/80">{{ step }}</span>
          </li>
        </ol>
        <div class="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <ActivityIcon class="size-4 text-primary" /> Data autosaves while you train.
        </div>
      </RedHeaderCard>
    </div>
  </section>
</template>
