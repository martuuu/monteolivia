'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'
import { ChevronIcon, CloseIcon } from '@/components/icons'

export type LightboxItem = {
  src: string
  width: number
  height: number
  blurDataURL: string
  alt: string
  caption?: string
}

export type LightboxLabels = { close: string; prev: string; next: string; counter: string }

type Props = {
  items: LightboxItem[]
  index: number | null
  onIndex: (i: number | null) => void
  labels: LightboxLabels
  /** Título fijo (p. ej. "Departamento 2") */
  title?: string
  /** transform-origin del zoom de entrada (centro del tile clickeado) */
  origin?: string
  /** nombre de la galería para analytics */
  gallery: string
}

const navBtn =
  'absolute z-3 flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-ink/50 text-white transition-colors hover:border-orange hover:bg-orange hover:text-ink-deep'

/**
 * Lightbox del diseño (design/extracted/departamentos: moLbFade + moLbIn con transform-origin en el tile).
 * <dialog> nativo: foco atrapado, Esc, fondo inerte. Flechas del teclado y swipe en mobile.
 */
export function Lightbox({ items, index, onIndex, labels, title, origin = '50% 50%', gallery }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const touch = useRef<number | null>(null)
  const open = index !== null
  const total = items.length
  const cur = open ? items[index] : null

  const step = useCallback(
    (d: number) => {
      if (index === null) return
      const next = (index + d + total) % total
      onIndex(next)
      track('lightbox_nav', { gallery, direction: d > 0 ? 'next' : 'prev', index: next + 1 })
    },
    [index, total, onIndex, gallery],
  )

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && d.open) d.close()
    if (!open) document.documentElement.style.overflow = ''
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  // Precarga la siguiente imagen
  const nextItem = index !== null && total > 1 ? items[(index + 1) % total] : null

  return (
    <dialog
      ref={ref}
      aria-label={title ?? cur?.alt}
      onCancel={() => onIndex(null)}
      onClose={() => open && onIndex(null)}
      onClick={(e) => e.target === e.currentTarget && onIndex(null)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
      }}
      className="bg-night/94 open:animate-mo-lb-fade fixed inset-0 z-100 h-dvh w-screen overflow-hidden backdrop-blur-md"
    >
      {cur && (
        <div
          className="animate-mo-lb-in absolute inset-0 flex items-center justify-center px-3 pt-16 pb-28 sm:px-[clamp(64px,8vw,110px)] sm:py-[clamp(16px,4vw,56px)]"
          style={{ transformOrigin: origin }}
          onClick={(e) => e.target === e.currentTarget && onIndex(null)}
        >
          <figure className="m-0 flex max-h-full w-full max-w-[1240px] flex-col items-center gap-4">
            <div className="relative h-[min(76vh,calc(100dvh-220px))] w-full drop-shadow-[0_30px_60px_rgba(0,0,0,.55)] sm:h-[76vh]">
              <Image
                key={cur.src}
                src={cur.src}
                alt={cur.alt}
                fill
                sizes="(max-width: 640px) 100vw, min(1240px, 84vw)"
                placeholder="blur"
                blurDataURL={cur.blurDataURL}
                className="object-contain"
              />
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-center gap-x-3.5 gap-y-1.5 text-center text-[15.5px] text-white/85">
              {title && <span className="font-display text-xl text-white">{title}</span>}
              <span>{cur.caption ?? cur.alt}</span>
              <span className="text-orange text-[14px] font-semibold tracking-[1.5px]" aria-live="polite">
                {labels.counter.replace('{i}', String((index ?? 0) + 1)).replace('{total}', String(total))}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
      {nextItem && (
        // Precarga invisible de la siguiente foto (mismo srcset/sizes que la visible)
        <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
          <Image
            src={nextItem.src}
            alt=""
            width={nextItem.width}
            height={nextItem.height}
            sizes="(max-width: 640px) 100vw, min(1240px, 84vw)"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => onIndex(null)}
        aria-label={labels.close}
        className={`${navBtn} top-[18px] right-[18px] h-[50px] w-[50px]`}
      >
        <CloseIcon />
      </button>
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={labels.prev}
            className={`${navBtn} bottom-6 left-[calc(50%-66px)] sm:top-1/2 sm:bottom-auto sm:left-[clamp(10px,2vw,28px)] sm:-translate-y-1/2`}
          >
            <ChevronIcon dir="left" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={labels.next}
            className={`${navBtn} right-[calc(50%-66px)] bottom-6 sm:top-1/2 sm:right-[clamp(10px,2vw,28px)] sm:bottom-auto sm:-translate-y-1/2`}
          >
            <ChevronIcon />
          </button>
        </>
      )}
    </dialog>
  )
}
