import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  // ES sin prefijo (/), EN con /en
  localePrefix: 'as-needed',
  // La URL es la única fuente de idioma: canonical estable para Google, sin cookies en respuestas estáticas.
  localeDetection: false,
  localeCookie: false,
  // hreflang se emite desde generateMetadata (control total de x-default)
  alternateLinks: false,
  pathnames: {
    '/': '/',
    '/departamentos': { es: '/departamentos', en: '/apartments' },
    '/departamentos/[slug]': { es: '/departamentos/[slug]', en: '/apartments/[slug]' },
    '/mantenimiento': { es: '/mantenimiento', en: '/maintenance' },
  },
})

export type Locale = (typeof routing.locales)[number]
export type AppPathname = keyof typeof routing.pathnames
