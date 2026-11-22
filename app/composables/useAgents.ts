export interface Agent {
  slug: string
  title: string
  category: string
  description: string
  prompt: string
}

interface DirectusAgent {
  slug: string
  title: string
  category: string | null
  description: string | null
  prompt: string | null
}

const FIELDS = ['slug', 'title', 'category', 'description', 'prompt']

function mapAgent(agent: DirectusAgent): Agent {
  return {
    slug: agent.slug,
    title: agent.title,
    category: agent.category ?? '',
    description: agent.description ?? '',
    prompt: agent.prompt ?? '',
  }
}

/** All published agents, in their configured admin order — used by the /#agents section. */
export function useAgents() {
  const config = useRuntimeConfig()

  return useFetch<{ data: DirectusAgent[] }>(`${config.public.directusUrl}/items/agents`, {
    key: 'agents',
    query: {
      filter: { status: { _eq: 'published' } },
      sort: 'sort',
      fields: FIELDS,
    },
    transform: (res) => res.data.map(mapAgent),
    default: () => [],
  })
}
