import type { CSSProperties } from 'react'

type Props = { lead: string; soft: string; className?: string }

const SOFT_START = 0.35 // s
const WORD_STEP = 0.22

/**
 * h1 del hero. "Tu lugar en" se pinta de entrada (solo se desliza: no retrasa el LCP);
 * "el fin del mundo" aparece palabra por palabra con un fundido suave (opacidad + desenfoque + leve subida).
 * Server Component, CSS puro. Nombre accesible = frase completa.
 */
export function HeroTitle({ lead, soft, className }: Props) {
  const leadWords = lead.split(' ')
  const softWords = soft.split(' ')
  return (
    <h1 className={className} aria-label={`${lead} ${soft}`}>
      {leadWords.map((w, k) => (
        <span key={`l${k}`}>
          <span className="mo-slide-in inline-block">{w}</span>{' '}
        </span>
      ))}
      {softWords.map((w, k) => (
        <span key={`s${k}`}>
          <span
            className="mo-soft-in inline-block"
            style={{ '--d': `${(SOFT_START + k * WORD_STEP).toFixed(2)}s` } as CSSProperties}
          >
            {w}
          </span>
          {k < softWords.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  )
}
