import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { apartments, apartmentSlug, priceLine, roomCaption } from '@/data/apartments'
import { seasons, waUrl } from '@/data/site'
import { PaxIcons } from '@/components/icons'
import {
  btnOrange,
  btnOutline,
  btnTeal,
  container,
  eyebrowLight,
  h2,
  lead,
  sectionY,
} from '@/components/ui/styles'
import { toItem } from '@/lib/images'
import { ApartmentCarousel } from './ApartmentCarousel'

export async function HomeApartments({ locale }: { locale: Locale }) {
  const t = await getTranslations('HomeApartments')
  const c = await getTranslations('Common')
  const a11y = await getTranslations('Apartment')
  return (
    <section
      id="departamentos"
      data-section="departamentos"
      aria-labelledby="home-apts-title"
      className="bg-cream scroll-mt-[84px] overflow-x-clip"
    >
      <div className={`${container} ${sectionY}`}>
        <p className={eyebrowLight} data-reveal="up">
          {t('eyebrow')}
        </p>
        <h2
          id="home-apts-title"
          className={`${h2} max-w-[20ch]`}
          data-reveal="up"
          style={{ '--reveal-delay': '.08s' } as CSSProperties}
        >
          {t('title')}
        </h2>
        <p className={lead} data-reveal="up" style={{ '--reveal-delay': '.16s' } as CSSProperties}>
          {t('lead')}
        </p>

        <div className="border-ink/12 mt-[clamp(28px,4vw,44px)] border-t">
          {apartments.map((a, idx) => {
            const label = `${c('apartment')} ${a.n}`
            const slides = a.carousel.map((id) => {
              const room = a.images.find((im) => im.id === id)?.room ?? 'overview'
              return toItem(id, a11y('photoAlt', { caption: roomCaption[room][locale], n: a.n }))
            })
            return (
              <article
                key={a.n}
                aria-labelledby={`home-apt-${a.n}`}
                className="border-ink/12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-[clamp(20px,3.5vw,44px)] border-b py-[clamp(28px,4vw,40px)]"
              >
                {/* La foto entra desde su lado y el texto desde el opuesto */}
                <div
                  className={idx % 2 === 1 ? 'min-[761px]:order-2' : undefined}
                  data-reveal={idx % 2 === 1 ? 'right' : 'left'}
                >
                  <ApartmentCarousel
                    slides={slides}
                    offset={idx}
                    apartment={a.n}
                    dotLabel={t.raw('photoOf')}
                  />
                </div>
                <div
                  className="flex flex-col gap-3"
                  data-reveal={idx % 2 === 1 ? 'left' : 'right'}
                  style={{ '--reveal-delay': '.12s' } as CSSProperties}
                >
                  <h3
                    id={`home-apt-${a.n}`}
                    className="text-orange-text m-0 text-[13.5px] font-semibold tracking-[2px] uppercase"
                  >
                    {label}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span
                      className="font-display text-teal text-[clamp(56px,7vw,76px)] leading-[.9]"
                      aria-hidden="true"
                    >
                      {a.pax}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-display text-ink text-[26px] leading-[1.1]">
                        <span className="sr-only">{a.pax} </span>
                        {c('guests')}
                      </span>
                      <PaxIcons count={a.pax} />
                    </div>
                  </div>
                  <p className="text-slate m-0 text-[18px] leading-[1.6]">{a.summary[locale]}</p>
                  <p className="text-slate m-0 text-base leading-[1.6]">{t('amenityLine')}</p>
                  <div className="mt-1 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
                    <div className="border-ink/10 rounded-xl border bg-white px-3.5 py-3">
                      <p className="text-muted m-0 text-[12.5px] font-semibold tracking-[1.5px] uppercase">
                        {seasons.low.label[locale]}
                      </p>
                      <p className="text-teal mt-1 mb-0 text-[16.5px] font-semibold">
                        {priceLine(a.prices.low, locale)}
                      </p>
                    </div>
                    <div className="bg-teal-dark rounded-xl px-3.5 py-3">
                      <p className="m-0 text-[12.5px] font-semibold tracking-[1.5px] text-white/70 uppercase">
                        {seasons.high.label[locale]}
                      </p>
                      <p className="text-orange mt-1 mb-0 text-[16.5px] font-semibold">
                        {priceLine(a.prices.high, locale)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5 pt-1.5">
                    <Link
                      href={{
                        pathname: '/departamentos/[slug]',
                        params: { slug: apartmentSlug(a.n, locale) },
                      }}
                      className={btnTeal}
                      data-track="cta_click"
                      data-track-cta_id={`ver_depto_${a.n}`}
                      data-track-location="apartment_card"
                      data-track-apartment={a.n}
                    >
                      {c('viewApartment')} <span aria-hidden="true">→</span>
                    </Link>
                    <a
                      href={waUrl(c('waApartment', { n: a.n }))}
                      target="_blank"
                      rel="noopener"
                      className={btnOutline}
                      data-track="whatsapp_click"
                      data-track-location="apartment_card"
                      data-track-apartment={a.n}
                    >
                      {c('askWhatsapp')}
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-[clamp(30px,4vw,44px)] flex justify-center" data-reveal="up">
          <Link
            href="/departamentos"
            className={`${btnOrange} px-8 shadow-[0_6px_18px_rgba(240,151,59,.3)]`}
            data-track="cta_click"
            data-track-cta_id="ver_todos"
            data-track-location="apartments_section"
          >
            {c('seeAllApartments')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
