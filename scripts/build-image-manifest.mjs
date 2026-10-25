#!/usr/bin/env node
/**
 * public/images/{apartments,landscapes,hero} → src/data/image-manifest.ts
 * Para cada foto: src, width, height y blurDataURL (placeholder de 16px en WebP base64).
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const base = path.resolve('public/images')
const folders = ['hero', 'apartments', 'landscapes']
const entries = []
for (const folder of folders) {
  const dir = path.join(base, folder)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.jpg'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  for (const f of files) {
    const file = path.join(dir, f)
    const { width, height } = await sharp(file).metadata()
    const blur = await sharp(file).resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer()
    entries.push({
      id: f.replace(/\.jpg$/, ''),
      src: `/images/${folder}/${f}`,
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
