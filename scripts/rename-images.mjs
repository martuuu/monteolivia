#!/usr/bin/env node
/**
 * Renombra images/apartments → apartment-N.jpg, images/landscapes → landscape-N.jpg / video-N.mp4.
 * Orden: alfabético por nombre original (WhatsApp ordena por fecha/hora). Uso único.
 *   node scripts/rename-images.mjs          → dry-run (muestra el mapeo)
 *   node scripts/rename-images.mjs --apply  → renombra y escribe images/rename-map.csv
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('images')
const apply = process.argv.includes('--apply')
const rows = [['folder', 'new', 'original']]

function plan(folder, prefix, exts) {
  const dir = path.join(root, folder)
  const files = fs
    .readdirSync(dir)
    .filter((f) => exts.includes(path.extname(f).toLowerCase()))
    .filter((f) => !new RegExp(`^${prefix}-\\d+\\.`).test(f))
    .sort((a, b) => a.localeCompare(b))
  return files.map((f, i) => {
    const ext = path.extname(f).toLowerCase() === '.jpeg' ? '.jpg' : path.extname(f).toLowerCase()
    return { dir, from: f, to: `${prefix}-${i + 1}${ext}`, folder }
  })
}

const jobs = [
  ...plan('apartments', 'apartment', ['.jpg', '.jpeg']),
  ...plan('landscapes', 'landscape', ['.jpg', '.jpeg']),
  ...plan('landscapes', 'video', ['.mp4']),
]
for (const j of jobs) {
  rows.push([j.folder, j.to, j.from])
  console.log(`${j.folder}/${j.from}  →  ${j.to}`)
  if (apply) fs.renameSync(path.join(j.dir, j.from), path.join(j.dir, j.to))
}
if (apply) {
  fs.writeFileSync(
    path.join(root, 'rename-map.csv'),
    rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n') + '\n',
  )
  console.log(`\n${jobs.length} archivos renombrados. Mapa: images/rename-map.csv`)
} else console.log(`\n${jobs.length} archivos (dry-run). Usar --apply para renombrar.`)
