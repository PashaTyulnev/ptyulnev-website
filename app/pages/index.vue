<script setup lang="ts">
useHead({
  title: 'Pavel Tyulnev — Betriebsabläufe digitalisieren, individuelle Software, Shopware | Dresden',
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
          'Softwareentwickler in Dresden. Ich digitalisiere Betriebsabläufe wie Dienstplanung, Zeiterfassung und Auswertungen, verbinde Datenquellen, entwickle für Shopware 6 und übernehme bestehende Software.',
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
