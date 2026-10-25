#!/usr/bin/env node
/**
 * Capturas para QA visual: node scripts/qa/screenshot.mjs <baseUrl> <outDir> [paths...] [--design]
 * --design: captura los HTML de design/*.dc.html (referencia aprobada) para comparar lado a lado.
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const [base, out, ...rest] = process.argv.slice(2)
const design = rest.includes('--design')
const paths = rest.filter((r) => !r.startsWith('--'))
const widths = (process.env.WIDTHS ?? '390,1440').split(',').map(Number)
fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch()
for (const w of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: w < 600 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const targets = design
    ? fs
        .readdirSync('design')
        .filter((f) => f.endsWith('.dc.html'))
        .map((f) => ({ url: 'file://' + path.resolve('design', f), name: f.replace(/\W+/g, '-') }))
    : paths.map((p) => ({
        url: base + p,
        name: (p.replace(/\W+/g, '-') || 'home').replace(/^-/, '') || 'home',
      }))
  for (const t of targets) {
    await page.goto(t.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(design ? 2500 : 600)
    // forzar carga de imágenes lazy
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${out}/${t.name}-${w}.png`, fullPage: true })
    console.log('shot', t.name, w)
  }
  await page.close()
}
await browser.close()
