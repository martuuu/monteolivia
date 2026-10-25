import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import { apartmentFromSlug, apartments, apartmentSlug } from '@/data/apartments'
import { routing, type Locale } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    apartments.map((a) => ({ locale, slug: apartmentSlug(a.n, locale) })),
  )
}

export default async function ApartmentPage({ params }: PageProps<'/[locale]/departamentos/[slug]'>) {
  const locale = (await rootLocale()) as Locale
  const { slug } = await params
  const apt = apartmentFromSlug(slug, locale)
  if (!apt) notFound()
  return <h1 className="font-display pt-40 text-5xl">Departamento {apt.n}</h1>
}
