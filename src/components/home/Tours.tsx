import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { tours } from '@/data/tours'
import { Photo } from '@/components/ui/Photo'
import { container, eyebrowLight, h2, lead } from '@/components/ui/styles'
import { ToursScroller } from './ToursScroller'

export async function Tours({ locale }: { locale: Locale }) {
  const t = await getTranslations('Tours')
  return (
    <section
      id="excursiones"
      data-section="excursiones"
      aria-labelledby="tours-title"
      className="bg-cream scroll-mt-[84px]"
    >
      <div className={`${container} pt-[clamp(56px,9vw,104px)] pb-[clamp(40px,6vw,72px)]`}>
        <p className={eyebrowLight}>{t('eyebrow')}</p>
        <h2 id="tours-title" className={h2}>
          {t('title')}
        </h2>
        <p className={lead}>{t('lead')}</p>
      </div>
      <div className={`${container} pb-[clamp(56px,9vw,104px)]`}>
        <ToursScroller prev={t('prev')} next={t('next')}>
          {tours.map((tour) => (
            <article
              key={tour.id}
              className="border-ink/8 flex w-[min(340px,86vw)] flex-none snap-start flex-col overflow-hidden rounded-[18px] border bg-white"
            >
              <div className="bg-sand relative h-[180px] flex-none">
                <Photo id={tour.image} alt={tour.name[locale]} fill sizes="340px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-3 px-5 pt-5 pb-[22px]">
                <h3 className="font-display m-0 text-[22px] font-normal">{tour.name[locale]}</h3>
                <p className="text-slate m-0 text-base leading-[1.55]">{tour.desc[locale]}</p>
                <dl className="border-ink/8 mt-auto mb-0 grid grid-cols-2 gap-x-3.5 gap-y-2.5 border-t pt-3 text-[15px]">
                  <div>
                    <dt className="text-muted m-0 text-[12px] font-semibold tracking-[1.5px] uppercase">
                      {t('distance')}
                    </dt>
                    <dd className="text-ink mt-[3px] mb-0 leading-[1.4] font-medium">
                      {tour.distance[locale]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted m-0 text-[12px] font-semibold tracking-[1.5px] uppercase">
                      {t('contact')}
                    </dt>
                    <dd className="text-ink mt-[3px] mb-0 leading-[1.4] font-medium">
                      {tour.contact[locale]}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </ToursScroller>
      </div>
    </section>
  )
}
