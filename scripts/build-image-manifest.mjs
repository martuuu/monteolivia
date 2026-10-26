#!/usr/bin/env node
/**
 * public/images/{hero,apartments/depto-N,building,landscapes} → src/data/image-manifest.ts
 * Para cada foto: src, width, height y blurDataURL (placeholder de 16px en WebP base64).
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const base = path.resolve('public/images')
// Carpetas (y subcarpetas: apartments/depto-N). El id es el nombre del archivo sin extensión.
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : e.name.endsWith('.jpg')
          ? [path.join(dir, e.name)]
          : [],
    )
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
const entries = []
for (const folder of ['hero', 'apartments', 'building', 'landscapes']) {
  for (const file of walk(path.join(base, folder))) {
    const { width, height } = await sharp(file).metadata()
    const blur = await sharp(file).resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer()
    entries.push({
      id: path.basename(file, '.jpg'),
      src: '/' + path.relative(path.resolve('public'), file).split(path.sep).join('/'),
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    })
  }
}
const body = entries
  .map(
    (e) =>
      `  '${e.id}': { src: '${e.src}', width: ${e.width}, height: ${e.height}, blurDataURL: '${e.blurDataURL}' },`,
  )
  .join('\n')
const ts = `// GENERADO por scripts/build-image-manifest.mjs — no editar a mano (npm run images:manifest)
export type ImageAsset = { src: string; width: number; height: number; blurDataURL: string }

export const imageManifest = {
${body}
} as const satisfies Record<string, ImageAsset>

export type ImageId = keyof typeof imageManifest
`
fs.writeFileSync(path.resolve('src/data/image-manifest.ts'), ts)
console.log(`${entries.length} imágenes → src/data/image-manifest.ts`)
