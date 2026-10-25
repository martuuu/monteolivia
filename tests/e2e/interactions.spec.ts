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
  await page.getByRole('button', { name: /Ver las 8 fotos/ }).click()
  await expect(page.locator('dialog[open]')).toContainText('1 / 8')
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
