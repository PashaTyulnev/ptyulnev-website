<script setup lang="ts">
const { seed, hideNav } = withDefaults(
  defineProps<{ seed?: number; hideNav?: boolean }>(),
  { hideNav: false },
)

const navItems = ['Muster', 'Regeln', 'Forschung', 'API']
</script>

<template>
  <div class="relative isolate size-full overflow-hidden bg-[#020306] text-fog">
    <!-- Particle Life background -->
    <div class="absolute inset-0">
      <TemplatesParticleLifeBackground :seed="seed" />
    </div>

    <!-- Readability gradients -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020306]/45 via-[#020306]/35 to-[#020306]/92"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,rgba(2,3,6,0.55)_100%)]"
    />

    <!-- Content -->
    <div class="relative z-10 flex h-full flex-col" :class="hideNav ? 'pt-16' : ''">
      <nav v-if="!hideNav" class="flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6">
        <div class="flex items-center gap-2.5 font-semibold">
          <span
            class="flex size-7 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-xs font-bold tracking-tight shadow-[0_0_24px_-6px_rgba(236,72,153,0.55)]"
          >
            ✺
          </span>
          <span class="text-[0.95rem] tracking-tight">Emergent</span>
        </div>

        <div class="hidden items-center gap-8 text-sm text-white/50 md:flex">
          <span
            v-for="item in navItems"
            :key="item"
            class="cursor-default transition-colors duration-150 hover:text-white"
          >
            {{ item }}
          </span>
        </div>

        <span
          class="inline-flex h-9 cursor-default items-center rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
        >
          Demo ansehen
        </span>
      </nav>

      <div class="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <span
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-400/[0.06] px-4 py-1.5 text-xs font-medium tracking-wide text-pink-200/80 backdrop-blur-sm"
        >
          <span class="size-1.5 animate-pulse rounded-full bg-pink-400" />
          Regelbasierte Emergenz · WebGL
        </span>

        <h1
          class="max-w-[19ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl"
        >
          Aus einfachen Regeln,<br />
          <span
            class="bg-gradient-to-r from-pink-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent"
          >
            komplexes Leben.
          </span>
        </h1>

        <p class="mt-5 max-w-[46ch] text-sm leading-relaxed text-white/55 sm:text-base">
          Fünf Partikel-Spezies, eine zufällige Anziehungsmatrix — bei jedem
          Aufruf entsteht ein neues, nie zuvor gesehenes Muster.
        </p>

        <div class="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <span
            class="inline-flex h-12 cursor-default items-center justify-center rounded-xl bg-pink-400 px-7 text-[0.95rem] font-semibold tracking-tight text-[#020306] transition-transform hover:-translate-y-0.5"
          >
            Simulation starten
          </span>
          <span
            class="group inline-flex h-12 cursor-default items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-7 text-[0.95rem] font-medium tracking-tight transition-colors hover:bg-white/[0.06]"
          >
            Regeln ansehen
            <span class="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>

        <div class="mt-10 flex items-center gap-6 text-xs text-white/35">
          <span class="flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-pink-400/70" />
            Cursor: sanfte Abstoßung
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
