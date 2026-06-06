<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Loads the Spline robot scene as the hero's main visual element.
 *
 * The Spline web component is registered lazily on the client only. The robot
 * already tracks the mouse with its head inside the Spline scene, so this
 * component simply mounts it full-bleed and centered behind the hero content.
 */
const SCENE_URL = 'https://prod.spline.design/hwnITsxvyRhIJgsE/scene.splinecode'

const isLoaded = ref(false)
const container = ref<HTMLElement | null>(null)

// Fallback reveal in case the viewer's `load` event never fires.
const REVEAL_FALLBACK_MS = 4000
let fallbackTimer: ReturnType<typeof setTimeout> | undefined

/**
 * The Spline canvas captures wheel events for its own controls. Forward them to
 * the page in the capture phase so scrolling still works while the robot keeps
 * receiving pointer/mouse events for head tracking.
 */
function forwardWheelToPage(event: WheelEvent): void {
  window.scrollBy({
    top: event.deltaY,
    left: event.deltaX,
  })
  event.preventDefault()
}

onMounted(async () => {
  await import('@splinetool/viewer')
  fallbackTimer = setTimeout(() => (isLoaded.value = true), REVEAL_FALLBACK_MS)

  container.value?.addEventListener('wheel', forwardWheelToPage, {
    passive: false,
    capture: true,
  })
})

onBeforeUnmount(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  container.value?.removeEventListener('wheel', forwardWheelToPage, {
    capture: true,
  })
})

function onSceneLoad(): void {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  isLoaded.value = true
}
</script>

<template>
  <div
    ref="container"
    class="absolute inset-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    <ClientOnly>
      <spline-viewer
        :url="SCENE_URL"
        class="h-full w-full transition-opacity duration-[1200ms] ease-out"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        @load="onSceneLoad"
      />
    </ClientOnly>

    <!-- Vignette to keep the hero content readable above the robot. -->
    <div
      class="pointer-events-none absolute inset-0"
      style="
        background:
          radial-gradient(
            120% 90% at 50% 45%,
            transparent 0%,
            transparent 45%,
            rgba(5, 5, 5, 0.55) 100%
          );
      "
    />
  </div>
</template>

<style scoped>
/* Allow vertical page scroll on touch devices over the canvas. */
:deep(spline-viewer) {
  touch-action: pan-y;
}
</style>
