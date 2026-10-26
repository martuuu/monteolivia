import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { galleryBottom, galleryTop } from '@/data/gallery'
import { toItem } from '@/lib/images'
import { container, eyebrowLight, h2 } from '@/components/ui/styles'
import { GalleryRows } from './GalleryRows'

export async function Gallery({ locale }: { locale: Locale }) {
  const t = await getTranslations('Gallery')
  const lb = await getTranslations('Lightbox')
  const map = (list: typeof galleryTop) => list.map((g) => toItem(g.id, g.alt[locale]))
  return (
    <section
      id="galeria"
      data-section="galeria"
      aria-labelledby="gallery-title"
      className="scroll-mt-[84px] overflow-hidden bg-white"
    >
      <div className={`${container} pt-[clamp(56px,9vw,104px)]`}>
        <p className={eyebrowLight}>{t('eyebrow')}</p>
        <h2 id="gallery-title" className={`${h2} mb-[clamp(24px,4vw,40px)]`}>
          {t('title')}
        </h2>
      </div>
      <GalleryRows
        top={map(galleryTop)}
        bottom={map(galleryBottom)}
        openLabel={t.raw('open')}
        labels={{ close: lb('close'), prev: lb('prev'), next: lb('next'), counter: lb.raw('counter') }}
      />
      <div className="pb-[clamp(56px,9vw,104px)]" />
    </section>
  )
}
