import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { waUrl } from '@/data/site'
import { btnOutline } from '@/components/ui/styles'

/** Cierre "¿No sabés cuál elegir?" (design/extracted/departamentos, data-screen-label="Cierre"). */
export async function ClosingCta() {
  const t = await getTranslations('ApartmentsPage')
  const c = await getTranslations('Common')
  return (
    <section data-section="cierre" aria-labelledby="closing-title" className="border-ink/8 bg-cream border-t">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-[clamp(48px,7vw,88px)]">
        <div className="max-w-[620px]">
          <h2
            id="closing-title"
            className="font-display m-0 text-[clamp(2rem,4vw,2.8rem)] leading-[1.15] font-normal"
          >
            {t('closingTitle')}
          </h2>
          <p className="text-slate mt-3 mb-0 text-[18px] leading-[1.6]">{t('closingText')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={waUrl(c('waRecommend'))}
            target="_blank"
            rel="noopener"
            className="bg-orange text-ink-deep hover:bg-orange-hover hover:text-ink-deep inline-flex items-center gap-[9px] rounded-full px-7 py-4 text-[17px] font-semibold"
            data-track="whatsapp_click"
            data-track-location="closing"
          >
            {c('askWhatsapp')}
          </a>
          <Link
            href={{ pathname: '/', hash: 'tarifas' }}
            className={`${btnOutline} hover:bg-cream px-[26px] py-4 text-[17px]`}
            data-track="cta_click"
            data-track-cta_id="ver_tarifas"
            data-track-location="closing"
          >
            {t('seeRates')}
          </Link>
        </div>
      </div>
    </section>
  )
}
