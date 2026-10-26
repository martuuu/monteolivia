'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import type { LightboxItem } from '@/components/ui/Lightbox'

type Props = { slides: LightboxItem[]; offset: number; apartment: number; dotLabel: string }

/**
 * Carrusel del diseño: 3 fotos en fundido (opacity .9s). Arranca en la portada; cambia cada 4,2 s (el primer cambio
 * desfasado por departamento),
 * pausa con hover/foco/fuera de pantalla/pestaña oculta. Sin autoplay con reduced-motion. Swipe en mobile.
 */
export function ApartmentCarousel({ slides, offset, apartment, dotLabel }: Props) {
  // Siempre arranca en la portada (slide 0). El desfase entre departamentos va en el primer cambio.
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const touch = useRef<number | null>(null)
  const interacted = useRef(false)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const next = () => {
      if (document.visibilityState === 'visible') setI((v) => (v + 1) % slides.length)
    }
    let id: ReturnType<typeof setInterval> | undefined
    // primer cambio desfasado por departamento (para que no cambien todos a la vez), después cada 4,2 s
    const first = setTimeout(
      () => {
        started.current = true
        next()
        id = setInterval(next, 4200)
      },
      started.current ? 4200 : 4200 + offset * 700,
    )
    return () => {
      clearTimeout(first)
      if (id) clearInterval(id)
    }
  }, [paused, visible, slides.length, offset])

  const go = (n: number, action: string) => {
    setI((n + slides.length) % slides.length)
    if (!interacted.current) {
      interacted.current = true
      track('carousel_interact', { apartment, action })
    }
  }

  return (
    <div
      ref={ref}
      className="bg-sand relative aspect-[4/3] overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), 'swipe')
      }}
    >
      {slides.map((s, k) => (
        <div
          key={s.src}
          className="mo-slide absolute inset-0"
          data-on={k === i ? 'true' : 'false'}
          aria-hidden={k !== i}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="(max-width: 760px) 100vw, 560px"
            placeholder="blur"
            blurDataURL={s.blurDataURL}
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-1 z-3 flex justify-center">
        {slides.map((s, k) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(k, 'dot')}
            aria-label={dotLabel.replace('{i}', String(k + 1)).replace('{total}', String(slides.length))}
            aria-current={k === i ? 'true' : undefined}
            className="flex h-8 min-w-6 cursor-pointer items-center justify-center"
          >
            <span
              className="mo-dot block h-2 w-2 rounded-full bg-white/60 shadow-[0_0_0_1px_rgba(11,40,54,.25)]"
              data-on={k === i ? 'true' : 'false'}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
