<script setup lang="ts">
useHead({
  title: 'Betriebsabläufe digitalisieren & individuelle Software | Pavel Tyulnev, Dresden',
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
        image: 'https://ptyulnev.de/cv/profile_image.png',
        sameAs: ['https://www.linkedin.com/in/pavel-tyulnev-82327b270/'],
        founder: { '@type': 'Person', name: 'Pavel Tyulnev', jobTitle: 'Softwareentwickler', sameAs: ['https://www.linkedin.com/in/pavel-tyulnev-82327b270/'] },
        makesOffer: [
          {
            '@type': 'Offer',
            name: 'Kostenlose Bestandsaufnahme',
            description: 'Analyse der bestehenden Betriebsabläufe und Software mit ehrlicher Einschätzung, bevor etwas umgesetzt wird.',
            price: '0',
            priceCurrency: 'EUR',
          },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Betriebsabläufe digitalisieren: Dienstplanung, Zeiterfassung, interne Tools' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Daten verbinden und auswerten: Schnittstellen, Importe, Reports' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shopware 6 Entwicklung: Plugins, Wartung, Migration' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Übernahme und Weiterentwicklung bestehender Software' } },
        ],
        knowsAbout: [
          'Digitalisierung von Betriebsabläufen',
          'Individuelle Softwareentwicklung',
          'Dienstplanung',
          'Zeiterfassung',
          'Datenauswertung',
          'API-Integration',
          'Automatisierung',
          'Shopware 6',
          'Shopware Plugin-Entwicklung',
          'Symfony',
          'PHP',
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
    <OfferSection />
    <ProcessSection />
    <ProjectsSection />
    <AboutSection />
    <AgentsSection />
    <ContactSection />
  </main>
</template>
