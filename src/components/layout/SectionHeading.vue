<script setup lang="ts">
withDefaults(defineProps<{ title: string, subtitle?: string, align?: 'center' | 'left' }>(), { align: 'center' })
</script>

<template>
  <div v-reveal :class="align === 'center' ? 'mx-auto max-w-2xl text-center' : ''">
    <h2 class="text-2xl text-foreground md:text-3xl">
      {{ title }}
    </h2>
    <span :class="['reveal-bar mt-3 block h-1 w-12 bg-primary', align === 'center' && 'mx-auto']" />
    <p v-if="subtitle" class="mt-4 text-sm text-muted-foreground md:text-base">
      {{ subtitle }}
    </p>
  </div>
</template>
