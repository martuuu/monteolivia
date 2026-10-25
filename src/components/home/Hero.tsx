import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { site, waUrl } from '@/data/site'
import { WhatsAppIcon } from '@/components/icons'
import { Photo } from '@/components/ui/Photo'
import { btnGhostDark, btnOrange } from '@/components/ui/styles'
import { HeroVideo } from './HeroVideo'
import { TypedTitle } from './TypedTitle'

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
          fetchPriority="high"
          loading="eager"
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
      <div className="relative z-2 max-w-[880px] px-[clamp(18px,5vw,64px)] pt-32 pb-[clamp(80px,11vh,112px)]">
        <p className="mo-rise bg-night/55 text-orange m-0 mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/20 px-4 py-2 text-[clamp(14px,1.5vw,17px)] font-semibold tracking-[3px] uppercase backdrop-blur-sm [text-shadow:none]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          {t('eyebrow')}
        </p>
        <TypedTitle
          lead={t('titleLead')}
          typed={t('titleTyped')}
          className="font-display m-0 text-[clamp(3rem,8vw,5.8rem)] leading-[1.04] font-normal text-balance text-white [text-shadow:0_2px_24px_rgba(7,27,38,.6),0_1px_2px_rgba(7,27,38,.5)]"
        />
        <p
          style={{ '--d': '.35s' } as CSSProperties}
          className={`mo-rise mt-5 mb-0 max-w-[54ch] text-[clamp(18px,2.4vw,21px)] leading-[1.6] text-white/92 ${shadow}`}
        >
          {t('lead')}
        </p>
        <div className="mo-rise mt-[30px] flex flex-wrap gap-3" style={{ '--d': '.5s' } as CSSProperties}>
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
      <a
        href="#esencial"
        aria-label={t('scrollCue')}
        className="group absolute bottom-[14px] left-1/2 z-2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/20 hover:text-white sm:bottom-6 sm:h-[54px] sm:w-[54px]"
        data-track="cta_click"
        data-track-cta_id="scroll_cue"
        data-track-location="hero"
      >
        <span
          aria-hidden="true"
          className="mo-cue-ring absolute inset-0 rounded-full border border-white/50"
        />
        <svg
          className="mo-cue-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v13M6 12l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
