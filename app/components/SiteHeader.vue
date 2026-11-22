<script setup lang="ts">
const navItems = [
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Softwarecheck', href: '/#check' },
  { label: 'Projekte', href: '/#projekte' },
  { label: 'Über mich', href: '/#ueber-mich' },
  { label: 'CV', href: '/cv/' },
]

function toggleTheme(): void {
  const dark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
      <NuxtLink to="/" class="font-semibold tracking-tight">Pavel Tyulnev</NuxtLink>

      <nav class="hidden items-center gap-8 text-sm text-muted md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="transition-colors hover:text-fg"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-fg"
          aria-label="Hell/Dunkel umschalten"
          @click="toggleTheme"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
          </svg>
        </button>
        <BaseButton href="/#kontakt" class="hidden h-10 px-4 text-sm sm:inline-flex">
          Kontakt
        </BaseButton>
      </div>
    </div>
  </header>
</template>
