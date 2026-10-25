# Analytics · GA4

Medición del sitio con Google Analytics 4 (gtag directo vía `@next/third-parties`). Sin GTM.

## Cómo funciona

- `NEXT_PUBLIC_GA_ID=G-XXXXXXX` activa GA (vacío = no se carga nada). Se lee en build: cambiarlo requiere redeploy.
- `page_view`: automático por Enhanced Measurement (incluye navegaciones internas por historial).
- Clicks: cualquier `<a>`/`<button>` con `data-track="evento"` y `data-track-<param>="valor"` envía el evento. Lo procesa `src/components/analytics/Analytics.tsx` (un solo listener global). Para links externos se agrega `link_domain`.
- Secciones: cada bloque con `data-section="id"` envía `section_view` (primera vez visible) y `section_time` (segundos visibles con la pestaña activa, al salir de la sección, al ocultar la pestaña o al cerrar).
- Eventos desde componentes cliente: `track()` en `src/lib/analytics.ts`.
- Todos los eventos llevan `locale` (es/en) y `page_type` (home, apartments, apartment_detail, maintenance, other).

## Catálogo de eventos

| Evento | Parámetros | Cuándo |
|---|---|---|
| `section_view` | `section_id` | Primera vez que una sección se ve en la página |
| `section_time` | `section_id`, `seconds` | Tiempo visible acumulado en la sección (≥1 s) |
| `whatsapp_click` | `location`, `apartment`, `link_domain` | Cualquier botón/link a WhatsApp |
| `email_click` | `location` | Links `mailto:` |
| `airbnb_click` / `instagram_click` / `facebook_click` | `location`, `apartment` | Links a redes |
| `map_click` | `location` | "Cómo llegar" (Google Maps) |
| `cta_click` | `cta_id`, `location`, `apartment` | CTAs internos (ver departamentos, ver depto N, reservar, ver tarifas…) |
| `nav_click` | `target`, `location` | Header, menú mobile, footer, atajos y paginador de departamentos |
| `menu_open` | — | Abre el menú mobile |
| `lang_switch` | `from`, `to` | Cambio de idioma |
| `lightbox_open` | `gallery` (home, apartment_N), `apartment`, `index` | Abre una foto |
| `lightbox_nav` | `gallery`, `direction`, `index` | Navega en el lightbox |
| `carousel_interact` | `apartment`, `action` (dot, swipe) | Primera interacción con un carrusel de la home |
| `booking_submit` | `channel` (whatsapp, email), `source` (home_form, apartment_widget), `apartment`, `guests`, `has_dates`, `nights` | Envía una consulta de reserva |
| `review_open` / `review_submit` | `status` (sent, mailto_fallback, error), `rating` | Modal "Dejar comentario" |
| `tours_scroll` | `direction` | Flechas del carrusel de excursiones |
| `hero_video` | `state` | Solo si se activa el video del hero |

Valores de `section_id`: `hero`, `datos`, `departamentos`, `tarifas`, `huespedes`, `reserva`, `galeria`, `excursiones`, `ubicacion` (home), `depto_1`…`depto_5`, `cierre`.

Valores de `location`: `hero`, `nav`, `menu`, `fab` (botón flotante), `apartment_card`, `apartment_widget`, `apartments_page`, `apartment_pager`, `apartments_jump`, `booking`, `location`, `closing`, `footer`, `not_found`, `maintenance`.

## Configuración en GA4 (hacerlo ANTES de publicar: no es retroactivo)

1. **Admin → Flujos de datos → Web → Medición mejorada**: dejar activos "Vistas de página" (con "cambios del historial del navegador"), "Desplazamientos" y "Búsqueda". **Desactivar** "Clics salientes" y "Interacciones con formularios" (ya los medimos nosotros; evita doble conteo).
2. **Admin → Definiciones personalizadas → Dimensiones** (alcance: evento): `section_id`, `location`, `apartment`, `channel`, `source`, `cta_id`, `gallery`, `target`, `page_type`, `locale`.
3. **Métricas personalizadas** (alcance: evento, unidad: estándar): `seconds`, `nights`, `guests`.
4. **Admin → Eventos clave**: marcar `whatsapp_click`, `booking_submit`, `email_click`, `airbnb_click`.
5. **Admin → Retención de datos**: 14 meses.
6. Vincular **Search Console** (Admin → Vinculación de productos).

## Origen del tráfico (web, Instagram, otros)

- GA4 clasifica solo: Google orgánico, directo, referidos, `l.instagram.com` → "Organic Social".
- El navegador interno de Instagram a veces no envía referrer → aparece como "Direct". Por eso hay **links cortos con UTM**:

| Link | Uso | Llega como |
|---|---|---|
| `monteoliviasuites.com.ar/ig` | Bio de Instagram | `instagram / social / bio` |
| `/ig?c=historia-julio` | Historias, reels, posts | + `utm_content=historia-julio` |
| `/ig?to=en` | Versión en inglés | idem, aterriza en `/en` |
| `/fb` | Página de Facebook | `facebook / social / page` |
| `/airbnb` | Perfil / anuncios de Airbnb | `airbnb / referral / profile` |
| `/wa` | Estados de WhatsApp | `whatsapp / social / status` |

Definidos en `src/lib/campaign.ts`.

## Informes recomendados

- **Adquisición de tráfico** → fuente/medio: cuánta gente viene de Instagram vs Google vs directo.
- **Exploración "Tiempo por sección"**: técnica libre, filas `section_id`, valores `seconds` (suma) y recuento de `section_time`; promedio = suma / recuento. Filtrar por `page_type`.
- **Embudo**: `section_view (departamentos)` → `cta_click (ver_depto_N)` → `whatsapp_click` / `booking_submit`.
- **Departamento más consultado**: `whatsapp_click` + `booking_submit` por `apartment`.

## Probar

- `NEXT_PUBLIC_GA_DEBUG=1` en un deploy de preview → GA4 **DebugView** muestra cada evento con sus parámetros.
- Local: en desarrollo `track()` loguea `[ga] evento {…}` en la consola del navegador.
- `npm run test:e2e` valida los eventos principales leyendo `window.dataLayer`.

## Privacidad

GA4 no guarda IP. Argentina no exige banner de cookies; visitantes de UE/UK técnicamente requieren consentimiento. Pendiente de decisión (ver `.docs/pending.md`).
