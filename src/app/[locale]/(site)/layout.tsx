import { getTranslations } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { site, waUrl } from '@/data/site'
import type { Locale } from '@/i18n/routing'

export default async function SiteLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = (await rootLocale()) as Locale
  const n = await getTranslations('Nav')
  const c = await getTranslations('Common')
  return (
    <>
      <a
        href="#contenido"
        className="bg-teal sr-only z-100 rounded-full px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {n('skip')}
      </a>
      <SiteHeader
        locale={locale}
        labels={{
          apartments: n('apartments'),
          rates: n('rates'),
          guests: n('guests'),
          book: n('book'),
          bookNow: n('bookNow'),
          menu: n('menu'),
          close: n('close'),
          langLabel: n('langLabel'),
          switchTo: n('switchTo'),
        }}
        phone={site.phoneDisplay}
        phoneHref={waUrl(c('waHello'))}
        address={`${site.address.street} · ${site.address.city}`}
      />
      <main id="contenido">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
