#!/usr/bin/env node
/**
 * Logo para fondos oscuros (footer): todo en blanco, el sol y "SUITES" en naranja.
 * Parte del PNG transparente del diseño y limpia los píxeles sueltos del original
 * (en blanco sobre navy se verían como puntitos).  → public/images/brand/logo-white.png
 */
import sharp from 'sharp'

const SRC = 'design/extracted/sitio-v2/498fb63e-cd4a-403f-94e1-c610ff7ee27b.png'
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H } = info
const px = (x, y) => (y * W + x) * 4

// 1) componentes conexos de píxeles visibles; se descartan los de menos de 40 px (ruido)
const label = new Int32Array(W * H).fill(-1)
const sizes = []
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = y * W + x
    if (label[i] !== -1 || data[i * 4 + 3] < 8) continue
    const id = sizes.length
    let count = 0
    const stack = [i]
    label[i] = id
    while (stack.length) {
      const j = stack.pop()
      count++
      const jx = j % W
      const jy = (j / W) | 0
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ]) {
        const nx = jx + dx
        const ny = jy + dy
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
        const k = ny * W + nx
        if (label[k] === -1 && data[k * 4 + 3] >= 8) {
          label[k] = id
          stack.push(k)
        }
      }
    }
    sizes.push(count)
  }

// 2) recolorear: naranja se conserva, el resto pasa a blanco con el mismo alfa
const out = Buffer.from(data)
let removed = 0
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const o = px(x, y)
    const a = data[o + 3]
    if (!a) continue
    const l = label[y * W + x]
    if (l === -1 || sizes[l] < 40) {
      out[o + 3] = 0
      removed++
      continue
    }
    const [r, g, b] = [data[o], data[o + 1], data[o + 2]]
    const orange = r > 150 && r > g + 25 && g > b + 30
    if (!orange) {
      out[o] = 255
      out[o + 1] = 255
      out[o + 2] = 255
    }
  }

await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .trim({ threshold: 1 })
  .resize({ width: 480 })
  .png({ compressionLevel: 9 })
  .toFile('public/images/brand/logo-white.png')
console.log(`logo-white.png (${removed} px de ruido eliminados)`)
