<script setup lang="ts">
import { computed } from 'vue'
import { useCountUp } from '@/composables/useCountUp'
import { numberFmt } from '@/lib/utils'

const props = defineProps<{ value: number }>()
const shown = useCountUp(() => props.value)
const text = computed(() => numberFmt.format(shown.value))
</script>

<template>
  <span class="tabular-nums">{{ text }}</span>
</template>
