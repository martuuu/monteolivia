import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { apartments, priceLine } from '@/data/apartments'
import { seasons } from '@/data/site'
import { container, h2, lead, sectionY } from '@/components/ui/styles'

export async function Rates({ locale }: { locale: Locale }) {
  const t = await getTranslations('Rates')
  const c = await getTranslations('Common')
  const cards = [
    { key: 'low' as const, dark: false },
    { key: 'high' as const, dark: true },
  ]
  return (
    <section
      id="tarifas"
      data-section="tarifas"
      aria-labelledby="rates-title"
      className="scroll-mt-[84px] bg-white"
    >
      <div className={`${container} ${sectionY}`}>
        <h2 id="rates-title" className={h2}>
          {t('title')}
        </h2>
        <p className={lead}>{t('lead')}</p>
        <div className="mt-[clamp(28px,4vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(16px,2.5vw,26px)]">
          {cards.map(({ key, dark }) => (
            <div
              key={key}
              className={`border-ink/10 rounded-[18px] border p-[clamp(20px,3vw,30px)] ${dark ? 'bg-teal-dark' : 'bg-cream'}`}
            >
              <h3 className={`font-display m-0 text-[26px] font-normal ${dark ? 'text-white' : 'text-teal'}`}>
                {seasons[key].label[locale]}
              </h3>
              <p className={`mt-1.5 mb-3.5 text-[15.5px] ${dark ? 'text-white/75' : 'text-slate'}`}>
                {seasons[key].months[locale]}
              </p>
              <dl className="m-0">
                {apartments.map((a) => (
                  <div
                    key={a.n}
                    className={`flex items-baseline justify-between gap-3.5 border-t py-3 ${dark ? 'border-white/14' : 'border-ink/10'}`}
                  >
                    <dt
                      className={`text-[17px] font-medium whitespace-nowrap ${dark ? 'text-white' : 'text-ink'}`}
                    >
                      {c('apartment')} {a.n}
                    </dt>
                    <dd
                      className={`m-0 text-right text-[16.5px] font-semibold ${dark ? 'text-orange' : 'text-teal'}`}
                    >
                      {priceLine(a.prices[key], locale)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <p className="text-slate mt-5 mb-0 max-w-[70ch] text-base leading-[1.6]">* {t('residents')}</p>
      </div>
    </section>
  )
}
