import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** 301 desde el sitio Joomla anterior (monteoliviasuites.com.ar/es/..., /en/...). */
const legacy: { source: string; destination: string }[] = [
  // Español: el sitio viejo usaba prefijo /es
  { source: '/es', destination: '/' },
  { source: '/es/departamentos', destination: '/departamentos' },
  { source: '/es/departamentos/departamento-:n(\\d)', destination: '/departamentos/departamento-:n' },
  { source: '/es/tarifas', destination: '/#tarifas' },
  { source: '/es/reservas', destination: '/#reserva' },
  { source: '/es/contacto', destination: '/#reserva' },
  { source: '/es/fotos', destination: '/#galeria' },
  { source: '/es/comentarios', destination: '/#huespedes' },
  { source: '/es/excursiones', destination: '/#excursiones' },
  { source: '/es/:path*', destination: '/' },
  // Inglés: /en/apartments y /en/apartments/apartment-N ya son las URLs nuevas
  { source: '/en/rates', destination: '/en#tarifas' },
  { source: '/en/reservation', destination: '/en#reserva' },
  { source: '/en/contact', destination: '/en#reserva' },
  { source: '/en/gallery', destination: '/en#galeria' },
  { source: '/en/testimonials', destination: '/en#huespedes' },
  { source: '/en/tours', destination: '/en#excursiones' },
  // Joomla
  { source: '/index.php', destination: '/' },
  { source: '/index.php/:path*', destination: '/' },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    // Vercel Hobby: 5.000 transformaciones/mes. WebP + 1 calidad + anchos recortados ≈ <1.000 transformaciones.
    formats: ['image/webp'],
    qualities: [75],
    deviceSizes: [640, 828, 1200, 1920, 2560],
    imageSizes: [128, 256, 384, 512, 768],
    minimumCacheTTL: 2678400, // 31 días
  },
  async redirects() {
    return legacy.map((r) => ({ ...r, statusCode: 301 as const }))
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
