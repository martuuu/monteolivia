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
