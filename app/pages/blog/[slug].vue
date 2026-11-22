<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useBlogPost(slug)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel nicht gefunden', fatal: true })
}

const formattedDate = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(post.value.date))

useHead({
  title: `${post.value.title} — Pavel Tyulnev`,
  link: [{ rel: 'canonical', href: `https://ptyulnev.de/blog/${post.value.slug}` }],
})
</script>

<template>
  <LegalPage :title="post.title" back-href="/blog" back-label="Zurück zum Blog">
    <div
      class="mb-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-dim"
    >
      <span>{{ formattedDate }}</span>
      <span aria-hidden="true">·</span>
      <span>{{ post.readTime }}</span>
      <span aria-hidden="true">·</span>
      <span>{{ post.category }}</span>
    </div>

    <div v-html="post.content" />
  </LegalPage>
</template>
