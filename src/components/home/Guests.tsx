import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { reviewsFor, type Review } from '@/data/reviews'
import { site } from '@/data/site'
import { Marquee } from '@/components/ui/Marquee'
import { container, eyebrowDark, h2 } from '@/components/ui/styles'
import { ReviewModal } from './ReviewModal'

const MAX_CHARS = 340

function ReviewCard({ r, locale }: { r: Review; locale: Locale }) {
  const date = new Date(r.date + 'T12:00:00Z').toLocaleDateString(locale === 'es' ? 'es-AR' : 'en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return (
    <figure className="m-0 mr-4 flex w-[min(380px,80vw)] flex-none flex-col gap-3.5 rounded-[18px] border border-white/12 bg-white/5 p-[26px] transition-colors duration-300 hover:border-white/30 hover:bg-white/9">
      <span className="text-orange text-[15px] tracking-[3px]" role="img" aria-label={`${r.rating}/5`}>
        {'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}
      </span>
      <blockquote
        lang={r.lang}
        className="font-display m-0 line-clamp-7 text-[21px] leading-[1.5] text-white"
      >
        “{r.text}”
      </blockquote>
      <figcaption className="mt-auto text-[15.5px] text-white/70">
        {r.name}
        {r.city ? ` — ${r.city}` : ''} · <time dateTime={r.date}>{date}</time>
      </figcaption>
    </figure>
  )
}

export async function Guests({ locale }: { locale: Locale }) {
  const t = await getTranslations('Guests')
  const f = await getTranslations('ReviewForm')
  const list = reviewsFor(locale).filter((r) => r.text.length <= MAX_CHARS)
  const cards = list.map((r) => <ReviewCard key={r.n} r={r} locale={locale} />)
  return (
    <section
      id="huespedes"
      data-section="huespedes"
      aria-labelledby="guests-title"
      className="bg-ink scroll-mt-[84px] overflow-hidden"
    >
      <div className={`${container} pt-[clamp(56px,9vw,104px)]`}>
        <p className={eyebrowDark}>{t('eyebrow')}</p>
        <h2 id="guests-title" className={`${h2} max-w-[22ch] leading-[1.15] text-white`}>
          {t('title')}
        </h2>
      </div>
      <Marquee
        label={t('eyebrow')}
        seconds={list.length * 7}
        duplicate={cards}
        className="mt-[clamp(28px,4vw,44px)] items-stretch"
      >
        {cards}
      </Marquee>
      <div
        className={`${container} flex flex-wrap items-center justify-between gap-4 pt-6 pb-[clamp(56px,9vw,104px)]`}
      >
        <p className="m-0 text-[15px] text-white/65">{t('note')}</p>
        <ReviewModal
          locale={locale}
          email={site.email}
          labels={{
            open: t('leaveReview'),
            eyebrow: f('eyebrow'),
            title: f('title'),
            name: f('name'),
            namePlaceholder: f('namePlaceholder'),
            rating: f('rating'),
            ratingOption: f.raw('ratingOption'),
            text: f('text'),
            textPlaceholder: f('textPlaceholder'),
            email: f('email'),
            submit: f('submit'),
            sending: f('sending'),
            thanksTitle: f('thanksTitle'),
            thanksText: f('thanksText'),
            fallbackText: f.raw('fallbackText'),
            error: f('error'),
            close: f('close'),
            mailSubject: f('mailSubject'),
          }}
        />
      </div>
    </section>
  )
}
