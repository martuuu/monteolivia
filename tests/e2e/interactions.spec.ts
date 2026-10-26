import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { gaEvents, opened, prepare } from './helpers'

test.beforeEach(async ({ page }) => prepare(page))

test('formulario de reserva arma el mensaje de WhatsApp y trackea', async ({ page }) => {
  await page.goto('/#reserva')
  const form = page.locator('#reserva form')
  await form.getByLabel('Nombre').fill('Ana')
  await form.getByLabel('Llegada').fill('2027-01-10')
  await form.getByLabel('Salida').fill('2027-01-14')
  await form.getByLabel('Huéspedes').selectOption('4')
  await form.getByLabel('Departamento').selectOption('3')
  await form.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
  const [url] = await opened(page)
  expect(url).toContain('https://wa.me/5492916421561?text=')
  const text = decodeURIComponent(url.split('text=')[1])
  expect(text).toContain('Nombre: Ana')
  expect(text).toContain('Fechas: 10/01/2027 → 14/01/2027')
  expect(text).toContain('Noches: 4')
  expect(text).toContain('Departamento: N° 3')
  const ev = (await gaEvents(page)).find((e) => e.name === 'booking_submit')
  expect(ev?.params).toMatchObject({
    channel: 'whatsapp',
    source: 'home_form',
    apartment: '3',
    nights: 4,
    page_type: 'home',
  })
})

test('clicks de WhatsApp llevan location y departamento', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('[data-track="whatsapp_click"][data-track-location="apartment_card"][data-track-apartment="2"]')
    .evaluate((a: HTMLAnchorElement) => {
      a.removeAttribute('target')
      a.addEventListener('click', (e) => e.preventDefault())
      a.click()
    })
  const ev = (await gaEvents(page)).find((e) => e.name === 'whatsapp_click')
  expect(ev?.params).toMatchObject({
    location: 'apartment_card',
    apartment: 2,
    locale: 'es',
    link_domain: 'wa.me',
  })
})

test('section_view y section_time', async ({ page }) => {
  await page.goto('/')
  await page.locator('#tarifas').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2300)
  await page.locator('#ubicacion').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const events = await gaEvents(page)
  expect(events.some((e) => e.name === 'section_view' && e.params.section_id === 'tarifas')).toBeTruthy()
  const time = events.find((e) => e.name === 'section_time' && e.params.section_id === 'tarifas')
  expect(Number(time?.params.seconds)).toBeGreaterThanOrEqual(2)
})

test('lightbox de galería: abrir, navegar con teclado y cerrar con Esc', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }) // el marquee se detiene (si no, el tile nunca está "estable")
  await page.goto('/#galeria')
  await page.locator('#galeria button[aria-label^="Ampliar foto"]').first().click()
  const dialog = page.locator('dialog[open]')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('1 / 16')
  await page.keyboard.press('ArrowRight')
  await expect(dialog).toContainText('2 / 16')
  await page.keyboard.press('Escape')
  await expect(page.locator('dialog[open]')).toHaveCount(0)
  expect((await gaEvents(page)).some((e) => e.name === 'lightbox_open')).toBeTruthy()
})

test('mosaico de departamento abre lightbox con todas las fotos', async ({ page }) => {
  await page.goto('/departamentos/departamento-1')
  await page.getByRole('button', { name: /Ver las 16 fotos/ }).click()
  await expect(page.locator('dialog[open]')).toContainText('1 / 16')
  await expect(page.locator('dialog[open]')).toContainText('Departamento 1')
})

test('widget de consulta del departamento', async ({ page }) => {
  await page.goto('/en/apartments/apartment-4')
  const widget = page.locator('text=Check availability').locator('..')
  await widget.getByLabel('Check-in').fill('2027-07-01')
  await widget.getByLabel('Check-out').fill('2027-07-08')
  await widget.getByRole('button', { name: 'WhatsApp' }).click()
  const [url] = await opened(page)
  const text = decodeURIComponent(url.split('text=')[1])
  expect(text).toContain('Apartment 4 (up to 4 guests)')
  expect(text).toContain('Nights: 7')
})

test('cambio de idioma conserva la página', async ({ page }) => {
  await page.goto('/departamentos/departamento-2')
  await page.locator('a[hreflang="en"]').first().click()
  await expect(page).toHaveURL(/\/en\/apartments\/apartment-2$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('modal de reseña: validación y envío (fallback mailto sin Resend)', async ({ page }) => {
  await page.goto('/#huespedes')
  await page.getByRole('button', { name: 'Dejar comentario' }).click()
  const dialog = page.locator('dialog[open]')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Enviar comentario' }).click()
  await expect(dialog.getByRole('alert')).toBeVisible()
})

for (const path of ['/', '/departamentos', '/departamentos/departamento-1', '/en', '/no-existe']) {
  test(`accesibilidad (axe) ${path}`, async ({ page }) => {
    // sin animaciones de entrada: axe mide contraste con la opacidad final
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('iframe')
      .analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(
      serious.map(
        (v) =>
          `${v.id}: ${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`,
      ),
    ).toEqual([])
  })
}

test('marquee de reseñas: se mueve, se pausa con hover y las flechas avanzan', async ({ page }) => {
  await page.goto('/#huespedes')
  const section = page.locator('#huespedes')
  const x = () =>
    section.locator('.mo-marquee-track').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
  await section.locator('.mo-marquee').scrollIntoViewIfNeeded()
  await page.mouse.move(5, 5)
  const a = await x()
  await page.waitForTimeout(600)
  expect(await x()).toBeLessThan(a) // avanza solo hacia la izquierda
  const box = (await section.locator('.mo-marquee').boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(150)
  const b = await x()
  await page.waitForTimeout(600)
  expect(Math.abs((await x()) - b)).toBeLessThan(1) // pausado con hover
  await page.mouse.move(5, 5)
  const c = await x()
  await section.getByRole('button', { name: 'Reseña siguiente' }).click()
  await page.waitForTimeout(900)
  expect(c - (await x())).toBeGreaterThan(300) // avanzó ~una tarjeta
  await expect(section.locator('figure').first()).toContainText('★★★★★')
  expect(
    (await gaEvents(page)).some((e) => e.name === 'carousel_interact' && e.params.carousel === 'reviews'),
  ).toBeTruthy()
})

test('galería: la fila de abajo también abre el lightbox', async ({ page }) => {
  await page.goto('/#galeria')
  const rows = page.locator('#galeria .mo-marquee')
  await rows.nth(1).scrollIntoViewIfNeeded()
  await page.waitForTimeout(400) // termina el scroll suave
  const box = (await rows.nth(1).boundingBox())!
  // click en el centro de la fila de abajo apenas carga (antes mostraba la copia inert)
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect(page.locator('dialog[open]')).toBeVisible()
  await expect(page.locator('dialog[open]')).toContainText('/ 16')
})

test('navegar entre páginas usa View Transition', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const d = document as unknown as { startViewTransition?: (...a: unknown[]) => unknown; __vt: number }
    d.__vt = 0
    const orig = d.startViewTransition?.bind(d)
    if (orig) d.startViewTransition = (...a: unknown[]) => ((d.__vt += 1), orig(...a))
  })
  await page.locator('header nav').getByRole('link', { name: 'Departamentos' }).click()
  await expect(page).toHaveURL(/\/departamentos$/)
  expect(await page.evaluate(() => (document as unknown as { __vt: number }).__vt)).toBeGreaterThan(0)
})

test('galería de la home: solo paisajes', async ({ page }) => {
  await page.goto('/#galeria')
  const srcs = await page
    .locator('#galeria img')
    .evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src))
  expect(srcs.length).toBeGreaterThan(0)
  expect(srcs.some((s) => decodeURIComponent(s).includes('/images/apartments/'))).toBeFalsy()
})

test('h1 animado conserva el texto completo y nombre accesible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Tu lugar en el fin del mundo' })).toBeVisible()
  await page.goto('/en')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Your place at the end of the world' }),
  ).toBeVisible()
})

test('selector de departamentos: activo según scroll', async ({ page }) => {
  await page.goto('/departamentos')
  const picker = page.getByRole('navigation', { name: 'Ir a un departamento' })
  await expect(picker.getByRole('link')).toHaveCount(5)
  await picker.getByRole('link', { name: /Departamento 3/ }).click()
  await expect(page).toHaveURL(/#depto-3$/)
  await expect(picker.getByRole('link', { name: /Departamento 3/ })).toHaveAttribute('aria-current', 'true')
})

test('ficha: galería propia (no el mosaico) y columna de reserva', async ({ page }) => {
  await page.goto('/departamentos/departamento-2')
  await expect(page.locator('.aspect-\\[6\\/5\\]')).toHaveCount(0)
  await page
    .getByRole('button', { name: /^Ampliar foto/ })
    .first()
    .click()
  await expect(page.locator('dialog[open]')).toContainText('Departamento 2')
  await page.keyboard.press('Escape')
  await expect(page.getByText('Consultar disponibilidad')).toBeVisible()
})
