<script setup lang="ts">
const included = [
  'Gespräch über Ihre Abläufe, Programme und Daten',
  'Gemeinsamer Blick auf den bestehenden Prozess vor Ort oder per Video',
  'Ehrliche Einschätzung, was sich lohnt und was nicht, auch wenn das Ergebnis „lassen Sie es so“ ist',
  'Erst danach, wenn Sie möchten, ein konkretes Angebot für die Umsetzung',
]

const mailto =
  'mailto:kontakt@ptyulnev.de?subject=' + encodeURIComponent('Anfrage kostenlose Bestandsaufnahme')
</script>

<template>
  <section id="bestandsaufnahme" class="border-t border-line py-24">
    <div class="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div>
        <SectionHeading
          eyebrow="Der Einstieg"
          title="Kostenlose Bestandsaufnahme"
          lead="Bevor eine Zeile Code entsteht, schaue ich mir genau an, wie Ihr Betrieb arbeitet. Sie bekommen die Lösung, die Sie wirklich brauchen, und nichts, was Ihnen aufgezwungen wird."
        />
        <ul class="mt-10 space-y-4">
          <li v-for="item in included" :key="item" class="flex gap-3">
            <span class="text-accent" aria-hidden="true">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="rounded-xl border border-line bg-ink-soft p-8">
        <p class="text-sm text-muted">Bestandsaufnahme und Analyse</p>
        <p class="mt-2 text-4xl font-semibold tracking-tight">Kostenlos</p>
        <p class="mt-4 text-sm leading-relaxed text-muted">
          Bezahlt wird erst die Umsetzung und die weitere Zusammenarbeit, und
          auch nur, wenn Sie das möchten.
        </p>
        <BaseButton :href="mailto" class="mt-8 w-full">Bestandsaufnahme anfragen</BaseButton>
      </div>
    </div>
  </section>
</template>
