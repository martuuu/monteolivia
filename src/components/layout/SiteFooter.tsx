import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { site, waUrl } from '@/data/site'
import { AirbnbIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons'

const social =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white hover:border-orange hover:text-orange'
const footLink = 'inline-flex min-h-8 items-center text-white/80 hover:text-orange'

export async function SiteFooter() {
  const t = await getTranslations('Footer')
  const n = await getTranslations('Nav')
  const c = await getTranslations('Common')
  const sections = [
    { href: '/departamentos' as const, label: n('apartments'), id: 'apartments' },
    { href: { pathname: '/' as const, hash: 'tarifas' }, label: n('rates'), id: 'rates' },
    { href: { pathname: '/' as const, hash: 'huespedes' }, label: n('guests'), id: 'guests' },
    { href: { pathname: '/' as const, hash: 'reserva' }, label: n('book'), id: 'book' },
    { href: { pathname: '/' as const, hash: 'galeria' }, label: n('gallery'), id: 'gallery' },
    { href: { pathname: '/' as const, hash: 'excursiones' }, label: n('tours'), id: 'tours' },
    { href: { pathname: '/' as const, hash: 'ubicacion' }, label: n('location'), id: 'location' },
  ]
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start justify-between gap-[clamp(24px,4vw,48px)] px-[clamp(18px,5vw,64px)] py-[clamp(40px,7vw,72px)]">
        <div className="flex max-w-[300px] flex-col gap-3.5">
          <Image
            src="/images/brand/logo-tile.png"
            alt="Monte Olivia Suites"
            width={150}
            height={64}
            className="h-16 w-auto self-start rounded-xl"
          />
          <p className="font-display m-0 text-[19px] text-white/85">{t('tagline')}</p>
        </div>
        <nav aria-label={t('sections')} className="flex flex-col gap-1.5 text-[16.5px]">
          <p className="text-orange m-0 mb-1 text-[13px] font-semibold tracking-[2px] uppercase">
            {t('sections')}
          </p>
          {sections.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className={footLink}
              data-track="nav_click"
              data-track-target={s.id}
              data-track-location="footer"
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="flex max-w-[280px] flex-col gap-2.5 text-[16.5px]">
          <p className="text-orange m-0 mb-1 text-[13px] font-semibold tracking-[2px] uppercase">
            {t('contact')}
          </p>
          <address className="m-0 leading-[1.55] text-white/80 not-italic">
            {site.address.street}
            <br />({site.address.postalCode}) {site.address.city}, {site.address.region}
          </address>
          <a
            href={waUrl(c('waHello'))}
            target="_blank"
            rel="noopener"
            className={`${footLink} gap-2`}
            data-track="whatsapp_click"
            data-track-location="footer"
          >
            <WhatsAppIcon size={16} className="text-wa" />
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className={footLink}
            data-track="email_click"
            data-track-location="footer"
          >
            {site.email}
          </a>
          <div className="mt-1 flex gap-2.5">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className={social}
              data-track="instagram_click"
              data-track-location="footer"
            >
              <InstagramIcon />
            </a>
            <a
              href={site.social.airbnb}
              target="_blank"
              rel="noopener"
              aria-label="Airbnb"
              className={social}
              data-track="airbnb_click"
              data-track-location="footer"
            >
              <AirbnbIcon size={19} />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className={social}
              data-track="facebook_click"
              data-track-location="footer"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-2.5 px-[clamp(18px,5vw,64px)] py-[18px] text-[14.5px] text-white/60">
          <span>{t('rights', { year: site.copyrightYear })}</span>
          <span>{t('pricesNote')}</span>
        </div>
      </div>
    </footer>
  )
}
