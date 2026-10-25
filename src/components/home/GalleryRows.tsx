'use client'

import Image from 'next/image'
import { useState } from 'react'
import { track } from '@/lib/analytics'
import { Lightbox, type LightboxItem, type LightboxLabels } from '@/components/ui/Lightbox'
import { Marquee } from '@/components/ui/Marquee'

type Props = { top: LightboxItem[]; bottom: LightboxItem[]; labels: LightboxLabels; openLabel: string }

/** Galería del diseño: 2 filas en sentidos opuestos (75 s / 85 s), tile 4:3, click → lightbox con las 16 fotos. */
export function GalleryRows({ top, bottom, labels, openLabel }: Props) {
  const all = [...top, ...bottom]
  const [index, setIndex] = useState<number | null>(null)

  const tiles = (row: LightboxItem[], offset: number, interactive: boolean) =>
    row.map((it, k) => (
      <button
        key={it.src + interactive}
        type="button"
        tabIndex={interactive ? 0 : -1}
        onClick={() => {
          setIndex(offset + k)
          track('lightbox_open', { gallery: 'home', index: offset + k + 1 })
        }}
        aria-label={openLabel.replace('{alt}', it.alt)}
        className="group bg-sand relative mr-3.5 aspect-[4/3] w-[clamp(240px,26vw,340px)] flex-none cursor-zoom-in overflow-hidden rounded-[14px] border-0 p-0"
      >
        <Image
          src={it.src}
          alt=""
          fill
          sizes="(max-width: 900px) 240px, 340px"
          placeholder="blur"
          blurDataURL={it.blurDataURL}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </button>
    ))

  return (
    <>
      <div className="flex flex-col gap-3.5">
        <Marquee seconds={75} duplicate={tiles(top, 0, false)}>
          {tiles(top, 0, true)}
        </Marquee>
        <Marquee seconds={85} direction="right" duplicate={tiles(bottom, top.length, false)}>
          {tiles(bottom, top.length, true)}
        </Marquee>
      </div>
      <Lightbox items={all} index={index} onIndex={setIndex} labels={labels} gallery="home" />
    </>
  )
}
