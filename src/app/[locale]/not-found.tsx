import { locale as rootLocale } from 'next/root-params'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { NotFoundView } from '@/components/layout/NotFoundView'

export default async function NotFound() {
  const value = await rootLocale()
  return <NotFoundView locale={hasLocale(routing.locales, value) ? value : routing.defaultLocale} />
}
