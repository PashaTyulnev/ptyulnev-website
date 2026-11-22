<script setup lang="ts">
const services = [
  {
    illustration: resolveComponent('IllustrationsDigitize'),
    title: 'Betriebsabläufe digitalisieren',
    text: 'Aus Excel-Listen, Papierformularen und Handarbeit werden Programme, die genau zu Ihrem Betrieb passen.',
    points: ['Dienstplanung und Zeiterfassung', 'Interne Verwaltungs-Tools', 'Rechnungen, Angebote und PDFs'],
  },
  {
    illustration: resolveComponent('IllustrationsIntegrate'),
    title: 'Daten verbinden und auswerten',
    text: 'Daten aus verschiedenen Systemen, Dateien und Geräten an einer Stelle sammeln und verständlich auswerten.',
    points: ['Schnittstellen und Importe', 'Automatische Abgleiche', 'Auswertungen und Reports'],
  },
  {
    illustration: resolveComponent('IllustrationsShopware'),
    title: 'Shopware entwickeln',
    text: 'Plugins, Anpassungen und Wartung für Shopware 6, dort wo Standard-Erweiterungen nicht reichen.',
    points: ['Individuelle Plugins und Themes', 'Wartung und Versionsupdates', 'Migration von Shopware 5'],
  },
  {
    illustration: resolveComponent('IllustrationsTakeover'),
    title: 'Software übernehmen',
    text: 'Wenn der bisherige Entwickler nicht mehr da ist, arbeite ich mich ein und bringe das System wieder in sichere Hände.',
    points: ['Code verstehen und dokumentieren', 'Fehler finden und beheben', 'Weiterentwicklung'],
  },
]
</script>

<template>
  <section id="leistungen" class="border-t border-line py-24">
    <div class="mx-auto max-w-6xl px-6">
      <SectionHeading
        eyebrow="Leistungen"
        title="Software, die zu Ihrem Betrieb passt."
        lead="Der gemeinsame Nenner: Abläufe verstehen, Fehler finden und passende Software bauen oder verbessern."
      />
      <div class="mt-12 grid gap-4 md:grid-cols-2">
        <article
          v-for="(service, index) in services"
          :key="service.title"
          class="flex flex-col rounded-xl border border-line bg-ink-soft p-7"
        >
          <component :is="service.illustration" class="mb-6 w-full max-w-md text-fog" />
          <span class="text-sm font-semibold tabular-nums text-accent">0{{ index + 1 }}</span>
          <h3 class="mt-3 text-xl font-semibold tracking-tight">{{ service.title }}</h3>
          <p class="mb-6 mt-3 text-[0.95rem] leading-relaxed text-muted">{{ service.text }}</p>
          <ul class="mt-auto space-y-2 border-t border-line pt-5 text-sm">
            <li v-for="point in service.points" :key="point" class="flex gap-2">
              <span class="text-accent" aria-hidden="true">✓</span>{{ point }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
