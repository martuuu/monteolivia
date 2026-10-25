import { Archivo, Marcellus } from 'next/font/google'
import { locale as rootLocale } from 'next/root-params'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { site } from '@/data/site'
import { Analytics } from '@/components/analytics/Analytics'
import { RevealObserver } from '@/components/ui/RevealObserver'
import '@/styles/globals.css'

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})
const archivo = Archivo({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { title: site.name },
}

export const viewport: Viewport = {
  themeColor: '#0B2836',
  colorScheme: 'light',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await rootLocale()
  if (!hasLocale(routing.locales, locale)) notFound()
  return (
    <html lang={locale} className={`${marcellus.variable} ${archivo.variable}`} data-scroll-behavior="smooth">
      <body>
        {/* Sin mensajes en el cliente: los textos llegan como props. El provider solo da el locale a <Link>. */}
        <NextIntlClientProvider locale={locale} messages={null} timeZone="America/Argentina/Ushuaia">
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <RevealObserver />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} debugMode={process.env.NEXT_PUBLIC_GA_DEBUG === '1'} />}
      </body>
    </html>
  )
}
