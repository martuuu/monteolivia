# Contexto del proyecto

**Cliente:** Monte Olivia Suites — 5 departamentos boutique en Primer Argentino 108, Ushuaia (Tierra del Fuego). Anfitriones: Matías y Gabriela. En Airbnb desde 2019 (Superhost).

**Objetivo de la iteración 1:** reemplazar el sitio Joomla (2019, `/es/` y `/en/`, sin SEO técnico, Universal Analytics muerto) por un sitio rápido, bilingüe y medible, fiel al diseño aprobado en Claude Design.

**Prioridades del cliente (en orden):**

1. Los departamentos: página propia y excelente UX en mobile.
2. SEO: aparecer en "departamento en Ushuaia" / "alquiler temporario Ushuaia".
3. Público mayor: tipografía grande (base 18 px), contraste, botones grandes.
4. Analytics: clicks, tiempo por sección y origen (web, Instagram, otros).

**Conversión:** no hay motor de reservas. La consulta sale por WhatsApp (principal), email o Airbnb. Por eso los eventos clave son `whatsapp_click` y `booking_submit`.

**Tarifas** (U$S por noche, residentes argentinos pagan en pesos al cambio BNA):

|                              | Baja (abr–jun, oct–nov) | Alta (jul–sep, dic–mar) |
| ---------------------------- | ----------------------- | ----------------------- |
| D1 y D2 (hasta 6)            | 4 pax 140 · 5/6 pax 170 | 4 pax 150 · 5/6 pax 185 |
| D3 (hasta 4)                 | 2 pax 100 · 3/4 pax 125 | 2 pax 110 · 3/4 pax 135 |
| D4 (hasta 4)                 | 135                     | 145                     |
| D5 (2, monoambiente 4° piso) | 69                      | 79                      |

**Fuentes:**

- Diseño aprobado: `design/*.dc.html` (+ `design/extracted/`).
- Sitio anterior (datos, reseñas, excursiones): monteoliviasuites.com.ar/es/ — se reemplaza en el lanzamiento; reseñas archivadas en `src/data/reviews-archive.json`.
- Fotos originales: `images/` (no se versiona; renombradas `apartment-N`, `landscape-N`, `video-N`, mapa en `images/rename-map.csv`).

**Decisiones tomadas (25/10/2026):** idiomas por ruta (ES `/`, EN `/en`); GA4 directo; página de departamentos + 5 fichas; reseñas reales + formulario por email (Resend); copy enriquecido con datos reales; hero con imagen (componente de video listo, inactivo: los videos del cliente son verticales); solo fotos propias; Vercel Hobby.
