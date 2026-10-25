import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { pageLocale } from '@/i18n/locale'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { apartmentFromSlug, apartments, apartmentSlug, minPrice } from '@/data/apartments'
import { buildMetadata, localizedUrl } from '@/lib/seo'
import { apartmentJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { ApartmentBlock } from '@/components/apartments/ApartmentBlock'
import { ClosingCta } from '@/components/apartments/ClosingCta'
import { ChevronIcon } from '@/components/icons'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    apartments.map((a) => ({ locale, slug: apartmentSlug(a.n, locale) })),
  )
}

async function resolve(params: PageProps<'/[locale]/departamentos/[slug]'>['params']) {
  const locale = await pageLocale()
  const { slug } = await params
  const apt = apartmentFromSlug(slug, locale)
  if (!apt) notFound()
  return { locale, apt }
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/departamentos/[slug]'>): Promise<Metadata> {
  const { locale, apt } = await resolve(params)
  const t = await getTranslations('Meta')
  const c = await getTranslations('Common')
  const pax = apt.pax === 2 ? c('exactly', { n: 2 }) : c('upTo', { n: apt.pax })
  return buildMetadata({
    locale,
    href: (l) => ({ pathname: '/departamentos/[slug]', params: { slug: apartmentSlug(apt.n, l) } }),
    title: t('apartmentTitle', { n: apt.n, pax: pax.toLowerCase() }),
    description: t('apartmentDescription', { summary: apt.summary[locale], price: minPrice(apt) }),
    ogImage: `/og/apartment-${apt.n}-${locale}.jpg`,
    ogAlt: t('ogAlt'),
  })
}

export default async function ApartmentPage({ params }: PageProps<'/[locale]/departamentos/[slug]'>) {
  const { locale, apt } = await resolve(params)
  const t = await getTranslations('Apartment')
  const n = await getTranslations('Nav')
  const c = await getTranslations('Common')
  const idx = apartments.findIndex((a) => a.n === apt.n)
  const prev = apartments[(idx - 1 + apartments.length) % apartments.length]
  const next = apartments[(idx + 1) % apartments.length]
  const href = (num: number) => ({
    pathname: '/departamentos/[slug]' as const,
    params: { slug: apartmentSlug(num, locale) },
  })
  const label = `${c('apartment')} ${apt.n}`
  const pager =
    'inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/16 bg-white px-5 py-2.5 text-base font-semibold text-teal hover:border-teal'

  return (
    <>
      <JsonLd
        data={[
          apartmentJsonLd(apt, locale),
          breadcrumbJsonLd([
            { name: t('breadcrumbHome'), url: localizedUrl('/', locale) },
            { name: n('apartments'), url: localizedUrl('/departamentos', locale) },
            { name: label, url: localizedUrl(href(apt.n), locale) },
          ]),
        ]}
      />
      <section data-section={`depto_${apt.n}`} className="bg-white pt-[clamp(96px,12vw,120px)]">
        <div className="wrap pb-[clamp(40px,6vw,72px)]">
          <nav aria-label="Breadcrumb" className="mb-[clamp(20px,3vw,32px)]">
            <ol className="text-slate m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[15px]">
              <li>
                <Link href="/" className="text-slate hover:text-teal">
                  {t('breadcrumbHome')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/departamentos" className="text-slate hover:text-teal">
                  {n('apartments')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink font-semibold">
                {label}
              </li>
            </ol>
          </nav>
          <ApartmentBlock apt={apt} locale={locale} as="h1" priority />
          <nav
            aria-label={t('allApartments')}
            className="border-ink/10 mt-[clamp(32px,5vw,56px)] flex flex-wrap items-center justify-between gap-3 border-t pt-6"
          >
            <Link
              href={href(prev.n)}
              className={pager}
              data-track="nav_click"
              data-track-target={`depto_${prev.n}`}
              data-track-location="apartment_pager"
            >
              <ChevronIcon dir="left" size={18} />
              {c('apartment')} {prev.n}
            </Link>
            <Link
              href="/departamentos"
              className="text-teal text-base font-semibold hover:underline"
              data-track="nav_click"
              data-track-target="apartments"
              data-track-location="apartment_pager"
            >
              {t('allApartments')}
            </Link>
            <Link
              href={href(next.n)}
              className={pager}
              data-track="nav_click"
              data-track-target={`depto_${next.n}`}
              data-track-location="apartment_pager"
            >
              {c('apartment')} {next.n}
              <ChevronIcon size={18} />
            </Link>
          </nav>
        </div>
      </section>
      <ClosingCta />
    </>
  )
}
