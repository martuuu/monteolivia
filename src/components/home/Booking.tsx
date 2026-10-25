import { getTranslations } from 'next-intl/server'
import { apartments } from '@/data/apartments'
import { site } from '@/data/site'
import { AirbnbIcon, InstagramIcon } from '@/components/icons'
import { eyebrowLight, sectionY } from '@/components/ui/styles'
import { BookingForm } from './BookingForm'

const social =
  'flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink/16 text-teal transition-all duration-200 hover:border-teal hover:bg-teal hover:text-white'

export async function Booking() {
  const t = await getTranslations('Booking')
  return (
    <section
      id="reserva"
      data-section="reserva"
      aria-labelledby="booking-title"
      className="bg-cream scroll-mt-[84px]"
    >
      <div className={`wrap-narrow ${sectionY}`}>
        <div className="border-ink/8 rounded-[22px] border bg-white p-[clamp(24px,5vw,48px)] shadow-[0_2px_10px_rgba(11,40,54,.05)]">
          <p className={eyebrowLight}>{t('eyebrow')}</p>
          <h2
            id="booking-title"
            className="font-display m-0 text-[clamp(2.3rem,4.8vw,3.1rem)] leading-[1.12] font-normal"
          >
            {t('title')}
          </h2>
          <p className="text-slate mt-3.5 mb-7 text-[18px] leading-[1.6]">{t('lead')}</p>
          <BookingForm
            whatsapp={site.whatsapp}
            email={site.email}
            apartments={apartments.map((a) => a.n)}
            labels={{
              name: t('name'),
              namePlaceholder: t('namePlaceholder'),
              checkIn: t('checkIn'),
              checkOut: t('checkOut'),
              guests: t('guests'),
              apartment: t('apartment'),
              any: t('any'),
              message: t('message'),
              messagePlaceholder: t('messagePlaceholder'),
              sendWhatsapp: t('sendWhatsapp'),
              sendEmail: t('sendEmail'),
              mailSubject: t('mailSubject'),
              dateError: t('dateError'),
              msg: {
                hello: t('msgHello'),
                name: t.raw('msgName'),
                dates: t.raw('msgDates'),
                guests: t.raw('msgGuests'),
                apartment: t.raw('msgApartment'),
                nights: t.raw('msgNights'),
                unknownDate: t('unknownDate'),
              },
            }}
          />
          <div className="border-ink/10 mt-[30px] flex flex-wrap items-center gap-[18px] border-t pt-6">
            <p className="text-muted m-0 text-[14px] font-semibold tracking-[2px] uppercase">{t('alsoOn')}</p>
            <div className="flex gap-2.5">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className={social}
                data-track="instagram_click"
                data-track-location="booking"
              >
                <InstagramIcon size={24} />
              </a>
              <a
                href={site.social.airbnb}
                target="_blank"
                rel="noopener"
                aria-label="Airbnb"
                className={social}
                data-track="airbnb_click"
                data-track-location="booking"
              >
                <AirbnbIcon size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
