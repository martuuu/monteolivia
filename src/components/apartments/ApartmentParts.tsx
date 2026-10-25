import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { commonAmenities, roomCaption, tierLabel, type Apartment } from '@/data/apartments'
import { seasons, site } from '@/data/site'
import { CheckIcon, PaxIcons } from '@/components/icons'
import { toItem } from '@/lib/images'
import { ApartmentBooking } from './ApartmentBooking'

/**
 * Piezas de un departamento, compartidas por /departamentos (bloque con mosaico)
 * y por la ficha individual (galería grande + columna lateral).
 */
type P = { apt: Apartment; locale: Locale }

const smallLabel = 'm-0 mb-2.5 text-[13px] font-semibold uppercase tracking-[2px] text-muted'

export async function apartmentText(apt: Apartment) {
  const c = await getTranslations('Common')
  return {
    label: `${c('apartment')} ${apt.n}`,
    paxTitle: apt.pax === 2 ? c('exactly', { n: 2 }) : c('upTo', { n: apt.pax }),
  }
}

/** Fotos del departamento para mosaico/galería/lightbox, con alt y caption. */
export async function apartmentPhotos(apt: Apartment, locale: Locale) {
  const t = await getTranslations('Apartment')
  return apt.images.map((im) => {
    const caption = roomCaption[im.room][locale]
    return toItem(im.id, t('photoAlt', { caption, n: apt.n }), caption)
  })
}

export async function lightboxLabels() {
  const lb = await getTranslations('Lightbox')
  return { close: lb('close'), prev: lb('prev'), next: lb('next'), counter: lb.raw('counter') }
}

export async function ApartmentHeading({ apt, locale, as: Heading = 'h2' }: P & { as?: 'h1' | 'h2' }) {
  const { label, paxTitle } = await apartmentText(apt)
  return (
    <div>
      <p className="text-orange-text m-0 mb-2 text-[14px] font-semibold tracking-[2.5px] uppercase">
        {label}
      </p>
      <Heading
        id={`depto-${apt.n}-title`}
        className="font-display text-ink m-0 text-[clamp(2rem,3.6vw,2.8rem)] leading-[1.1] font-normal"
      >
        <span className="sr-only">{label}: </span>
        {paxTitle}
      </Heading>
      <div className="mt-2.5 flex flex-wrap items-center gap-3">
        <PaxIcons count={apt.pax} />
        <span className="text-slate text-base font-medium">{apt.sizeLine[locale]}</span>
      </div>
    </div>
  )
}

export async function ApartmentDetails({ apt, locale }: P) {
  const t = await getTranslations('Apartment')
  const amenities = [...commonAmenities[locale], ...(apt.extraAmenities?.[locale] ?? [])]
  return (
    <>
      <p className="text-ink m-0 text-[18px] leading-[1.65]">{apt.p1[locale]}</p>
      <p className="text-slate m-0 text-[17px] leading-[1.65]">{apt.p2[locale]}</p>

      {apt.notes && (
        <div className="border-orange/45 bg-orange/10 rounded-xl border px-4 py-3">
          <p className="text-orange-text m-0 mb-1 text-[13px] font-semibold tracking-[2px] uppercase">
            {t('goodToKnow')}
          </p>
          {apt.notes[locale].map((n) => (
            <p key={n} className="text-ink m-0 text-base leading-[1.55]">
              {n}
            </p>
          ))}
        </div>
      )}

      <div>
        <p className={smallLabel}>{t('rooms')}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {apt.rooms[locale].map((r) => (
            <li
              key={r}
              className="border-ink/10 bg-cream text-ink inline-flex items-center rounded-full border px-3.5 py-2 text-[15.5px] font-medium"
            >
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className={smallLabel}>{t('beds')}</p>
        <p className="text-ink m-0 text-[16.5px]">{apt.beds[locale]}</p>
      </div>

      <div>
        <p className={smallLabel}>{t('amenities')}</p>
        <ul className="text-ink m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-4 gap-y-2 p-0 text-[16.5px] leading-[1.4]">
          {amenities.map((am) => (
            <li key={am} className="flex items-start gap-[9px]">
              <CheckIcon className="text-orange mt-[3px]" />
              <span>{am}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function ApartmentPrices({ apt, locale }: P) {
  const single = apt.prices.low.length === 1
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
      {(['low', 'high'] as const).map((k) => {
        const dark = k === 'high'
        return (
          <div
            key={k}
            className={`rounded-[14px] px-[18px] py-4 ${dark ? 'bg-teal-dark text-white' : 'border-ink/10 bg-cream border'}`}
          >
            <p
              className={`m-0 text-[13px] font-semibold tracking-[1.5px] uppercase ${dark ? 'text-white/70' : 'text-muted'}`}
            >
              {seasons[k].label[locale]}
            </p>
            <p className={`mt-0.5 mb-2.5 text-[14px] ${dark ? 'text-white/75' : 'text-slate'}`}>
              {seasons[k].months[locale]}
            </p>
            <dl className="m-0">
              {apt.prices[k].map((p) => (
                <div
                  key={p.minPax}
                  className={`flex justify-between gap-2.5 border-t py-1.5 text-[16.5px] ${dark ? 'border-white/14' : 'border-ink/8'}`}
                >
                  <dt className={dark ? 'text-white/75' : 'text-slate'}>{tierLabel(p, single, locale)}</dt>
                  <dd className={`m-0 font-semibold ${dark ? 'text-orange' : 'text-teal'}`}>U$S {p.usd}</dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
    </div>
  )
}

export async function ApartmentBookingBox({ apt }: { apt: Apartment }) {
  const t = await getTranslations('Apartment')
  const b = await getTranslations('Booking')
  const { paxTitle } = await apartmentText(apt)
  return (
    <ApartmentBooking
      apartment={apt.n}
      pax={apt.pax}
      whatsapp={site.whatsapp}
      email={site.email}
      airbnbUrl={apt.airbnbUrl ?? site.social.airbnb}
      labels={{
        eyebrow: t('bookEyebrow'),
        checkIn: b('checkIn'),
        checkOut: b('checkOut'),
        guests: b('guests'),
        sendVia: t('sendVia'),
        mailSubject: b('mailSubjectApartment', { n: apt.n }),
        dateError: b('dateError'),
        msg: {
          hello: b('msgHelloApartment', { n: apt.n, pax: paxTitle.toLowerCase() }),
          name: b.raw('msgName'),
          dates: b.raw('msgDates'),
          guests: b.raw('msgGuests'),
          apartment: b.raw('msgApartment'),
          nights: b.raw('msgNights'),
          unknownDate: b('unknownDate'),
        },
      }}
    />
  )
}
