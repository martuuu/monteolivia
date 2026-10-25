import type { Locale } from '@/i18n/routing'

export type L<T = string> = Record<Locale, T>

/** Datos de contacto y negocio. Fuente: diseño aprobado + sitio anterior (monteoliviasuites.com.ar). */
export const site = {
  name: 'Monte Olivia Suites',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://monteoliviasuites.com.ar').replace(/\/$/, ''),
  whatsapp: '5492916421561',
  phoneDisplay: '+54 9 291 642 1561',
  email: 'info@monteoliviasuites.com.ar',
  address: {
    street: 'Primer Argentino 108',
    postalCode: '9410',
    city: 'Ushuaia',
    region: 'Tierra del Fuego',
    country: 'AR',
    countryName: { es: 'Argentina', en: 'Argentina' } satisfies L,
  },
  // PENDIENTE: confirmar con el cliente (pin aproximado de la calle Primer Argentino, OpenStreetMap/Nominatim).
  geo: { lat: -54.81637, lng: -68.33278 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Primer+Argentino+108+Ushuaia',
  social: {
    instagram: 'https://www.instagram.com/monteoliviasuites',
    facebook: 'https://www.facebook.com/MonteOliviaSuites',
    airbnb: 'https://www.airbnb.com.ar/users/show/243098378',
  },
  /** Video de fondo del hero (solo desktop). null = hero con imagen. Ver .docs/roadmap.md */
  heroVideo: null as null | { mp4: string; webm?: string },
  foundingYear: 2019,
  /** Año del copyright (fijo para que las páginas sigan siendo estáticas). */
  copyrightYear: 2026,
} as const

export const seasons = {
  low: {
    label: { es: 'Temporada baja', en: 'Low season' },
    months: { es: 'Abril a junio · Octubre y noviembre', en: 'April–June · October & November' },
  },
  high: {
    label: { es: 'Temporada alta', en: 'High season' },
    months: { es: 'Julio a septiembre · Diciembre a marzo', en: 'July–September · December–March' },
  },
} as const

export function waUrl(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

export function mailtoUrl(subject: string, body?: string) {
  const q = [`subject=${encodeURIComponent(subject)}`]
  if (body) q.push(`body=${encodeURIComponent(body)}`)
  return `mailto:${site.email}?${q.join('&')}`
}
