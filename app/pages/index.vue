<script setup lang="ts">
useHead({
  title: 'Pavel Tyulnev — Shopware 6 & individuelle Business-Software | Dresden',
  link: [{ rel: 'canonical', href: 'https://ptyulnev.de/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Pavel Tyulnev',
        url: 'https://ptyulnev.de/',
        email: 'kontakt@ptyulnev.de',
        telephone: '+4917670583534',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dresden',
          addressCountry: 'DE',
        },
        areaServed: ['Dresden', 'DE'],
        description:
          'Softwareentwickler in Dresden. Shopware 6 als Schwerpunkt, dazu individuelle Business-Software, API-Integrationen und Automatisierung, Bugfixing und Performance-Optimierung.',
        knowsAbout: [
          'Shopware 6',
          'Shopware Plugin-Entwicklung',
          'Shopware Template-Anpassung',
          'Shopware Migration von SW5',
          'Individuelle Softwareentwicklung',
          'API-Integration',
          'Automatisierung',
          'Bugfixing',
          'Performance-Optimierung',
        ],
      }),
    },
  ],
})
</script>

<template>
  <main>
    <HeroSection />
    <ServicesSection />
    <ProjectsSection />
    <TechSection />
    <AgentsSection />
    <ContactSection />
  </main>
</template>
