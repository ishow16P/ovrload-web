<script setup lang="ts">
import type { Exercise, SelectedItem, Program, ProgramPayload } from '@/types'
import { PlusIcon } from '@lucide/vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import ExerciseSelector from '@/components/exercise/ExerciseSelector.vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import SelectedExerciseList from './SelectedExerciseList.vue'

const props = defineProps<{ exercises: Exercise[], initial?: Program, saving?: boolean }>()
const emit = defineEmits<{ save: [payload: ProgramPayload] }>()

const name = ref('')
const description = ref('')
const selected = ref<SelectedItem[]>([])
const pickerOpen = ref(false)
// Tablet → side panel, phone → bottom sheet
const isTablet = useMediaQuery('(min-width: 768px)')

watch(() => props.initial, (t) => {
  if (!t) return
  name.value = t.name
  description.value = t.description
  selected.value = t.exercises.filter(te => te.exercise).map(te => ({ exercise: te.exercise, targetSets: te.targetSets, targetWeight: te.targetWeight ?? 0, targetReps: te.targetReps ?? 0 }))
}, { immediate: true })

const selectedIds = computed(() => new Set(selected.value.map(s => s.exercise._id)))
const canSave = computed(() => name.value.trim() && selected.value.length > 0)

function toggle(e: Exercise) {
  selected.value = selectedIds.value.has(e._id)
    ? selected.value.filter(s => s.exercise._id !== e._id)
    : [...selected.value, { exercise: e, targetSets: 3, targetWeight: 0, targetReps: 0 }]
}

function submit() {
  if (!canSave.value) return
  emit('save', {
    name: name.value.trim(),
    description: description.value.trim(),
    exercises: selected.value.map(s => ({ exercise: s.exercise._id, targetSets: s.targetSets, targetWeight: s.targetWeight, targetReps: s.targetReps })),
  })
}
</script>

<template>
  <form class="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:pb-0" @submit.prevent="submit">
    <!-- Library: inline on desktop, Sheet on mobile/tablet -->
    <RedHeaderCard title="Exercise library" class="hidden lg:flex lg:max-h-[calc(100dvh-10rem)] lg:sticky lg:top-20">
      <ExerciseSelector class="h-full" :exercises="exercises" :selected-ids="selectedIds" @toggle="toggle" />
    </RedHeaderCard>

    <div class="flex flex-col gap-6">
      <RedHeaderCard title="Program details">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="tpl-name" class="text-xs font-bold uppercase tracking-widest">Name</Label>
            <Input id="tpl-name" v-model="name" placeholder="e.g. Pull Day" maxlength="60" required />
          </div>
          <div class="grid gap-2">
            <Label for="tpl-desc" class="text-xs font-bold uppercase tracking-widest">Description</Label>
            <Textarea id="tpl-desc" v-model="description" placeholder="Optional — focus, notes, vibes" rows="2" class="rounded-sm" />
          </div>
        </div>
      </RedHeaderCard>

      <RedHeaderCard :title="`Exercises (${selected.length})`">
        <template #action>
          <Button type="button" size="sm" variant="outline" class="h-7 border-white text-white hover:bg-white hover:text-primary lg:hidden" @click="pickerOpen = true">
            <PlusIcon /> Add
          </Button>
        </template>
        <SelectedExerciseList v-if="selected.length" v-model="selected" />
        <div v-else class="py-8 text-center text-sm text-muted-foreground">
          <span class="hidden lg:inline">Pick exercises from the library on the left.</span>
          <button type="button" class="font-bold text-primary lg:hidden" @click="pickerOpen = true">
            + Add exercises from the master list
          </button>
        </div>
      </RedHeaderCard>

      <!-- Sticky save bar on mobile/tablet, inline on desktop -->
      <div class="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/95 p-4 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <Button type="submit" size="lg" class="w-full" :disabled="!canSave || saving">
          {{ saving ? 'Saving…' : initial ? 'Save changes' : 'Create program' }}
        </Button>
      </div>
    </div>

    <Sheet v-model:open="pickerOpen">
      <SheetContent
        :side="isTablet ? 'right' : 'bottom'"
        :class="isTablet ? 'data-[side=right]:w-[90vw] data-[side=right]:sm:max-w-md border-l-4 border-l-primary' : 'data-[side=bottom]:h-[85dvh] rounded-t-md border-t-4 border-t-primary'"
      >
        <SheetHeader>
          <SheetTitle class="font-extrabold uppercase">
            Add exercises · {{ selected.length }} selected
          </SheetTitle>
        </SheetHeader>
        <ExerciseSelector class="min-h-0 flex-1 px-4" :exercises="exercises" :selected-ids="selectedIds" @toggle="toggle" />
        <div class="border-t border-white/10 p-4">
          <Button type="button" class="w-full" @click="pickerOpen = false">
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </form>
</template>
