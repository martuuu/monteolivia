'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import { Lightbox, type LightboxItem, type LightboxLabels } from '@/components/ui/Lightbox'

type Props = {
  apartment: number
  title: string
  items: LightboxItem[]
  labels: LightboxLabels
  openLabel: string
  seeAllLabel: string
}

const GridIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const seeAllBtn =
  'absolute z-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-white/95 px-4 py-2 text-[15px] font-semibold text-teal shadow-[0_4px_14px_rgba(11,40,54,.22)] hover:bg-white'

/**
 * Galería de la ficha individual (distinta del mosaico de /departamentos):
 * - Desktop: foto grande + 4 fotos, a lo ancho y alta (~66 % de la pantalla).
 * - Mobile: carrusel deslizable a ancho completo, más alto, con contador.
 * Click/toque → lightbox con todas las fotos.
 */
export function ApartmentGallery({ apartment, title, items, labels, openLabel, seeAllLabel }: Props) {
  const [index, setIndex] = useState<number | null>(null)
  const [origin, setOrigin] = useState('50% 50%')
  const [current, setCurrent] = useState(0)
  const strip = useRef<HTMLDivElement>(null)

  const open = (k: number, el?: HTMLElement) => {
    if (el) {
      const r = el.getBoundingClientRect()
      setOrigin(`${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`)
    } else setOrigin('50% 50%')
    setIndex(k)
    track('lightbox_open', { gallery: `apartment_${apartment}_page`, apartment, index: k + 1 })
  }

  const label = (k: number) => openLabel.replace('{caption}', items[k].caption ?? items[k].alt)
  const counter = (i: number) =>
    labels.counter.replace('{i}', String(i + 1)).replace('{total}', String(items.length))

  return (
    <>
      {/* Una sola estructura: mobile = carrusel con scroll-snap a ancho completo; desktop (md) = grilla 1 grande + 4 */}
      <div className="relative -mx-[clamp(18px,5vw,64px)] md:mx-0">
        <div
          ref={strip}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:grid md:h-[clamp(420px,66vh,640px)] md:grid-cols-4 md:grid-rows-2 md:gap-2.5 md:overflow-hidden md:rounded-[20px]"
          onScroll={(e) => {
            const el = e.currentTarget
            if (el.clientWidth) setCurrent(Math.round(el.scrollLeft / el.clientWidth))
          }}
        >
          {items.map((it, k) => (
            <button
              key={it.src}
              type="button"
              onClick={(e) => open(k, e.currentTarget)}
              aria-label={label(k)}
              className={`group bg-sand relative h-[min(62svh,540px)] w-full flex-none cursor-zoom-in snap-center overflow-hidden border-0 p-0 md:h-auto md:w-auto ${
                k === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } ${k >= 5 ? 'md:hidden' : ''}`}
            >
              <span className="ease-mo-out absolute inset-0 block transition-transform duration-700 md:group-hover:scale-[1.04]">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes={
                    k === 0
                      ? '(max-width: 767px) 100vw, (max-width: 1240px) 50vw, 620px'
                      : '(max-width: 767px) 100vw, (max-width: 1240px) 25vw, 310px'
                  }
                  fetchPriority={k === 0 ? 'high' : undefined}
                  loading={k === 0 ? 'eager' : 'lazy'}
                  placeholder="blur"
                  blurDataURL={it.blurDataURL}
                  className="object-cover"
                />
              </span>
            </button>
          ))}
        </div>
        {/* Overlays mobile: contador y ambiente */}
        <span
          className="bg-night/70 pointer-events-none absolute top-3 right-[clamp(18px,5vw,64px)] rounded-full px-3 py-1 text-[14px] font-semibold tracking-[1px] text-white md:hidden"
          aria-live="polite"
        >
          {counter(current)}
        </span>
        <span className="text-ink pointer-events-none absolute top-3 left-[clamp(18px,5vw,64px)] rounded-full bg-white/95 px-3 py-1 text-[14px] font-medium md:hidden">
          {items[current]?.caption}
        </span>
        <button
          type="button"
          onClick={() => open(current)}
          className={`${seeAllBtn} right-[clamp(18px,5vw,64px)] bottom-3 md:right-4 md:bottom-4`}
        >
          <GridIcon />
          {seeAllLabel}
        </button>
      </div>

      <Lightbox
        items={items}
        index={index}
        onIndex={(i) => {
          setIndex(i)
          // al cerrar en mobile, el carrusel queda en la última foto vista
          if (i !== null && strip.current) strip.current.scrollTo({ left: i * strip.current.clientWidth })
        }}
        labels={labels}
        title={title}
        origin={origin}
        gallery={`apartment_${apartment}_page`}
      />
    </>
  )
}
