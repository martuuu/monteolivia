import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'
import { routing } from '@/i18n/routing'
import { NotFoundView } from '@/components/layout/NotFoundView'

async function currentLocale() {
  const value = await rootLocale()
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: await currentLocale(), namespace: 'Meta' })
  return { title: { absolute: t('notFoundTitle') }, robots: { index: false, follow: true } }
}

export default async function NotFound() {
  const locale = await currentLocale()
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return (
    <>
      {/* React 19 lo lleva al <head> (la metadata de not-found no se emite con cacheComponents) */}
      <title>{t('notFoundTitle')}</title>
      <NotFoundView locale={locale} />
    </>
  )
}
