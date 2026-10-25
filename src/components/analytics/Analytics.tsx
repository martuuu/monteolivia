'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { track, type EventName, type EventParams } from '@/lib/analytics'

const MIN_SECONDS = 1
const MAX_EVENTS_PER_PAGE = 60

/**
 * Tracking GA4 de toda la página (montado una vez en el layout):
 *
 * 1) Clicks: cualquier elemento con `data-track="evento"` envía ese evento con sus `data-track-*` como parámetros.
 *    Ej.: <a data-track="whatsapp_click" data-track-location="hero" data-track-apartment="2">
 *
 * 2) Secciones: cada elemento con `data-section="id"` envía
 *    - `section_view` la primera vez que se ve (≥40 % de la sección o ≥60 % del viewport cubierto) en la página vista;
 *    - `section_time` con los segundos visibles acumulados (pestaña visible) al salir de la sección,
 *      al ocultar la pestaña o al salir de la página. Una sección = un envío por "visita" a la sección.
 *
 * Catálogo de eventos y configuración en GA4: .docs/analytics.md
 */
export function Analytics() {
  const pathname = usePathname()

  // 1) Clicks delegados
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (!el) return
      const name = el.dataset.track as EventName
      const params: EventParams = {}
      for (const [k, v] of Object.entries(el.dataset)) {
        if (!k.startsWith('track') || k === 'track' || v === undefined) continue
        // data-track-cta_id → cta_id ; data-track-location → location
        const key = k.slice(5).replace(/^[A-Z]/, (c) => c.toLowerCase())
        params[key] = /^\d+$/.test(v) ? Number(v) : v
      }
      if (
        el instanceof HTMLAnchorElement &&
        /^https?:/.test(el.href) &&
        !el.href.startsWith(window.location.origin)
      ) {
        params.link_domain = new URL(el.href).hostname
      }
      track(name, params)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  // 2) Vista y tiempo por sección (se reinicia en cada cambio de ruta)
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const viewed = new Set<string>()
    const since = new Map<string, number>() // sección → timestamp desde que está visible
    const acc = new Map<string, number>() // ms acumulados no enviados
    let sent = 0

    const send = (name: EventName, params: EventParams) => {
      if (sent++ < MAX_EVENTS_PER_PAGE) track(name, params)
    }
    const pause = (id: string) => {
      const start = since.get(id)
      if (start === undefined) return
      acc.set(id, (acc.get(id) ?? 0) + (performance.now() - start))
      since.delete(id)
    }
    const flush = (id: string) => {
      pause(id)
      const ms = acc.get(id) ?? 0
      acc.delete(id)
      const seconds = Math.round(ms / 1000)
      if (seconds >= MIN_SECONDS) send('section_time', { section_id: id, seconds })
    }

    const isOn = (entry: IntersectionObserverEntry) =>
      entry.isIntersecting &&
      (entry.intersectionRatio >= 0.4 || entry.intersectionRect.height >= window.innerHeight * 0.6)

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.section!
          if (isOn(entry)) {
            if (!viewed.has(id)) {
              viewed.add(id)
              send('section_view', { section_id: id })
            }
            if (!since.has(id) && document.visibilityState === 'visible') since.set(id, performance.now())
          } else if (since.has(id)) {
            flush(id)
          }
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    )
    sections.forEach((s) => io.observe(s))

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        for (const id of Array.from(since.keys())) flush(id)
      } else {
        // al volver, las secciones visibles reanudan su conteo en el próximo callback del observer
        sections.forEach((s) => {
          io.unobserve(s)
          io.observe(s)
        })
      }
    }
    const onHide = () => {
      for (const id of Array.from(since.keys())) flush(id)
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onHide)
    return () => {
      onHide()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onHide)
    }
  }, [pathname])

  return null
}
