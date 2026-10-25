import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import { routing, type Locale } from './routing'

/**
 * Idioma de la ruta actual (root param [locale]) validado.
 * Rutas como /algo.php caen en [locale]="algo.php": se responde 404 en vez de renderizar con un idioma inválido.
 */
export async function pageLocale(): Promise<Locale> {
  const value = await rootLocale()
  if (!hasLocale(routing.locales, value)) notFound()
  return value
}
