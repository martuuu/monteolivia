import { getTranslations } from 'next-intl/server'
import { getPathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { waUrl } from '@/data/site'
import { HomeIcon } from '@/components/icons'
import { btnGhostDark, btnOrange } from '@/components/ui/styles'
import { FullscreenMessage, fsEyebrow, fsLead, fsTitle } from './FullscreenMessage'

/** 404 del diseño (design/extracted/404). Se usa desde [locale]/not-found y global-not-found. */
export async function NotFoundView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'NotFound' })
  const n = await getTranslations({ locale, namespace: 'Nav' })
  const home = getPathname({ href: '/', locale })
  const apts = getPathname({ href: '/departamentos', locale })
  return (
    <FullscreenMessage
      locale={locale}
      image="hero-404"
      imagePosition="center 45%"
      logoHref={home}
      langLabel={n('langLabel')}
      switchTo={n('switchTo')}
    >
      <p className={fsEyebrow}>{t('eyebrow')}</p>
      <h1 className={fsTitle}>{t('title')}</h1>
      <p className={fsLead}>{t('lead')}</p>
      <div className="mt-2 flex flex-wrap gap-3">
        <a
          href={home}
          className={btnOrange}
          data-track="cta_click"
          data-track-cta_id="home"
          data-track-location="not_found"
        >
          <HomeIcon />
          {t('home')}
        </a>
        <a
          href={apts}
          className={`${btnGhostDark} !bg-night/60 font-semibold hover:!border-white`}
          data-track="cta_click"
          data-track-cta_id="ver_departamentos"
          data-track-location="not_found"
        >
          {t('apartments')}
        </a>
      </div>
      <p className="mt-2.5 mb-0 text-base text-white/75">
        {t('help')}{' '}
        <a
          href={waUrl(t('waText'))}
          target="_blank"
          rel="noopener"
          className="text-orange font-semibold hover:text-white"
          data-track="whatsapp_click"
          data-track-location="not_found"
        >
          WhatsApp
        </a>
      </p>
    </FullscreenMessage>
  )
}
