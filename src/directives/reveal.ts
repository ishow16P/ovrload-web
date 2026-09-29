import type { Directive } from 'vue'

// v-reveal / v-reveal="index" → fade-up when scrolled into view, once.
// Only hides content when IntersectionObserver exists and motion is allowed, so nothing can get stuck invisible.
let observer: IntersectionObserver | undefined

function getObserver() {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      observer!.unobserve(entry.target)
    }
    // Huge top margin: anything scrolled past (fast scroll / anchor jump) also counts, so it never pops in on the way back up
  }, { rootMargin: '100000px 0px -8% 0px', threshold: 0 })
  return observer
}

const canAnimate = () =>
  typeof IntersectionObserver !== 'undefined'
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    if (!canAnimate()) return
    el.dataset.reveal = ''
    if (value) el.style.setProperty('--stagger', String(value))
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
