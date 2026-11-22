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
          <BaseButton href="mailto:kontakt@ptyulnev.de">kontakt@ptyulnev.de</BaseButton>
          <BaseButton href="tel:+4917670583534" variant="secondary">0176 705 83 534</BaseButton>
          <BaseButton href="https://www.linkedin.com/in/pavel-tyulnev-82327b270/" variant="secondary" target="_blank" rel="noopener me">LinkedIn</BaseButton>
        </div>
      </div>

      <footer class="mt-14 flex flex-col items-center justify-between gap-4 text-sm text-dim sm:flex-row">
        <span>© {{ currentYear }} Pavel Tyulnev · Dresden · ptyulnev.de</span>
        <nav class="flex flex-wrap items-center justify-center gap-6">
          <NuxtLink to="/templates" class="hover:text-fog">Templates</NuxtLink>
          <a href="https://www.linkedin.com/in/pavel-tyulnev-82327b270/" target="_blank" rel="noopener me" class="hover:text-fog">LinkedIn</a>
          <NuxtLink to="/impressum" class="hover:text-fog">Impressum</NuxtLink>
          <NuxtLink to="/datenschutz" class="hover:text-fog">Datenschutz</NuxtLink>
          <a href="/sitemap.xml" download="sitemap.xml" class="hover:text-fog">Sitemap</a>
        </nav>
      </footer>
    </div>
  </section>
</template>
