<script setup lang="ts">
import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

const services = [
  {
    title: 'Prozessautomatisierung',
    description:
      'Manuelle Abläufe analysieren und durch Software automatisieren — weniger Copy-Paste, weniger Fehler, mehr Zeit für das Wesentliche.',
  },
  {
    title: 'KI-Integration',
    description:
      'Künstliche Intelligenz sinnvoll in bestehende Prozesse und Anwendungen integrieren — dort, wo sie echten Mehrwert schafft.',
  },
  {
    title: 'Individuelle Software',
    description:
      'Webanwendungen und Business-Tools entwickeln, wenn Standardsoftware nicht ausreicht oder zu unflexibel ist.',
  },
  {
    title: 'Beratung & Architektur',
    description:
      'Technische Entscheidungen, Systemarchitektur und Skalierung begleiten — damit Lösungen langfristig tragen.',
  },
]
</script>

<template>
  <section
    id="leistungen"
    ref="root"
    class="relative border-t border-line py-28 lg:py-36"
  >
    <div
      class="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[120px]"
    />

    <div class="relative mx-auto w-full max-w-[1200px] px-6">
      <SectionHeading
        eyebrow="Leistungen"
        title="Ich löse Geschäftsprobleme — nicht nur technische Aufgaben."
        lead="Vier Wege, wie ich Unternehmen helfe, effizienter zu arbeiten und manuelle Arbeit zu eliminieren."
      />

      <div class="mt-14 grid gap-4 sm:grid-cols-2">
        <article
          v-for="(service, index) in services"
          :key="service.title"
          data-reveal
          class="reveal-init group relative overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
        >
          <span class="text-sm font-semibold tabular-nums text-dim">
            0{{ index + 1 }}
          </span>
          <h3 class="mt-4 text-xl font-semibold tracking-tight text-fog">
            {{ service.title }}
          </h3>
          <p class="mt-3 text-[0.95rem] leading-relaxed text-muted">
            {{ service.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
