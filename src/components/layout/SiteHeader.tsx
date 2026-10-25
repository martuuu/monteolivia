'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { LangSwitch } from './LangSwitch'
import { cx } from '@/components/ui/styles'

export type HeaderLabels = {
  apartments: string
  rates: string
  guests: string
  book: string
  bookNow: string
  menu: string
  close: string
  langLabel: string
  switchTo: string
}

type Props = { locale: Locale; labels: HeaderLabels; phone: string; phoneHref: string; address: string }

const navLink =
  'mo-underline px-0.5 pt-1.5 pb-2 text-ink hover:text-teal aria-[current=page]:font-semibold aria-[current=page]:text-teal'

export function SiteHeader({ locale, labels, phone, phoneHref, address }: Props) {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const onApartments = /\/(departamentos|apartments)(\/|$)/.test(pathname)

  // Diseño: se oculta al bajar (>140px, delta 4px) y reaparece al subir.
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y > last + 4 && y > 140) setHidden(true)
        else if (y < last - 4 || y <= 140) setHidden(false)
        last = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && d.open) d.close()
    if (!open) document.documentElement.style.overflow = ''
  }, [open])

  const items = [
    { href: '/departamentos' as const, label: labels.apartments, current: onApartments, id: 'apartments' },
    { href: { pathname: '/' as const, hash: 'tarifas' }, label: labels.rates, id: 'rates' },
    { href: { pathname: '/' as const, hash: 'huespedes' }, label: labels.guests, id: 'guests' },
  ]

  return (
    <>
      <header
        className="mo-nav border-ink/8 fixed inset-x-0 top-0 z-60 flex items-center justify-between gap-4 border-b px-[clamp(16px,4vw,40px)] py-3"
        data-hidden={hidden && !open ? 'true' : 'false'}
      >
        <Link
          href="/"
          className="flex flex-none items-center"
          data-track="nav_click"
          data-track-target="logo"
        >
          <Image
            src="/images/brand/logo.png"
            alt="Monte Olivia Suites"
            width={127}
            height={54}
            priority
            className="block h-[54px] w-auto"
          />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-[clamp(14px,2.2vw,30px)] text-[16.5px] font-medium min-[1081px]:flex"
        >
          {items.map((it) => (
            <Link
              key={it.id}
              href={it.href}
              className={navLink}
              aria-current={it.current ? 'page' : undefined}
              data-track="nav_click"
              data-track-target={it.id}
            >
              {it.label}
            </Link>
          ))}
          <Link
            href={{ pathname: '/', hash: 'reserva' }}
            className="bg-teal hover:bg-teal-dark ml-1 inline-flex min-h-[44px] items-center rounded-full px-5 py-[11px] font-semibold text-white transition-colors hover:text-white"
            data-track="cta_click"
            data-track-cta_id="reservar"
            data-track-location="nav"
          >
            {labels.book}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitch locale={locale} label={labels.langLabel} switchTo={labels.switchTo} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={labels.menu}
            aria-expanded={open}
            aria-controls="mo-menu"
            className="border-ink/14 hover:border-teal flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border bg-white min-[1081px]:hidden"
            data-track="menu_open"
          >
            <span className="bg-teal block h-0.5 w-[18px] rounded-sm" />
            <span className="bg-teal block h-0.5 w-[18px] rounded-sm" />
          </button>
        </div>
      </header>

      <dialog
        id="mo-menu"
        ref={dialog}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        aria-label={labels.menu}
        className="open:animate-mo-fade fixed inset-0 z-90 h-dvh w-screen overflow-auto bg-[rgba(9,31,42,.97)] backdrop-blur-[10px] open:flex open:flex-col"
      >
        <div className="flex h-full flex-col p-[clamp(20px,5vw,56px)]">
          <div className="flex items-center justify-between">
            <Image
              src="/images/brand/logo-tile.png"
              alt="Monte Olivia Suites"
              width={122}
              height={52}
              className="h-[52px] w-auto rounded-[10px]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              className="h-12 w-12 cursor-pointer rounded-full border border-white/30 bg-transparent text-xl text-white hover:bg-white/12"
            >
              ✕
            </button>
          </div>
          <nav
            aria-label={labels.menu}
            className="my-auto flex max-w-[560px] flex-col gap-[clamp(12px,2.4vh,20px)] py-6"
          >
            {[
              ...items,
              {
                href: { pathname: '/' as const, hash: 'reserva' },
                label: labels.bookNow,
                id: 'book',
                current: false,
              },
            ].map((it, i) => (
              <Link
                key={it.id}
                href={it.href}
                onClick={() => setOpen(false)}
                aria-current={it.current ? 'page' : undefined}
                className={cx(
                  'font-display flex items-baseline gap-3.5 text-[clamp(2rem,6vw,3.2rem)] leading-tight',
                  it.id === 'book' || it.current
                    ? 'text-orange hover:text-white'
                    : 'hover:text-orange text-white',
                )}
                data-track="nav_click"
                data-track-target={it.id}
                data-track-location="menu"
              >
                <span className="text-orange font-sans text-[13px] tracking-[2px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-[18px] text-[15px] text-white/65">
            <a
              href={phoneHref}
              target="_blank"
              rel="noopener"
              className="hover:text-orange text-white/85"
              data-track="whatsapp_click"
              data-track-location="menu"
            >
              {phone}
            </a>
            <span>{address}</span>
          </div>
        </div>
      </dialog>
    </>
  )
}
