<script setup lang="ts">
import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

const technologies = [
  'Symfony',
  'API Platform',
  'Nuxt',
  'Vue',
  'TypeScript',
  'Shopware',
  'PHP',
  'PostgreSQL',
  'KI / OpenAI',
  'Docker',
]
</script>

<template>
  <section ref="root" class="relative border-t border-line py-20">
    <div class="relative mx-auto w-full max-w-[1200px] px-6 text-center">
      <p
        data-reveal
        class="reveal-init text-xs font-medium uppercase tracking-[0.18em] text-dim"
      >
        Eingesetzte Technologien
      </p>

      <ul
        data-reveal
        class="reveal-init mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
      >
        <li
          v-for="tech in technologies"
          :key="tech"
          class="text-base font-medium text-muted/70 transition-colors duration-200 hover:text-fog"
        >
          {{ tech }}
        </li>
      </ul>
    </div>
  </section>
</template>
