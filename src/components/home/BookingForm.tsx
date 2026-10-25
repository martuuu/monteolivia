'use client'

import { useState } from 'react'
import { addDaysISO, buildBookingMessage, nightsBetween, todayISO, type BookingStrings } from '@/lib/booking'
import { track } from '@/lib/analytics'
import { MailIcon, WhatsAppIcon } from '@/components/icons'
import { cx, input, label } from '@/components/ui/styles'

export type BookingLabels = {
  name: string
  namePlaceholder: string
  checkIn: string
  checkOut: string
  guests: string
  apartment: string
  any: string
  message: string
  messagePlaceholder: string
  sendWhatsapp: string
  sendEmail: string
  mailSubject: string
  dateError: string
  msg: BookingStrings
}

type Props = { labels: BookingLabels; whatsapp: string; email: string; apartments: number[] }

/** Formulario de reserva de la home: arma el mensaje y abre WhatsApp o el correo (sin backend). */
export function BookingForm({ labels: l, whatsapp, email, apartments }: Props) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const datesInvalid = !!checkIn && !!checkOut && nightsBetween(checkIn, checkOut) === 0

  const send = (form: HTMLFormElement, channel: 'whatsapp' | 'email') => {
    if (datesInvalid) return
    const d = new FormData(form)
    const data = {
      name: String(d.get('name') ?? ''),
      checkIn,
      checkOut,
      guests: String(d.get('guests') ?? '2'),
      apartment: String(d.get('apartment') ?? ''),
      message: String(d.get('message') ?? ''),
    }
    const text = buildBookingMessage(data, l.msg)
    track('booking_submit', {
      channel,
      source: 'home_form',
      apartment: data.apartment || 'any',
      guests: Number(data.guests),
      has_dates: !!(checkIn && checkOut),
      nights: nightsBetween(checkIn, checkOut),
    })
    if (channel === 'whatsapp')
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    else
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(l.mailSubject)}&body=${encodeURIComponent(text)}`
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
        send(e.currentTarget, submitter?.value === 'email' ? 'email' : 'whatsapp')
      }}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3.5">
        <label className={label}>
          {l.name}
          <input name="name" autoComplete="name" placeholder={l.namePlaceholder} className={input} />
        </label>
        <label className={label}>
          {l.checkIn}
          <input
            name="checkIn"
            type="date"
            onFocus={(e) => (e.currentTarget.min = todayISO())}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) setCheckOut(addDaysISO(e.target.value, 1))
            }}
            className={input}
          />
        </label>
        <label className={label}>
          {l.checkOut}
          <input
            name="checkOut"
            type="date"
            min={checkIn ? addDaysISO(checkIn, 1) : undefined}
            onFocus={(e) => !checkIn && (e.currentTarget.min = todayISO())}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            aria-invalid={datesInvalid || undefined}
            aria-describedby={datesInvalid ? 'booking-date-error' : undefined}
            className={input}
          />
        </label>
        <label className={label}>
          {l.guests}
          <select name="guests" defaultValue="2" className={input}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          {l.apartment}
          <select name="apartment" defaultValue="" className={input}>
            <option value="">{l.any}</option>
            {apartments.map((n) => (
              <option key={n} value={n}>
                N° {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={cx(label, 'mt-3.5')}>
        {l.message}
        <textarea
          name="message"
          rows={3}
          placeholder={l.messagePlaceholder}
          className={cx(input, 'resize-y')}
        />
      </label>
      {datesInvalid && (
        <p id="booking-date-error" role="alert" className="mt-3 mb-0 text-base font-medium text-[#A3361F]">
          {l.dateError}
        </p>
      )}
      <div className="mt-[22px] flex flex-wrap gap-3">
        <button
          type="submit"
          value="whatsapp"
          className="bg-orange text-ink-deep hover:bg-orange-hover inline-flex min-h-[56px] cursor-pointer items-center gap-2.5 rounded-full border-0 px-[30px] py-4 text-[17.5px] font-semibold"
        >
          <WhatsAppIcon />
          {l.sendWhatsapp}
        </button>
        <button
          type="submit"
          value="email"
          className="border-ink/22 text-teal hover:border-teal hover:bg-cream inline-flex min-h-[56px] cursor-pointer items-center gap-[9px] rounded-full border bg-transparent px-[30px] py-4 text-[17.5px] font-semibold"
        >
          <MailIcon />
          {l.sendEmail}
        </button>
      </div>
    </form>
  )
}
