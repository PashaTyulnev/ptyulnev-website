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
      class="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-line-strong bg-surface px-5 py-4 shadow-lg"
      role="region"
      aria-label="Cookie-Hinweis"
    >
      <div class="flex items-start justify-between gap-4">
        <p class="text-sm leading-relaxed text-muted">
          Diese Seite setzt keine Tracking-Cookies. Schriften werden von Google
          Fonts geladen.
          <NuxtLink
            to="/datenschutz"
            class="text-fg underline underline-offset-2"
          >
            Datenschutzerklärung
          </NuxtLink>
        </p>
        <button
          type="button"
          class="mt-0.5 shrink-0 rounded-lg border border-line px-4 py-1.5 text-xs font-medium hover:bg-bg"
          @click="dismiss"
        >
          OK
        </button>
      </div>
    </div>
  </Transition>
</template>
