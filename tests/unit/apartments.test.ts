import { describe, expect, it } from 'vitest'
import { apartmentFromSlug, apartments, priceLine, tierLabel } from '@/data/apartments'
import { imageManifest } from '@/data/image-manifest'

describe('apartments data', () => {
  it('has 5 apartments with valid images', () => {
    expect(apartments).toHaveLength(5)
    for (const a of apartments) {
      expect(a.images.length).toBeGreaterThanOrEqual(5)
      for (const img of [...a.images.map((i) => i.id), ...a.carousel])
        expect(imageManifest[img]).toBeDefined()
    }
  })
  it('usa fotos de su carpeta (portada primero) y cierra con las del edificio', () => {
    for (const a of apartments) {
      expect(a.images[0].id).toBe(`depto-${a.n}-portada`)
      expect(a.carousel[0]).toBe(`depto-${a.n}-portada`)
      for (const id of [...a.images.map((i) => i.id), ...a.carousel]) {
        const src = imageManifest[id].src
        // propias del depto o del edificio (lockers, fachada, desayunos)
        expect(src.includes(`/apartments/depto-${a.n}/`) || src.includes('/building/'), id).toBe(true)
      }
      // cierra con las fotos del edificio y la fachada al final
      expect(a.images.at(-1)?.id).toBe('edificio-fachada')
      expect(a.images.some((i) => i.room === 'lockers')).toBe(true)
      // las 5 del mosaico/grilla son horizontales
      for (const im of a.images.slice(0, 5)) {
        const { width, height } = imageManifest[im.id]
        expect(width, im.id).toBeGreaterThan(height)
      }
      expect(new Set(a.images.map((i) => i.id)).size).toBe(a.images.length)
    }
  })
  it('los carruseles de la home no repiten fotos entre departamentos', () => {
    const md5 = (id: string) => imageManifest[id as keyof typeof imageManifest].blurDataURL
    const seen = new Map<string, string>()
    for (const a of apartments) {
      for (const id of a.carousel) {
        const key = md5(id)
        expect(seen.get(key), `${id} repite ${seen.get(key)}`).toBeUndefined()
        seen.set(key, id)
      }
    }
  })
  it('matches the approved rates (diseño + sitio anterior)', () => {
    expect(priceLine(apartments[0].prices.low, 'es')).toBe('4 pax U$S 140 · 5/6 pax U$S 170')
    expect(priceLine(apartments[2].prices.high, 'es')).toBe('2 pax U$S 110 · 3/4 pax U$S 135')
    expect(priceLine(apartments[3].prices.low, 'es')).toBe('U$S 135')
    expect(tierLabel(apartments[3].prices.low[0], true, 'es')).toBe('Hasta 4 pax')
    expect(tierLabel(apartments[3].prices.low[0], true, 'en')).toBe('Up to 4 pax')
    expect(tierLabel(apartments[4].prices.high[0], true, 'es')).toBe('2 pax')
  })
  it('resolves localized slugs', () => {
    expect(apartmentFromSlug('departamento-2', 'es')?.n).toBe(2)
    expect(apartmentFromSlug('apartment-2', 'en')?.n).toBe(2)
    expect(apartmentFromSlug('apartment-2', 'es')).toBeUndefined()
    expect(apartmentFromSlug('departamento-9', 'es')).toBeUndefined()
  })
})
