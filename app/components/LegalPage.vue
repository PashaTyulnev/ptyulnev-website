<script setup lang="ts">
defineProps<{
  title: string
  updated?: string
}>()
</script>

<template>
  <main class="legal mx-auto w-full max-w-3xl px-6 pb-28 pt-32">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fog"
    >
      <span aria-hidden="true">←</span>
      Zurück zur Startseite
    </NuxtLink>

    <h1
      class="mt-8 text-3xl font-semibold tracking-[-0.03em] text-fog sm:text-4xl"
    >
      {{ title }}
    </h1>

    <p v-if="updated" class="mt-3 text-sm text-dim">
      Stand: {{ updated }}
    </p>

    <div class="legal-content mt-10">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.legal-content :deep(h2) {
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-fog);
}

.legal-content :deep(h3) {
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--color-fog);
}

.legal-content :deep(p),
.legal-content :deep(li) {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-muted);
}

.legal-content :deep(p) {
  margin-bottom: 1rem;
}

.legal-content :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.1rem;
  list-style: disc;
}

.legal-content :deep(a) {
  color: var(--color-fog);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.legal-content :deep(strong) {
  color: var(--color-fog);
  font-weight: 600;
}
</style>
