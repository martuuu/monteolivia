import { ViewTransition, type ReactNode } from 'react'

/**
 * Transición sutil entre páginas (React <ViewTransition> + View Transitions API; Next 16 la activa en cada navegación).
 * La página que sale se desvanece rápido y la nueva entra con un fundido + subida mínima (CSS en globals.css: .page-*).
 * Va en cada page.tsx (no en el layout: el layout persiste y no dispara enter/exit). Sin soporte del navegador, no anima.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  )
}
