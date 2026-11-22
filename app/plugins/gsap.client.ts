import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Registers GSAP and its ScrollTrigger plugin once on the client and exposes
 * them via the Nuxt app (`$gsap`, `$ScrollTrigger`). This keeps the structure
 * ready for scroll-driven animations to be added later.
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
