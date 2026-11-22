<script setup lang="ts">
import { ref, computed } from 'vue'


const { data: caseStudies } = await useCaseStudies()

const activeCategory = ref<string | null>(null)

const categories = computed(() =>
  [...new Set(caseStudies.value.map((c) => c.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'de'),
  ),
)

const filtered = computed(() =>
  activeCategory.value
    ? caseStudies.value.filter((c) => c.category === activeCategory.value)
    : caseStudies.value,
)

usePageSeo({
  title: 'Fallstudien: gelöste Software-Probleme aus der Praxis',
  description: 'Echte Fälle aus Projekten: Performance, Integrationen, Debugging und Automatisierung mit Symfony, Shopware und KI – mit Ausgangslage, Vorgehen und Ergebnis.',
  path: '/fallstudien',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd([
          { name: 'Startseite', path: '/' },
          { name: 'Fallstudien', path: '/fallstudien' },
        ]),
      ),
    },
  ],
})
</script>

<template>
  <main class="relative pb-28 pt-32">
    <div class="mx-auto w-full max-w-[1200px] px-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fog"
      >
        <span aria-hidden="true">←</span>
        Zurück zur Startseite
      </NuxtLink>

      <SectionHeading
        class="mt-8"
        eyebrow="Fallstudien"
        title="Probleme, die ich gelöst habe."
        lead="Echte Fälle aus Projekten: Was war kaputt oder langsam, wie habe ich die Ursache gefunden — und was hat die Lösung gebracht."
      />

      <div
        v-if="categories.length > 1"
        class="mt-12 flex flex-wrap gap-2"
        role="group"
        aria-label="Nach Kategorie filtern"
      >
        <button
          type="button"
          class="rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-150"
          :class="
            activeCategory === null
              ? 'border-line-strong bg-fog text-ink'
              : 'border-line text-muted hover:border-line-strong hover:text-fog'
          "
          :aria-pressed="activeCategory === null"
          @click="activeCategory = null"
        >
          Alle ({{ caseStudies.length }})
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-150"
          :class="
            activeCategory === cat
              ? 'border-line-strong bg-fog text-ink'
              : 'border-line text-muted hover:border-line-strong hover:text-fog'
          "
          :aria-pressed="activeCategory === cat"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <p v-if="!caseStudies.length" class="mt-14 text-muted">
        Die ersten Fallstudien folgen in Kürze.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="cs in filtered"
          :key="cs.slug"
          :to="`/fallstudien/${cs.slug}`"
          class="group flex flex-col gap-4 rounded-2xl border border-line bg-ink-soft p-6 transition-all duration-300 hover:border-line-strong sm:p-7"
          :class="cs.featured && !activeCategory ? 'md:col-span-2' : ''"
        >
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.14em] text-dim">
            <span v-if="cs.category">{{ cs.category }}</span>
            <span v-if="cs.category && cs.context" aria-hidden="true">·</span>
            <span v-if="cs.context" class="normal-case tracking-normal">{{ cs.context }}</span>
          </div>

          <h3
            class="text-lg font-semibold tracking-tight text-fog transition-colors duration-300 group-hover:text-fog/80"
            :class="cs.featured && !activeCategory ? 'max-w-[40ch] sm:text-2xl' : ''"
          >
            {{ cs.title }}
          </h3>

          <p class="flex-1 text-sm leading-relaxed text-muted" :class="cs.featured ? 'max-w-[70ch]' : ''">
            {{ cs.summary }}
          </p>

          <dl v-if="cs.metrics.length" class="flex flex-wrap gap-x-8 gap-y-3">
            <div v-for="(m, i) in cs.metrics.slice(0, 3)" :key="i" class="flex flex-col">
              <dt class="order-2 text-xs text-dim">{{ m.label }}</dt>
              <dd class="order-1 text-xl font-semibold tracking-tight text-fog">{{ m.value }}</dd>
            </div>
          </dl>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <ul class="flex flex-wrap gap-1.5">
              <li
                v-for="tech in cs.techStack.slice(0, 5)"
                :key="tech"
                class="rounded-md border border-line px-2 py-0.5 text-[0.7rem] text-muted"
              >
                {{ tech }}
              </li>
            </ul>
            <span class="text-xs text-dim">
              {{ formatCaseStudyDate(cs.date) }}<template v-if="cs.duration"> · {{ cs.duration }}</template>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
