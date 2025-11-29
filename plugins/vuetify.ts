// plugins/vuetify.ts
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          colors: {
            primary: '#2E7D32', // Green 800
            secondary: '#00695C', // Teal 800
            surface: '#F1F8E9', // Light Green 50
            background: '#FFFFFF',
            error: '#B00020',
            info: '#0288D1',
            success: '#2E7D32',
            warning: '#F57C00',
          },
        },
        dark: {
          colors: {
            primary: '#A5D6A7', // Material You Green 200
            secondary: '#80CBC4', // Teal 200
            surface: '#1A211B', // Dark Green-Grey Surface
            background: '#101411', // Very Dark Green-Grey Background
            error: '#EF9A9A',
            info: '#81D4FA',
            success: '#A5D6A7',
            warning: '#FFE082',
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
