/**
 * GA4 · wrapper de eventos. Catálogo completo de eventos y parámetros: .docs/analytics.md
 * - No hace nada si GA no está cargado (sin NEXT_PUBLIC_GA_ID o bloqueado), salvo loguear en desarrollo.
 * - Agrega locale y page_type a todos los eventos.
 */
export type EventName =
  | 'section_view'
  | 'section_time'
  | 'whatsapp_click'
  | 'email_click'
  | 'phone_click'
  | 'airbnb_click'
  | 'instagram_click'
  | 'facebook_click'
  | 'map_click'
  | 'cta_click'
  | 'nav_click'
  | 'menu_open'
  | 'lang_switch'
  | 'lightbox_open'
  | 'lightbox_nav'
  | 'carousel_interact'
  | 'booking_submit'
  | 'review_open'
  | 'review_submit'
  | 'tours_scroll'
  | 'hero_video'

export type EventParams = Record<string, string | number | boolean | undefined>

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }

export function pageType(pathname: string) {
  const p = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  if (p === '/') return 'home'
  if (/^\/(departamentos|apartments)$/.test(p)) return 'apartments'
  if (/^\/(departamentos|apartments)\//.test(p)) return 'apartment_detail'
  if (/^\/(mantenimiento|maintenance)$/.test(p)) return 'maintenance'
  return 'other'
}

export function track(name: EventName, params: EventParams = {}) {
  if (typeof window === 'undefined') return
  const clean: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(params))
    if (v !== undefined && v !== '') clean[k.slice(0, 40)] = typeof v === 'string' ? v.slice(0, 100) : v
  clean.locale = document.documentElement.lang || 'es'
  clean.page_type = pageType(window.location.pathname)
  const w = window as GtagWindow
  if (process.env.NODE_ENV !== 'production') console.debug('[ga]', name, clean)
  if (typeof w.gtag === 'function') w.gtag('event', name, clean)
}
