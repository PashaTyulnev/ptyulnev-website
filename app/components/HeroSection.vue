<script setup lang="ts">
const stats = [
  { value: '8+', label: 'Jahre Berufserfahrung' },
  { value: '20+', label: 'API-Integrationen' },
  { value: '4+', label: 'Jahre produktive SaaS-Entwicklung' },
]
</script>

<template>
  <section id="top" class="mx-auto max-w-6xl px-6 pb-20 pt-36 sm:pt-44">
    <p class="text-sm font-medium text-accent">
      Softwareentwickler in Dresden
    </p>
    <h1 class="mt-5 max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
      Ich bringe Ihre Betriebsabläufe in eine Software.
    </h1>
    <p class="mt-6 max-w-[56ch] text-lg text-muted">
      Dienstplanung, Zeiterfassung, Datensammlungen und Auswertungen: Ich
      entwickle Programme, die zu Ihrem Betrieb passen, verbinde Daten aus
      anderen Quellen und entwickle für Shopware. Auch wenn der bisherige
      Entwickler nicht mehr da ist.
    </p>
    <div class="mt-10 flex flex-col gap-3 sm:flex-row">
      <BaseButton href="#bestandsaufnahme">Kostenlose Bestandsaufnahme</BaseButton>
      <BaseButton href="/fallstudien" variant="secondary">Fallstudien ansehen</BaseButton>
    </div>

    <dl class="mt-16 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-3">
      <div v-for="stat in stats" :key="stat.label" class="flex flex-col">
        <dt class="order-2 text-sm text-dim">{{ stat.label }}</dt>
        <dd class="order-1 text-2xl font-semibold tracking-tight">{{ stat.value }}</dd>
      </div>
    </dl>
  </section>
</template>
