<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Templates — Pavel Tyulnev',
})

const golSeed = ref(0x9e3779b9)

function randomizeSeed(): void {
  golSeed.value = (Math.random() * 0xffffffff) >>> 0
}

const { toggle, isActive } = useAnimationManager()
const golActive = isActive('gol')

const ecoSeed = ref(0x1a2b3c4d)
function randomizeEcoSeed(): void {
  ecoSeed.value = (Math.random() * 0xffffffff) >>> 0
}
const ecoActive = isActive('eco')
</script>

<template>
  <main class="mx-auto w-full max-w-[1200px] px-6 pb-28 pt-32">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fog"
    >
      <span aria-hidden="true">←</span>
      Zurück zur Startseite
    </NuxtLink>

    <header class="mt-8 max-w-2xl">
      <span
        class="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
      >
        <span class="size-1.5 rounded-full bg-fog/80" />
        Experimente · WebGL
      </span>
      <h1
        class="mt-6 text-3xl font-semibold tracking-[-0.03em] text-fog sm:text-4xl"
      >
        Templates
      </h1>
      <p class="mt-4 text-base leading-relaxed text-muted">
        Eine Sammlung von Design- und Interaktionsideen, gerendert in Echtzeit.
        Jedes Template ist ein lauffähiges Konzept, das als Ausgangspunkt für
        echte Projekte dienen kann.
      </p>
    </header>

    <section class="mt-14">
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-fog">
            01 · Game of Life Header
          </h2>
          <p class="mt-1.5 text-sm text-muted">
            Dark-Mode Hero-Header mit Conways Game of Life als GPU-Hintergrund.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-dim">Seed: {{ golSeed }}</span>
          <BaseButton
            variant="secondary"
            class="h-10 gap-1.5 px-4 text-sm"
            @click="toggle('gol')"
          >
            <svg
              v-if="golActive"
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="4" height="18" rx="1" />
              <rect x="15" y="3" width="4" height="18" rx="1" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 3.765C6 2.358 7.56 1.545 8.7 2.364l10.5 8.235a1.5 1.5 0 0 1 0 2.402L8.7 21.636C7.56 22.455 6 21.642 6 20.235V3.765Z" />
            </svg>
            {{ golActive ? 'Pause' : 'Starten' }}
          </BaseButton>
          <BaseButton
            variant="secondary"
            class="h-10 px-5 text-sm"
            @click="randomizeSeed"
          >
            Neuer Seed
          </BaseButton>
        </div>
      </div>

      <!-- Browser-frame preview -->
      <div
        class="overflow-hidden rounded-2xl border border-line-strong bg-ink-soft shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div
          class="flex items-center gap-2 border-b border-line bg-white/[0.02] px-4 py-3"
        >
          <span class="size-3 rounded-full bg-white/15" />
          <span class="size-3 rounded-full bg-white/15" />
          <span class="size-3 rounded-full bg-white/15" />
          <span
            class="ml-3 hidden rounded-md bg-white/[0.04] px-3 py-1 text-xs text-dim sm:block"
          >
            cellular.app
          </span>
        </div>

        <div class="h-[560px] w-full">
          <ClientOnly>
            <TemplatesGameOfLifeHeader :seed="golSeed" />
            <template #fallback>
              <div class="flex size-full items-center justify-center bg-[#050506]">
                <span class="text-sm text-dim">WebGL wird geladen …</span>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in ['WebGL2', 'GLSL', 'Ping-Pong-FBO', 'Dark Mode']"
          :key="tag"
          class="rounded-full border border-line bg-white/[0.02] px-3 py-1 text-xs text-muted"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <!-- ── Template 02: Particle Ecosystem ────────────────────────────── -->
    <section class="mt-20">
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-fog">
            02 · Particle Ecosystem
          </h2>
          <p class="mt-1.5 text-sm text-muted">
            Artificial-Life-Simulation mit Organismen, Futter und emergenten Ökosystem-Dynamiken auf der GPU.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-dim">Seed: {{ ecoSeed }}</span>
          <BaseButton
            variant="secondary"
            class="h-10 gap-1.5 px-4 text-sm"
            @click="toggle('eco')"
          >
            <svg
              v-if="ecoActive"
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="4" height="18" rx="1" />
              <rect x="15" y="3" width="4" height="18" rx="1" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 3.765C6 2.358 7.56 1.545 8.7 2.364l10.5 8.235a1.5 1.5 0 0 1 0 2.402L8.7 21.636C7.56 22.455 6 21.642 6 20.235V3.765Z" />
            </svg>
            {{ ecoActive ? 'Pause' : 'Starten' }}
          </BaseButton>
          <BaseButton
            variant="secondary"
            class="h-10 px-5 text-sm"
            @click="randomizeEcoSeed"
          >
            Neuer Seed
          </BaseButton>
        </div>
      </div>

      <!-- Browser-frame preview -->
      <div
        class="overflow-hidden rounded-2xl border border-line-strong bg-ink-soft shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div
          class="flex items-center gap-2 border-b border-line bg-white/[0.02] px-4 py-3"
        >
          <span class="size-3 rounded-full bg-white/15" />
          <span class="size-3 rounded-full bg-white/15" />
          <span class="size-3 rounded-full bg-white/15" />
          <span
            class="ml-3 hidden rounded-md bg-white/[0.04] px-3 py-1 text-xs text-dim sm:block"
          >
            ecosystem.app
          </span>
        </div>

        <div class="h-[560px] w-full">
          <ClientOnly>
            <TemplatesParticleEcosystemHeader :seed="ecoSeed" />
            <template #fallback>
              <div class="flex size-full items-center justify-center bg-[#050506]">
                <span class="text-sm text-dim">WebGL wird geladen …</span>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in ['WebGL2', 'Artificial Life', 'CPU-Simulation', 'HDR Bloom']"
          :key="tag"
          class="rounded-full border border-line bg-white/[0.02] px-3 py-1 text-xs text-muted"
        >
          {{ tag }}
        </span>
      </div>
    </section>
  </main>
</template>
