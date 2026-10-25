#!/usr/bin/env node
/** Genera src/app/icon.png, apple-icon.png y favicon.ico a partir del isotipo (public/images/brand/mark.png). */
import sharp from 'sharp'
import fs from 'node:fs'

const mark = 'public/images/brand/mark.png'
async function tile(size, pad, bg) {
  const inner = Math.round(size * (1 - pad * 2))
  const m = await sharp(mark).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: m, gravity: 'center' }]).png()
}
const cream = { r: 246, g: 244, b: 239, alpha: 1 }
await (await tile(512, 0.08, cream)).toFile('src/app/icon.png')
await (await tile(180, 0.1, cream)).toFile('src/app/apple-icon.png')
// favicon.ico: PNG de 48px embebido (ICO con PNG es válido en todos los navegadores actuales)
const png = await (await tile(48, 0.04, cream)).toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4)
header.writeUInt8(48, 6); header.writeUInt8(48, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9)
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18)
fs.writeFileSync('src/app/favicon.ico', Buffer.concat([header, png]))
console.log('icons ok')
