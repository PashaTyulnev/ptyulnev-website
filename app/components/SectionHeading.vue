<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; lead?: string }>()
</script>

<template>
  <div class="max-w-2xl">
    <p v-if="eyebrow" class="text-sm font-medium text-accent">{{ eyebrow }}</p>
    <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
      {{ title }}
    </h2>
    <p v-if="lead" class="mt-4 text-lg text-muted">{{ lead }}</p>
  </div>
</template>
