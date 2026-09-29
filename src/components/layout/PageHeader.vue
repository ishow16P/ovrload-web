<script setup lang="ts">
// Dark banner for inner pages — echoes the ref hero at smaller scale.
defineProps<{ eyebrow?: string, title: string, subtitle?: string }>()
</script>

<template>
  <section class="relative overflow-hidden border-b border-white/5 bg-black">
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(238,59,69,0.25),transparent_65%)]" />
    <div class="container-page relative flex flex-col gap-5 py-10 md:flex-row md:items-end md:justify-between md:py-14">
      <div>
        <span v-if="eyebrow" class="eyebrow animate-fade-up">{{ eyebrow }}</span>
        <h1 class="mt-3 animate-fade-up text-3xl [--stagger:1] leading-none text-white sm:text-4xl md:text-5xl">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-3 max-w-xl animate-fade-up [--stagger:2] text-sm text-white/60 md:text-base">
          {{ subtitle }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex animate-fade-up flex-wrap gap-3 [--stagger:3]">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
