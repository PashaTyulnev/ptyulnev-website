<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const slug = route.params.slug as string

const { data: cs } = await useCaseStudy(slug)

if (!cs.value) {
  throw createError({ statusCode: 404, statusMessage: 'Fallstudie nicht gefunden', fatal: true })
}

const sections = computed(() =>
  [
    { id: 'problem', title: 'Ausgangslage', html: cs.value!.problem },
    { id: 'analyse', title: 'Analyse & Vorgehen', html: cs.value!.investigation },
    { id: 'loesung', title: 'Lösung', html: cs.value!.solution },
    { id: 'ergebnis', title: 'Ergebnis', html: cs.value!.result },
    { id: 'learnings', title: 'Erkenntnisse', html: cs.value!.learnings },
  ].filter((s) => s.html.trim()),
)

const facts = computed(() =>
  [
    { label: 'Kategorie', value: cs.value!.category },
    { label: 'Kontext', value: cs.value!.context },
    { label: 'Rolle', value: cs.value!.role },
    { label: 'Zeitraum', value: formatCaseStudyDate(cs.value!.date) },
    { label: 'Dauer', value: cs.value!.duration },
  ].filter((f) => f.value),
)

useHead({
  title: `${cs.value.title} — Fallstudie — Pavel Tyulnev`,
  link: [{ rel: 'canonical', href: `https://ptyulnev.de/fallstudien/${cs.value.slug}` }],
  meta: [{ name: 'description', content: cs.value.summary }],
})
</script>

<template>
  <LegalPage :title="cs!.title" back-href="/fallstudien" back-label="Zurück zu den Fallstudien">
    <p v-if="cs!.summary" class="!text-lg !leading-relaxed">{{ cs!.summary }}</p>

    <dl
      v-if="facts.length"
      class="my-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-line bg-white/[0.03] p-6 light:bg-black/[0.025] sm:grid-cols-3"
    >
      <div v-for="f in facts" :key="f.label">
        <dt class="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-dim">{{ f.label }}</dt>
        <dd class="mt-1 text-sm text-fog">{{ f.value }}</dd>
      </div>
      <div v-if="cs!.techStack.length" class="col-span-2 sm:col-span-3">
        <dt class="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-dim">Tech-Stack</dt>
        <dd class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="tech in cs!.techStack"
            :key="tech"
            class="rounded-md border border-line px-2 py-0.5 text-xs text-muted"
          >
            {{ tech }}
          </span>
        </dd>
      </div>
    </dl>

    <dl v-if="cs!.metrics.length" class="my-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div
        v-for="(m, i) in cs!.metrics"
        :key="i"
        class="flex flex-col rounded-2xl border border-line p-5"
      >
        <dt class="order-2 mt-1 text-xs text-dim">{{ m.label }}</dt>
        <dd class="order-1 text-2xl font-semibold tracking-tight text-fog">{{ m.value }}</dd>
      </div>
    </dl>

    <section v-for="s in sections" :id="s.id" :key="s.id">
      <h2>{{ s.title }}</h2>
      <div v-html="s.html" />
    </section>

    <div class="mt-16 rounded-2xl border border-line p-6 sm:p-8">
      <p class="!mb-2 !text-base font-semibold !text-fog">Ein ähnliches Problem?</p>
      <p>Ich analysiere und löse so etwas gerne auch für Sie.</p>
      <BaseButton href="/#kontakt" variant="secondary" class="mt-2 h-10 px-5 text-sm">
        Kontakt aufnehmen
      </BaseButton>
    </div>
  </LegalPage>
</template>
