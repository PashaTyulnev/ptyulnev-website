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

const path = `/blog/${post.value.slug}`
const seoTitle = post.value.seoTitle || post.value.title
const seoDescription = post.value.seoDescription || toSnippet(post.value.excerpt || post.value.content)

usePageSeo({
  title: seoTitle,
  description: seoDescription,
  path,
  type: 'article',
  publishedTime: post.value.date,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: seoTitle,
          description: seoDescription,
          url: `${SITE_URL}${path}`,
          datePublished: post.value.date,
          inLanguage: 'de-DE',
          author: { '@type': 'Person', name: SITE_NAME, url: `${SITE_URL}/` },
        },
        breadcrumbJsonLd([
          { name: 'Startseite', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.value.title, path },
        ]),
      ]),
    },
  ],
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
