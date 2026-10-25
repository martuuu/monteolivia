import type { Metadata } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { site } from '@/data/site'

type Href = Parameters<typeof getPathname>[0]['href']
/** Href fijo o por idioma (las fichas tienen slug distinto en ES y EN). */
export type LocalizedHref = Href | ((locale: Locale) => Href)
const resolve = (h: LocalizedHref, l: Locale) => (typeof h === 'function' ? h(l) : h)

export const absoluteUrl = (path: string) => `${site.url}${path === '/' ? '' : path}` || site.url

export function localizedUrl(href: Href, locale: Locale) {
  const path = getPathname({ href, locale })
  return absoluteUrl(path === '/' ? '/' : path)
}

/** canonical + hreflang (es, en, x-default → es) para una ruta. */
export function alternates(href: LocalizedHref, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = localizedUrl(resolve(href, l), l)
  languages['x-default'] = localizedUrl(resolve(href, routing.defaultLocale), routing.defaultLocale)
  return { canonical: localizedUrl(resolve(href, locale), locale), languages }
}

export function buildMetadata(opts: {
  locale: Locale
  href: LocalizedHref
  title: string
  description: string
  ogImage: string
  ogAlt: string
}): Metadata {
  const url = localizedUrl(resolve(opts.href, opts.locale), opts.locale)
  return {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: alternates(opts.href, opts.locale),
    openGraph: {
      type: 'website',
      url,
      siteName: site.name,
      title: opts.title,
      description: opts.description,
      locale: opts.locale === 'es' ? 'es_AR' : 'en_US',
      alternateLocale: opts.locale === 'es' ? ['en_US'] : ['es_AR'],
      images: [{ url: opts.ogImage, width: 1200, height: 630, alt: opts.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [opts.ogImage],
    },
  }
}
