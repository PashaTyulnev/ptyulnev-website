<script setup lang="ts">
import { ref } from 'vue'

export type ServiceIcon =
  | 'automation'
  | 'ai'
  | 'website'
  | 'webapp'
  | 'systems'
  | 'consulting'

export interface ServiceCardItem {
  id: string
  title: string
  description: string
  anchor: string
  icon: ServiceIcon
}

defineProps<ServiceCardItem>()

const emit = defineEmits<{
  activate: [element: HTMLElement]
  deactivate: []
}>()

const card = ref<HTMLElement | null>(null)
</script>

<template>
  <a
    ref="card"
    :href="anchor"
    class="group/card relative block w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.04] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_-16px_rgba(99,102,241,0.28)]"
    @mouseenter="card && emit('activate', card)"
    @mouseleave="emit('deactivate')"
    @focusin="card && emit('activate', card)"
    @focusout="emit('deactivate')"
  >
    <!-- Top glow on hover -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
    />

    <div
      class="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-fog transition-colors duration-300 group-hover/card:border-blue-400/20 group-hover/card:bg-blue-400/[0.06]"
    >
      <!-- Automation -->
      <svg
        v-if="icon === 'automation'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path
          d="M12 3v3M5.5 7.5l2.1 2.1M18.5 7.5l-2.1 2.1M4 14h3M17 14h3"
          stroke-linecap="round"
        />
        <circle cx="12" cy="14" r="4.5" />
      </svg>

      <!-- AI -->
      <svg
        v-else-if="icon === 'ai'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path d="M12 2l1.8 5.5H19l-4.5 3.3L16.3 16 12 12.7 7.7 16l1.8-5.2L5 7.5h5.2L12 2z" />
      </svg>

      <!-- Website -->
      <svg
        v-else-if="icon === 'website'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M9 4v16" />
      </svg>

      <!-- Web App -->
      <svg
        v-else-if="icon === 'webapp'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 7h8M8 11h6M8 15h4" stroke-linecap="round" />
      </svg>

      <!-- Systems -->
      <svg
        v-else-if="icon === 'systems'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <rect x="3" y="8" width="6" height="6" rx="1" />
        <rect x="15" y="8" width="6" height="6" rx="1" />
        <path d="M9 11h6" />
      </svg>

      <!-- Consulting -->
      <svg
        v-else
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 3" stroke-linecap="round" />
      </svg>
    </div>

    <h3 class="mt-4 text-sm font-semibold tracking-tight text-fog">
      {{ title }}
    </h3>
    <p class="mt-1.5 text-xs leading-relaxed text-muted">
      {{ description }}
    </p>

    <span
      class="mt-4 inline-flex items-center gap-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-dim transition-colors duration-300 group-hover/card:text-fog/70"
    >
      Leistung
      <span
        class="transition-transform duration-300 group-hover/card:translate-x-0.5"
        aria-hidden="true"
      >
        →
      </span>
    </span>
  </a>
</template>
