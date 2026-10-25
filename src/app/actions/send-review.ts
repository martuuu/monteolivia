'use server'

import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(2000),
  email: z.union([z.literal(''), z.email().max(120)]).optional(),
  locale: z.enum(['es', 'en']),
  // anti-spam: honeypot vacío + tiempo mínimo desde que se abrió el formulario
  website: z.string().max(0).optional(),
  startedAt: z.coerce.number(),
})

export type ReviewResult = { status: 'sent' | 'fallback' | 'invalid' | 'error' }

/**
 * Envía la reseña por email al dueño (Resend). Sin RESEND_API_KEY devuelve 'fallback' y el cliente abre mailto:.
 * Las reseñas NO se publican automáticamente: el cliente decide cuáles agregar a src/data/reviews.ts.
 */
export async function sendReview(formData: FormData): Promise<ReviewResult> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    // Honeypot completado o datos inválidos
    if (formData.get('website')) return { status: 'sent' }
    return { status: 'invalid' }
  }
  const r = parsed.data
  // bot: formulario enviado en <3 s o sin timestamp válido → se descarta en silencio
  if (r.startedAt <= 0 || Date.now() - r.startedAt < 3000) return { status: 'sent' }

  const key = process.env.RESEND_API_KEY
  if (!key) return { status: 'fallback' }

  const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)
  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!)
  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({
      from: process.env.REVIEW_FROM_EMAIL || 'Monte Olivia Suites <onboarding@resend.dev>',
      to: process.env.REVIEW_TO_EMAIL || 'info@monteoliviasuites.com.ar',
      replyTo: r.email || undefined,
      subject: `Nuevo comentario de huésped: ${r.name} (${stars})`,
      text: `${r.name}\n${stars}\nIdioma del sitio: ${r.locale}\n${r.email ? `Email: ${r.email}\n` : ''}\n${r.text}`,
      html: `<p><strong>${esc(r.name)}</strong><br>${stars}<br><small>Idioma del sitio: ${r.locale}${
        r.email ? ` · ${esc(r.email)}` : ''
      }</small></p><blockquote style="border-left:3px solid #F0973B;margin:0;padding:8px 14px">${esc(
        r.text,
      ).replace(
        /\n/g,
        '<br>',
      )}</blockquote><p><small>Para publicarlo, agregarlo en src/data/reviews.ts</small></p>`,
    })
    return { status: error ? 'error' : 'sent' }
  } catch {
    return { status: 'error' }
  }
}
