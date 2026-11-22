<script setup lang="ts">
const projects = [
  {
    name: 'SecureTime',
    problem:
      'Dienstpläne, Zeiterfassung und Einsatznachweise eines Sicherheitsdienstes liefen über Excel: fehleranfällig und kaum skalierbar.',
    solution:
      'Eine eigene Web-Anwendung mit Schichtplanung, Mitarbeiterverwaltung, digitaler Zeiterfassung und PDF-Auswertungen.',
    result: 'Weniger Planungsaufwand, weniger Fehler und ein klarer Überblick über Schichten und Arbeitszeiten.',
  },
  {
    name: 'ParkingSoft',
    problem:
      'Parkplatzbuchungen, Kundendaten und Verfügbarkeiten sollten digital abgebildet und im Alltag einfach bedienbar sein.',
    solution: 'Eine Web-Anwendung mit Buchungsprozess, Verwaltungsoberfläche und klarer Benutzerführung.',
    result: 'Ein durchgängiger digitaler Ablauf von der Buchung bis zur Verwaltung, ohne Nacharbeit von Hand.',
  },
  {
    name: 'Shopware-Plugins',
    problem:
      'Wiederkehrende Aufgaben im Shop-Alltag, etwa bei Produktdaten und Bestellungen, kosteten unnötig viel Handarbeit.',
    solution: 'Individuelle Shopware-Erweiterungen mit Admin-Modulen, Automatisierungen und sauberer Backend-Logik.',
    result: 'Weniger manuelle Arbeit und Erweiterungen, die genau zum bestehenden Shop passen.',
  },
]

const facets = [
  { key: 'problem', label: 'Problem' },
  { key: 'solution', label: 'Lösung' },
  { key: 'result', label: 'Ergebnis' },
] as const
</script>

<template>
  <section id="projekte" class="border-t border-line py-24">
    <div class="mx-auto max-w-6xl px-6">
      <SectionHeading
        eyebrow="Projekte"
        title="Gelöste Probleme aus der Praxis."
      />
      <div class="mt-12 space-y-4">
        <article
          v-for="project in projects"
          :key="project.name"
          class="grid gap-6 rounded-xl border border-line bg-surface p-7 lg:grid-cols-[180px_1fr] lg:gap-10"
        >
          <h3 class="font-semibold">{{ project.name }}</h3>
          <dl class="grid gap-6 sm:grid-cols-3">
            <div v-for="facet in facets" :key="facet.key">
              <dt class="text-xs font-medium uppercase tracking-wider text-dim">{{ facet.label }}</dt>
              <dd class="mt-2 text-[0.95rem] leading-relaxed text-muted">{{ project[facet.key] }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </div>
  </section>
</template>
