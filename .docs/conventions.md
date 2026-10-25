# Convenciones

## Stack

| Pieza      | Versión                          | Notas                                                                |
| ---------- | -------------------------------- | -------------------------------------------------------------------- |
| Node       | 24.x                             | `.nvmrc`. Vercel ya no buildea con Node 20                           |
| Next.js    | 16.4                             | App Router, Turbopack, `cacheComponents`, `proxy.ts` (ex middleware) |
| React      | 19.3                             | `<title>` nativo se hoistea al `<head>`                              |
| TypeScript | ~5.9                             | No subir a 7 hasta que typescript-eslint lo soporte                  |
| next-intl  | 4.14                             | Root params (`next/root-params`), sin `setRequestLocale`             |
| Tailwind   | 4.3                              | Tokens en `@theme` (`src/styles/globals.css`)                        |
| Tests      | Vitest 5 + Playwright 1.64 + axe |                                                                      |

Sin librerías de animación, carruseles ni lightbox: el diseño es CSS + SVG y los componentes son chicos y propios.

## Estructura

```
src/app/[locale]/layout.tsx          root layout (html lang, fuentes, GA, Analytics)
src/app/[locale]/(site)/...          páginas con header/footer
src/app/[locale]/(bare)/mantenimiento
src/app/[locale]/not-found.tsx       404 (+ global-not-found.tsx para rutas con punto)
src/app/{ig,fb,airbnb,wa}/route.ts   links cortos con UTM
src/components/{layout,home,apartments,ui,icons,analytics,seo}
src/data/                            contenido tipado (es/en)
src/i18n/                            routing, navegación, request, pageLocale()
src/lib/                             helpers puros (booking, seo, jsonld, analytics, locale-path)
messages/{es,en}.json                textos de interfaz
scripts/                             imágenes, OG, íconos, diseño, QA
tests/unit · tests/e2e
```

## Componentes

- **Server por defecto.** `'use client'` solo con estado o eventos: `SiteHeader`, `LangSwitch`, `ApartmentCarousel`, `ApartmentMosaic`, `Lightbox`, `Marquee`, `GalleryRows`, `BookingForm`, `ApartmentBooking`, `ReviewModal`, `ToursScroller`, `HeroVideo`, `Analytics`.
- A los componentes cliente se les pasan **textos ya traducidos** por props (no hay mensajes de next-intl en el cliente; el provider solo da el locale a `<Link>`).
- Plantillas con variables para el cliente: usar `t.raw('clave')` y reemplazar `{i}`, `{total}`, etc. en el componente.
- Modales/menú/lightbox: `<dialog>` nativo con `showModal()`.
- Clases repetidas: `src/components/ui/styles.ts`. Contenedores del diseño: utilidades `wrap` (1180), `wrap-wide` (1240), `wrap-narrow` (900) — el max-width es del contenido, el padding se suma (igual que el diseño).

## Estilos

- Colores y animaciones solo desde tokens: `bg-ink`, `text-teal`, `bg-orange`, `text-orange-text` (eyebrow accesible), `text-muted`, `animate-mo-*`.
- Medidas del diseño con valores arbitrarios (`text-[17.5px]`, `px-[30px]`) cuando no coinciden con la escala de Tailwind. Es intencional: pixel-perfect.
- Breakpoints del diseño: `min-[761px]` (alternado de columnas), `min-[1081px]` (nav desktop / burger).
- Animaciones decorativas con `animate-mo-*` → se apagan solas con `prefers-reduced-motion`.

## Contenido

- Tipo bilingüe: `L<T> = { es: T; en: T }` (`src/data/site.ts`).
- Precio nuevo / cambio de tarifa → `apartments.ts` (`prices.low/high`, tramos por pax). La home, tarifas, fichas y JSON-LD se actualizan solos.
- Fotos: ids del manifest (`'apartment-12'`, `'landscape-9'`, `'hero-home'`). `npm run images:manifest` después de agregar archivos.

## Routing

- Nueva página → agregar el pathname en `src/i18n/routing.ts` (ES y EN), en `src/lib/locale-path.ts` (selector de idioma), en `sitemap.ts` y en los tests e2e.
- Validar el idioma con `await pageLocale()` (no usar `rootLocale()` directo en páginas).
- Redirecciones del sitio viejo: `next.config.ts` → `legacy`.

## SEO

- Cada página: `generateMetadata` con `buildMetadata()` (canonical + hreflang + OG). Un solo `h1`.
- JSON-LD con `src/lib/jsonld.ts` y `<JsonLd>`.
- OG por página: `npm run og:build` (archivos en `public/og/`).

## Analytics

- `data-track="evento"` + `data-track-<param>` en links/botones; `data-section="id"` en secciones. Ver `.docs/analytics.md`.
- Nombres de evento en snake_case, ≤40 caracteres, declarados en `EventName` (`src/lib/analytics.ts`).

## Calidad

```bash
npm run lint && npm run typecheck && npm test   # rápido
npm run test:e2e                                 # build + Playwright (rutas, 301, 404, SEO, GA, a11y, mobile)
```

`npm run build` debe mostrar todas las páginas como `○` (estáticas) o `◐`; ninguna `ƒ` salvo los links `/ig`, `/fb`, `/airbnb`, `/wa`.

## Git

- Rama de trabajo `develop`; producción desde `main`.
- Commits cortos y concretos en español (`feat:`, `fix:`, `docs:`, `chore:`). Sin línea de co-autor.
