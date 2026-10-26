import type { Metadata } from 'next'
import { PageTransition } from '@/components/layout/PageTransition'
import { getTranslations } from 'next-intl/server'
import { pageLocale } from '@/i18n/locale'
import { Link } from '@/i18n/navigation'
import { apartments, apartmentSlug } from '@/data/apartments'
import { buildMetadata, localizedUrl } from '@/lib/seo'
import { breadcrumbJsonLd } from '@/lib/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { Photo } from '@/components/ui/Photo'
import { ApartmentBlock } from '@/components/apartments/ApartmentBlock'
import { ClosingCta } from '@/components/apartments/ClosingCta'
import { ApartmentPicker } from '@/components/apartments/ApartmentPicker'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await pageLocale()
  const t = await getTranslations('Meta')
  return buildMetadata({
    locale,
    href: '/departamentos',
    title: t('apartmentsTitle'),
    description: t('apartmentsDescription'),
    ogImage: `/og/apartments-${locale}.jpg`,
    ogAlt: t('ogAlt'),
  })
}

export default async function ApartmentsPage() {
  const locale = await pageLocale()
  const t = await getTranslations('ApartmentsPage')
  const c = await getTranslations('Common')
  const a = await getTranslations('Apartment')
  return (
    <PageTransition>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: a('breadcrumbHome'), url: localizedUrl('/', locale) },
          { name: t('title'), url: localizedUrl('/departamentos', locale) },
        ])}
      />
      <section
        id="inicio"
        data-section="hero"
        className="bg-ink relative flex min-h-[72svh] items-end overflow-hidden"
      >
        <div className="animate-mo-zoom absolute inset-0">
          <Photo
            id="depto-3-portada"
            alt={t('imageAlt')}
            fill
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover object-[center_55%]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,40,54,.55)_0%,rgba(11,40,54,.3)_35%,rgba(7,27,38,.82)_72%,rgba(7,27,38,.96)_100%)]" />
        <div className="wrap relative z-2 flex flex-col gap-[22px] pt-[140px] pb-[clamp(44px,6vh,72px)]">
          <div className="max-w-[820px]">
            <p className="bg-night/55 text-orange m-0 mb-4 inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-[clamp(14px,1.5vw,17px)] font-semibold tracking-[3px] uppercase backdrop-blur-sm">
              {t('eyebrow')}
            </p>
            <h1 className="font-display m-0 text-[clamp(2.8rem,7vw,5rem)] leading-[1.05] font-normal text-white [text-shadow:0_2px_24px_rgba(7,27,38,.6)]">
              {t('title')}
            </h1>
            <p className="mt-[18px] mb-0 max-w-[62ch] text-[clamp(18px,2.2vw,20px)] leading-[1.65] text-white/92 [text-shadow:0_1px_14px_rgba(7,27,38,.7)]">
              {t('lead')}
            </p>
          </div>
        </div>
      </section>

      <ApartmentPicker
        ariaLabel={t('jumpTo')}
        items={apartments.map((apt) => ({
          n: apt.n,
          pax: apt.pax,
          label: `${c('apartment')} ${apt.n}`,
          paxLabel: apt.pax === 2 ? c('exactly', { n: 2 }) : c('upTo', { n: apt.pax }),
        }))}
      />

      {apartments.map((apt, i) => (
        <section
          key={apt.n}
          id={`depto-${apt.n}`}
          data-section={`depto_${apt.n}`}
          className="border-ink/8 scroll-mt-[90px] border-t bg-white first-of-type:border-t-0"
        >
          <div className="wrap py-[clamp(40px,6vw,72px)]">
            <ApartmentBlock apt={apt} locale={locale} priority={i === 0} />
            <p className="mt-6 mb-0 text-right">
              <Link
                href={{ pathname: '/departamentos/[slug]', params: { slug: apartmentSlug(apt.n, locale) } }}
                prefetch
                className="text-teal inline-flex min-h-11 items-center text-base font-semibold underline-offset-4 hover:underline"
                data-track="cta_click"
                data-track-cta_id={`ficha_depto_${apt.n}`}
                data-track-location="apartments_page"
                data-track-apartment={apt.n}
              >
                {c('viewApartment')} {apt.n} <span aria-hidden="true">&nbsp;→</span>
              </Link>
            </p>
          </div>
        </section>
      ))}
      <ClosingCta />
    </PageTransition>
  )
}
