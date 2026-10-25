/** Armado del mensaje de consulta (WhatsApp / email). Puro y testeado en tests/unit/booking.test.ts */
export type BookingInput = {
  name?: string
  checkIn?: string // yyyy-mm-dd
  checkOut?: string
  guests?: string
  apartment?: string // '1'..'5' o ''
  message?: string
}

export type BookingStrings = {
  hello: string
  name: string // "Nombre: {v}"
  dates: string // "Fechas: {in} → {out}"
  guests: string
  apartment: string
  nights: string
  unknownDate: string
}

const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))

/** dd/mm/aaaa (formato que entienden huéspedes AR y extranjeros sin ambigüedad de mes). */
export function formatDate(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function nightsBetween(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 0
  const a = Date.parse(checkIn + 'T12:00:00Z')
  const b = Date.parse(checkOut + 'T12:00:00Z')
  const n = Math.round((b - a) / 86_400_000)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function buildBookingMessage(input: BookingInput, s: BookingStrings) {
  const lines = [s.hello]
  if (input.name?.trim()) lines.push(fill(s.name, { v: input.name.trim() }))
  if (input.checkIn || input.checkOut) {
    lines.push(
      fill(s.dates, {
        in: formatDate(input.checkIn) || s.unknownDate,
        out: formatDate(input.checkOut) || s.unknownDate,
      }),
    )
    const n = nightsBetween(input.checkIn, input.checkOut)
    if (n) lines.push(fill(s.nights, { v: n }))
  }
  lines.push(fill(s.guests, { v: input.guests || '2' }))
  if (input.apartment) lines.push(fill(s.apartment, { v: input.apartment }))
  if (input.message?.trim()) lines.push(input.message.trim())
  return lines.join('\n')
}

/** yyyy-mm-dd de hoy en hora local del navegador (para el atributo min de los inputs date). */
export function todayISO(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function addDaysISO(iso: string, days: number) {
  const t = Date.parse(iso + 'T12:00:00Z') + days * 86_400_000
  return new Date(t).toISOString().slice(0, 10)
}
