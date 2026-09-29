<script setup lang="ts">
import type { ActivityId, CalorieInput, Goal, Sex } from '@/lib/nutrition'
import { FlameIcon, InfoIcon, TriangleAlertIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import CountUp from '@/components/layout/CountUp.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { ACTIVITY_LEVELS, calculate, GOALS, suggestActivity, validate } from '@/lib/nutrition'
import { cn, numberFmt } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const STORAGE_KEY = 'ovrload:calories'

// Numeric fields stay strings while typing; parsed below.
interface FormState { sex: Sex, age: string, heightCm: string, weightKg: string, bodyFatPct: string, activity: ActivityId, goal: Goal }
const form = reactive<FormState>({ sex: 'male', age: '', heightCm: '', weightKg: '', bodyFatPct: '', activity: 'moderate', goal: 'maintain' })

try {
  Object.assign(form, JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'))
}
catch {}
watch(form, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  }
  catch {}
}, { deep: true })

const num = (s: string) => (s.trim() === '' ? null : Number(s))
const parsed = computed(() => ({ age: num(form.age), heightCm: num(form.heightCm), weightKg: num(form.weightKg), bodyFatPct: num(form.bodyFatPct) }))
const check = computed(() => validate(parsed.value))
const touched = reactive<Record<string, boolean>>({})
const errorFor = (field: keyof typeof parsed.value) => (touched[field] || parsed.value[field] != null ? check.value.errors[field] : undefined)

// Weight-loss targets aren't appropriate for minors.
watch(() => check.value.isMinor, (minor) => {
  if (minor && form.goal === 'cut') form.goal = 'maintain'
})

const result = computed(() => {
  if (!check.value.valid) return null
  const p = parsed.value
  return calculate({ ...form, age: p.age!, heightCm: p.heightCm!, weightKg: p.weightKg!, bodyFatPct: p.bodyFatPct } satisfies CalorieInput)
})

// Logged-in: suggest activity from finished workouts in the last 4 weeks.
const { user } = storeToRefs(useAuthStore())
const perWeek = ref<number | null>(null)
watch(user, async (u) => {
  perWeek.value = null
  if (!u) return
  try {
    const logs = await api.logs.list({ status: 'completed', limit: 200 })
    const since = Date.now() - 28 * 864e5
    perWeek.value = Math.round((logs.filter(l => +new Date(l.startedAt) >= since).length / 4) * 10) / 10
  }
  catch {}
}, { immediate: true })
const suggested = computed(() => (perWeek.value == null ? null : suggestActivity(perWeek.value)))
const suggestedLabel = computed(() => ACTIVITY_LEVELS.find(a => a.id === suggested.value)?.label)

const macroRows = computed(() => result.value
  ? [
      { key: 'Protein', color: 'bg-primary', ...result.value.macros.protein },
      { key: 'Carbs', color: 'bg-white', ...result.value.macros.carbs },
      { key: 'Fat', color: 'bg-white/40', ...result.value.macros.fat },
    ]
  : [])

const chip = (active: boolean) => cn(
  'h-11 flex-1 rounded-sm border text-xs font-bold uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-40',
  active ? 'border-primary bg-primary text-primary-foreground' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white',
)
const fields = [
  { key: 'age', label: 'Age', unit: 'yrs', mode: 'numeric' },
  { key: 'heightCm', label: 'Height', unit: 'cm', mode: 'decimal' },
  { key: 'weightKg', label: 'Weight', unit: 'kg', mode: 'decimal' },
  { key: 'bodyFatPct', label: 'Body fat', unit: '%', mode: 'decimal', optional: true },
] as const
</script>

<template>
  <PageHeader eyebrow="Fuel" title="Calories" subtitle="How much you need to eat each day to cut, maintain or bulk." />

  <section class="container-page py-8 md:py-10">
    <div class="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <!-- FORM -->
      <div class="flex flex-col gap-6">
        <RedHeaderCard v-reveal title="Your stats">
          <div class="grid gap-5">
            <div class="grid gap-2">
              <span class="text-xs font-bold uppercase tracking-widest">Sex</span>
              <div class="flex gap-2" role="radiogroup" aria-label="Sex">
                <button v-for="s in (['male', 'female'] as const)" :key="s" type="button" role="radio" :aria-checked="form.sex === s" :class="chip(form.sex === s)" @click="form.sex = s">
                  {{ s }}
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="f in fields" :key="f.key" class="grid content-start gap-2">
                <Label :for="f.key" class="text-xs font-bold uppercase tracking-widest">
                  {{ f.label }} <span v-if="'optional' in f" class="font-medium normal-case tracking-normal text-muted-foreground">(optional)</span>
                </Label>
                <div class="relative">
                  <Input
                    :id="f.key"
                    v-model="form[f.key]"
                    type="text"
                    :inputmode="f.mode"
                    :aria-invalid="!!errorFor(f.key)"
                    class="h-11 pr-12 text-base font-bold tabular-nums"
                    @blur="touched[f.key] = true"
                  />
                  <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold uppercase text-muted-foreground">{{ f.unit }}</span>
                </div>
                <p v-if="errorFor(f.key)" class="text-xs text-primary">
                  {{ errorFor(f.key) }}
                </p>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">
              Know your body fat %? Add it for a more accurate estimate (Katch-McArdle).
            </p>
          </div>
        </RedHeaderCard>

        <RedHeaderCard v-reveal="1" title="Activity">
          <div v-if="suggested" class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm">
            <span>Last 4 weeks: <b>{{ perWeek }}</b> workouts / week → <b class="uppercase">{{ suggestedLabel }}</b></span>
            <Button v-if="form.activity !== suggested" size="sm" @click="form.activity = suggested!">
              Use this
            </Button>
          </div>
          <div class="grid gap-2" role="radiogroup" aria-label="Activity level">
            <button
              v-for="a in ACTIVITY_LEVELS"
              :key="a.id"
              type="button"
              role="radio"
              :aria-checked="form.activity === a.id"
              :class="cn(
                'flex min-h-14 items-center justify-between gap-3 rounded-sm border px-4 py-2 text-left transition-colors',
                form.activity === a.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-background hover:border-white/30',
              )"
              @click="form.activity = a.id"
            >
              <span>
                <span class="block text-sm font-bold uppercase">{{ a.label }}</span>
                <span class="block text-xs text-muted-foreground">{{ a.hint }}</span>
              </span>
              <span :class="cn('text-xs font-black tabular-nums', form.activity === a.id ? 'text-primary' : 'text-white/40')">×{{ a.factor }}</span>
            </button>
          </div>
        </RedHeaderCard>

        <RedHeaderCard v-reveal="2" title="Goal">
          <div class="flex gap-2" role="radiogroup" aria-label="Goal">
            <button
              v-for="g in GOALS"
              :key="g.id"
              type="button"
              role="radio"
              :aria-checked="form.goal === g.id"
              :disabled="g.id === 'cut' && check.isMinor"
              :class="chip(form.goal === g.id)"
              @click="form.goal = g.id"
            >
              {{ g.label }}
            </button>
          </div>
          <p class="mt-3 text-xs text-muted-foreground">
            Cut −20% · Maintain = TDEE · Bulk +10%
          </p>
        </RedHeaderCard>
      </div>

      <!-- RESULT -->
      <div class="flex flex-col gap-6 lg:sticky lg:top-20">
        <div v-if="check.isMinor" role="alert" class="flex gap-3 rounded-sm border-l-4 border-primary bg-card p-4 text-sm">
          <TriangleAlertIcon class="size-5 shrink-0 text-primary" />
          <span>These formulas are built for adults. Under 18 you're still growing — cutting is disabled, and it's worth checking with a doctor or coach.</span>
        </div>

        <template v-if="result">
          <div class="relative animate-fade-up overflow-hidden rounded-sm bg-primary p-6 text-primary-foreground md:p-8">
            <FlameIcon class="absolute -right-4 -bottom-6 size-40 opacity-15" stroke-width="1.5" />
            <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-85">
              Daily target · {{ GOALS.find(g => g.id === form.goal)?.label }}
            </p>
            <p class="mt-2 text-5xl font-black tabular-nums md:text-6xl" data-testid="calorie-target">
              <CountUp :value="result.target" /><span class="ml-2 text-xl font-bold">kcal</span>
            </p>
            <p class="mt-2 text-sm opacity-85">
              Likely range {{ numberFmt.format(result.range[0]) }}–{{ numberFmt.format(result.range[1]) }} kcal
            </p>
          </div>

          <p v-if="result.floored" class="flex gap-2 text-xs text-muted-foreground">
            <InfoIcon class="size-4 shrink-0 text-primary" />
            Raised to the minimum safe intake ({{ numberFmt.format(result.target) }} kcal). Going lower needs professional supervision.
          </p>

          <RedHeaderCard title="Breakdown">
            <dl class="divide-y divide-white/5 text-sm">
              <div class="flex items-center justify-between gap-3 py-2.5">
                <dt>
                  <span class="font-bold uppercase">BMR</span>
                  <span class="block text-xs text-muted-foreground">{{ result.formula }} · energy at rest</span>
                </dt>
                <dd class="font-black tabular-nums">
                  {{ numberFmt.format(result.bmr) }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-3 py-2.5">
                <dt>
                  <span class="font-bold uppercase">TDEE</span>
                  <span class="block text-xs text-muted-foreground">BMR × {{ result.activityFactor }} activity</span>
                </dt>
                <dd class="font-black tabular-nums">
                  {{ numberFmt.format(result.tdee) }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-3 py-2.5">
                <dt>
                  <span class="font-bold uppercase text-primary">Target</span>
                  <span class="block text-xs text-muted-foreground">Adjusted for your goal</span>
                </dt>
                <dd class="font-black tabular-nums text-primary">
                  {{ numberFmt.format(result.target) }}
                </dd>
              </div>
            </dl>
          </RedHeaderCard>

          <RedHeaderCard title="Macros">
            <div class="flex h-3 w-full overflow-hidden rounded-sm bg-white/10">
              <div v-for="m in macroRows" :key="m.key" :class="[m.color, 'basis-0']" :style="{ flexGrow: m.pct }" />
            </div>
            <ul class="mt-4 grid grid-cols-3 gap-3 text-center">
              <li v-for="m in macroRows" :key="m.key" class="rounded-sm bg-background px-2 py-3">
                <span :class="cn('mx-auto mb-2 block h-1 w-6', m.color)" />
                <p class="text-xl font-black tabular-nums">
                  <CountUp :value="m.grams" /><span class="text-xs font-bold text-muted-foreground">g</span>
                </p>
                <p class="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
                  {{ m.key }} · {{ m.pct }}%
                </p>
              </li>
            </ul>
            <p class="mt-3 text-xs text-muted-foreground">
              Protein {{ form.goal === 'cut' ? '2.0' : '1.8' }} g/kg · fat ~25% · carbs fill the rest.
            </p>
          </RedHeaderCard>
        </template>

        <div v-else class="flex animate-fade-up flex-col items-center gap-3 rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
          <FlameIcon class="size-10 text-primary" />
          <p class="text-lg font-extrabold uppercase">
            Fill in your stats
          </p>
          <p class="max-w-xs text-sm text-muted-foreground">
            Age, height and weight — your daily target updates as you type.
          </p>
        </div>

        <p class="text-xs text-muted-foreground">
          Estimates only (±10%), not medical advice. Track your weight for 2–3 weeks and adjust.
        </p>
      </div>
    </div>
  </section>
</template>
