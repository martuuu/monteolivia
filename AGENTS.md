# AGENTS.md · Monte Olivia Suites

Sitio de marketing de Monte Olivia Suites (5 departamentos en Ushuaia). Next.js 16 App Router + next-intl (ES/EN) + Tailwind v4, deploy en Vercel. Prioridades: SEO, UX mobile en departamentos, tipografía grande (público mayor), GA4 con eventos.

## Comandos

```bash
nvm use            # Node 24 (.nvmrc). Vercel ya no buildea con Node 20.
npm run dev        # http://localhost:3000 (ES) · /en (EN)
npm run build      # todas las rutas deben salir ○ (estáticas)
npm run lint && npm run typecheck && npm test
npm run test:e2e   # Playwright (levanta `next start` sobre el build)
npm run images:prepare   # assets-src/ → public/images (≤2560px, sin EXIF)
npm run images:manifest  # public/images → src/data/image-manifest.ts (ancho/alto/blur)
npm run og:build         # public/og/*.jpg (1200×630)
```

## Mapa del código

- `design/` — **fuente de verdad visual** (bundles de Claude Design aprobados por el cliente). Ante cualquier duda de tamaño, color, espaciado o animación: abrir el HTML en el navegador y comparar.
- `src/app/[locale]/` — root layout por idioma. `(site)/` páginas con header/footer; `(bare)/` mantenimiento. `not-found.tsx` = 404 del diseño.
- `src/i18n/routing.ts` — idiomas y **pathnames localizados** (`/departamentos` ↔ `/en/apartments`). Agregar rutas acá primero.
- `src/proxy.ts` — next-intl + modo mantenimiento (503). Redirecciones del sitio viejo: `next.config.ts`.
- `src/data/` — **todo el contenido** (departamentos, precios, tours, reseñas, contacto) tipado y bilingüe (`L<T> = {es, en}`). `image-manifest.ts` es generado, no editar a mano.
- `messages/{es,en}.json` — textos de interfaz (botones, labels, metadata).
- `src/components/` — `layout/`, `home/`, `apartments/`, `ui/`, `icons/` (SVG animados como JSX de servidor), `analytics/`, `seo/`.
- `src/lib/` — `whatsapp.ts`, `analytics.ts`, `jsonld.ts`, `seo.ts`, helpers puros (con tests en `tests/unit`).
- `.docs/` — runbook de producción, convenciones, roadmap, pendientes, QA, desvíos del diseño.

## Reglas

1. **Server Components por defecto.** Cliente solo para estado/interacción (header, menú, carrusel, lightbox, formularios, modal, tracking). Pasar textos ya traducidos como props a los componentes cliente; no usar `useTranslations` en cliente.
2. **Pixel-perfect contra `design/`.** Tokens en `src/styles/globals.css` (`@theme`). Keyframes del diseño con prefijo `mo-` (utilidades `animate-mo-*`). Si un cambio se desvía del diseño, anotarlo en `.docs/design-deviations.md`.
3. **Contenido en `src/data`, no en JSX.** Precio, capacidad o texto nuevo → data file + ambos idiomas.
4. **Tracking**: links/botones llevan `data-track="evento"` + `data-track-*`; no agregar `onClick` solo para GA. Eventos y parámetros en `.docs/analytics.md`.
5. **Imágenes**: siempre `next/image` desde el manifest (`img('apartment-12')`), con `sizes` real. Nada de `<img>` sueltos ni fotos >2560px en `public/`.
6. **SEO**: cada página exporta `generateMetadata` vía `buildMetadata()` (canonical + hreflang). Rutas nuevas → `sitemap.ts`.
7. **Accesibilidad**: áreas táctiles ≥44px, inputs ≥16px, `focus-visible`, `prefers-reduced-motion` (las animaciones `animate-mo-*` se apagan solas).
8. **Estático**: no leer `cookies()`/`headers()`/`searchParams` en páginas; `npm run build` debe mostrar todas las rutas como estáticas.
9. **Git**: commits cortos y concretos en `develop`. No push sin pedido explícito. Sin líneas de co-autor.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
