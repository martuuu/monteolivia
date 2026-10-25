import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'
import type { Locale } from '@/i18n/routing'
import { mailtoUrl, site, waUrl } from '@/data/site'
import { HouseSmokeIcon } from '@/components/icons/animated'
import { WhatsAppIcon } from '@/components/icons'
import { FullscreenMessage, fsLead, fsTitle } from '@/components/layout/FullscreenMessage'
import { btnGhostDark, btnOrange } from '@/components/ui/styles'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta')
  return { title: { absolute: t('maintenanceTitle') }, robots: { index: false, follow: false } }
}

/** Página de mantenimiento (design/extracted/mantenimiento). El proxy la sirve con 503 cuando MAINTENANCE_MODE=1. */
export default async function Maintenance() {
  const locale = (await rootLocale()) as Locale
  const t = await getTranslations('Maintenance')
  const n = await getTranslations('Nav')
  const c = await getTranslations('Common')
  return (
    <FullscreenMessage
      locale={locale}
      image="hero-maintenance"
      imagePosition="center 50%"
      langLabel={n('langLabel')}
      switchTo={n('switchTo')}
    >
      <div className="flex items-center gap-3">
        <HouseSmokeIcon />
        <p className="text-orange m-0 text-[15px] font-semibold tracking-[3px] uppercase">{t('eyebrow')}</p>
      </div>
      <h1 className={fsTitle}>{t('title')}</h1>
      <p className={fsLead}>{t('lead')}</p>
      <div className="mt-2 flex flex-wrap gap-3">
        <a
          href={waUrl(c('waHello'))}
          target="_blank"
          rel="noopener"
          className={btnOrange}
          data-track="whatsapp_click"
          data-track-location="maintenance"
        >
          <WhatsAppIcon size={20} />
          {t('whatsapp')}
        </a>
        <a
          href={mailtoUrl(site.name)}
          className={`${btnGhostDark} !bg-night/60 font-semibold hover:!border-white`}
          data-track="email_click"
          data-track-location="maintenance"
        >
          {site.email}
        </a>
      </div>
      <p className="mt-2.5 mb-0 text-base text-white/75">
        {site.address.street} · {site.address.city}, {site.address.region}
      </p>
    </FullscreenMessage>
  )
}
