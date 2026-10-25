import type { Accommodation, BreadcrumbList, LodgingBusiness, WebSite, WithContext } from 'schema-dts'
import type { Locale } from '@/i18n/routing'
import { apartments, commonAmenities, minPrice, allPrices, type Apartment } from '@/data/apartments'
import { site } from '@/data/site'
import { imageManifest } from '@/data/image-manifest'
import { localizedUrl } from './seo'

const BUSINESS_ID = `${site.url}/#business`
const abs = (p: string) => `${site.url}${p}`

function accommodation(a: Apartment, locale: Locale): Accommodation {
  const url = localizedUrl(
    {
      pathname: '/departamentos/[slug]',
      params: { slug: locale === 'es' ? `departamento-${a.n}` : `apartment-${a.n}` },
    },
    locale,
  )
  return {
    '@type': 'Accommodation',
    '@id': `${url}#accommodation`,
    name: `${locale === 'es' ? 'Departamento' : 'Apartment'} ${a.n} · ${site.name}`,
    description: a.summary[locale],
    url,
    accommodationCategory: a.bedrooms === 0 ? 'Studio' : 'Apartment',
    numberOfRooms: Math.max(1, a.bedrooms + 1),
    numberOfBedrooms: a.bedrooms,
    numberOfBathroomsTotal: 1,
    occupancy: { '@type': 'QuantitativeValue', minValue: 1, maxValue: a.pax },
    image: a.images.slice(0, 5).map((im) => abs(imageManifest[im.id].src)),
    amenityFeature: [...commonAmenities[locale], ...(a.extraAmenities?.[locale] ?? [])].map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    containedInPlace: { '@id': BUSINESS_ID },
  }
}

export function businessJsonLd(locale: Locale): WithContext<LodgingBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': BUSINESS_ID,
    name: site.name,
    description:
      locale === 'es'
        ? 'Cinco departamentos boutique en alquiler temporario en Ushuaia, Tierra del Fuego, en una zona residencial tranquila.'
        : 'Five boutique vacation apartments in Ushuaia, Tierra del Fuego, in a quiet residential area.',
    url: localizedUrl('/', locale),
    telephone: site.phoneDisplay.replace(/\s/g, ''),
    email: site.email,
    image: [
      abs(imageManifest['hero-home'].src),
      abs(imageManifest['apartment-52'].src),
      abs(imageManifest['apartment-1'].src),
    ],
    logo: abs('/images/brand/logo.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    priceRange: `USD ${Math.min(...allPrices)}–${Math.max(...allPrices)}`,
    currenciesAccepted: 'USD, ARS',
    numberOfRooms: apartments.length,
    petsAllowed: false,
    availableLanguage: ['es', 'en'],
    sameAs: [site.social.instagram, site.social.facebook, site.social.airbnb],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      {
        '@type': 'LocationFeatureSpecification',
        name: locale === 'es' ? 'Estacionamiento gratuito' : 'Free parking',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: locale === 'es' ? 'Lockers para esquí' : 'Ski lockers',
        value: true,
      },
      { '@type': 'LocationFeatureSpecification', name: locale === 'es' ? 'Cocina' : 'Kitchen', value: true },
    ],
    containsPlace: apartments.map((a) => accommodation(a, locale)),
    makesOffer: apartments.map((a) => ({
      '@type': 'Offer',
      itemOffered: { '@id': (accommodation(a, locale) as { '@id': string })['@id'] },
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: minPrice(a),
        priceCurrency: 'USD',
        unitCode: 'DAY',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'DAY' },
      },
    })),
  } as WithContext<LodgingBusiness>
}

export function websiteJsonLd(locale: Locale): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: localizedUrl('/', locale),
    inLanguage: locale === 'es' ? 'es-AR' : 'en',
    publisher: { '@id': BUSINESS_ID },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

export function apartmentJsonLd(a: Apartment, locale: Locale): WithContext<Accommodation> {
  return Object.assign(
    { '@context': 'https://schema.org' },
    accommodation(a, locale) as object,
  ) as WithContext<Accommodation>
}
