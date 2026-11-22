<script setup lang="ts">
const problems = [
  {
    title: 'Excel ist zur Datenbank geworden',
    text: 'Mehrere Leute pflegen dieselbe Liste, und niemand weiß genau, welche Version stimmt.',
  },
  {
    title: 'Dienstpläne entstehen von Hand',
    text: 'Schichten, Urlaube und Stunden werden auf Papier oder in Tabellen geplant und am Monatsende mühsam abgerechnet.',
  },
  {
    title: 'Daten werden abgetippt',
    text: 'Papierformulare, E-Mails und Copy-Paste von einem System ins nächste kosten jeden Tag Zeit.',
  },
  {
    title: 'Zahlen liegen überall verstreut',
    text: 'Daten aus Programmen, Geräten und Dateien lassen sich nur mühsam zusammenführen und auswerten.',
  },
  {
    title: 'Der Entwickler ist weg',
    text: 'Die Software läuft, aber niemand weiß mehr genau, wie. Jede Änderung fühlt sich riskant an.',
  },
  {
    title: 'Die Software ist zu langsam',
    text: 'Suchen, Listen und Auswertungen brauchen Sekunden oder Minuten, wo es Millisekunden sein könnten.',
  },
]
</script>

<template>
  <section class="border-t border-line py-24">
    <div class="mx-auto max-w-6xl px-6">
      <div class="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
        <SectionHeading
          eyebrow="Kommt Ihnen das bekannt vor?"
          title="Typische Probleme, mit denen Kunden zu mir kommen."
        />
        <figure>
          <IllustrationsPerformance class="w-full text-fog" />
          <figcaption class="mt-2 text-sm text-dim">
            Aus einem Projekt: Praxis-Software für ca. 200 Zahnarztpraxen.
            <NuxtLink to="/fallstudien" class="text-accent hover:underline">Zu den Fallstudien</NuxtLink>
          </figcaption>
        </figure>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="problem in problems"
          :key="problem.title"
          class="rounded-xl border border-line bg-ink-soft p-6"
        >
          <h3 class="font-semibold">{{ problem.title }}</h3>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">{{ problem.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
