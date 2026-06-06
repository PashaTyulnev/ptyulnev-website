<script setup lang="ts">
import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

const currentYear = new Date().getFullYear()
</script>

<template>
  <section
    id="kontakt"
    ref="root"
    class="relative border-t border-line py-28 lg:py-36"
  >
    <div class="relative mx-auto w-full max-w-[1200px] px-6">
      <div
        data-reveal
        class="reveal-init relative overflow-hidden rounded-3xl border border-line bg-white/[0.04] px-8 py-16 text-center backdrop-blur-xl sm:px-16 sm:py-20"
      >
        <div
          class="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[110px]"
        />

        <div class="relative">
          <span
            class="text-xs font-medium uppercase tracking-[0.16em] text-muted"
          >
            Kontakt
          </span>

          <h2
            class="mx-auto mt-5 max-w-[20ch] text-3xl font-semibold tracking-[-0.03em] text-fog sm:text-5xl"
          >
            Lassen Sie uns über Ihre Prozesse sprechen.
          </h2>

          <p class="mx-auto mt-5 max-w-[44ch] text-base text-muted sm:text-lg">
            Erzählen Sie mir, wo in Ihrem Unternehmen Zeit verloren geht — wir
            finden heraus, was sich automatisieren oder digitalisieren lässt.
          </p>

          <div
            class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <BaseButton href="mailto:kontakt@ptyulnev.de" variant="primary">
              Gespräch vereinbaren
            </BaseButton>
            <BaseButton href="mailto:kontakt@ptyulnev.de" variant="secondary">
              kontakt@ptyulnev.de
            </BaseButton>
          </div>
        </div>
      </div>

      <footer
        class="mt-14 flex flex-col items-center justify-between gap-4 text-sm text-dim sm:flex-row"
      >
        <span>© {{ currentYear }} Pavel Tyulnev · ptyulnev.de</span>
        <nav class="flex items-center gap-6">
          <NuxtLink
            to="/impressum"
            class="transition-colors duration-150 hover:text-fog"
          >
            Impressum
          </NuxtLink>
          <NuxtLink
            to="/datenschutz"
            class="transition-colors duration-150 hover:text-fog"
          >
            Datenschutz
          </NuxtLink>
        </nav>
      </footer>
    </div>
  </section>
</template>
