<script setup lang="ts">
const { seed, hideNav } = withDefaults(
  defineProps<{ seed?: number; hideNav?: boolean }>(),
  { hideNav: false },
)

const navItems = ['Plattform', 'Agenten', 'Analysen', 'Preise']
</script>

<template>
  <div class="relative isolate size-full overflow-hidden bg-[#030408] text-fog">
    <!-- Particle Ecosystem background -->
    <div class="absolute inset-0">
      <TemplatesParticleEcosystemBackground :seed="seed" />
    </div>

    <!-- Readability gradients -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030408]/50 via-[#030408]/40 to-[#030408]/95"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,rgba(3,4,8,0.55)_100%)]"
    />

    <!-- Content -->
    <div class="relative z-10 flex h-full flex-col" :class="hideNav ? 'pt-16' : ''">
      <nav v-if="!hideNav" class="flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6">
        <div class="flex items-center gap-2.5 font-semibold">
          <span
            class="flex size-7 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-xs font-bold tracking-tight shadow-[0_0_24px_-6px_rgba(103,232,249,0.6)]"
          >
            ⬡
          </span>
          <span class="text-[0.95rem] tracking-tight">Evolvant</span>
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
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-300/80 backdrop-blur-sm"
        >
          <span class="size-1.5 animate-pulse rounded-full bg-cyan-400" />
          Autonome Agenten · Echtzeit-Evolution
        </span>

        <h1
          class="max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl"
        >
          Intelligenz,<br />
          <span
            class="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-200 bg-clip-text text-transparent"
          >
            die sich selbst
          </span>
          <br />
          optimiert.
        </h1>

        <p class="mt-5 max-w-[44ch] text-sm leading-relaxed text-white/55 sm:text-base">
          Autonome Agenten, die konkurrieren, kooperieren und evolvieren —
          beobachte emergente Intelligenz als lebendiges System.
        </p>

        <div class="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <span
            class="inline-flex h-12 cursor-default items-center justify-center rounded-xl bg-cyan-400 px-7 text-[0.95rem] font-semibold tracking-tight text-[#030408] transition-transform hover:-translate-y-0.5"
          >
            Simulation starten
          </span>
          <span
            class="group inline-flex h-12 cursor-default items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-7 text-[0.95rem] font-medium tracking-tight transition-colors hover:bg-white/[0.06]"
          >
            Mehr erfahren
            <span class="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>

        <!-- Live stats -->
        <div class="mt-10 flex items-center gap-6 text-xs text-white/35">
          <span class="flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-cyan-400/70" />
            Linksklick: Beute
          </span>
          <span class="flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-red-400/70" />
            Rechtsklick: Jäger
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
