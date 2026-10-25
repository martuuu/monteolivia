import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageLocale } from '@/i18n/locale'
import { buildMetadata } from '@/lib/seo'
import { businessJsonLd, websiteJsonLd } from '@/lib/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/home/Hero'
import { QuickFacts } from '@/components/home/QuickFacts'
import { HomeApartments } from '@/components/home/HomeApartments'
import { Rates } from '@/components/home/Rates'
import { Guests } from '@/components/home/Guests'
import { Booking } from '@/components/home/Booking'
import { Gallery } from '@/components/home/Gallery'
import { Tours } from '@/components/home/Tours'
import { Location } from '@/components/home/Location'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await pageLocale()
  const t = await getTranslations('Meta')
  return buildMetadata({
    locale,
    href: '/',
    title: t('homeTitle'),
    description: t('homeDescription'),
    ogImage: `/og/home-${locale}.jpg`,
    ogAlt: t('ogAlt'),
  })
}

export default async function Home() {
  const locale = await pageLocale()
  return (
    <>
      <JsonLd data={[businessJsonLd(locale), websiteJsonLd(locale)]} />
      <Hero />
      <QuickFacts />
      <HomeApartments locale={locale} />
      <Rates locale={locale} />
      <Guests locale={locale} />
      <Booking />
      <Gallery locale={locale} />
      <Tours locale={locale} />
      <Location />
    </>
  )
}
