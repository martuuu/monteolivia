# Runbook · puesta en producción

Pasos para publicar monteoliviasuites.com.ar en Vercel y reemplazar el sitio Joomla. Pensado para hacerlo una vez, en orden. Tiempo estimado: 2–3 h + propagación de DNS.

## 0. Antes de empezar

- [ ] Rama `develop` al día y build local verde:
  ```bash
  nvm use && npm ci && npm run lint && npm run typecheck && npm test && npm run test:e2e
  ```
- [ ] Datos del cliente confirmados (ver `.docs/pending.md`, sección "Bloquea el lanzamiento").
- [ ] Acceso al panel DNS del dominio (hoy NS en `dns1/dns2.servidoraweb.net`) y al hosting viejo.
- [ ] Cuenta de Google con acceso a GA4 y Search Console (idealmente la del cliente).

## 1. GitHub

```bash
git checkout main && git merge --ff-only develop   # o PR develop → main
git push origin main develop
```

Vercel publica producción desde `main`; `develop` genera previews.

## 2. Vercel (plan Hobby)

1. **Add New → Project → Import** `martuuu/monteolivia`. Framework: Next.js (autodetectado). Root: `/`.
2. **Settings → General → Node.js Version: 24.x** (coincide con `engines` y `.nvmrc`).
3. **Settings → Environment Variables** (Production y Preview):

   | Variable               | Production                                           | Preview                    | Notas                                         |
   | ---------------------- | ---------------------------------------------------- | -------------------------- | --------------------------------------------- |
   | `NEXT_PUBLIC_SITE_URL` | `https://monteoliviasuites.com.ar`                   | URL del preview o la misma | Canonical, sitemap, OG                        |
   | `NEXT_PUBLIC_GA_ID`    | `G-XXXXXXXXXX`                                       | vacío (no ensuciar datos)  | Se lee en build                               |
   | `NEXT_PUBLIC_GA_DEBUG` | `0`                                                  | `1` si querés DebugView    |                                               |
   | `RESEND_API_KEY`       | `re_...`                                             | opcional                   | Sin key → el formulario de reseñas usa mailto |
   | `REVIEW_FROM_EMAIL`    | `Monte Olivia Suites <web@monteoliviasuites.com.ar>` | idem                       | Dominio verificado en Resend                  |
   | `REVIEW_TO_EMAIL`      | `info@monteoliviasuites.com.ar`                      | tu email para pruebas      |                                               |
   | `MAINTENANCE_MODE`     | `0`                                                  | `0`                        | `1` = sitio en mantenimiento (503)            |

4. **Deploy**. Verificar en la URL `*.vercel.app` (checklist del paso 6).
5. **Settings → Deployment Protection**: dejar previews protegidos (evita indexación de previews).

> Hobby es "uso personal / no comercial". Si el cliente empieza a vender por la web o se supera la cuota de imágenes (5.000 transformaciones/mes; hoy se usan <1.000), pasar a Pro.

## 3. Resend (formulario de reseñas) · opcional

1. Crear cuenta en resend.com → **Domains → Add** `monteoliviasuites.com.ar`.
2. Cargar en el DNS los registros que indica (SPF/DKIM en un subdominio `send.`; no rompen el mail actual).
3. Crear API key (permiso "Sending access") → `RESEND_API_KEY` en Vercel → redeploy.
4. Probar "Dejar comentario" en producción → debe llegar a `REVIEW_TO_EMAIL`.

## 4. Dominio y DNS

1. **48 h antes**: bajar el TTL de los registros `@` y `www` a 300 s en servidoraweb.
2. Vercel → **Settings → Domains → Add** `monteoliviasuites.com.ar` y `www.monteoliviasuites.com.ar` (redirect 308 de `www` → apex).
3. En el DNS (sin mover los NS, para no tocar el mail):
   - `A @ 76.76.21.21` (o el valor que muestre Vercel)
   - `CNAME www cname.vercel-dns.com.`
   - **No tocar** registros `MX`, `TXT` de SPF/DMARC del correo `info@`.
4. Esperar el certificado SSL (Vercel lo emite solo) y verificar `https://monteoliviasuites.com.ar`.
5. Mantener el hosting Joomla **2 semanas** sin borrar (rollback = volver el `A` a `167.250.5.20`).

## 5. Google

**GA4** (detalle en `.docs/analytics.md`):

- [ ] Propiedad GA4 + flujo web → `NEXT_PUBLIC_GA_ID`.
- [ ] Dimensiones y métricas personalizadas creadas **antes** del lanzamiento.
- [ ] Eventos clave: `whatsapp_click`, `booking_submit`, `email_click`, `airbnb_click`.
- [ ] Medición mejorada: desactivar "Clics salientes" e "Interacciones con formularios".
- [ ] Quitar del contenedor GTM viejo (`GTM-NQZ5QBX`) la etiqueta UA si se sigue usando en otro lado.

**Search Console**:

- [ ] Propiedad de dominio `monteoliviasuites.com.ar` (verificación por TXT en DNS).
- [ ] Enviar `https://monteoliviasuites.com.ar/sitemap.xml`.
- [ ] Inspeccionar `/`, `/departamentos`, `/en` y pedir indexación.
- [ ] A los 7 días: revisar "Páginas" (las URLs `/es/...` viejas deben figurar como "Página con redirección").
- [ ] Vincular con GA4.

**Perfil de Empresa de Google** (lo hace el cliente, impacta mucho en "departamentos en Ushuaia"):

- [ ] Sitio web → `https://monteoliviasuites.com.ar`. Nombre, dirección y teléfono idénticos al sitio.
- [ ] Categoría "Apartamento de alquiler vacacional" / "Complejo de apartamentos". Fotos nuevas.
- [ ] Pedir reseñas en Google a huéspedes recientes.

**Bing Webmaster Tools**: importar desde Search Console.

## 6. Checklist post-deploy (producción)

```bash
BASE=https://monteoliviasuites.com.ar
for u in / /en /departamentos /en/apartments /departamentos/departamento-1 /sitemap.xml /robots.txt; do curl -s -o /dev/null -w "%{http_code} $u\n" $BASE$u; done   # todo 200
for u in /es/ /es/departamentos/departamento-2 /es/tarifas /en/rates /index.php; do curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" $BASE$u; done  # 301/308
curl -s -o /dev/null -w "%{http_code}\n" $BASE/no-existe   # 404
curl -sI http://www.monteoliviasuites.com.ar | head -3       # redirige a https apex
```

- [ ] PageSpeed Insights (mobile) en `/` y `/departamentos`: Performance ≥90, resto 100.
- [ ] Compartir el link en WhatsApp → se ve la imagen OG.
- [ ] Rich Results Test en `/` → LodgingBusiness sin errores.
- [ ] GA4 Tiempo real: entrar desde el celular y ver page_view + section_view.
- [ ] Probar `/ig` desde la app de Instagram (bio) → GA4 Tiempo real muestra fuente `instagram`.
- [ ] `.docs/QA.md` completo en iPhone y Android.

## 7. Instagram y redes

- Bio de Instagram: `monteoliviasuites.com.ar/ig`
- Historias / reels: `monteoliviasuites.com.ar/ig?c=<nombre-campaña>`
- Facebook: `monteoliviasuites.com.ar/fb` · Airbnb (perfil): `monteoliviasuites.com.ar/airbnb` · WhatsApp estados: `/wa`

## 8. Operación

| Tarea                                 | Cómo                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Cambiar precios, textos o comodidades | `src/data/apartments.ts` / `messages/*.json` → commit → push a `main`                                                                 |
| Agregar una reseña recibida           | `src/data/reviews.ts` (copiar formato)                                                                                                |
| Fotos nuevas                          | Copiar a `images/apartments` o `images/landscapes` → `npm run images:prepare && npm run images:manifest` → usar el id en `src/data/*` |
| Modo mantenimiento                    | Vercel → env `MAINTENANCE_MODE=1` → Redeploy (sin cache). Volver a `0` + redeploy. Devuelve 503 + Retry-After (Google no desindexa)   |
| Activar video en el hero              | Clip horizontal → `scripts/encode-hero-video.sh in.mov` → `site.heroVideo` en `src/data/site.ts`                                      |
| Rollback                              | Vercel → Deployments → deploy anterior → "Promote to Production"                                                                      |
| Ver errores                           | Vercel → Logs (filtrar por 5xx)                                                                                                       |

## 9. Rollback total (volver al Joomla)

DNS: `A @` → `167.250.5.20`, `www` → valor anterior. Con TTL 300 s vuelve en minutos.
