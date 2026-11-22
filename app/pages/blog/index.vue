<script setup lang="ts">
import { ref, computed } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

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

useHead({
  title: 'Blog — Pavel Tyulnev',
  link: [{ rel: 'canonical', href: 'https://ptyulnev.de/blog' }],
  meta: [
    {
      name: 'description',
      content:
        'Notizen zu Shopware 6, API-Integrationen, Performance und individueller Business-Software — aus echten Projekten.',
    },
  ],
})
</script>

<template>
  <main ref="root" class="relative pb-28 pt-32">
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
        data-reveal
        :to="`/blog/${featured.slug}`"
        class="reveal-init group mt-14 flex flex-col gap-5 rounded-2xl border border-line bg-white/[0.03] p-7 backdrop-blur-md transition-colors duration-300 hover:border-white/20 light:bg-black/[0.025] light:hover:border-black/15 sm:p-9"
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
          data-reveal
          :to="`/blog/${post.slug}`"
          class="reveal-init group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] light:bg-black/[0.025] light:hover:border-black/15 light:hover:bg-black/[0.04]"
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
