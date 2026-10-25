'use client'

import Image from 'next/image'
import { useState } from 'react'
import { track } from '@/lib/analytics'
import { Lightbox, type LightboxItem, type LightboxLabels } from '@/components/ui/Lightbox'

type Props = {
  apartment: number
  title: string
  items: LightboxItem[]
  labels: LightboxLabels
  openLabel: string
  seeAllLabel: string
  priority?: boolean
}

// Grilla 6×5 del diseño: principal 4×3, 2×2, 2×1, 2×2, 4×2
const cells = [
  'col-[1/5] row-[1/4] rounded-2xl',
  'col-[5/7] row-[1/3] rounded-xl',
  'col-[5/7] row-[3/4] rounded-xl',
  'col-[1/3] row-[4/6] rounded-xl',
  'col-[3/7] row-[4/6] rounded-xl',
]
const sizes = [
  '(max-width: 760px) 66vw, 380px',
  '(max-width: 760px) 33vw, 190px',
  '(max-width: 760px) 33vw, 190px',
  '(max-width: 760px) 33vw, 190px',
  '(max-width: 760px) 66vw, 380px',
]

/** Mosaico del diseño (design/extracted/departamentos) + lightbox con zoom desde el tile clickeado. */
export function ApartmentMosaic({
  apartment,
  title,
  items,
  labels,
  openLabel,
  seeAllLabel,
  priority,
}: Props) {
  const [index, setIndex] = useState<number | null>(null)
  const [origin, setOrigin] = useState('50% 50%')

  const open = (k: number, el?: HTMLElement) => {
    if (el) {
      const r = el.getBoundingClientRect()
      setOrigin(`${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`)
    } else setOrigin('50% 50%')
    setIndex(k)
    track('lightbox_open', { gallery: `apartment_${apartment}`, apartment, index: k + 1 })
  }

  return (
    <>
      <div className="relative grid aspect-[6/5] grid-cols-6 grid-rows-5 gap-2.5">
        {items.slice(0, 5).map((it, k) => (
          <button
            key={it.src}
            type="button"
            onClick={(e) => open(k, e.currentTarget)}
            aria-label={openLabel.replace('{caption}', it.caption ?? it.alt)}
            className={`group bg-sand relative cursor-zoom-in overflow-hidden border-0 p-0 ${cells[k]}`}
          >
            <span
              className={`ease-mo-out absolute inset-0 block transition-transform duration-700 ${k === 0 ? 'group-hover:scale-105' : 'group-hover:scale-[1.07]'}`}
            >
              <Image
                src={it.src}
                alt=""
                fill
                sizes={sizes[k]}
                fetchPriority={priority && k === 0 ? 'high' : undefined}
                loading={priority && k === 0 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL={it.blurDataURL}
                className="object-cover"
              />
            </span>
          </button>
        ))}
        {items.length > 5 && (
          <button
            type="button"
            onClick={() => open(0)}
            className="text-teal absolute right-2.5 bottom-2.5 z-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-white/95 px-4 py-2 text-[15px] font-semibold shadow-[0_4px_14px_rgba(11,40,54,.22)] hover:bg-white"
          >
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
            {seeAllLabel}
          </button>
        )}
      </div>
      <Lightbox
        items={items}
        index={index}
        onIndex={setIndex}
        labels={labels}
        title={title}
        origin={origin}
        gallery={`apartment_${apartment}`}
      />
    </>
  )
}
