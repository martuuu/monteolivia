import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = (size: number, p: P) => ({
  width: size,
  height: size,
  'aria-hidden': true as const,
  focusable: false as const,
  ...p,
})

/** Paths copiados del diseño (design/extracted/*). */
export function WhatsAppIcon({ size = 18, ...p }: P) {
  return (
    <svg {...base(size, p)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.86 11.86 0 0 0 5.74 1.47h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.42-8.34zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.28c0-5.45 4.43-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.12-.27-.2-.57-.35z" />
    </svg>
  )
}

export function MailIcon({ size = 18, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6.5L20.5 7" />
    </svg>
  )
}

export function AirbnbIcon({ size = 18, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 2.6c-2.2 0-3.4 3-5.3 7.3C5.3 13 3.4 16.8 3.4 18.4c0 1.9 1.5 3.3 3.3 3.3 1.9 0 3.7-1.4 5.3-3.2 1.6 1.8 3.4 3.2 5.3 3.2 1.8 0 3.3-1.4 3.3-3.3 0-1.6-1.9-5.4-3.3-8.5C15.4 5.6 14.2 2.6 12 2.6z" />
      <path d="M12 18.5c-1.3-1.6-2.4-3.4-2.4-4.8a2.4 2.4 0 0 1 4.8 0c0 1.4-1.1 3.2-2.4 4.8z" />
    </svg>
  )
}

export function InstagramIcon({ size = 19, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ size = 19, ...p }: P) {
  return (
    <svg {...base(size, p)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" />
    </svg>
  )
}

export function CheckIcon({ size = 18, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  )
}

export function CloseIcon({ size = 20, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function ChevronIcon({ size = 22, dir = 'right', ...p }: P & { dir?: 'left' | 'right' }) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

export function HomeIcon({ size = 18, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v10h13V10" />
    </svg>
  )
}

export function PencilIcon({ size = 16, ...p }: P) {
  return (
    <svg
      {...base(size, p)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  )
}

/** Persona del ícono de capacidad (diseño: moPaxWave con delay i*0.22s). */
export function PaxIcons({ count, size = 18 }: { count: number; size?: number }) {
  return (
    <span className="text-teal inline-flex gap-1" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 14 14"
          fill="currentColor"
          className="animate-mo-pax"
          style={{ animationDelay: `${(i * 0.22).toFixed(2)}s` }}
        >
          <circle cx="7" cy="3.6" r="3" />
          <path d="M.8 14c0-3.6 2.6-5.8 6.2-5.8s6.2 2.2 6.2 5.8z" />
        </svg>
      ))}
    </span>
  )
}
