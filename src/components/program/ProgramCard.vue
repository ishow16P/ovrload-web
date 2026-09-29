<script setup lang="ts">
import type { Program } from '@/types'
import { PencilIcon, PlayIcon, Trash2Icon } from '@lucide/vue'
import ConfirmDialog from '@/components/layout/ConfirmDialog.vue'
import RedHeaderCard from '@/components/layout/RedHeaderCard.vue'
import { Button } from '@/components/ui/button'

defineProps<{ program: Program, starting?: boolean }>()
const emit = defineEmits<{ start: [], remove: [] }>()
</script>

<template>
  <RedHeaderCard :title="program.name" class="card-lift">
    <template #action>
      <span class="shrink-0 text-[0.65rem] font-bold uppercase tracking-widest text-white/80">
        {{ program.exercises.length }} moves
      </span>
    </template>
    <div class="flex h-full flex-col">
      <p v-if="program.description" class="mb-3 text-sm text-muted-foreground">
        {{ program.description }}
      </p>
      <ul class="flex-1 space-y-1.5 text-sm">
        <li v-for="te in program.exercises" :key="te.exercise?._id" class="flex justify-between gap-3">
          <span class="truncate text-white/85">{{ te.exercise?.name ?? 'Deleted exercise' }}</span>
          <span class="shrink-0 text-xs text-muted-foreground"><template v-if="te.targetReps">{{ te.targetSets }} × {{ te.targetReps }}</template><template v-else>{{ te.targetSets }} sets</template><template v-if="te.targetWeight"> · {{ te.targetWeight }} kg</template></span>
        </li>
      </ul>
      <div class="mt-5 flex gap-2">
        <Button class="flex-1" :disabled="starting" @click="emit('start')">
          <PlayIcon /> Start
        </Button>
        <Button variant="outline" size="icon" as-child aria-label="Edit program">
          <RouterLink :to="`/programs/${program._id}/edit`">
            <PencilIcon />
          </RouterLink>
        </Button>
        <ConfirmDialog
          :title="`Delete ${program.name}?`"
          description="Past workout logs stay in your history."
          confirm-label="Delete"
          @confirm="emit('remove')"
        >
          <Button variant="outline" size="icon" aria-label="Delete program">
            <Trash2Icon />
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  </RedHeaderCard>
</template>
