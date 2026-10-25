'use client'

import { useEffect, useState } from 'react'
import { cx } from '@/components/ui/styles'

export type PickerItem = { n: number; pax: number; label: string; paxLabel: string }

type Props = { items: PickerItem[]; ariaLabel: string }

/**
 * Selector de departamentos de /departamentos: los 5 siempre visibles (sin scroll horizontal),
 * fijo debajo del header (se acomoda cuando el header se oculta: --hdr) y marca el departamento en pantalla.
 * Mobile: número grande + capacidad. Desktop: número + "Departamento N" + capacidad y precio desde.
 */
export function ApartmentPicker({ items, ariaLabel }: Props) {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(`depto-${it.n}`))
      .filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number(e.target.id.replace('depto-', '')))
        }
      },
      // franja horizontal en el 35–45 % superior de la pantalla
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [items])

  return (
    <nav
      aria-label={ariaLabel}
      className="border-ink/8 ease-mo sticky top-[var(--hdr)] z-50 border-b bg-white/96 shadow-[0_6px_18px_-12px_rgba(11,40,54,.35)] backdrop-blur-sm transition-[top] duration-[380ms]"
    >
      <ul className="wrap m-0 grid list-none grid-cols-5 gap-1.5 py-2 sm:gap-2">
        {items.map((it) => {
          const on = active === it.n
          return (
            <li key={it.n} className="min-w-0">
              <a
                href={`#depto-${it.n}`}
                aria-current={on ? 'true' : undefined}
                className={cx(
                  'group flex h-[60px] min-w-0 items-center justify-center gap-1.5 rounded-xl border px-1 transition-colors duration-300 lg:justify-start lg:gap-3 lg:px-3',
                  on
                    ? 'border-teal bg-teal text-white hover:text-white'
                    : 'border-ink/10 bg-cream text-ink hover:border-teal hover:text-teal',
                )}
                data-track="nav_click"
                data-track-target={`depto_${it.n}`}
                data-track-location="apartments_picker"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'font-display text-[28px] leading-none lg:text-[34px]',
                    on ? 'text-orange' : 'text-teal',
                  )}
                >
                  {it.n}
                </span>
                {/* mobile: ícono + capacidad (el nombre completo va para lectores de pantalla) */}
                <span className="sr-only lg:hidden">
                  {it.label}, {it.paxLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="flex items-center gap-0.5 text-[15px] font-semibold lg:hidden"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="opacity-80">
                    <circle cx="7" cy="3.6" r="3" />
                    <path d="M.8 14c0-3.6 2.6-5.8 6.2-5.8s6.2 2.2 6.2 5.8z" />
                  </svg>
                  {it.pax}
                </span>
                {/* desktop: nombre + capacidad + desde */}
                <span className="hidden min-w-0 flex-col lg:flex">
                  <span className="truncate text-[15.5px] leading-tight font-semibold">{it.label}</span>
                  <span
                    className={cx(
                      'truncate text-[13.5px] leading-tight',
                      on ? 'text-white/80' : 'text-slate',
                    )}
                  >
                    {it.paxLabel}
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
