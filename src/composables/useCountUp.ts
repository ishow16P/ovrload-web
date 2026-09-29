import type { MaybeRefOrGetter } from 'vue'
import { TransitionPresets, usePreferredReducedMotion, useTransition } from '@vueuse/core'
import { computed, toRef } from 'vue'

// Animates a number toward its latest value (e.g. calorie target, stats). Instant under reduced motion.
export function useCountUp(source: MaybeRefOrGetter<number>, duration = 600) {
  const reduced = usePreferredReducedMotion()
  const value = useTransition(toRef(source), {
    duration: computed(() => (reduced.value === 'reduce' ? 0 : duration)),
    transition: TransitionPresets.easeOutExpo,
  })
  return computed(() => Math.round(value.value))
}
