const BASE_URL = 'https://ptyulnev.de'

const STATIC_ROUTES = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/fallstudien', changefreq: 'weekly', priority: '0.8' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/impressum', changefreq: 'yearly', priority: '0.3' },
  { loc: '/datenschutz', changefreq: 'yearly', priority: '0.3' },
]

interface DirectusEntry {
  slug: string
  date: string | null
}

function urlEntry(loc: string, opts: { lastmod?: string; changefreq: string; priority: string }): string {
  const lastmod = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : ''
  return `  <url>\n    <loc>${BASE_URL}${loc}</loc>${lastmod}\n    <changefreq>${opts.changefreq}</changefreq>\n    <priority>${opts.priority}</priority>\n  </url>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // Directus unreachable: ship the sitemap without these entries rather than failing the request.
  async function published(collection: string): Promise<DirectusEntry[]> {
    try {
      const res = await $fetch<{ data: DirectusEntry[] }>(`${config.public.directusUrl}/items/${collection}`, {
        query: { filter: { status: { _eq: 'published' } }, fields: ['slug', 'date'] },
      })
      return res.data
    } catch {
      return []
    }
  }

  const [blogPosts, caseStudies] = await Promise.all([published('blog_posts'), published('case_studies')])

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(r.loc, r)),
    ...blogPosts.map((post) =>
      urlEntry(`/blog/${post.slug}`, { lastmod: post.date ?? undefined, changefreq: 'monthly', priority: '0.6' }),
    ),
    ...caseStudies.map((cs) =>
      urlEntry(`/fallstudien/${cs.slug}`, { lastmod: cs.date ?? undefined, changefreq: 'monthly', priority: '0.7' }),
    ),
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
