'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Activa las animaciones de aparición: marca con data-revealed los elementos [data-reveal] al entrar en pantalla.
 * Uno solo para todo el sitio (montado en el layout); los elementos siguen siendo Server Components.
 */
export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'))
    if (!els.length) return
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.setAttribute('data-revealed', ''))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-revealed', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
  return null
}
