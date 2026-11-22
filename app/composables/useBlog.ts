export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  content: string
  seoTitle: string
  seoDescription: string
}

interface DirectusBlogPost {
  slug: string
  title: string
  excerpt: string | null
  category: string | null
  date: string
  read_time: string | null
  content: string | null
  seo_title?: string | null
  seo_description?: string | null
}

const FIELDS = ['slug', 'title', 'excerpt', 'category', 'date', 'read_time', 'content', 'seo_title', 'seo_description']

function mapPost(post: DirectusBlogPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    category: post.category ?? '',
    date: post.date,
    readTime: post.read_time ?? '',
    content: post.content ?? '',
    seoTitle: post.seo_title ?? '',
    seoDescription: post.seo_description ?? '',
  }
}

/** All published blog posts, newest first — used by the /blog listing. */
export function useBlogPosts() {
  const config = useRuntimeConfig()

  return useFetch<{ data: DirectusBlogPost[] }>(`${config.public.directusUrl}/items/blog_posts`, {
    key: 'blog-posts',
    query: {
      filter: { status: { _eq: 'published' } },
      sort: '-date',
      fields: FIELDS,
    },
    transform: (res) => res.data.map(mapPost),
    default: () => [],
  })
}

/** A single published blog post by slug — used by /blog/[slug]. */
export function useBlogPost(slug: string) {
  const config = useRuntimeConfig()

  return useFetch<{ data: DirectusBlogPost[] }>(`${config.public.directusUrl}/items/blog_posts`, {
    key: `blog-post-${slug}`,
    query: {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
      fields: FIELDS,
    },
    transform: (res) => (res.data[0] ? mapPost(res.data[0]) : null),
    default: () => null,
  })
}
