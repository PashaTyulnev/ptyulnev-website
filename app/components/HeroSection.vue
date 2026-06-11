<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ServiceCardItem } from '~/components/ServiceCard.vue'

type BgVariant = 'robot' | 'gol' | 'eco'
const bgVariant = ref<BgVariant>('robot')
const bgSeed    = ref(0x9e3779b9)

/**
 * Hero with the Spline robot as the visual centre, framed by six floating
 * service cards. Hovering a card draws an animated data-stream line to the
 * robot. Cards are the primary navigation to the services section.
 */
const root = ref<HTMLElement | null>(null)

const leftCards: ServiceCardItem[] = [
  {
    id: 'automation',
    title: 'Prozesse automatisieren',
    description: 'Manuelle Abläufe eliminieren und Zeit zurückgewinnen.',
    anchor: '#leistungen',
    icon: 'automation',
  },
  {
    id: 'ai',
    title: 'KI integrieren',
    description: 'Intelligenz dort einsetzen, wo sie echten Nutzen schafft.',
    anchor: '#leistungen',
    icon: 'ai',
  },
  {
    id: 'website',
    title: 'Webseiten entwickeln',
    description: 'Hochwertige Auftritte, die Vertrauen schaffen.',
    anchor: '#leistungen',
    icon: 'website',
  },
]

const rightCards: ServiceCardItem[] = [
  {
    id: 'webapp',
    title: 'Web Apps entwickeln',
    description: 'Individuelle Anwendungen für echte Geschäftsprozesse.',
    anchor: '#leistungen',
    icon: 'webapp',
  },
  {
    id: 'systems',
    title: 'Systeme verbinden',
    description: 'Bestehende Tools nahtlos miteinander verknüpfen.',
    anchor: '#leistungen',
    icon: 'systems',
  },
  {
    id: 'consulting',
    title: 'Technische Beratung',
    description: 'Architektur und Entscheidungen, die langfristig tragen.',
    anchor: '#leistungen',
    icon: 'consulting',
  },
]

const allCards = computed(() => [...leftCards, ...rightCards])

interface ConnectionLine {
  x1: number
  y1: number
  x2: number
  y2: number
}

const activeConnection = ref<ConnectionLine | null>(null)

function onCardActivate(element: HTMLElement): void {
  if (!root.value) return

  const section = root.value.getBoundingClientRect()
  const card = element.getBoundingClientRect()

  const cardCenterX = card.left + card.width / 2 - section.left
  const cardCenterY = card.top + card.height / 2 - section.top
  const robotX = section.width / 2
  const robotY = section.height * 0.46

  const isLeft = cardCenterX < robotX
  const x1 = isLeft ? card.right - section.left : card.left - section.left
  const y1 = cardCenterY

  activeConnection.value = { x1, y1, x2: robotX, y2: robotY }
}

function onCardDeactivate(): void {
  activeConnection.value = null
}

const { $gsap } = useNuxtApp()

onMounted(() => {
  const r = Math.random()
  bgVariant.value = r < 0.333 ? 'robot' : r < 0.667 ? 'gol' : 'eco'
  bgSeed.value    = (Math.random() * 0xffffffff) >>> 0

  if (!root.value) return

  const targets = root.value.querySelectorAll<HTMLElement>('[data-reveal]')

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (prefersReducedMotion || !$gsap) {
    targets.forEach((el) => el.classList.remove('reveal-init'))
    return
  }

  $gsap
    .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
    .to(targets, { opacity: 1, y: 0, stagger: 0.1, delay: 0.2 })
})
</script>

<template>
  <section
    id="top"
    ref="root"
    class="relative flex min-h-screen flex-col overflow-hidden bg-ink"
  >
    <!-- Background — randomly robot, Game of Life, or Particle Ecosystem -->
    <SplineRobot v-if="bgVariant === 'robot'" />
    <div v-else class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <ClientOnly>
        <TemplatesGameOfLifeBackground
          v-if="bgVariant === 'gol'"
          :seed="bgSeed"
        />
        <TemplatesParticleEcosystemBackground
          v-else
          :seed="bgSeed"
        />
      </ClientOnly>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink/90" />
    </div>

    <!-- Animated data-stream line (desktop only). -->
    <svg
      class="pointer-events-none absolute inset-0 z-[5] hidden lg:block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="stream-gradient"
          gradientUnits="userSpaceOnUse"
          :x1="activeConnection?.x1 ?? 0"
          :y1="activeConnection?.y1 ?? 0"
          :x2="activeConnection?.x2 ?? 0"
          :y2="activeConnection?.y2 ?? 0"
        >
          <stop offset="0%" stop-color="rgba(99,102,241,0.15)" />
          <stop offset="50%" stop-color="rgba(147,197,253,0.55)" />
          <stop offset="100%" stop-color="rgba(99,102,241,0.15)" />
        </linearGradient>
      </defs>

      <line
        v-if="activeConnection"
        :x1="activeConnection.x1"
        :y1="activeConnection.y1"
        :x2="activeConnection.x2"
        :y2="activeConnection.y2"
        stroke="url(#stream-gradient)"
        stroke-width="1"
        class="animate-line-pulse"
      />
    </svg>

    <!-- Content layer: pointer-events-none so the robot tracks the mouse in
         the centre; cards and CTAs re-enable pointer events individually. -->
    <div
      class="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pb-10 pt-24 lg:px-10"
    >
      <!-- Headline: always on mobile; on md+ only for the robot variant (other variants place it between the cards) -->
      <div class="flex flex-col items-center text-center" :class="bgVariant !== 'robot' ? 'md:hidden' : ''">
        <span
          data-reveal
          class="reveal-init mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm"
        >
          <span class="size-1.5 rounded-full bg-fog/80" />
          Digitalisierung · Automatisierung · KI
        </span>

        <h1
          data-reveal
          class="reveal-init max-w-[18ch] text-3xl font-semibold leading-[1.06] tracking-[-0.04em] text-fog sm:text-5xl lg:text-[3.75rem]"
        >
          Software, die Arbeit spart.
        </h1>

        <p
          data-reveal
          class="reveal-init mt-5 max-w-[44ch] text-sm text-muted sm:text-base"
        >
          Ich unterstütze Unternehmen bei der Entwicklung von Webanwendungen,
          Automatisierungslösungen und KI-gestützten Prozessen.
        </p>
      </div>

      <!-- Desktop: cards flanking the robot -->
      <div
        class="mt-8 hidden flex-1 items-center justify-between gap-6 lg:flex"
      >
        <div class="flex w-[15.5rem] shrink-0 flex-col gap-5 xl:w-[17rem]">
          <div
            v-for="card in leftCards"
            :key="card.id"
            data-reveal
            class="reveal-init pointer-events-auto"
          >
            <ServiceCard
              v-bind="card"
              @activate="onCardActivate"
              @deactivate="onCardDeactivate"
            />
          </div>
        </div>

        <!-- Centre: robot gap or title for non-robot variants -->
        <div
          v-if="bgVariant === 'robot'"
          class="min-w-[22rem] flex-1"
          aria-hidden="true"
        />
        <div
          v-else
          class="flex min-w-[22rem] flex-1 flex-col items-center justify-center text-center px-6"
        >
          <span
            data-reveal
            class="reveal-init mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm"
          >
            <span class="size-1.5 rounded-full bg-fog/80" />
            Digitalisierung · Automatisierung · KI
          </span>
          <h1
            data-reveal
            class="reveal-init max-w-[18ch] text-3xl font-semibold leading-[1.06] tracking-[-0.04em] text-fog sm:text-5xl lg:text-[3.75rem]"
          >
            Software, die Arbeit spart.
          </h1>
          <p
            data-reveal
            class="reveal-init mt-5 max-w-[44ch] text-sm text-muted sm:text-base"
          >
            Ich unterstütze Unternehmen bei der Entwicklung von Webanwendungen,
            Automatisierungslösungen und KI-gestützten Prozessen.
          </p>
        </div>

        <div class="flex w-[15.5rem] shrink-0 flex-col gap-5 xl:w-[17rem]">
          <div
            v-for="card in rightCards"
            :key="card.id"
            data-reveal
            class="reveal-init pointer-events-auto"
          >
            <ServiceCard
              v-bind="card"
              @activate="onCardActivate"
              @deactivate="onCardDeactivate"
            />
          </div>
        </div>
      </div>

      <!-- Tablet: cards closer to the robot -->
      <div
        class="mt-8 hidden flex-1 items-center justify-center gap-4 md:flex lg:hidden"
      >
        <div class="flex w-[13.5rem] shrink-0 flex-col gap-4">
          <div
            v-for="card in leftCards"
            :key="`md-${card.id}`"
            data-reveal
            class="reveal-init pointer-events-auto"
          >
            <ServiceCard
              v-bind="card"
              @activate="onCardActivate"
              @deactivate="onCardDeactivate"
            />
          </div>
        </div>

        <div
          v-if="bgVariant === 'robot'"
          class="min-w-[14rem] flex-1"
          aria-hidden="true"
        />
        <div
          v-else
          class="flex min-w-[14rem] flex-1 flex-col items-center justify-center text-center px-4"
        >
          <span
            data-reveal
            class="reveal-init mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm"
          >
            <span class="size-1.5 rounded-full bg-fog/80" />
            Digitalisierung · Automatisierung · KI
          </span>
          <h1
            data-reveal
            class="reveal-init max-w-[18ch] text-3xl font-semibold leading-[1.06] tracking-[-0.04em] text-fog sm:text-5xl lg:text-[3.75rem]"
          >
            Software, die Arbeit spart.
          </h1>
          <p
            data-reveal
            class="reveal-init mt-5 max-w-[44ch] text-sm text-muted sm:text-base"
          >
            Ich unterstütze Unternehmen bei der Entwicklung von Webanwendungen,
            Automatisierungslösungen und KI-gestützten Prozessen.
          </p>
        </div>

        <div class="flex w-[13.5rem] shrink-0 flex-col gap-4">
          <div
            v-for="card in rightCards"
            :key="`md-${card.id}`"
            data-reveal
            class="reveal-init pointer-events-auto"
          >
            <ServiceCard
              v-bind="card"
              @activate="onCardActivate"
              @deactivate="onCardDeactivate"
            />
          </div>
        </div>
      </div>

      <!-- Mobile: cards below the robot -->
      <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        <div
          v-for="card in allCards"
          :key="`sm-${card.id}`"
          data-reveal
          class="reveal-init pointer-events-auto"
        >
          <ServiceCard v-bind="card" />
        </div>
      </div>

      <!-- CTAs -->
      <div
        data-reveal
        class="reveal-init pointer-events-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <BaseButton href="#projekte" variant="primary">
          Projekte ansehen
        </BaseButton>
        <BaseButton href="#kontakt" variant="secondary">
          Kontakt aufnehmen
          <span
            class="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            →
          </span>
        </BaseButton>
      </div>
    </div>
  </section>
</template>
