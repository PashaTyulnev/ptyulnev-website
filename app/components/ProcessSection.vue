<script setup lang="ts">
const steps = [
  { title: 'Kurzes Gespräch', text: 'Sie schildern, wo es hakt. Wir vereinbaren einen Termin für die Bestandsaufnahme.' },
  { title: 'Bestandsaufnahme', text: 'Kostenlos: Ich schaue mir Abläufe, Programme und Daten genau an und sage ehrlich, was sinnvoll ist.' },
  { title: 'Angebot', text: 'Wenn Sie möchten, bekommen Sie einen klaren Vorschlag mit Preis für die Umsetzung. Ohne Verpflichtung.' },
  { title: 'Umsetzung', text: 'Ich setze um, übergebe sauber und betreue das System auf Wunsch weiter.' },
]
</script>

<template>
  <section class="border-t border-line py-24">
    <div class="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow="Ablauf" title="So arbeiten wir zusammen." />
      <ol class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(step, index) in steps" :key="step.title" class="border-t-2 border-accent pt-5">
          <span class="text-sm font-semibold tabular-nums text-accent">Schritt {{ index + 1 }}</span>
          <h3 class="mt-2 font-semibold">{{ step.title }}</h3>
          <p class="mt-2 text-[0.95rem] leading-relaxed text-muted">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
