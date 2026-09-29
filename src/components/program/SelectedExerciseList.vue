<script setup lang="ts">
import type { SelectedItem } from '@/types'
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon, XIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const items = defineModel<SelectedItem[]>({ required: true })

function move(i: number, dir: -1 | 1) {
  const next = [...items.value]
  const [item] = next.splice(i, 1)
  next.splice(i + dir, 0, item!)
  items.value = next
}

function setSets(i: number, delta: number) {
  const item = items.value[i]!
  item.targetSets = Math.min(20, Math.max(1, item.targetSets + delta))
}

function setWeight(i: number, raw: string) {
  const n = Number.parseFloat(raw)
  items.value[i]!.targetWeight = Number.isFinite(n) ? Math.min(1000, Math.max(0, n)) : 0
}

function setReps(i: number, raw: string) {
  const n = Number.parseInt(raw, 10)
  items.value[i]!.targetReps = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0
}

const numCls = 'h-9 w-24 rounded-sm border border-white/10 bg-card pr-11 pl-3 text-sm font-bold tabular-nums outline-none transition-colors duration-200 placeholder:font-medium placeholder:text-white/30 focus:border-primary'
</script>

<template>
  <TransitionGroup tag="ol" name="list" class="space-y-2">
    <li
      v-for="(item, i) in items"
      :key="item.exercise._id"
      class="rounded-sm border border-white/10 bg-background p-2 sm:p-3"
    >
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex size-8 shrink-0 items-center justify-center bg-primary text-xs font-black">{{ i + 1 }}</span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold">
            {{ item.exercise.name }}
          </p>
          <p class="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {{ item.exercise.muscleGroup }}
          </p>
        </div>
        <div class="hidden flex-col sm:flex">
          <Button variant="ghost" size="icon-xs" :disabled="i === 0" aria-label="Move up" @click="move(i, -1)">
            <ChevronUpIcon />
          </Button>
          <Button variant="ghost" size="icon-xs" :disabled="i === items.length - 1" aria-label="Move down" @click="move(i, 1)">
            <ChevronDownIcon />
          </Button>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Remove" @click="items = items.filter((_, j) => j !== i)">
          <XIcon />
        </Button>
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 pl-10 sm:pl-11">
        <div class="flex items-center gap-1" role="group" :aria-label="`${item.exercise.name} sets`">
          <Button variant="ghost" size="icon-sm" aria-label="Fewer sets" @click="setSets(i, -1)">
            <MinusIcon />
          </Button>
          <span class="w-14 text-center text-xs font-bold uppercase tabular-nums">{{ item.targetSets }} <span class="text-muted-foreground">sets</span></span>
          <Button variant="ghost" size="icon-sm" aria-label="More sets" @click="setSets(i, 1)">
            <PlusIcon />
          </Button>
        </div>
        <div class="flex items-center gap-2">
          <label class="relative flex items-center">
            <span class="sr-only">{{ item.exercise.name }} starting weight in kg</span>
            <input
              :value="item.targetWeight || ''"
              type="text"
              inputmode="decimal"
              placeholder="0"
              :class="numCls"
              @change="setWeight(i, ($event.target as HTMLInputElement).value)"
            >
            <span class="pointer-events-none absolute right-3 text-[0.65rem] font-bold uppercase text-muted-foreground">kg</span>
          </label>
          <span class="text-xs font-bold text-white/30">×</span>
          <label class="relative flex items-center">
            <span class="sr-only">{{ item.exercise.name }} starting reps</span>
            <input
              :value="item.targetReps || ''"
              type="text"
              inputmode="numeric"
              placeholder="0"
              :class="numCls"
              @change="setReps(i, ($event.target as HTMLInputElement).value)"
            >
            <span class="pointer-events-none absolute right-3 text-[0.65rem] font-bold uppercase text-muted-foreground">reps</span>
          </label>
        </div>
      </div>
    </li>
  </TransitionGroup>
</template>
