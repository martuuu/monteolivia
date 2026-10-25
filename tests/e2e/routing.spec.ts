import { expect, test } from '@playwright/test'

const pages = [
  { path: '/', lang: 'es', h1: 'Tu lugar en el fin del mundo', alt: '/en' },
  { path: '/en', lang: 'en', h1: 'Your place at the end of the world', alt: '/' },
  { path: '/departamentos', lang: 'es', h1: 'Departamentos', alt: '/en/apartments' },
  { path: '/en/apartments', lang: 'en', h1: 'Apartments', alt: '/departamentos' },
  {
    path: '/departamentos/departamento-3',
    lang: 'es',
    h1: 'Hasta 4 huéspedes',
    alt: '/en/apartments/apartment-3',
  },
  { path: '/en/apartments/apartment-5', lang: 'en', h1: '2 guests', alt: '/departamentos/departamento-5' },
]

for (const p of pages) {
  test(`SEO básico ${p.path}`, async ({ page, request }) => {
    const res = await request.get(p.path, { maxRedirects: 0 })
    expect(res.status()).toBe(200)
    await page.goto(p.path)
    await expect(page.locator('html')).toHaveAttribute('lang', p.lang)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toContainText(p.h1)
    const title = await page.title()
    expect(title.length).toBeGreaterThan(20)
    expect(title.length).toBeLessThanOrEqual(90)
    const desc = await page.locator('meta[name="description"]').getAttribute('content')
    expect(desc && desc.length).toBeGreaterThan(80)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toMatch(new RegExp(`${p.path === '/' ? '' : p.path}$`))
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1)
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
    // selector de idioma apunta a la página equivalente
    await expect(page.locator(`a[hreflang="${p.lang === 'es' ? 'en' : 'es'}"]`).first()).toHaveAttribute(
      'href',
      p.alt,
    )
  })
}

test('JSON-LD válido en home y ficha', async ({ page }) => {
  for (const path of ['/', '/departamentos/departamento-1']) {
    await page.goto(path)
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(blocks.length).toBeGreaterThan(0)
    for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow()
    expect(blocks.join('')).toContain(path === '/' ? 'LodgingBusiness' : 'Accommodation')
  }
})

const redirects: [string, string][] = [
  ['/es', '/'],
  ['/es/departamentos', '/departamentos'],
  ['/es/departamentos/departamento-2', '/departamentos/departamento-2'],
  ['/es/tarifas', '/#tarifas'],
  ['/es/reservas', '/#reserva'],
  ['/es/contacto', '/#reserva'],
  ['/es/fotos', '/#galeria'],
  ['/es/comentarios', '/#huespedes'],
  ['/es/excursiones', '/#excursiones'],
  ['/es/lo-que-sea', '/'],
  ['/en/rates', '/en#tarifas'],
  ['/en/reservation', '/en#reserva'],
  ['/en/gallery', '/en#galeria'],
  ['/en/testimonials', '/en#huespedes'],
  ['/en/tours', '/en#excursiones'],
  ['/index.php', '/'],
]
for (const [from, to] of redirects) {
  test(`301 ${from} → ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(
      new URL(res.headers()['location'], 'http://x').pathname +
        (new URL(res.headers()['location'], 'http://x').hash || ''),
    ).toBe(to)
  })
}

test('URLs del sitio viejo en inglés siguen vivas', async ({ request }) => {
  for (const p of ['/en/apartments', '/en/apartments/apartment-1'])
    expect((await request.get(p)).status()).toBe(200)
})

test('404 con diseño y status correcto', async ({ page, request }) => {
  for (const p of ['/no-existe', '/en/nope', '/departamentos/departamento-9', '/algo.php']) {
    expect((await request.get(p)).status()).toBe(404)
  }
  await page.goto('/no-existe')
  await expect(page.locator('h1')).toHaveText('Te perdiste en el fin del mundo')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('links de campaña con UTM', async ({ request }) => {
  const res = await request.get('/ig?c=reel-julio', { maxRedirects: 0 })
  expect(res.status()).toBe(302)
  const loc = new URL(res.headers()['location'])
  expect(loc.pathname).toBe('/')
  expect(loc.searchParams.get('utm_source')).toBe('instagram')
  expect(loc.searchParams.get('utm_medium')).toBe('social')
  expect(loc.searchParams.get('utm_content')).toBe('reel-julio')
})

test('sitemap y robots', async ({ request }) => {
  const sm = await (await request.get('/sitemap.xml')).text()
  expect(sm.match(/<url>/g)?.length).toBe(14)
  expect(sm).toContain('/en/apartments/apartment-3')
  expect(sm).toContain('hreflang')
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap:')
})
