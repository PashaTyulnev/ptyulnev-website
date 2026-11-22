<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const root = ref<HTMLElement | null>(null)
useScrollReveal(root)

const { data: agents } = await useAgents()

const activeAgent = ref<(typeof agents.value)[number] | null>(null)
const copiedSlug = ref<string | null>(null)

function openAgent(agent: (typeof agents.value)[number]): void {
  activeAgent.value = agent
}

function closeAgent(): void {
  activeAgent.value = null
}

async function copyPrompt(slug: string, prompt: string): Promise<void> {
  await navigator.clipboard.writeText(prompt)
  copiedSlug.value = slug
  setTimeout(() => {
    if (copiedSlug.value === slug) copiedSlug.value = null
  }, 2000)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeAgent()
}

watch(activeAgent, (agent) => {
  if (!import.meta.client) return
  document.body.style.overflow = agent ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <section
    v-if="agents.length"
    id="agents"
    ref="root"
    class="relative border-t border-line py-28 lg:py-36"
  >
    <div class="relative mx-auto w-full max-w-[1200px] px-6">
      <SectionHeading
        eyebrow="Agents"
        title="KI-Agenten zum Copy-Paste."
        lead="Ein paar Agenten-Konfigurationen aus meiner eigenen Arbeit mit KI-Tools — frei kopierbar für den eigenen Einsatz."
      />

      <div class="mt-14 grid gap-4 sm:grid-cols-2">
        <article
          v-for="agent in agents"
          :key="agent.slug"
          data-reveal
          role="button"
          tabindex="0"
          class="reveal-init group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-7 text-left backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] light:bg-black/[0.025] light:hover:border-black/15 light:hover:bg-black/[0.04]"
          @click="openAgent(agent)"
          @keydown.enter="openAgent(agent)"
          @keydown.space.prevent="openAgent(agent)"
        >
          <span
            v-if="agent.category"
            class="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium tracking-wide text-muted"
          >
            <span class="size-1.5 rounded-full bg-fog/70" />
            {{ agent.category }}
          </span>

          <h3 class="text-lg font-semibold tracking-tight text-fog">
            {{ agent.title }}
          </h3>

          <p v-if="agent.description" class="text-sm leading-relaxed text-muted">
            {{ agent.description }}
          </p>

          <span
            class="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-dim transition-colors duration-150 group-hover:text-fog"
          >
            Prompt ansehen
            <span aria-hidden="true">→</span>
          </span>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="activeAgent"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm light:bg-black/40"
        @click.self="closeAgent"
      >
        <div
          class="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-ink-soft shadow-2xl"
        >
          <div class="flex items-start justify-between gap-4 border-b border-line p-6">
            <div>
              <span
                v-if="activeAgent.category"
                class="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium tracking-wide text-muted"
              >
                <span class="size-1.5 rounded-full bg-fog/70" />
                {{ activeAgent.category }}
              </span>
              <h3 class="mt-3 text-xl font-semibold tracking-tight text-fog">
                {{ activeAgent.title }}
              </h3>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg p-1.5 text-dim transition-colors duration-150 hover:bg-white/5 hover:text-fog"
              aria-label="Schließen"
              @click="closeAgent"
            >
              ✕
            </button>
          </div>

          <div class="overflow-y-auto p-6">
            <p v-if="activeAgent.description" class="text-sm leading-relaxed text-muted">
              {{ activeAgent.description }}
            </p>

            <pre
              class="mt-5 overflow-auto rounded-xl border border-line bg-black/30 p-4 text-xs leading-relaxed text-muted/90 light:bg-black/[0.04]"
            ><code>{{ activeAgent.prompt }}</code></pre>
          </div>

          <div class="flex justify-end gap-3 border-t border-line p-6">
            <BaseButton
              variant="secondary"
              class="h-10 px-5 text-sm"
              @click="copyPrompt(activeAgent.slug, activeAgent.prompt)"
            >
              {{ copiedSlug === activeAgent.slug ? 'Kopiert ✓' : 'Prompt kopieren' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
