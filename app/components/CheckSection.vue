<script setup lang="ts">
const included = [
  'Gespräch über einen konkreten Ablauf oder ein Softwareproblem',
  'Kurzer Blick auf den bestehenden Prozess oder Code',
  'Schriftliche Einschätzung: Was ist das Problem, was wäre eine sinnvolle Lösung, mit welchem Aufwand ist zu rechnen?',
  'Anschließend ein separates Festpreis-Angebot für die Umsetzung',
]

const mailto =
  'mailto:kontakt@ptyulnev.de?subject=' + encodeURIComponent('Anfrage Prozess- und Softwarecheck')
</script>

<template>
  <section id="check" class="border-t border-line py-24">
    <div class="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div>
        <SectionHeading
          eyebrow="Der Einstieg"
          title="Prozess- und Softwarecheck"
          lead="Ein kleines, klar begrenztes Erstprojekt. Danach wissen Sie, woran es liegt und was eine Lösung kosten würde, ohne sich gleich auf ein großes Projekt festzulegen."
        />
        <ul class="mt-10 space-y-4">
          <li v-for="item in included" :key="item" class="flex gap-3">
            <span class="text-accent" aria-hidden="true">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="rounded-xl border border-line bg-surface p-8">
        <p class="text-sm text-muted">Festpreis, je nach Umfang</p>
        <p class="mt-2 text-4xl font-semibold tracking-tight">500–900 €</p>
        <p class="mt-4 text-sm leading-relaxed text-muted">
          Den genauen Preis legen wir vorher gemeinsam fest. Die Umsetzung ist
          ein eigenes Angebot, über das Sie frei entscheiden.
        </p>
        <BaseButton :href="mailto" class="mt-8 w-full">Check anfragen</BaseButton>
      </div>
    </div>
  </section>
</template>
