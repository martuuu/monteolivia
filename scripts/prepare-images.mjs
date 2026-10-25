#!/usr/bin/env node
/**
 * Optimiza las fotos originales para la web (idempotente).
 *   images/apartments/apartment-N.jpg  → public/images/apartments/  (lado mayor ≤2048px)
 *   images/landscapes/landscape-N.jpg  → public/images/landscapes/  (excluye fotos sin derechos confirmados)
 *   design/extracted/* (AVIF/PNG)      → public/images/hero/ y public/images/brand/
 * Requiere haber corrido antes: python3 -I scripts/extract-design.py
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.resolve('public/images')
// Fotos que parecen descargadas de internet (chicas, sobresaturadas): no se publican hasta confirmar derechos.
export const EXCLUDED_LANDSCAPES = [7, 12, 13, 18, ...Array.from({ length: 15 }, (_, i) => 22 + i)]

const jobs = []
for (const folder of ['apartments', 'landscapes']) {
  const dir = path.resolve('images', folder)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(apartment|landscape)-(\d+)\.jpg$/)
    if (!m) continue
    if (m[1] === 'landscape' && EXCLUDED_LANDSCAPES.includes(Number(m[2]))) continue
    jobs.push({ src: path.join(dir, f), out: path.join(OUT, folder, f), max: 2048, q: 80 })
  }
}
const design = path.resolve('design/extracted')
const heroes = {
  'sitio-v2': 'hero-home.jpg',
  departamentos: 'hero-apartments.jpg',
  404: 'hero-404.jpg',
  mantenimiento: 'hero-maintenance.jpg',
}
for (const [page, name] of Object.entries(heroes)) {
  const dir = path.join(design, page)
  const avif = fs.existsSync(dir) && fs.readdirSync(dir).find((f) => f.endsWith('.avif'))
  if (avif) jobs.push({ src: path.join(dir, avif), out: path.join(OUT, 'hero', name), max: 2560, q: 78 })
}
// Logos: el PNG chico es transparente (nav, fondos claros); el grande tiene fondo blanco (menú/footer con radio).
const logoLight = path.join(design, 'sitio-v2', '498fb63e-cd4a-403f-94e1-c610ff7ee27b.png')
const logoTile = path.join(design, 'sitio-v2', '785d5c2f-f410-4ced-9a75-b094594b2f29.png')

fs.mkdirSync(path.join(OUT, 'brand'), { recursive: true })
let done = 0
for (const j of jobs) {
  fs.mkdirSync(path.dirname(j.out), { recursive: true })
  if (fs.existsSync(j.out) && fs.statSync(j.out).mtimeMs > fs.statSync(j.src).mtimeMs) continue
  await sharp(j.src)
    .rotate()
    .resize({ width: j.max, height: j.max, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: j.q, mozjpeg: true, progressive: true })
    .toFile(j.out)
  done++
}
if (fs.existsSync(logoLight)) {
  await sharp(logoLight)
    .resize({ width: 480 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(OUT, 'brand', 'logo.png'))
  // Isotipo (montañas + sol) para favicon / apple-icon
  await sharp(logoLight)
    .extract({ left: 184, top: 4, width: 398, height: 156 })
    .toFile(path.join(OUT, 'brand', 'mark.png'))
}
if (fs.existsSync(logoTile)) {
  await sharp(logoTile)
    .resize({ width: 480 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(OUT, 'brand', 'logo-tile.png'))
}
console.log(`${jobs.length} fotos (${done} procesadas ahora) + logos → public/images`)
