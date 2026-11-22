export const SITE_URL = 'https://ptyulnev.de'
export const SITE_NAME = 'Pavel Tyulnev'
const DEFAULT_IMAGE = `${SITE_URL}/cv/profile_image.png`

interface PageSeo {
  /** Shown as the blue headline in Google — keep it ≤ 60 characters. */
  title: string
  /** Snippet under the headline — aim for 120–155 characters. */
  description: string
  /** Path starting with "/", used for canonical and og:url. */
  path: string
  type?: 'website' | 'article'
  image?: string
  publishedTime?: string | null
}

/** Shortens text to a Google-friendly snippet without cutting words in half. */
export function toSnippet(text: string, max = 155): string {
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.–-]+$/, '')}…`
}

/** Sets title, description, canonical URL and social preview tags for one page. */
export function usePageSeo(seo: PageSeo) {
  const url = `${SITE_URL}${seo.path}`
  const image = seo.image ?? DEFAULT_IMAGE

  useSeoMeta({
    title: seo.title,
    description: seo.description,
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogUrl: url,
    ogType: seo.type ?? 'website',
    ogImage: image,
    ogSiteName: SITE_NAME,
    ogLocale: 'de_DE',
    twitterCard: 'summary',
    twitterTitle: seo.title,
    twitterDescription: seo.description,
    twitterImage: image,
    ...(seo.publishedTime ? { articlePublishedTime: seo.publishedTime } : {}),
  })

  useHead({ link: [{ rel: 'canonical', href: url }] })
}

/** Breadcrumb structured data, so Google shows "ptyulnev.de › Fallstudien › …". */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
