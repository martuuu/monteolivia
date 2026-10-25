import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { site, waUrl } from '@/data/site'
import { WhatsAppIcon } from '@/components/icons'
import { Photo } from '@/components/ui/Photo'
import { btnGhostDark, btnOrange } from '@/components/ui/styles'
import { HeroVideo } from './HeroVideo'

export async function Hero() {
  const t = await getTranslations('Hero')
  const c = await getTranslations('Common')
  const shadow = '[text-shadow:0_1px_14px_rgba(7,27,38,.7),0_1px_2px_rgba(7,27,38,.5)]'
  return (
    <section
      id="inicio"
      data-section="hero"
      className="bg-ink relative flex min-h-svh items-end overflow-hidden"
    >
      <div className="animate-mo-zoom absolute inset-0">
        <Photo
          id="hero-home"
          alt={t('imageAlt')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        {site.heroVideo && (
          <HeroVideo
            mp4={site.heroVideo.mp4}
            webm={site.heroVideo.webm}
            poster="/images/hero/hero-home.jpg"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,40,54,.32)_0%,rgba(11,40,54,.04)_38%,rgba(7,27,38,.72)_78%,rgba(7,27,38,.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_75%_at_18%_88%,rgba(7,27,38,.78)_0%,rgba(7,27,38,.45)_45%,rgba(7,27,38,0)_100%)]" />
      <div className="relative z-2 max-w-[880px] px-[clamp(18px,5vw,64px)] pt-32 pb-[clamp(60px,9vh,100px)]">
        <p className="text-orange m-0 mb-4 text-[15px] font-semibold tracking-[3px] uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="font-display m-0 text-[clamp(3rem,8vw,5.8rem)] leading-[1.04] font-normal text-balance text-white [text-shadow:0_2px_24px_rgba(7,27,38,.6),0_1px_2px_rgba(7,27,38,.5)]">
          {t('title')}
        </h1>
        <p
          className={`mt-5 mb-0 max-w-[54ch] text-[clamp(18px,2.4vw,21px)] leading-[1.6] text-white/92 ${shadow}`}
        >
          {t('lead')}
        </p>
        <div className="mt-[30px] flex flex-wrap gap-3">
          <a
            href={waUrl(c('waHello'))}
            target="_blank"
            rel="noopener"
            className={btnOrange}
            data-track="whatsapp_click"
            data-track-location="hero"
          >
            <WhatsAppIcon size={19} />
            {c('bookWhatsapp')}
          </a>
          <Link
            href="/departamentos"
            className={btnGhostDark}
            data-track="cta_click"
            data-track-cta_id="ver_departamentos"
            data-track-location="hero"
          >
            {c('seeApartments')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="animate-mo-cue absolute bottom-4 left-1/2 z-2 h-[34px] w-0.5 -translate-x-1/2 rounded-sm bg-[linear-gradient(180deg,rgba(255,255,255,0),#fff)]"
      />
    </section>
  )
}
