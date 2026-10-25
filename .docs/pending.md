# Pendientes y decisiones abiertas

Para trabajar con Martín al cerrar la iteración 1. Cada ítem dice qué hace falta y dónde se cambia.

## Bloquea el lanzamiento

| #   | Qué                                                                                                                                                                                    | Quién   | Dónde                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| 1   | **Measurement ID de GA4** (`G-…`) y crear dimensiones/eventos clave antes de publicar                                                                                                  | Martín  | Vercel env `NEXT_PUBLIC_GA_ID` · `.docs/analytics.md` |
| 2   | **Coordenadas exactas** del edificio (link de Google Maps del cliente). Hoy el pin es aproximado sobre la calle Primer Argentino (-54.81637, -68.33278)                                | Cliente | `src/data/site.ts` → `geo` y `mapsUrl`                |
| 3   | **Validar copy enriquecido** (tabla en `.docs/copy-changes.md`): comodidades, camas, balcones, aviso de escalera del D5, distancias de excursiones, textos de las 4 excursiones nuevas | Cliente | `src/data/*`, `messages/*`                            |
| 4   | **Validar desvíos de diseño** por accesibilidad (colores de eyebrows/labels, etc.)                                                                                                     | Cliente | `.docs/design-deviations.md`                          |
| 5   | **Teléfono**: el sitio usa +54 9 291 642 1561 (el del sitio actual); directorios turísticos muestran +54 9 291 575 9920. Confirmar                                                     | Cliente | `src/data/site.ts`                                    |
| 6   | Acceso a DNS (servidoraweb) y plan de corte                                                                                                                                            | Martín  | `.docs/runbook.md` §4                                 |

## Importante (no bloquea)

| #   | Qué                                                                                                                                                                                                                                                              | Dónde                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 7   | **Asignar fotos por departamento.** La asignación actual es una propuesta por tipo de ambiente (las fotos estaban mezcladas). Cuando ordenes `images/` por depto, actualizar `images` y `carousel` de cada uno                                                   | `src/data/apartments.ts`      |
| 8   | Links de Airbnb de **D2 y D3** (hoy van al perfil del anfitrión)                                                                                                                                                                                                 | `apartments.ts` → `airbnbUrl` |
| 9   | **Resend**: crear cuenta, verificar dominio y API key. Sin esto, "Dejar comentario" abre el mail del usuario (funciona, pero es menos cómodo)                                                                                                                    | `.docs/runbook.md` §3         |
| 10  | Reseñas a publicar: elegí 21 de 58 (las más cortas). Revisar si el cliente quiere otras o quitar alguna                                                                                                                                                          | `src/data/reviews.ts`         |
| 11  | **Fotos sin derechos confirmados**: se excluyeron 19 landscapes (`landscape-7, 12, 13, 18, 22…36`: faro, tren, cartel, lobos marinos, otoño). Si son del cliente, sacarlas de `EXCLUDED_LANDSCAPES` y correr `npm run images:prepare && npm run images:manifest` | `scripts/prepare-images.mjs`  |
| 12  | Fotos para **Tren del Fin del Mundo** y **Lagos** (hoy: río del parque y lago con tronco, genéricas)                                                                                                                                                             | `src/data/tours.ts`           |
| 13  | **Video horizontal** para el hero (los 11 recibidos son verticales 720×1280)                                                                                                                                                                                     | `site.heroVideo`              |
| 14  | **Cookies/consentimiento** para visitantes de UE/UK (hay huéspedes de Alemania, Suiza, UK). Opciones: nada (hoy), banner simple, o Consent Mode v2                                                                                                               | `.docs/roadmap.md`            |
| 15  | Política de check-in/out, cancelación y mascotas: no figuran en el sitio. Sumarlas mejora confianza y SEO                                                                                                                                                        | nueva sección / FAQ           |
| 16  | GTM viejo `GTM-NQZ5QBX` y Google Ads `AW-1010582770`: si el cliente tiene campañas activas, decidir si se migra la conversión de Ads a GA4 (importar `whatsapp_click`)                                                                                           | GA4 / Ads                     |

## Decisiones técnicas a revisar

| Tema                                       | Estado                                                                                                 | Opción                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Plan Vercel                                | Hobby (pedido)                                                                                         | Pro si hay uso comercial o se pasa la cuota de imágenes                                     |
| Lighthouse mobile (laboratorio, localhost) | Perf 88–93, A11y/BP/SEO 100. LCP observado 130 ms; el simulado (3–4 s) lo penaliza el JS de React/Next | Medir en producción con PageSpeed Insights; si hace falta, `display: optional` en Marcellus |
| Títulos SEO                                | 65–78 caracteres (Google corta ~60 en mobile). Se priorizó incluir marca + keyword                     | Acortar si Search Console muestra baja CTR                                                  |
| Mosaico de departamentos en mobile         | Se respetó el diseño + botón "Ver las N fotos"                                                         | Alternativa: foto principal + tira deslizable                                               |
| Marquee de reseñas                         | 7 s por reseña, texto recortado a 7 líneas                                                             | Ajustar velocidad o largo con el cliente                                                    |

## Hallazgos menores de la revisión de código (25/10/2026)

| Tema                                                                                                                            | Impacto                                               | Opción                                                       |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| El header `x-mo-internal: 1` saltea el modo mantenimiento (lo usa el proxy para pedir la página de mantenimiento)               | Bajo: solo permite ver el sitio durante mantenimiento | Firmar el header con un secreto de env                       |
| El HTML del 404 dentro de un idioma llega como shell y el contenido/título aparecen con JS (status 404 y noindex son correctos) | Bajo: no se indexa                                    | Revisar en una versión futura de Next/next-intl              |
| No hay `error.tsx` con el diseño del sitio (errores inesperados muestran la pantalla genérica de Next)                          | Bajo                                                  | Agregar `src/app/[locale]/error.tsx` con la plantilla de 404 |
