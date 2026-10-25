import type { Page } from '@playwright/test'

/** Bloquea gtag.js/OSM y evita abrir pestañas reales (window.open). */
export async function prepare(page: Page) {
  await page.route(/googletagmanager\.com|google-analytics\.com|openstreetmap\.org/, (r) => r.abort())
  await page.addInitScript(() => {
    ;(window as unknown as { __opened: string[] }).__opened = []
    window.open = ((url: string) => {
      ;(window as unknown as { __opened: string[] }).__opened.push(String(url))
      return null
    }) as typeof window.open
  })
}

type GaEvent = { name: string; params: Record<string, unknown> }

/** Eventos enviados con gtag('event', ...) */
export async function gaEvents(page: Page): Promise<GaEvent[]> {
  return page.evaluate(() => {
    const dl = ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []) as ArrayLike<unknown>[]
    return Array.from(dl)
      .map((a) => Array.from(a))
      .filter((a) => a[0] === 'event')
      .map((a) => ({ name: String(a[1]), params: (a[2] ?? {}) as Record<string, unknown> }))
  })
}

export const opened = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened)
