import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intl = createMiddleware(routing)
const INTERNAL = 'x-mo-internal'

/**
 * 1) Modo mantenimiento (MAINTENANCE_MODE=1): todo responde 503 + Retry-After con la página de mantenimiento.
 *    Assets (_next, imágenes) quedan fuera del matcher y siguen sirviéndose.
 * 2) Resto: routing de next-intl (ES sin prefijo, EN en /en, pathnames localizados).
 * Las redirecciones 301 del sitio viejo viven en next.config.ts (se evalúan antes que este proxy).
 */
export default async function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === '1' && !request.headers.get(INTERNAL)) {
    const isEn = request.nextUrl.pathname === '/en' || request.nextUrl.pathname.startsWith('/en/')
    // Se pide la página estática de mantenimiento y se devuelve con 503 (un rewrite no conserva el status en páginas estáticas).
    const page = await fetch(new URL(isEn ? '/en/maintenance' : '/mantenimiento', request.url), {
      headers: { [INTERNAL]: '1' },
    })
    return new NextResponse(page.body, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '3600',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    })
  }
  // Slugs de departamento inexistentes → 404 real (sin esto, el shell estático sale con 200 antes del notFound()).
  const apt = request.nextUrl.pathname.match(/^\/(?:(en)\/apartments|departamentos)\/([^/]+)\/?$/)
  if (apt) {
    const valid = apt[1] ? /^apartment-[1-5]$/ : /^departamento-[1-5]$/
    if (!valid.test(apt[2])) return NextResponse.rewrite(new URL(`/${apt[1] ?? 'es'}/404`, request.url))
  }
  return intl(request)
}

export const config = {
  matcher: '/((?!api|_next|_vercel|ig|fb|airbnb|wa|.*\\..*).*)',
}
