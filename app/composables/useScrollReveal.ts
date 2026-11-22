import { onMounted, type Ref } from 'vue'

/**
 * Reveals `[data-reveal]` descendants of `root` as they scroll into view,
 * using the globally registered GSAP ScrollTrigger plugin.
 *
 * Elements should carry the `reveal-init` class for their hidden start state.
 * Respects the user's reduced-motion preference.
 */
export function useScrollReveal(root: Ref<HTMLElement | null>): void {
  const { $gsap, $ScrollTrigger } = useNuxtApp() as unknown as {
    $gsap?: typeof import('gsap').gsap
    $ScrollTrigger?: unknown
  }

  onMounted(() => {
    if (!root.value) return

    const items = Array.from(
      root.value.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion || !$gsap || !$ScrollTrigger) {
      items.forEach((el) => el.classList.remove('reveal-init'))
      return
    }

    items.forEach((el, index) => {
      $gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: (index % 3) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })
  })
}
