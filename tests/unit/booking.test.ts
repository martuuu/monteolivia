import { describe, expect, it } from 'vitest'
import { addDaysISO, buildBookingMessage, formatDate, nightsBetween } from '@/lib/booking'
import { waUrl } from '@/data/site'
import es from '../../messages/es.json'

const s = {
  hello: es.Booking.msgHello,
  name: es.Booking.msgName,
  dates: es.Booking.msgDates,
  guests: es.Booking.msgGuests,
  apartment: es.Booking.msgApartment,
  nights: es.Booking.msgNights,
  unknownDate: es.Booking.unknownDate,
}

describe('booking message', () => {
  it('builds the full message like the design', () => {
    const msg = buildBookingMessage(
      {
        name: 'Ana',
        checkIn: '2026-12-20',
        checkOut: '2026-12-27',
        guests: '4',
        apartment: '2',
        message: 'Llegamos tarde',
      },
      s,
    )
    expect(msg).toBe(
      [
        'Hola Monte Olivia Suites! Quiero consultar disponibilidad.',
        'Nombre: Ana',
        'Fechas: 20/12/2026 → 27/12/2026',
        'Noches: 7',
        'Huéspedes: 4',
        'Departamento: N° 2',
        'Llegamos tarde',
      ].join('\n'),
    )
  })
  it('defaults guests to 2 and marks unknown dates', () => {
    expect(buildBookingMessage({ checkIn: '2026-07-01' }, s)).toContain('Fechas: 01/07/2026 → ¿?')
    expect(buildBookingMessage({}, s)).toContain('Huéspedes: 2')
  })
  it('computes nights and dates', () => {
    expect(nightsBetween('2026-03-30', '2026-04-02')).toBe(3)
    expect(nightsBetween('2026-04-02', '2026-03-30')).toBe(0)
    expect(formatDate('2026-01-05')).toBe('05/01/2026')
    expect(addDaysISO('2026-12-31', 1)).toBe('2027-01-01')
  })
  it('encodes the WhatsApp URL', () => {
    expect(waUrl('Hola\nmundo')).toBe('https://wa.me/5492916421561?text=Hola%0Amundo')
  })
})
