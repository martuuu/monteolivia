import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intl = createMiddleware(routing)

/**
 * 1) Modo mantenimiento (MAINTENANCE_MODE=1): todo responde 503 + Retry-After con la página de mantenimiento.
 * 2) Resto: routing de next-intl (ES sin prefijo, EN en /en, pathnames localizados).
 * Las redirecciones 301 del sitio viejo viven en next.config.ts (se evalúan antes que este proxy).
 */
export default function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === '1') {
    const isEn = request.nextUrl.pathname === '/en' || request.nextUrl.pathname.startsWith('/en/')
    // Ruta interna (carpeta [locale]/mantenimiento), no la URL pública localizada
    const target = new URL(isEn ? '/en/mantenimiento' : '/es/mantenimiento', request.url)
    return NextResponse.rewrite(target, {
      status: 503,
      headers: { 'Retry-After': '3600', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
    })
  }
  return intl(request)
}

export const config = {
  matcher: '/((?!api|_next|_vercel|ig|fb|airbnb|.*\\..*).*)',
}
