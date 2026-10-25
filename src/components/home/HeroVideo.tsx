'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'

type Props = { mp4: string; webm?: string; poster: string }

/**
 * Video de fondo del hero — SOLO desktop (≥1024px), sin reduced-motion y sin ahorro de datos.
 * Se monta después de `load` + idle; la imagen del hero sigue siendo el LCP. Activar con `site.heroVideo`.
 */
export function HeroVideo({ mp4, webm, poster }: Props) {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    ).matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (!desktop || saveData) {
      track('hero_video', { state: !desktop ? 'skipped_mobile_or_motion' : 'skipped_savedata' })
      return
    }
    const start = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback
      if (idle) idle(() => setEnabled(true))
      else setTimeout(() => setEnabled(true), 1200)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
  }, [])

  if (!enabled) return null
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0, objectPosition: 'center 30%' }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      onCanPlay={() => {
        setReady(true)
        track('hero_video', { state: 'played' })
      }}
      onError={() => track('hero_video', { state: 'error' })}
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  )
}
