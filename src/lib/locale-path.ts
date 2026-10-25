import type { Locale } from '@/i18n/routing'

/**
 * Traduce una URL pública al otro idioma (para el selector ES/EN del header).
 * Espejo de `pathnames` en src/i18n/routing.ts — mantener sincronizado.
 */
const pairs: [es: RegExp, en: string, en2es: RegExp, es: string][] = [
  [
    /^\/departamentos\/departamento-(\d)$/,
    '/apartments/apartment-$1',
    /^\/apartments\/apartment-(\d)$/,
    '/departamentos/departamento-$1',
  ],
  [/^\/departamentos$/, '/apartments', /^\/apartments$/, '/departamentos'],
  [/^\/mantenimiento$/, '/maintenance', /^\/maintenance$/, '/mantenimiento'],
]

export function localeOfPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

export function switchLocalePath(pathname: string, to: Locale): string {
  const clean = pathname.replace(/\/+$/, '') || '/'
  const from = localeOfPath(clean)
  if (from === to) return clean
  if (to === 'en') {
    for (const [re, en] of pairs) if (re.test(clean)) return '/en' + clean.replace(re, en)
    return clean === '/' ? '/en' : '/en' + clean
  }
  const rest = clean.replace(/^\/en/, '') || '/'
  for (const [, , re, es] of pairs) if (re.test(rest)) return rest.replace(re, es)
  return rest
}
