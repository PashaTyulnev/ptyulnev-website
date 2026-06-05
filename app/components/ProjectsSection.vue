<script setup lang="ts">
import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

interface CaseStudy {
  sector: string
  problem: string
  solution: string
  result: string
}

const projects: CaseStudy[] = [
  {
    sector: 'Sicherheitsunternehmen',
    problem:
      'Dienstpläne, Einsatznachweise und Zeiterfassung wurden manuell in Excel gepflegt — fehleranfällig und zeitaufwendig.',
    solution:
      'Eine individuelle Web-Anwendung für automatisierte Dienstplanung, digitale Zeiterfassung und Reporting auf Knopfdruck.',
    result:
      'Rund 15 Stunden manuelle Arbeit pro Woche eingespart und deutlich weniger Planungsfehler.',
  },
  {
    sector: 'Agentur',
    problem:
      'Angebote und Rechnungen mussten manuell aus mehreren Tools zusammengetragen werden.',
    solution:
      'Ein automatisierter Workflow, der CRM, Zeiterfassung und Buchhaltung miteinander verbindet.',
    result:
      'Angebotserstellung von Stunden auf Minuten reduziert — bei konsistenten Daten über alle Systeme.',
  },
  {
    sector: 'Dienstleister',
    problem:
      'Eingehende Dokumente mussten manuell gesichtet, ausgelesen und kategorisiert werden.',
    solution:
      'Eine KI-gestützte Verarbeitung, die relevante Daten automatisch extrahiert und korrekt zuordnet.',
    result:
      'Bearbeitungszeit um rund 70 % gesenkt und die Fehlerquote spürbar reduziert.',
  },
]

const facets: { key: keyof CaseStudy; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'solution', label: 'Lösung' },
  { key: 'result', label: 'Ergebnis' },
]
</script>

<template>
  <section
    id="projekte"
    ref="root"
    class="relative border-t border-line py-28 lg:py-36"
  >
    <div class="relative mx-auto w-full max-w-[1200px] px-6">
      <SectionHeading
        eyebrow="Projekte"
        title="Gelöste Probleme, nicht nur Software."
        lead="Jedes Projekt beginnt mit einer konkreten Herausforderung — und endet mit einem messbaren Nutzen."
      />

      <div class="mt-14 flex flex-col gap-4">
        <article
          v-for="project in projects"
          :key="project.sector"
          data-reveal
          class="reveal-init grid gap-6 rounded-2xl border border-line bg-white/[0.03] p-7 backdrop-blur-md transition-colors duration-300 hover:border-white/20 lg:grid-cols-[200px_1fr] lg:gap-10 lg:p-9"
        >
          <div class="flex items-start">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium tracking-wide text-muted"
            >
              <span class="size-1.5 rounded-full bg-fog/70" />
              {{ project.sector }}
            </span>
          </div>

          <dl class="grid gap-6 sm:grid-cols-3">
            <div v-for="facet in facets" :key="facet.key">
              <dt
                class="text-xs font-medium uppercase tracking-[0.14em] text-dim"
              >
                {{ facet.label }}
              </dt>
              <dd class="mt-2 text-[0.95rem] leading-relaxed text-fog/90">
                {{ project[facet.key] }}
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <p class="mt-6 text-sm text-dim">
        Anonymisierte Praxisbeispiele. Reale Referenzen auf Anfrage.
      </p>
    </div>
  </section>
</template>
