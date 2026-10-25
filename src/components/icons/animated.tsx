/**
 * Íconos animados de "Datos rápidos" y mantenimiento — copia 1:1 de los SVG del diseño
 * (design/extracted/sitio-v2/template.html, sección data-screen-label="Datos rápidos").
 * Se renderizan en el servidor; las animaciones son keyframes CSS (globals.css) y se apagan con prefers-reduced-motion.
 */
const common = {
  width: 52,
  height: 52,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: '#164E63',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function BuildingIcon() {
  const windows: [number, number, string][] = [
    [14, 17, '0s'],
    [21.5, 17, '.7s'],
    [29, 17, '1.4s'],
    [14, 25.5, '2.1s'],
    [29, 25.5, '2.8s'],
  ]
  return (
    <svg {...common}>
      <path d="M9 42V13l15-6 15 6v29" />
      <path d="M4 42h40" />
      <path d="M20 42v-9h8v9" />
      {windows.map(([x, y, d]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="5"
          height="5"
          rx="1"
          fill="#F0973B"
          stroke="none"
          className="animate-mo-blink"
          style={{ animationDelay: d }}
        />
      ))}
    </svg>
  )
}

export function WifiIcon() {
  return (
    <svg {...common}>
      <circle cx="24" cy="37" r="2.6" fill="#164E63" stroke="none" />
      <path d="M17 30a10 10 0 0 1 14 0" stroke="#F0973B" className="animate-mo-wave" />
      <path
        d="M11 24a18.5 18.5 0 0 1 26 0"
        stroke="#F0973B"
        className="animate-mo-wave"
        style={{ animationDelay: '.45s' }}
      />
      <path
        d="M5 18a27 27 0 0 1 38 0"
        stroke="#F0973B"
        className="animate-mo-wave"
        style={{ animationDelay: '.9s' }}
      />
    </svg>
  )
}

export function CarIcon() {
  return (
    <svg {...common}>
      <g className="animate-mo-drive">
        <path d="M9 29l3-8.5A3 3 0 0 1 14.8 18.5h18.4a3 3 0 0 1 2.8 2L39 29" />
        <rect x="6" y="29" width="36" height="9" rx="2.5" />
        <circle cx="14" cy="38.5" r="3.5" fill="#FFFFFF" />
        <circle cx="34" cy="38.5" r="3.5" fill="#FFFFFF" />
        <path d="M10.5 33.5h4M33.5 33.5h4" stroke="#F0973B" strokeWidth="2.6" />
      </g>
      <path d="M4 44h40" opacity=".35" />
    </svg>
  )
}

/** Locker con un par de esquís apoyados (se balancean) y un copo de nieve que titila. */
export function LockerIcon() {
  return (
    <svg {...common}>
      <rect x="5" y="7" width="19" height="35" rx="2.5" />
      <path d="M9 12h11M9 15.5h11" opacity=".5" />
      <path d="M20 23.5v5" strokeWidth="2.4" />
      <path d="M3 44h42" opacity=".35" />
      <g className="animate-mo-sway" style={{ transformBox: 'view-box', transformOrigin: '43px 43px' }}>
        <path d="M40.5 43 29.6 10.2c-.6-1.8.3-3.5 2.1-3.4" stroke="#F0973B" strokeWidth="2.4" />
        <path d="M45 42 34.1 9.2c-.6-1.8.3-3.5 2.1-3.4" stroke="#F0973B" strokeWidth="2.4" />
        <path d="M33.4 26.6l7.3-2.5" strokeWidth="2.2" />
      </g>
      <g stroke="#F0973B" strokeWidth="1.4" className="animate-mo-blink" style={{ animationDelay: '.6s' }}>
        <path d="M43 9v6M40 12h6M40.9 9.9l4.2 4.2M45.1 9.9l-4.2 4.2" />
      </g>
    </svg>
  )
}

export function GuestsIcon() {
  return (
    <svg {...common}>
      <circle cx="13" cy="18" r="4.5" />
      <path d="M4.5 38c0-6 3.8-10 8.5-10s8.5 4 8.5 10" />
      <circle cx="25" cy="18" r="4.5" />
      <path d="M16.5 38c0-6 3.8-10 8.5-10s8.5 4 8.5 10" />
      <g stroke="#F0973B" className="animate-mo-pop">
        <circle cx="37" cy="18" r="4.5" />
        <path d="M28.5 38c0-6 3.8-10 8.5-10s8.5 4 8.5 10" />
      </g>
    </svg>
  )
}

export function HouseSmokeIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#F0973B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 22L24 9l16 13" />
      <path d="M12 19v20h24V19" />
      <path d="M20 39V29h8v10" />
      <path d="M31 14V8h4v9" />
      <path d="M33 5c-1-1.2 1-2 0-3.4" className="animate-mo-smoke" />
    </svg>
  )
}
