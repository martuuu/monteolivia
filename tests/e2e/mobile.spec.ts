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
