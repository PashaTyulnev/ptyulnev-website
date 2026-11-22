<script setup lang="ts">
import { ref } from 'vue'

export type ServiceIcon =
  | 'shopware'
  | 'custom-software'
  | 'api-integration'
  | 'bugfixing'

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
    class="group/card relative block w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.04] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_-16px_rgba(99,102,241,0.28)] light:border-black/10 light:bg-black/[0.025] light:hover:border-black/20 light:hover:bg-black/[0.045]"
    @mouseenter="card && emit('activate', card)"
    @mouseleave="emit('deactivate')"
    @focusin="card && emit('activate', card)"
    @focusout="emit('deactivate')"
  >
    <!-- Top glow on hover -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 light:via-black/25"
    />

    <div
      class="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-fog transition-colors duration-300 group-hover/card:border-blue-400/20 group-hover/card:bg-blue-400/[0.06] light:border-black/10 light:bg-black/[0.04]"
    >
      <!-- Shopware 6 -->
      <svg
        v-if="icon === 'shopware'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path d="M4 8l8-5 8 5-8 5-8-5z" />
        <path d="M4 8v8l8 5 8-5V8" />
        <path d="M12 13v8" />
      </svg>

      <!-- Individuelle Software -->
      <svg
        v-else-if="icon === 'custom-software'"
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

      <!-- API-Integration -->
      <svg
        v-else-if="icon === 'api-integration'"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
        <path d="M9 17H7A5 5 0 0 1 7 7h2" />
        <path d="M8 12h8" />
      </svg>

      <!-- Bugfixing -->
      <svg
        v-else
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path d="M12 8a3.5 3.5 0 0 0-3.5 3.5v3a3.5 3.5 0 0 0 7 0v-3A3.5 3.5 0 0 0 12 8z" />
        <path d="M12 8V6M9 9l-2-2M15 9l2-2M8.5 12H5M15.5 12h3.5M9 15.5l-2 2M15 15.5l2 2" stroke-linecap="round" />
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
