<script setup lang="ts">
const technologies = ['PHP', 'Symfony', 'Shopware', 'MySQL / PostgreSQL', 'Nuxt / Vue', 'TypeScript', 'Docker']
</script>

<template>
  <section id="ueber-mich" class="border-t border-line py-24">
    <div class="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[240px_1fr] md:items-start">
      <img
        src="/cv/profile_image.png"
        alt="Pavel Tyulnev"
        width="240"
        height="240"
        class="aspect-square w-48 rounded-xl object-cover md:w-full"
      >
      <div>
        <SectionHeading eyebrow="Über mich" title="Sie sprechen direkt mit dem Entwickler." />
        <div class="mt-6 max-w-[60ch] space-y-4 text-muted">
          <p>
            Ich bin Pavel Tyulnev, Softwareentwickler mit Schwerpunkt PHP, Symfony
            und Shopware. Am liebsten arbeite ich an Systemen, die schon laufen und
            besser werden sollen: verstehen, aufräumen, schneller machen,
            weiterentwickeln.
          </p>
          <p>
            Bei mir gibt es keine Agentur dazwischen. Sie haben einen
            Ansprechpartner, der Ihr Problem versteht und es auch selbst löst.
          </p>
        </div>
        <ul class="mt-8 flex flex-wrap gap-2">
          <li
            v-for="tech in technologies"
            :key="tech"
            class="rounded-full border border-line px-3 py-1 text-sm text-muted"
          >
            {{ tech }}
          </li>
        </ul>
        <a href="/cv/" class="mt-8 inline-block text-sm font-medium text-accent hover:underline">
          Lebenslauf ansehen →
        </a>
      </div>
    </div>
  </section>
</template>
