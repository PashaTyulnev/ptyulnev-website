export interface CaseStudyMetric {
  value: string
  label: string
}

export interface CaseStudy {
  slug: string
  title: string
  summary: string
  category: string
  context: string
  role: string
  date: string | null
  duration: string
  featured: boolean
  techStack: string[]
  metrics: CaseStudyMetric[]
  problem: string
  investigation: string
  solution: string
  result: string
  learnings: string
}

interface DirectusCaseStudy {
  slug: string
  title: string
  summary: string | null
  category: string | null
  context: string | null
  role: string | null
  date: string | null
  duration: string | null
  featured: boolean | null
  tech_stack: string[] | null
  metrics: CaseStudyMetric[] | null
  problem?: string | null
  investigation?: string | null
  solution?: string | null
  result?: string | null
  learnings?: string | null
}

const LIST_FIELDS = [
  'slug',
  'title',
  'summary',
  'category',
  'context',
  'role',
  'date',
  'duration',
  'featured',
  'tech_stack',
  'metrics',
]

const DETAIL_FIELDS = [...LIST_FIELDS, 'problem', 'investigation', 'solution', 'result', 'learnings']

function mapCaseStudy(item: DirectusCaseStudy): CaseStudy {
  return {
    slug: item.slug,
    title: item.title,
    summary: item.summary ?? '',
    category: item.category ?? '',
    context: item.context ?? '',
    role: item.role ?? '',
    date: item.date,
    duration: item.duration ?? '',
    featured: item.featured ?? false,
    techStack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
    metrics: Array.isArray(item.metrics) ? item.metrics.filter((m) => m?.value || m?.label) : [],
    problem: item.problem ?? '',
    investigation: item.investigation ?? '',
    solution: item.solution ?? '',
    result: item.result ?? '',
    learnings: item.learnings ?? '',
  }
}

/** All published case studies: featured first, then manual sort, then newest. */
export function useCaseStudies() {
  const config = useRuntimeConfig()

  return useFetch<{ data: DirectusCaseStudy[] }>(`${config.public.directusUrl}/items/case_studies`, {
    key: 'case-studies',
    query: {
      filter: { status: { _eq: 'published' } },
      sort: ['-featured', 'sort', '-date'],
      fields: LIST_FIELDS,
      limit: -1,
    },
    transform: (res) => res.data.map(mapCaseStudy),
    default: () => [],
  })
}

/** A single published case study by slug — used by /fallstudien/[slug]. */
export function useCaseStudy(slug: string) {
  const config = useRuntimeConfig()

  return useFetch<{ data: DirectusCaseStudy[] }>(`${config.public.directusUrl}/items/case_studies`, {
    key: `case-study-${slug}`,
    query: {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
      fields: DETAIL_FIELDS,
    },
    transform: (res) => (res.data[0] ? mapCaseStudy(res.data[0]) : null),
    default: () => null,
  })
}

export function formatCaseStudyDate(date: string | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(new Date(date))
}
