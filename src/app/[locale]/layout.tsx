import { Archivo, Marcellus } from 'next/font/google'
import { locale as rootLocale } from 'next/root-params'
import { routing } from '@/i18n/routing'
import '@/styles/globals.css'

const marcellus = Marcellus({ weight: '400', subsets: ['latin'], variable: '--font-marcellus', display: 'swap' })
const archivo = Archivo({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-archivo', display: 'swap' })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await rootLocale()
  return (
    <html lang={locale} className={`${marcellus.variable} ${archivo.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
