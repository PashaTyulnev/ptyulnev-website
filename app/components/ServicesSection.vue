<script setup lang="ts">
import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

const shopware = {
  title: 'Shopware 6 Lösungen',
  description:
    'Shopware 6 ist mein Schwerpunkt: individuelle Plugin-Entwicklung, Template-Anpassungen und Bugfixes im laufenden Betrieb. Daneben entwickle ich eigenständige Business-Software und binde bestehende Systeme über APIs an.',
  highlights: [
    'Personalisierte Angebote',
    'Giftartikel-Markierung',
    'Template-Anpassungen',
    'Migrationstools für Export aus SW5',
    'Eigene Themes',
    'Massenverarbeitungstools mit der Shopware API',
    'Dokument-Anpassungen',
    'Kundenkreise-Template',
    'Versionsupdates',
  ],
}

const otherServices = [
  {
    title: 'Individuelle Software',
    description:
      'Maßgeschneiderte Tools für Unternehmen — z. B. Zeiterfassung, Auswertungen, Dienstplanung, Rechnungs- und Angebotsverwaltung oder Lagerübersichten. Alles, was sonst in Excel-Tabellen verwaltet wird.',
  },
  {
    title: 'API-Integrationen und Automatisierung',
    description:
      'Ich verbinde Shopware, interne Systeme und externe Plattformen über stabile Schnittstellen und automatisiere wiederkehrende Abläufe.',
  },
  {
    title: 'Bugfixing und Performance',
    description:
      'Schnelle, zuverlässige Fehlerbehebung und spürbare Performance-Verbesserungen in bestehendem Code — egal von wem er ursprünglich stammt.',
  },
]

const trustStats = [
  { value: '8+', label: 'Jahre Berufserfahrung' },
  { value: '20+', label: 'API-Integrationen' },
  { value: '4+', label: 'Jahre produktive SaaS-Entwicklung' },
  { value: 'Min. → Sek.', label: 'Performance verbessert' },
]
</script>

<template>
  <section
    id="leistungen"
    ref="root"
    class="relative overflow-x-hidden border-t border-line py-28 lg:py-36"
  >
    <div
      class="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[120px] light:bg-black/[0.035]"
    />

    <div class="relative mx-auto w-full max-w-[1200px] px-6">
      <SectionHeading
        eyebrow="Leistungen"
        title="Shopware 6 und individuelle Business-Software."
        lead="Shopware 6 ist mein Schwerpunkt — dazu entwickle ich eigenständige Softwarelösungen, binde bestehende Systeme über APIs an und arbeite mit komplexen Geschäftsprozessen."
      />

      <div class="mt-14 space-y-4">
        <article
          data-reveal
          class="reveal-init group relative overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] light:bg-black/[0.025] light:hover:border-black/15 light:hover:bg-black/[0.04]"
        >
          <span class="text-sm font-semibold tabular-nums text-dim">01</span>
          <h3 class="mt-4 text-xl font-semibold tracking-tight text-fog">
            {{ shopware.title }}
          </h3>
          <p class="mt-3 max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">
            {{ shopware.description }}
          </p>
          <ul class="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <li
              v-for="item in shopware.highlights"
              :key="item"
              class="flex items-start gap-2 text-sm text-muted"
            >
              <span class="mt-2 size-1 shrink-0 rounded-full bg-dim" />
              {{ item }}
            </li>
          </ul>
        </article>

        <div class="grid gap-4 sm:grid-cols-3">
          <article
            v-for="(service, index) in otherServices"
            :key="service.title"
            data-reveal
            class="reveal-init group relative overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] light:bg-black/[0.025] light:hover:border-black/15 light:hover:bg-black/[0.04]"
          >
            <span class="text-sm font-semibold tabular-nums text-dim">
              0{{ index + 2 }}
            </span>
            <h3 class="mt-4 text-xl font-semibold tracking-tight text-fog">
              {{ service.title }}
            </h3>
            <p class="mt-3 text-[0.95rem] leading-relaxed text-muted">
              {{ service.description }}
            </p>
          </article>
        </div>

        <div
          data-reveal
          class="reveal-init grid grid-cols-2 gap-x-4 gap-y-8 rounded-2xl border border-line bg-white/[0.03] p-7 backdrop-blur-md light:bg-black/[0.025] sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-line"
        >
          <div
            v-for="stat in trustStats"
            :key="stat.label"
            class="text-center sm:px-4 sm:first:pl-0 sm:last:pr-0"
          >
            <div class="text-2xl font-semibold tabular-nums tracking-tight text-fog sm:text-3xl">
              {{ stat.value }}
            </div>
            <div class="mt-1.5 text-xs leading-relaxed text-dim">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
