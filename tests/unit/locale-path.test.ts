import { describe, expect, it } from 'vitest'
import { switchLocalePath } from '@/lib/locale-path'

describe('switchLocalePath', () => {
  it.each([
    ['/', 'en', '/en'],
    ['/en', 'es', '/'],
    ['/departamentos', 'en', '/en/apartments'],
    ['/en/apartments', 'es', '/departamentos'],
    ['/departamentos/departamento-3', 'en', '/en/apartments/apartment-3'],
    ['/en/apartments/apartment-5', 'es', '/departamentos/departamento-5'],
    ['/mantenimiento', 'en', '/en/maintenance'],
    ['/en/maintenance', 'es', '/mantenimiento'],
    ['/departamentos', 'es', '/departamentos'],
    ['/en/', 'es', '/'],
    // rutas internas (rewrite de next-intl)
    ['/es', 'en', '/en'],
    ['/es/departamentos/departamento-2', 'en', '/en/apartments/apartment-2'],
    ['/en/departamentos/apartment-5', 'es', '/departamentos/departamento-5'],
    ['/en/departamentos', 'en', '/en/apartments'],
  ] as const)('%s → %s = %s', (from, to, expected) => {
    expect(switchLocalePath(from, to)).toBe(expected)
  })
})
