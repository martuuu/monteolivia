'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { track as trackEvent } from '@/lib/analytics'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { ChevronIcon } from '@/components/icons'
import { cx } from './styles'

type Props = {
  children: ReactNode
  /** Copia del contenido para el loop continuo: va aria-hidden y sin foco, pero clickeable (no `inert`) */
  duplicate: ReactNode
  direction?: 'left' | 'right'
  /** Segundos por vuelta completa (diseño: reseñas ~80 s, galería 75 s / 85 s) */
  seconds: number
  className?: string
  /** Nombre de la región. Si la fila no tiene elementos con foco (reseñas) se vuelve enfocable */
  label?: string
  /** Flechas anterior/siguiente (avanzan una tarjeta) */
  controls?: { prev: string; next: string; tone?: 'dark' | 'light'; analytics?: string }
}

const STEP_MS = 650
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Marquee del diseño (moMarqL / moMarqR) con motor propio (requestAnimationFrame + transform):
 * - movimiento continuo; pausa con hover (mouse), foco, toque y fuera de pantalla;
 * - flechas y swipe avanzan/retroceden una tarjeta con transición suave y después sigue el loop;
 * - con prefers-reduced-motion no se mueve solo (flechas y swipe siguen funcionando).
 */
export function Marquee({
  children,
  duplicate,
  direction = 'left',
  seconds,
  className,
  label,
  controls,
}: Props) {
  const viewport = useRef<HTMLDivElement>(null)
  const trackEl = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const s = useRef({
    x: 0,
    half: 0,
    hover: false,
    focus: false,
    userPaused: false,
    visible: false,
    tween: null as null | { dist: number; applied: number; start: number },
    raf: 0,
    last: 0,
    touchX: null as number | null,
  })

  useEffect(() => {
    const vp = viewport.current
    const tr = trackEl.current
    if (!vp || !tr) return
    const st = s.current
    const dir = direction === 'left' ? -1 : 1

    const measure = () => {
      const first = tr.firstElementChild as HTMLElement | null
      st.half = first?.scrollWidth ?? 0
      if (direction === 'right' && st.x === 0) st.x = -st.half
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(tr)

    const frame = (now: number) => {
      const dt = st.last ? Math.min(now - st.last, 64) / 1000 : 0
      st.last = now
      if (st.half > 0) {
        if (st.tween) {
          if (st.tween.start < 0) st.tween.start = now
          const p = Math.min((now - st.tween.start) / STEP_MS, 1)
          const target = st.tween.dist * ease(p)
          st.x += target - st.tween.applied
          st.tween.applied = target
          if (p >= 1) st.tween = null
        } else if (!reduced && !st.hover && !st.focus && !st.userPaused) {
          st.x += dir * (st.half / seconds) * dt
        }
        while (st.x <= -st.half) st.x += st.half
        while (st.x > 0) st.x -= st.half
        tr.style.transform = `translate3d(${st.x.toFixed(2)}px,0,0)`
      }
      st.raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (st.raf) return
      st.last = 0
      st.raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(st.raf)
      st.raf = 0
    }
    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting
        if (e.isIntersecting) start()
        else stop()
      },
      { rootMargin: '100px' },
    )
    io.observe(vp)
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
    }
  }, [direction, seconds, reduced])

  /** +1 = siguiente (el contenido se corre a la izquierda), -1 = anterior */
  const step = (n: 1 | -1) => {
    const tr = trackEl.current
    const item = tr?.firstElementChild?.firstElementChild as HTMLElement | null
    if (!item) return
    const width = item.offsetWidth + parseFloat(getComputedStyle(item).marginRight || '0')
    const st = s.current
    // si había un paso en curso, se completa de inmediato y se encadena el nuevo
    if (st.tween) st.x += st.tween.dist - st.tween.applied
    st.tween = { dist: -n * width, applied: 0, start: -1 } // el inicio se fija en el próximo frame
  }

  const arrow = (n: 1 | -1) =>
    controls && (
      <button
        type="button"
        onClick={() => {
          step(n)
          trackEvent('carousel_interact', {
            carousel: controls.analytics ?? 'marquee',
            action: n > 0 ? 'next' : 'prev',
          })
        }}
        aria-label={n > 0 ? controls.next : controls.prev}
        className={cx(
          'absolute top-1/2 z-3 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm transition-colors sm:h-[54px] sm:w-[54px]',
          n > 0 ? 'right-[clamp(10px,2vw,28px)]' : 'left-[clamp(10px,2vw,28px)]',
          controls.tone === 'light'
            ? 'border-ink/16 text-teal hover:border-teal hover:bg-teal bg-white/90 hover:text-white'
            : 'hover:border-orange hover:bg-orange hover:text-ink-deep bg-ink/60 border-white/30 text-white',
        )}
      >
        <ChevronIcon dir={n > 0 ? 'right' : 'left'} />
      </button>
    )

  return (
    <div className={cx('relative w-full', className)}>
      <div
        ref={viewport}
        className="mo-marquee w-full touch-pan-y overflow-hidden"
        role={label ? 'region' : undefined}
        aria-label={label}
        tabIndex={label ? 0 : undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && (s.current.hover = true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && (s.current.hover = false)}
        onFocus={() => (s.current.focus = true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && (s.current.focus = false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        onPointerDown={(e) => e.pointerType === 'touch' && (s.current.touchX = e.clientX)}
        onPointerUp={(e) => {
          const st = s.current
          if (e.pointerType !== 'touch' || st.touchX === null) return
          const dx = e.clientX - st.touchX
          st.touchX = null
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
          else if (!(e.target as HTMLElement).closest('button,a')) st.userPaused = !st.userPaused
        }}
      >
        <div ref={trackEl} className="mo-marquee-track">
          <div className="flex">{children}</div>
          <div className="flex" aria-hidden="true">
            {duplicate}
          </div>
        </div>
      </div>
      {controls && (
        <>
          {/* degradé en los bordes para que las flechas se apoyen sobre fondo y no sobre el texto */}
          <div
            aria-hidden="true"
            className={cx(
              'pointer-events-none absolute inset-y-0 left-0 z-2 w-[clamp(56px,7vw,110px)] bg-gradient-to-r to-transparent',
              controls.tone === 'light' ? 'from-white' : 'from-ink',
            )}
          />
          <div
            aria-hidden="true"
            className={cx(
              'pointer-events-none absolute inset-y-0 right-0 z-2 w-[clamp(56px,7vw,110px)] bg-gradient-to-l to-transparent',
              controls.tone === 'light' ? 'from-white' : 'from-ink',
            )}
          />
        </>
      )}
      {arrow(-1)}
      {arrow(1)}
    </div>
  )
}
