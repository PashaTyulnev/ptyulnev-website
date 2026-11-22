<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <section id="kontakt" class="border-t border-line py-24">
    <div class="mx-auto max-w-6xl px-6">
      <div class="rounded-2xl bg-accent-soft px-8 py-16 text-center sm:px-16">
        <h2 class="mx-auto max-w-[22ch] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Welcher Ablauf kostet Sie gerade am meisten Zeit?
        </h2>
        <p class="mx-auto mt-5 max-w-[48ch] text-lg text-muted">
          Schreiben Sie mir kurz, worum es geht. Ich melde mich und sage Ihnen
          ehrlich, ob und wie ich helfen kann.
        </p>
        <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BaseButton href="mailto:kontakt@ptyulnev.de">E-Mail schreiben</BaseButton>
          <BaseButton href="#check" variant="secondary">Zum Softwarecheck</BaseButton>
        </div>
        <p class="mt-6 text-sm text-muted">kontakt@ptyulnev.de</p>
      </div>

      <footer class="mt-14 flex flex-col items-center justify-between gap-4 text-sm text-dim sm:flex-row">
        <span>© {{ currentYear }} Pavel Tyulnev</span>
        <nav class="flex items-center gap-6">
          <NuxtLink to="/templates" class="hover:text-fg">Templates</NuxtLink>
          <NuxtLink to="/impressum" class="hover:text-fg">Impressum</NuxtLink>
          <NuxtLink to="/datenschutz" class="hover:text-fg">Datenschutz</NuxtLink>
        </nav>
      </footer>
    </div>
  </section>
</template>
