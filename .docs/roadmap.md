# Roadmap

## Iteración 1 · hecho

- Home, Departamentos, 5 fichas, 404 y mantenimiento (503) en ES/EN, fieles al diseño.
- SEO técnico: metadata, hreflang, canonical, sitemap, robots, JSON-LD (LodgingBusiness, Accommodation, Breadcrumb), OG por página, 301 desde todas las URLs del Joomla.
- GA4: clicks, tiempo por sección, embudo de consulta, links cortos con UTM para redes.
- Pipeline de imágenes (optimización + manifest + blur), reseñas reales, formulario de reseñas (Resend o mailto).
- Tests unitarios y e2e (rutas, SEO, GA, formularios, a11y con axe, mobile). Lighthouse desktop 98–99 / 100 / 100 / 100.

## Iteración 2 · propuesta

**Contenido**

- Fotos ordenadas por departamento (Martín) → actualizar `images` de cada depto en `src/data/apartments.ts`.
- Video horizontal para el hero desktop (componente listo: `site.heroVideo` + `scripts/encode-hero-video.sh`). Los 11 videos verticales pueden ir como tiles en la galería.
- Fotos propias para Tren del Fin del Mundo, Lagos y Faro (hoy con fotos genéricas del cliente).
- Logo en SVG.

**SEO**

- Páginas de contenido local (ES/EN): "Qué hacer en Ushuaia en invierno", "Cómo llegar desde el aeropuerto", "Ushuaia con chicos", una por excursión. Long tail con intención de viaje.
- FAQ (check-in/out, cancelación, estacionamiento, mascotas, cobro en pesos) — sin schema FAQPage (Google ya no lo muestra), pero suma contenido.
- Reseñas de Google en el sitio (Places API o carga manual) y `aggregateRating` solo si vienen de una fuente externa verificable.
- Portugués (`/pt`): 4 de las reseñas son de Brasil.

**Conversión**

- Calendario de disponibilidad (sincronizar iCal de Airbnb/Booking) para mostrar fechas libres en cada ficha.
- Motor de reservas o link directo a Booking/Airbnb por departamento.
- Botón "Agregar al calendario" / recordatorio de consulta.

**Medición**

- Consent Mode v2 si se quiere cumplir con visitantes UE/UK.
- Vercel Speed Insights para Core Web Vitals reales (gratis en Hobby con límite).
- Panel de Looker Studio con secciones, embudo y fuentes.

**Técnico**

- Vercel Global Config para el modo mantenimiento sin redeploy.
- Pasar a Vercel Pro cuando haya uso comercial (términos de Hobby).
- TypeScript 7 cuando typescript-eslint lo soporte.
