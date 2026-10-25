import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import es from '../../messages/es.json'
import en from '../../messages/en.json'

type Msgs = Record<string, Record<string, string>>
const files = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    return d.isDirectory() ? files(p) : /\.(tsx?)$/.test(d.name) ? [p] : []
  })

describe('messages', () => {
  it('ES y EN tienen las mismas claves y placeholders', () => {
    for (const [ns, keys] of Object.entries(es as Msgs)) {
      for (const [k, v] of Object.entries(keys)) {
        const other = (en as Msgs)[ns]?.[k]
        expect(other, `${ns}.${k} falta en en.json`).toBeTypeOf('string')
        const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join()
        expect(vars(other!), `${ns}.${k}`).toBe(vars(v))
      }
    }
  })

  it('las plantillas con {variables} no se llaman con t("clave") sin valores (usar t.raw o pasar valores)', () => {
    const withVars = new Set<string>()
    for (const keys of Object.values(es as Msgs))
      for (const [k, v] of Object.entries(keys)) if (/\{\w+\}/.test(v)) withVars.add(k)
    const offenders: string[] = []
    for (const f of files(path.resolve('src'))) {
      const src = fs.readFileSync(f, 'utf8')
      for (const m of src.matchAll(/(?<![.\w])(\w+)\('(\w+)'\)/g)) {
        if (withVars.has(m[2])) offenders.push(`${path.relative(process.cwd(), f)}: ${m[0]}`)
      }
    }
    expect(offenders).toEqual([])
  })
})
