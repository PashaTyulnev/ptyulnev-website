<script setup lang="ts">
import { ref, watch } from 'vue'

const navItems = [
  { label: 'Leistungen', href: '/#leistungen', external: false },
  { label: 'Bestandsaufnahme', href: '/#bestandsaufnahme', external: false },
  { label: 'Fallstudien', href: '/fallstudien', external: false },
  { label: 'Blog', href: '/blog', external: false },
  { label: 'Über mich', href: '/#ueber-mich', external: false },
  { label: 'CV', href: '/cv', external: true },
]

const isMenuOpen = ref(false)

function closeMenu(): void {
  isMenuOpen.value = false
}

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeMenu()
}

watch(isMenuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/95"
  >
    <div
      class="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6"
    >
      <NuxtLink to="/" class="flex items-center gap-2.5 font-semibold" @click="closeMenu">
        <span
          class="flex size-7 items-center justify-center rounded-lg border border-line bg-ink-soft text-xs font-bold tracking-tight text-fog "
        >
          PT
        </span>
        <span class="text-[0.95rem] tracking-tight">Pavel Tyulnev</span>
      </NuxtLink>

      <nav class="hidden items-center gap-7 text-sm text-muted lg:flex">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="transition-colors duration-150 hover:text-fog"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <ThemeToggle />
        <BaseButton
          href="/#kontakt"
          class="hidden h-10 px-5 text-sm sm:inline-flex"
        >
          Kontakt
        </BaseButton>

        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 hover:border-line-strong hover:text-fog lg:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-nav"
          :aria-label="isMenuOpen ? 'Menü schließen' : 'Menü öffnen'"
          @click="toggleMenu"
        >
          <svg
            v-if="!isMenuOpen"
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="isMenuOpen"
        id="mobile-nav"
        class="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink px-6 py-4 lg:hidden"
      >
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="block border-b border-line py-3.5 text-base text-muted transition-colors duration-150 last:border-b-0 hover:text-fog"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>

        <BaseButton
          href="/#kontakt"
          variant="secondary"
          class="mt-5 h-11 w-full text-sm"
          @click="closeMenu"
        >
          Gespräch vereinbaren
        </BaseButton>
      </nav>
    </Transition>
  </header>
</template>
