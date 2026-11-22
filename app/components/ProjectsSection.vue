<script setup lang="ts">

interface CaseStudy {
  sector: string
  problem: string
  solution: string
  result: string
  url?: string
}

const projects: CaseStudy[] = [
  {
    sector: 'SecureTime',
    url: 'https://securetime.de',
    problem:
      'Dienstpläne, Zeiterfassung und Einsatznachweise wurden manuell in Excel gepflegt — fehleranfällig, unübersichtlich und schwer skalierbar.',
    solution:
      'Eine individuelle Unternehmenssoftware für einen Sicherheitsdienst: Schichtplanung, Mitarbeiterverwaltung, digitale Zeiterfassung, Reporting und PDF-Auswertungen — zugeschnitten auf den bestehenden Betriebsablauf.',
    result:
      'Weniger manuelle Planung, weniger Fehler in der Abrechnung und ein tagesaktueller Überblick über Mitarbeiter, Objekte, Schichten und Arbeitszeiten.',
  },
  {
    sector: 'Parkingplan',
    url: 'https://parkingplan.de',
    problem:
      'Parkplatzbetreiber nehmen Buchungen per Telefon, E-Mail und Excel an und verlieren dabei schnell den Überblick über die Belegung.',
    solution:
      'Eine Parkplatz-Software mit Online-Buchungssystem und Verwaltungsoberfläche, die Betreiber direkt nutzen können.',
    result:
      'Buchungen, Belegung und Kundendaten an einer Stelle, ohne Zettelwirtschaft und doppelte Pflege.',
  },
  {
    sector: 'ParkingSoft',
    problem:
      'Parkplatzbuchungen, Kundendaten und Verfügbarkeiten mussten digital sauber abgebildet und für den Alltag einfach bedienbar gemacht werden.',
    solution:
      'Eine Web-Anwendung für Parkplatzverwaltung mit Buchungsprozess, Verwaltungsoberfläche und über 20 externen und internen API-Integrationen — seit mehr als 4 Jahren produktiv im Einsatz.',
    result:
      'Über 40.000 verarbeitete Buchungen und ein durchgängig digitaler Ablauf von der Buchung bis zur Verwaltung.',
  },
  {
    sector: 'Shopware Plugins',
    problem:
      'Shopware-Prozesse wie Produktdaten, Bestellungen, Schnittstellen oder wiederkehrende Admin-Aufgaben waren zu manuell oder nicht passend automatisiert.',
    solution:
      'Individuelle Plugins, Produkt- und Bestellschnittstellen sowie Massenverarbeitung und Datenbereinigung — inklusive automatisierter Admin-Prozesse, ohne den bestehenden Shop abzulösen.',
    result:
      'Weniger manuelle Arbeit im Shop-Alltag, stabilere Prozesse und Erweiterungen, die exakt zum bestehenden System passen — ganz ohne unnötigen Systemwechsel.',
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
    class="relative border-t border-line py-24"
  >
    <div class="relative mx-auto w-full max-w-6xl px-6">
      <SectionHeading
        eyebrow="Projekte"
        title="Gelöste Probleme, nicht nur Software."
        lead="Aus manuellen Abläufen, verstreuten Daten und wiederkehrenden Aufgaben entstehen digitale Lösungen mit messbarem Nutzen."
      />

      <div class="mt-14 flex flex-col gap-4">
        <article
          v-for="project in projects"
          :key="project.sector"
          class="grid gap-6 rounded-2xl border border-line bg-ink-soft p-7 transition-colors duration-300 hover:border-line-strong lg:grid-cols-[200px_1fr] lg:gap-10 lg:p-9"
        >
          <div>
            <span
              class="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium tracking-wide text-muted"
            >
              <span class="size-1.5 rounded-full bg-fog/70" />
              {{ project.sector }}
            </span>
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener"
              class="mt-3 block text-sm text-accent hover:underline"
            >
              {{ project.url.replace('https://', '') }} ↗
            </a>
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
        Ausgewählte Projekte.
        <NuxtLink to="/fallstudien" class="text-accent hover:underline">Weitere Fälle mit Vorgehen und Ergebnis →</NuxtLink>
      </p>
    </div>
  </section>
</template>
