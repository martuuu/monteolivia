/** Clases reutilizables que replican los estilos inline del diseño. */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const container = 'wrap'
export const sectionY = 'py-[clamp(56px,9vw,104px)]'

export const eyebrow = 'm-0 mb-2.5 text-[14px] font-semibold uppercase tracking-[2.5px]'
export const eyebrowLight = cx(eyebrow, 'text-orange-text')
export const eyebrowDark = cx(eyebrow, 'text-orange')

export const h2 = 'm-0 font-display text-[clamp(2.3rem,4.8vw,3.4rem)] font-normal leading-[1.12] text-balance'
export const lead = 'mt-4 mb-0 max-w-[62ch] text-[19px] leading-[1.65] text-slate'

const pill = 'inline-flex items-center justify-center rounded-full transition-colors duration-200'
/** CTA naranja grande (hero, reserva) */
export const btnOrange = cx(
  pill,
  'gap-2.5 bg-orange px-[30px] py-[17px] text-[17.5px] font-semibold text-ink-deep hover:bg-orange-hover hover:text-ink-deep',
)
/** CTA naranja mediano (ubicación, cierre) */
export const btnOrangeMd = cx(
  pill,
  'gap-2 bg-orange px-6 py-[13px] text-base font-semibold text-ink-deep hover:bg-orange-hover hover:text-ink-deep',
)
/** Botón teal (ver departamento) */
export const btnTeal = cx(
  pill,
  'gap-[7px] bg-teal px-6 py-[13px] text-base font-semibold text-white hover:bg-teal-dark hover:text-white',
)
/** Botón contorno sobre claro */
export const btnOutline = cx(
  pill,
  'gap-[7px] border border-ink/22 px-[22px] py-[13px] text-base font-semibold text-teal hover:border-teal hover:bg-white hover:text-teal',
)
/** Botón fantasma sobre foto oscura (hero) */
export const btnGhostDark = cx(
  pill,
  'gap-2 border border-white/45 bg-night/70 px-[30px] py-[17px] text-[17.5px] font-medium text-white hover:border-white/70 hover:bg-night/90 hover:text-white',
)
/** Botón contorno sobre fondo oscuro */
export const btnOutlineDark = cx(
  pill,
  'gap-2 border border-white/40 bg-transparent font-semibold text-white hover:bg-white/12 hover:text-white',
)

export const label = 'flex flex-col gap-1.5 text-[15px] font-semibold text-ink'
export const input =
  'min-h-[52px] rounded-xl border border-ink/16 bg-white px-4 py-3.5 text-[17px] text-ink outline-none transition-shadow focus:border-teal focus:shadow-[0_0_0_3px_rgba(47,168,220,.18)]'
