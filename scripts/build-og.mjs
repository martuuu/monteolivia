#!/usr/bin/env node
/** Genera public/og/*.jpg (1200×630) para Open Graph / WhatsApp / redes: foto + degradé + logo + título. */
import fs from 'node:fs'
import sharp from 'sharp'

const W = 1200
const H = 630
const out = 'public/og'
fs.mkdirSync(out, { recursive: true })

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const pages = [
  {
    file: 'home-es',
    img: 'hero/hero-home',
    eyebrow: 'USHUAIA · TIERRA DEL FUEGO',
    title: 'Departamentos en Ushuaia',
    sub: 'Tu lugar en el fin del mundo',
  },
  {
    file: 'home-en',
    img: 'hero/hero-home',
    eyebrow: 'USHUAIA · TIERRA DEL FUEGO',
    title: 'Apartments in Ushuaia',
    sub: 'Your place at the end of the world',
  },
  {
    file: 'apartments-es',
    img: 'apartments/depto-3/depto-3-portada',
    eyebrow: 'MONTE OLIVIA SUITES',
    title: '5 departamentos en Ushuaia',
    sub: 'De 2 a 6 huéspedes · cocina completa · Wi-Fi',
  },
  {
    file: 'apartments-en',
    img: 'apartments/depto-3/depto-3-portada',
    eyebrow: 'MONTE OLIVIA SUITES',
    title: '5 apartments in Ushuaia',
    sub: '2 to 6 guests · full kitchen · Wi-Fi',
  },
]
const apts = [
  [1, 'depto-1/depto-1-portada', 6],
  [2, 'depto-2/depto-2-portada', 6],
  [3, 'depto-3/depto-3-portada', 4],
  [4, 'depto-4/depto-4-portada', 4],
  [5, 'depto-5/depto-5-portada', 2],
]
for (const [n, img, pax] of apts) {
  pages.push({
    file: `apartment-${n}-es`,
    img: `apartments/${img}`,
    eyebrow: 'MONTE OLIVIA SUITES · USHUAIA',
    title: `Departamento ${n}`,
    sub: pax === 2 ? '2 huéspedes' : `Hasta ${pax} huéspedes`,
  })
  pages.push({
    file: `apartment-${n}-en`,
    img: `apartments/${img}`,
    eyebrow: 'MONTE OLIVIA SUITES · USHUAIA',
    title: `Apartment ${n}`,
    sub: pax === 2 ? '2 guests' : `Up to ${pax} guests`,
  })
}

const logo = await sharp('public/images/brand/logo-tile.png').resize({ height: 84 }).toBuffer()
for (const p of pages) {
  const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0B2836" stop-opacity=".15"/><stop offset=".45" stop-color="#071B26" stop-opacity=".35"/><stop offset="1" stop-color="#071B26" stop-opacity=".92"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <text x="64" y="440" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#F0973B">${esc(p.eyebrow)}</text>
    <text x="64" y="512" font-family="Marcellus, Georgia, 'Times New Roman', serif" font-size="66" fill="#FFFFFF">${esc(p.title)}</text>
    <text x="64" y="562" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="28" fill="#FFFFFF" fill-opacity=".9">${esc(p.sub)}</text>
  </svg>`)
  await sharp(`public/images/${p.img}.jpg`)
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: overlay }, { input: logo, top: 40, left: 64 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${out}/${p.file}.jpg`)
}
console.log(`${pages.length} imágenes OG → ${out}/`)
