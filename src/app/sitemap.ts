import type { MetadataRoute } from 'next'
import { apartments } from '@/data/apartments'
import { routing } from '@/i18n/routing'
import { localizedUrl } from '@/lib/seo'
import type { getPathname } from '@/i18n/navigation'

type Href = Parameters<typeof getPathname>[0]['href']

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { href: Href; priority: number; slugs?: Record<string, Href> }[] = [
    { href: '/', priority: 1 },
    { href: '/departamentos', priority: 0.9 },
  ]
  const entries: MetadataRoute.Sitemap = []
  const lastModified = new Date('2026-10-25')
  const push = (hrefFor: (l: 'es' | 'en') => Href, priority: number) => {
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(hrefFor(locale), locale),
        lastModified,
        changeFrequency: 'monthly',
        priority,
        alternates: {
          languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(hrefFor(l), l)])),
        },
      })
    }
  }
  for (const p of pages) push(() => p.href, p.priority)
  for (const a of apartments) {
    push(
      (l) => ({
        pathname: '/departamentos/[slug]',
        params: { slug: l === 'es' ? `departamento-${a.n}` : `apartment-${a.n}` },
      }),
      0.8,
    )
  }
  return entries
}
