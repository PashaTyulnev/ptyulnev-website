<script setup lang="ts">
const { theme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="relative">
    <BackgroundParticleLifeBackground
      :theme="theme"
      :opacity="theme === 'light' ? 0.28 : 0.4"
    />
    <SiteHeader />
    <NuxtPage />
    <CookieBanner />
  </div>
</template>
