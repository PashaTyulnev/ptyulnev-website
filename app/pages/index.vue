<script setup lang="ts">
useHead({
  title: 'Pavel Tyulnev — Abläufe digitalisieren, Shopware betreuen, Software übernehmen | Dresden',
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
          'Softwareentwickler in Dresden. Ich digitalisiere manuelle Abläufe, betreue Shopware-6-Shops und übernehme bestehende Software, wenn der bisherige Entwickler weg ist.',
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
    <ProblemsSection />
    <ServicesSection />
    <CheckSection />
    <ProcessSection />
    <ProjectsSection />
    <AboutSection />
    <AgentsSection />
    <ContactSection />
  </main>
</template>
