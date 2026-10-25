import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Apartment } from '@/data/apartments'
import { ApartmentMosaic } from './ApartmentMosaic'
import {
  ApartmentBookingBox,
  ApartmentDetails,
  ApartmentHeading,
  ApartmentPrices,
  apartmentPhotos,
  apartmentText,
  lightboxLabels,
} from './ApartmentParts'

type Props = { apt: Apartment; locale: Locale; priority?: boolean }

/**
 * Bloque de un departamento en /departamentos (design/extracted/departamentos): mosaico sticky + información.
 * El mosaico queda debajo del header y del selector de departamentos (--hdr + 96px).
 */
export async function ApartmentBlock({ apt, locale, priority }: Props) {
  const t = await getTranslations('Apartment')
  const { label } = await apartmentText(apt)
  const items = await apartmentPhotos(apt, locale)
  return (
    <article
      aria-labelledby={`depto-${apt.n}-title`}
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-[clamp(24px,4vw,56px)]"
    >
      <div className="transition-[top] duration-[380ms] min-[761px]:sticky min-[761px]:top-[calc(var(--hdr)+96px)]">
        <ApartmentMosaic
          apartment={apt.n}
          title={label}
          items={items}
          priority={priority}
          openLabel={t.raw('openPhoto')}
          seeAllLabel={t('seePhotos', { n: items.length })}
          labels={await lightboxLabels()}
        />
      </div>
      <div className="flex flex-col gap-[18px]">
        <ApartmentHeading apt={apt} locale={locale} />
        <ApartmentDetails apt={apt} locale={locale} />
        <ApartmentPrices apt={apt} locale={locale} />
        <ApartmentBookingBox apt={apt} />
      </div>
    </article>
  )
}
