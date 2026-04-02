// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s | Toolbox',
      title: 'Toolbox',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A collection of developer tools including Line Joiner and JSON Mapping.' },
        { property: 'og:title', content: 'Toolbox' },
        { property: 'og:description', content: 'A collection of developer tools including Line Joiner and JSON Mapping.' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-gtag',
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Toolbox',
      short_name: 'Toolbox',
      description: 'A collection of developer tools including Line Joiner and JSON Mapping.',
      theme_color: '#121212',
      background_color: '#121212',
      icons: [
        {
          src: '/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        },
        {
          src: '/favicon.svg',
          sizes: '192x192',
          type: 'image/svg+xml'
        },
        {
          src: '/favicon.svg',
          sizes: '512x512',
          type: 'image/svg+xml'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  gtag: {
    id: 'G-LY2LLWHMJY'
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
