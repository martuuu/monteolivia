import type { CSSProperties } from 'react'

type Props = { lead: string; typed: string; className?: string }

const LEAD_START = 0 // s
const WORD_STEP = 0.1
const TYPE_START = 0.6
const CHAR_STEP = 0.085

/**
 * h1 del hero: "Tu lugar en" se pinta de entrada (solo se desliza, para no retrasar el LCP)
 * y "el fin del mundo" se tipea letra por letra con cursor.
 * Server Component, CSS puro. El nombre accesible es la frase completa (aria-label); el texto del DOM también lo es (SEO).
 */
export function TypedTitle({ lead, typed, className }: Props) {
  const leadWords = lead.split(' ')
  const typedWords = typed.split(' ')
  let i = 0
  const total = typed.replace(/ /g, '').length
  return (
    <h1 className={className} aria-label={`${lead} ${typed}`}>
      {leadWords.map((w, k) => (
        <span key={`l${k}`}>
          <span
            className="mo-slide-in inline-block"
            style={{ '--d': `${LEAD_START + k * WORD_STEP}s` } as CSSProperties}
          >
            {w}
          </span>{' '}
        </span>
      ))}
      {typedWords.map((w, k) => (
        <span key={`t${k}`}>
          <span className="whitespace-nowrap">
            {Array.from(w).map((ch, j) => {
              const n = i++
              return (
                <span
                  key={j}
                  className="mo-type-ch"
                  data-last={n === total - 1 ? '' : undefined}
                  style={
                    {
                      '--d': `${(TYPE_START + n * CHAR_STEP + k * CHAR_STEP).toFixed(3)}s`,
                      '--step': `${CHAR_STEP}s`,
                    } as CSSProperties
                  }
                >
                  {ch}
                </span>
              )
            })}
          </span>
          {k < typedWords.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  )
}
