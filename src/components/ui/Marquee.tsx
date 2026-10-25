'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from './styles'

type Props = {
  children: ReactNode
  /** Contenido duplicado (aria-hidden) para el loop continuo */
  duplicate: ReactNode
  direction?: 'left' | 'right'
  /** Duración del loop en segundos (diseño: reseñas 80s, galería 75s / 85s) */
  seconds: number
  className?: string
}

/**
 * Marquee del diseño (moMarqL / moMarqR). Un solo layer animado con transform.
 * Se pausa con hover, foco, toque y cuando sale de pantalla. Con reduced-motion queda como fila scrolleable (globals.css).
 */
export function Marquee({ children, duplicate, direction = 'left', seconds, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cx('mo-marquee w-full overflow-hidden', className)}
      data-paused={!visible || userPaused ? 'true' : 'false'}
      onPointerUp={(e) => {
        if (e.pointerType === 'touch' && !(e.target as HTMLElement).closest('button,a'))
          setUserPaused((p) => !p)
      }}
    >
      <div
        className="mo-marquee-track"
        style={{
          animation: `${direction === 'left' ? 'mo-marq-l' : 'mo-marq-r'} ${seconds}s linear infinite`,
        }}
      >
        <div className="flex">{children}</div>
        <div className="flex" aria-hidden="true" inert>
          {duplicate}
        </div>
      </div>
    </div>
  )
}
