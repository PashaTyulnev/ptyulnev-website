<script setup lang="ts">
const STORAGE_KEY = 'cookie-notice-dismissed'
const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    visible.value = true
  }
})

function dismiss() {
  localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="visible"
      class="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-line-strong bg-ink-soft/90 px-5 py-4 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      role="region"
      aria-label="Cookie-Hinweis"
    >
      <div class="flex items-start justify-between gap-4">
        <p class="text-sm leading-relaxed text-muted">
          Diese Seite setzt keine eigenen Tracking-Cookies. Externe Dienste
          (Spline 3D) können Verbindungen aufbauen.
          <NuxtLink
            to="/datenschutz"
            class="text-fog/70 underline underline-offset-2 transition-colors hover:text-fog"
          >
            Datenschutzerklärung
          </NuxtLink>
        </p>
        <button
          type="button"
          class="mt-0.5 shrink-0 rounded-lg border border-line bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-fog transition-colors hover:bg-white/[0.12]"
          @click="dismiss"
        >
          OK
        </button>
      </div>
    </div>
  </Transition>
</template>
