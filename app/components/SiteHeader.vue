<script setup lang="ts">
const navItems = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Projekte', href: '#projekte' },
  { label: 'Kontakt', href: '#kontakt' },
]
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/60 backdrop-blur-xl"
  >
    <div
      class="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6"
    >
      <a href="#top" class="flex items-center gap-2.5 font-semibold">
        <span
          class="size-6 rounded-lg bg-fog shadow-[0_0_20px_-2px_rgba(255,255,255,0.5)]"
        />
        <span class="text-[0.95rem] tracking-tight">Pavel Tyulnev</span>
      </a>

      <nav class="hidden items-center gap-9 text-sm text-muted md:flex">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="transition-colors duration-150 hover:text-fog"
        >
          {{ item.label }}
        </a>
      </nav>

      <BaseButton
        href="#kontakt"
        variant="secondary"
        class="hidden h-10 px-5 text-sm sm:inline-flex"
      >
        Gespräch vereinbaren
      </BaseButton>
    </div>
  </header>
</template>
