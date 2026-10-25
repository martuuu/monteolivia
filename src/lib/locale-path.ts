import type { Locale } from '@/i18n/routing'

/**
 * Traduce una URL al otro idioma (selector ES/EN). Acepta la URL pública (/en/apartments/apartment-2)
 * y también la ruta interna que puede devolver usePathname tras el rewrite de next-intl
 * (/es/departamentos/departamento-2, /en/departamentos/apartment-2).
 * Espejo de `pathnames` en src/i18n/routing.ts — mantener sincronizado.
 */
type Parsed =
  | { kind: 'home' }
  | { kind: 'list' }
  | { kind: 'detail'; n: string }
  | { kind: 'maintenance' }
  | { kind: 'other'; rest: string }

export function localeOfPath(pathname: string): Locale {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'es'
}

function parse(pathname: string): Parsed {
  const rest = (pathname.replace(/\/+$/, '') || '/').replace(/^\/(es|en)(?=\/|$)/, '') || '/'
  if (rest === '/') return { kind: 'home' }
  if (/^\/(departamentos|apartments)$/.test(rest)) return { kind: 'list' }
  const d = rest.match(/^\/(?:departamentos|apartments)\/(?:departamento|apartment)-(\d+)$/)
  if (d) return { kind: 'detail', n: d[1] }
  if (/^\/(mantenimiento|maintenance)$/.test(rest)) return { kind: 'maintenance' }
  return { kind: 'other', rest }
}

export function switchLocalePath(pathname: string, to: Locale): string {
  const p = parse(pathname)
  const en = to === 'en'
  switch (p.kind) {
    case 'home':
      return en ? '/en' : '/'
    case 'list':
      return en ? '/en/apartments' : '/departamentos'
    case 'detail':
      return en ? `/en/apartments/apartment-${p.n}` : `/departamentos/departamento-${p.n}`
    case 'maintenance':
      return en ? '/en/maintenance' : '/mantenimiento'
    default:
      return en ? `/en${p.rest}` : p.rest
  }
}
