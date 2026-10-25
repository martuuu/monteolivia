import { getTranslations } from 'next-intl/server'
import { site, waUrl } from '@/data/site'
import { WhatsAppIcon } from '@/components/icons'
import { btnOrangeMd, btnOutlineDark } from '@/components/ui/styles'

export async function Location() {
  const t = await getTranslations('Location')
  const c = await getTranslations('Common')
  const { lat, lng } = site.geo
  const bbox = [lng - 0.019, lat - 0.0075, lng + 0.019, lat + 0.0075].map((v) => v.toFixed(4)).join('%2C')
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
  return (
    <section
      id="ubicacion"
      data-section="ubicacion"
      aria-labelledby="location-title"
      className="scroll-mt-[84px] bg-white"
    >
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(16px,3vw,28px)] py-[clamp(56px,9vw,104px)]">
        <div className="bg-teal-dark flex flex-col gap-[18px] rounded-[18px] p-[clamp(24px,4vw,40px)]">
          <p className="text-orange m-0 text-[14px] font-semibold tracking-[2.5px] uppercase">
            {t('eyebrow')}
          </p>
          <h2
            id="location-title"
            className="font-display m-0 text-[clamp(2rem,3.6vw,2.8rem)] leading-[1.15] font-normal text-white"
          >
            {site.address.street}
          </h2>
          <p className="m-0 text-[17.5px] leading-[1.6] text-white/80">
            ({site.address.postalCode}) {t('region')}
          </p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[17px] leading-[1.5] text-white/88">
            {(['b1', 'b2', 'b3', 'b4'] as const).map((k) => (
              <li key={k} className="flex gap-2.5">
                <span className="text-orange" aria-hidden="true">
                  —
                </span>
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener"
              className={btnOrangeMd}
              data-track="map_click"
              data-track-location="location"
            >
              {t('directions')}
            </a>
            <a
              href={waUrl(c('waHello'))}
              target="_blank"
              rel="noopener"
              className={`${btnOutlineDark} px-[22px] py-[13px] text-base font-medium`}
              data-track="whatsapp_click"
              data-track-location="location"
            >
              <WhatsAppIcon size={17} className="text-wa" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="flex min-h-[340px] flex-col gap-2">
          <iframe
            src={map}
            title={t('mapTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-ink/10 bg-sand min-h-[320px] w-full flex-1 rounded-[18px] border"
          />
        </div>
      </div>
    </section>
  )
}
