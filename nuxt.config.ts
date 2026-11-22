import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'https://cdn.ptyulnev.de',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: 'Betriebsabläufe digitalisieren & individuelle Software | Pavel Tyulnev, Dresden',
      htmlAttrs: { lang: 'de' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Softwareentwickler in Dresden: individuelle Software für Dienstplanung, Zeiterfassung und Auswertungen, Schnittstellen, Shopware-Entwicklung und Übernahme bestehender Software. Bestandsaufnahme kostenlos.',
        },
        {
          name: 'keywords',
          content:
            'Softwareentwickler Dresden, Betriebsabläufe digitalisieren, Digitalisierung Dresden, individuelle Softwareentwicklung, Dienstplanung Software, Zeiterfassung Software, Datenauswertung, API-Integration, Schnittstellen, Shopware Entwickler, Shopware Plugin Entwicklung, Software übernehmen, Pavel Tyulnev',
        },
        { name: 'theme-color', content: '#0d0f10' },
        {
          name: 'google-site-verification',
          content: 'oMKGQendz2vQPukT3BfJj6-DuvHD-CmfqF2cHTF6TjI',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'de_DE' },
        { property: 'og:url', content: 'https://ptyulnev.de/' },
        { property: 'og:site_name', content: 'Pavel Tyulnev' },
        { property: 'og:image', content: 'https://ptyulnev.de/cv/profile_image.png' },
        {
          property: 'og:title',
          content: 'Betriebsabläufe digitalisieren & individuelle Software | Pavel Tyulnev, Dresden',
        },
        {
          property: 'og:description',
          content:
            'Softwareentwickler in Dresden: individuelle Software für Dienstplanung, Zeiterfassung und Auswertungen, Schnittstellen, Shopware-Entwicklung und Übernahme bestehender Software. Bestandsaufnahme kostenlos.',
        },
      ],
      script: [
        {
          // Runs before hydration so a saved light-theme preference never
          // flashes the default dark theme first.
          innerHTML:
            "(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();",
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})
