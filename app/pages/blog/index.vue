<script setup lang="ts">
import { ref, computed } from 'vue'


const { data: blogPosts } = await useBlogPosts()

const featured = computed(() => blogPosts.value[0])
const rest = computed(() => blogPosts.value.slice(1))

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

usePageSeo({
  title: 'Blog: Notizen aus der Softwareentwicklung | Pavel Tyulnev',
  description: 'Erfahrungen aus echten Projekten: Symfony, Shopware 6, API-Integrationen, Performance und individuelle Software für Betriebsabläufe – praxisnah erklärt.',
  path: '/blog',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd([
          { name: 'Startseite', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]),
      ),
    },
  ],
})
</script>

<template>
  <main class="relative pb-28 pt-32">
    <div class="mx-auto w-full max-w-[1200px] px-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fog"
      >
        <span aria-hidden="true">←</span>
        Zurück zur Startseite
      </NuxtLink>

      <SectionHeading
        class="mt-8"
        eyebrow="Blog"
        title="Notizen aus der Praxis."
        lead="Gedanken zu Shopware 6, API-Integrationen, Performance und individueller Business-Software — aus echten Projekten."
      />

      <NuxtLink
        v-if="featured"
        :to="`/blog/${featured.slug}`"
        class="group mt-14 flex flex-col gap-5 rounded-2xl border border-line bg-ink-soft p-7 transition-colors duration-300 hover:border-line-strong sm:p-9"
      >
        <span
          class="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium tracking-wide text-muted"
        >
          <span class="size-1.5 rounded-full bg-fog/70" />
          {{ featured.category }}
        </span>

        <h3
          class="max-w-[36ch] text-2xl font-semibold tracking-tight text-fog transition-colors duration-300 group-hover:text-fog/80 sm:text-3xl"
        >
          {{ featured.title }}
        </h3>

        <p class="max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">
          {{ featured.excerpt }}
        </p>

        <div class="flex items-center gap-2 text-xs text-dim">
          <span>{{ formatDate(featured.date) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ featured.readTime }}</span>
        </div>
      </NuxtLink>

      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="post in rest"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-ink-soft p-6 transition-all duration-300 hover:border-line-strong"
        >
          <span class="text-xs font-medium uppercase tracking-[0.14em] text-dim">
            {{ post.category }}
          </span>

          <h3
            class="text-lg font-semibold tracking-tight text-fog transition-colors duration-300 group-hover:text-fog/80"
          >
            {{ post.title }}
          </h3>

          <p class="flex-1 text-sm leading-relaxed text-muted">
            {{ post.excerpt }}
          </p>

          <div class="flex items-center gap-2 text-xs text-dim">
            <span>{{ formatDate(post.date) }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ post.readTime }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
