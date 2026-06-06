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
    sector: 'SecureTime',
    problem:
      'Dienstpläne, Zeiterfassung und Einsatznachweise wurden manuell in Excel gepflegt — fehleranfällig, unübersichtlich und schwer skalierbar.',
    solution:
      'Eine individuelle Web-Anwendung für Sicherheitsdienste mit Schichtplanung, Mitarbeiterverwaltung, digitaler Zeiterfassung, Reporting und PDF-Auswertungen.',
    result:
      'Weniger manuelle Planung, weniger Fehler und ein klarer Überblick über Mitarbeiter, Objekte, Schichten und Arbeitszeiten.',
  },
  {
    sector: 'ParkingSoft',
    problem:
      'Parkplatzbuchungen, Kundendaten und Verfügbarkeiten mussten digital sauber abgebildet und für den Alltag einfach bedienbar gemacht werden.',
    solution:
      'Eine moderne Web-Anwendung für Parkplatzverwaltung mit Buchungsprozess, Verwaltungsoberfläche, REST-API-Anbindung und klarer Benutzerführung.',
    result:
      'Ein digitaler Ablauf von der Buchung bis zur Verwaltung — schneller, übersichtlicher und weniger abhängig von manueller Bearbeitung.',
  },
  {
    sector: 'Shopware Plugins',
    problem:
      'Shopware-Prozesse wie Produktdaten, Bestellungen, Schnittstellen oder wiederkehrende Admin-Aufgaben waren zu manuell oder nicht passend automatisiert.',
    solution:
      'Individuelle Shopware-Erweiterungen und Integrationen mit API-Anbindungen, Automatisierungen, Admin-Modulen und sauberer Backend-Logik.',
    result:
      'Weniger manuelle Arbeit im Shop-Alltag, stabilere Prozesse und Erweiterungen, die exakt zum bestehenden Business passen.',
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
        lead="Aus manuellen Abläufen, verstreuten Daten und wiederkehrenden Aufgaben entstehen digitale Lösungen mit messbarem Nutzen."
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
        Ausgewählte Projekte. Weitere Details gerne auf Anfrage.
      </p>
    </div>
  </section>
</template>
