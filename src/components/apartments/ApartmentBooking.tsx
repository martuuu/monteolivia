'use client'

import { useState } from 'react'
import { addDaysISO, buildBookingMessage, nightsBetween, todayISO, type BookingStrings } from '@/lib/booking'
import { track } from '@/lib/analytics'
import { AirbnbIcon, MailIcon, WhatsAppIcon } from '@/components/icons'

export type ApartmentBookingLabels = {
  eyebrow: string
  checkIn: string
  checkOut: string
  guests: string
  sendVia: string
  mailSubject: string
  dateError: string
  msg: BookingStrings
}

type Props = {
  apartment: number
  pax: number
  labels: ApartmentBookingLabels
  whatsapp: string
  email: string
  airbnbUrl: string
}

const field =
  'min-h-[48px] min-w-0 rounded-[10px] border border-white/20 bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-orange focus:shadow-[0_0_0_3px_rgba(240,151,59,.3)]'
const lbl = 'flex flex-col gap-[5px] text-[14px] font-semibold text-white/80'
const chip =
  'inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-[18px] py-2.5 text-[15px] font-semibold'

/** Widget "Consultar disponibilidad" de cada departamento (diseño: tarjeta navy con WhatsApp / Email / Airbnb). */
export function ApartmentBooking({ apartment, pax, labels: l, whatsapp, email, airbnbUrl }: Props) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(String(Math.min(2, pax)))
  const invalid = !!checkIn && !!checkOut && nightsBetween(checkIn, checkOut) === 0
  const errId = `dp-${apartment}-err`

  const message = () => buildBookingMessage({ checkIn, checkOut, guests }, l.msg)
  const meta = (channel: string) =>
    track('booking_submit', {
      channel,
      source: 'apartment_widget',
      apartment,
      guests: Number(guests),
      has_dates: !!(checkIn && checkOut),
      nights: nightsBetween(checkIn, checkOut),
    })

  return (
    <div className="bg-ink flex flex-col gap-3 rounded-2xl px-5 py-[18px] text-white">
      <p className="text-orange m-0 text-[13px] font-semibold tracking-[2px] uppercase">{l.eyebrow}</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
        <label className={lbl}>
          {l.checkIn}
          <input
            type="date"
            value={checkIn}
            onFocus={(e) => (e.currentTarget.min = todayISO())}
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) setCheckOut(addDaysISO(e.target.value, 1))
            }}
            className={field}
          />
        </label>
        <label className={lbl}>
          {l.checkOut}
          <input
            type="date"
            value={checkOut}
            min={checkIn ? addDaysISO(checkIn, 1) : undefined}
            onFocus={(e) => !checkIn && (e.currentTarget.min = todayISO())}
            onChange={(e) => setCheckOut(e.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errId : undefined}
            className={field}
          />
        </label>
        <label className={lbl}>
          {l.guests}
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className={field}>
            {Array.from({ length: pax }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      {invalid && (
        <p id={errId} role="alert" className="text-orange m-0 text-[15px] font-medium">
          {l.dateError}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[14px] text-white/70">{l.sendVia}</span>
        <button
          type="button"
          disabled={invalid}
          onClick={() => {
            meta('whatsapp')
            window.open(
              `https://wa.me/${whatsapp}?text=${encodeURIComponent(message())}`,
              '_blank',
              'noopener',
            )
          }}
          className={`${chip} bg-orange text-ink-deep hover:bg-orange-hover border-0 disabled:opacity-60`}
        >
          <WhatsAppIcon size={16} />
          WhatsApp
        </button>
        <button
          type="button"
          disabled={invalid}
          onClick={() => {
            meta('email')
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(l.mailSubject)}&body=${encodeURIComponent(message())}`
          }}
          className={`${chip} border border-white/40 bg-transparent text-white hover:bg-white/12`}
        >
          <MailIcon size={16} />
          Email
        </button>
        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener"
          className={`${chip} border border-white/40 text-white hover:bg-white/12 hover:text-white`}
          data-track="airbnb_click"
          data-track-location="apartment_widget"
          data-track-apartment={apartment}
        >
          <AirbnbIcon size={16} />
          Airbnb
        </a>
      </div>
    </div>
  )
}
