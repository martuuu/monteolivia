'use client'

import { useRef, type ReactNode } from 'react'
import { track } from '@/lib/analytics'
import { ChevronIcon } from '@/components/icons'

/** Fila horizontal con scroll-snap (diseño) + flechas en desktop para descubrir las 8 excursiones. */
export function ToursScroller({ children, prev, next }: { children: ReactNode; prev: string; next: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (d: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: d * Math.min(el.clientWidth * 0.9, 720), behavior: 'smooth' })
    track('tours_scroll', { direction: d > 0 ? 'next' : 'prev' })
  }
  const btn =
    'hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink/16 bg-white text-teal hover:border-teal hover:bg-teal hover:text-white sm:flex'
  return (
    <div>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
        tabIndex={0}
        role="region"
        aria-label={next}
      >
        {children}
      </div>
      <div className="mt-3 flex justify-end gap-2.5">
        <button type="button" className={btn} onClick={() => scroll(-1)} aria-label={prev}>
          <ChevronIcon dir="left" />
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} aria-label={next}>
          <ChevronIcon />
        </button>
      </div>
    </div>
  )
}
