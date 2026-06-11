<script setup lang="ts">
const { seed, hideNav } = withDefaults(
  defineProps<{ seed?: number; hideNav?: boolean }>(),
  { hideNav: false },
)

const navItems = ['Produkt', 'Lösungen', 'Preise', 'Docs']
</script>

<template>
  <div class="relative isolate size-full overflow-hidden bg-[#050506] text-fog">
    <!-- WebGL Conway's Game of Life background -->
    <div class="absolute inset-0">
      <TemplatesGameOfLifeBackground :seed="seed" />
    </div>

    <!-- Readability gradients over the simulation -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050506]/40 via-[#050506]/55 to-[#050506]/90"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,6,0.65)_100%)]"
    />

    <!-- Template content -->
    <div class="relative z-10 flex h-full flex-col" :class="hideNav ? 'pt-16' : ''">
      <nav
        v-if="!hideNav"
        class="flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6"
      >
        <div class="flex items-center gap-2.5 font-semibold">
          <span
            class="flex size-7 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-xs font-bold tracking-tight shadow-[0_0_24px_-6px_rgba(147,197,253,0.7)]"
          >
            ◳
          </span>
          <span class="text-[0.95rem] tracking-tight">Cellular</span>
        </div>

        <div class="hidden items-center gap-8 text-sm text-white/55 md:flex">
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
          Anmelden
        </span>
      </nav>

      <div
        class="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center"
      >
        <span
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-white/65 backdrop-blur-sm"
        >
          <span class="size-1.5 animate-pulse rounded-full bg-[#93c5fd]" />
          Lebende Systeme · WebGL
        </span>

        <h1
          class="max-w-[16ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl"
        >
          Wo Code zum Leben erwacht.
        </h1>

        <p class="mt-5 max-w-[42ch] text-sm text-white/60 sm:text-base">
          Ein Header, der sich nie wiederholt — angetrieben von Conways Game of
          Life, gerendert in Echtzeit auf der GPU.
        </p>

        <div class="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <span
            class="inline-flex h-12 cursor-default items-center justify-center rounded-xl bg-fog px-7 text-[0.95rem] font-medium tracking-tight text-ink transition-transform hover:-translate-y-0.5"
          >
            Kostenlos starten
          </span>
          <span
            class="group inline-flex h-12 cursor-default items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-7 text-[0.95rem] font-medium tracking-tight transition-colors hover:bg-white/[0.06]"
          >
            Live ansehen
            <span class="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
