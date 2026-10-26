import { expect, test } from '@playwright/test'
import { prepare } from './helpers'

test.beforeEach(async ({ page }) => prepare(page))

test('menú mobile abre, navega y cierra', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Menú' }).click()
  const menu = page.locator('dialog#mo-menu[open]')
  await expect(menu).toBeVisible()
  await menu.getByRole('link', { name: /Tarifas/ }).click()
  await expect(page.locator('dialog#mo-menu[open]')).toHaveCount(0)
  await expect(page).toHaveURL(/#tarifas$/)
})

test('sin scroll horizontal en mobile', async ({ page }) => {
  for (const path of ['/', '/departamentos', '/departamentos/departamento-5']) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('inputs ≥16px (iOS no hace zoom)', async ({ page }) => {
  await page.goto('/departamentos')
  const sizes = await page
    .locator('input, select, textarea')
    .evaluateAll((els) =>
      els.filter((e) => (e as HTMLElement).offsetParent).map((e) => parseFloat(getComputedStyle(e).fontSize)),
    )
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(16)
})

test('selector de departamentos: los 5 visibles sin scroll', async ({ page }) => {
  await page.goto('/departamentos')
  const links = page.getByRole('navigation', { name: 'Ir a un departamento' }).getByRole('link')
  await expect(links).toHaveCount(5)
  const vw = page.viewportSize()!.width
  for (const box of await links.evaluateAll((ls) => ls.map((l) => l.getBoundingClientRect().toJSON()))) {
    expect(box.left).toBeGreaterThanOrEqual(0)
    expect(box.right).toBeLessThanOrEqual(vw)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})

test('ficha mobile: carrusel con contador', async ({ page }) => {
  await page.goto('/departamentos/departamento-1')
  await expect(page.getByText('1 / 16')).toBeVisible()
})
