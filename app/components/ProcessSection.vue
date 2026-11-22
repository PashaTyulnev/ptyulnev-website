<script setup lang="ts">
const steps = [
  { title: 'Kurzes Gespräch', text: 'Sie schildern den Ablauf oder das Problem. Wir klären, ob ein Check sinnvoll ist.' },
  { title: 'Check', text: 'Ich schaue mir Prozess, System oder Code an und schreibe meine Einschätzung auf.' },
  { title: 'Angebot', text: 'Sie bekommen einen klaren Lösungsvorschlag mit Festpreis für die Umsetzung.' },
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
