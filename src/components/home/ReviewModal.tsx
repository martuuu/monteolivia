'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { sendReview } from '@/app/actions/send-review'
import { track } from '@/lib/analytics'
import { PencilIcon } from '@/components/icons'
import { input, label } from '@/components/ui/styles'

export type ReviewLabels = {
  open: string
  eyebrow: string
  title: string
  name: string
  namePlaceholder: string
  rating: string
  ratingOption: string
  text: string
  textPlaceholder: string
  email: string
  submit: string
  sending: string
  thanksTitle: string
  thanksText: string
  fallbackText: string
  error: string
  close: string
  mailSubject: string
}

type Props = { labels: ReviewLabels; locale: 'es' | 'en'; email: string }

export function ReviewModal({ labels: l, locale, email }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<'form' | 'sent' | 'fallback' | 'invalid'>('form')
  const [startedAt, setStartedAt] = useState(0)
  const [pending, start] = useTransition()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    start(async () => {
      // Error de red o deploy nuevo (acción inexistente): cae al fallback mailto sin romper la página
      let res: Awaited<ReturnType<typeof sendReview>>
      try {
        res = await sendReview(data)
      } catch {
        res = { status: 'error' }
      }
      if (res.status === 'sent') {
        setState('sent')
        track('review_submit', { status: 'sent', rating: Number(data.get('rating')) })
      } else if (res.status === 'invalid') {
        setState('invalid')
      } else {
        // Sin Resend configurado o error: abrir el correo con el comentario armado
        const body = `${data.get('name')}\n${'★'.repeat(Number(data.get('rating')))}\n\n${data.get('text')}`
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(l.mailSubject)}&body=${encodeURIComponent(body)}`
        setState('fallback')
        track('review_submit', { status: res.status === 'fallback' ? 'mailto_fallback' : 'error' })
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setState('form')
          setStartedAt(Date.now())
          setOpen(true)
          track('review_open')
        }}
        className="bg-orange text-ink-deep hover:bg-orange-hover ml-auto inline-flex min-h-[52px] cursor-pointer items-center gap-2 rounded-full border-0 px-6 py-3.5 text-[16.5px] font-semibold"
      >
        <PencilIcon />
        {l.open}
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        aria-labelledby="review-title"
        className="bg-night/72 open:animate-mo-fade fixed inset-0 z-95 h-dvh w-screen p-5 backdrop-blur-sm open:flex open:items-center open:justify-center"
      >
        <div className="text-ink flex max-h-[92vh] w-full max-w-[560px] flex-col gap-4 overflow-auto rounded-[22px] bg-white p-[clamp(24px,4vw,40px)] shadow-[0_24px_70px_rgba(0,0,0,.4)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-orange-text m-0 mb-1.5 text-[13.5px] font-semibold tracking-[2.5px] uppercase">
                {l.eyebrow}
              </p>
              <h3 id="review-title" className="font-display m-0 text-[30px] leading-[1.1] font-normal">
                {l.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={l.close}
              className="border-ink/16 text-teal hover:bg-cream h-11 w-11 flex-none cursor-pointer rounded-full border bg-transparent text-lg"
            >
              ✕
            </button>
          </div>

          {state === 'sent' || state === 'fallback' ? (
            <div className="bg-cream flex flex-col gap-2.5 rounded-2xl p-6" role="status">
              <p className="font-display text-teal m-0 text-2xl">{l.thanksTitle}</p>
              <p className="text-slate m-0 text-[17px] leading-[1.55]">
                {state === 'sent' ? l.thanksText : l.fallbackText.replace('{email}', email)}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-ink/22 text-teal hover:border-teal mt-1.5 min-h-12 cursor-pointer self-start rounded-full border bg-transparent px-[22px] py-3 text-base font-semibold"
              >
                {l.close}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="startedAt" value={startedAt} />
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label>
                  Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className={label}>
                {l.name}
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  placeholder={l.namePlaceholder}
                  className={input}
                />
              </label>
              <label className={label}>
                {l.rating}
                <select name="rating" defaultValue="5" className={input}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n} aria-label={l.ratingOption.replace('{n}', String(n))}>
                      {'★'.repeat(n) + '☆'.repeat(5 - n)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                {l.text}
                <textarea
                  name="text"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  placeholder={l.textPlaceholder}
                  className={`${input} resize-y`}
                />
              </label>
              <label className={label}>
                {l.email}
                <input name="email" type="email" autoComplete="email" maxLength={120} className={input} />
              </label>
              {state === 'invalid' && (
                <p role="alert" className="m-0 text-base font-medium text-[#A3361F]">
                  {l.error}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="bg-teal hover:bg-teal-dark inline-flex min-h-[52px] cursor-pointer items-center gap-2 self-start rounded-full border-0 px-7 py-[15px] text-[17px] font-semibold text-white disabled:opacity-70"
              >
                {pending ? l.sending : l.submit}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  )
}
