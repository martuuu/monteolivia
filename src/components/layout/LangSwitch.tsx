'use client'

import { usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/routing'
import { switchLocalePath } from '@/lib/locale-path'
import { cx } from '@/components/ui/styles'

type Props = { locale: Locale; label: string; switchTo: string; variant?: 'light' | 'dark' }

/** Selector ES/EN del diseño. Navega a la misma página en el otro idioma (conserva el #ancla). */
export function LangSwitch({ locale, label, switchTo, variant = 'light' }: Props) {
  const pathname = usePathname()
  const dark = variant === 'dark'
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        'flex items-center gap-0.5 rounded-full border p-0.5',
        dark ? 'bg-night/35 border-white/30' : 'border-ink/14',
      )}
    >
      {(['es', 'en'] as const).map((l) => {
        const active = l === locale
        const href = switchLocalePath(pathname, l)
        return (
          <a
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-current={active ? 'true' : undefined}
            aria-label={active ? undefined : switchTo}
            onClick={(e) => {
              if (active) return e.preventDefault()
              if (window.location.hash) {
                e.preventDefault()
                window.location.assign(href + window.location.hash)
              }
            }}
            className={cx(
              'inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-full px-3.5 py-2 text-[14px] font-semibold tracking-[.6px]',
              active
                ? dark
                  ? 'text-ink hover:text-ink bg-white'
                  : 'bg-teal text-white hover:text-white'
                : dark
                  ? 'text-white/80 hover:text-white'
                  : 'text-slate hover:text-teal',
            )}
            data-track={active ? undefined : 'lang_switch'}
            data-track-from={locale}
            data-track-to={l}
          >
            {l.toUpperCase()}
          </a>
        )
      })}
    </div>
  )
}
