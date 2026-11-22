<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    lead?: string
    align?: 'left' | 'center'
  }>(),
  {
    eyebrow: undefined,
    lead: undefined,
    align: 'left',
  },
)
</script>

<template>
  <div
    class="flex max-w-2xl flex-col gap-4"
    :class="align === 'center' ? 'mx-auto items-center text-center' : ''"
  >
    <span
      v-if="eyebrow"
      data-reveal
      class="reveal-init inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted"
    >
      <span class="h-px w-6 bg-line-strong" />
      {{ eyebrow }}
    </span>

    <h2
      data-reveal
      class="reveal-init text-3xl font-semibold tracking-[-0.03em] text-fog sm:text-4xl lg:text-[2.85rem] lg:leading-[1.08]"
    >
      {{ title }}
    </h2>

    <p
      v-if="lead"
      data-reveal
      class="reveal-init text-base text-muted sm:text-lg"
    >
      {{ lead }}
    </p>
  </div>
</template>
