import type { Locale } from '@/i18n/routing'
import type { ImageId } from './image-manifest'
import type { L } from './site'

export type RoomKey = 'overview' | 'living' | 'dining' | 'kitchen' | 'bedroom' | 'twin' | 'bathroom' | 'balcony' | 'detail'
export type PriceTier = { minPax: number; maxPax: number; usd: number }
export type ApartmentImage = { id: ImageId; room: RoomKey }

export type Apartment = {
  n: 1 | 2 | 3 | 4 | 5
  pax: number
  bedrooms: number
  beds: L
  sizeLine: L
  /** Descripción corta (home + meta description) */
  summary: L
  p1: L
  p2: L
  rooms: L<string[]>
  /** Extras propios de esta unidad, se suman a `commonAmenities` */
  extraAmenities?: L<string[]>
  /** Datos prácticos importantes (accesibilidad, piso, etc.) */
  notes?: L<string[]>
  prices: { low: PriceTier[]; high: PriceTier[] }
  /** Las 5 primeras forman el mosaico (vista general, living, detalle, dormitorio, cocina); el resto se ve en el lightbox. */
  images: ApartmentImage[]
  /** Tres fotos para el carrusel de la home */
  carousel: [ImageId, ImageId, ImageId]
  airbnbUrl?: string
}

export const roomCaption: Record<RoomKey, L> = {
  overview: { es: 'Vista general', en: 'Overview' },
  living: { es: 'Living', en: 'Living room' },
  dining: { es: 'Comedor', en: 'Dining area' },
  kitchen: { es: 'Cocina', en: 'Kitchen' },
  bedroom: { es: 'Dormitorio', en: 'Bedroom' },
  twin: { es: 'Dormitorio con dos camas', en: 'Twin bedroom' },
  bathroom: { es: 'Baño', en: 'Bathroom' },
  balcony: { es: 'Balcón y vista', en: 'Balcony view' },
  detail: { es: 'Detalle', en: 'Detail' },
}

/** Comodidades de todas las unidades (diseño + equipamiento real publicado en el sitio anterior). */
export const commonAmenities: L<string[]> = {
  es: [
    'Wi-Fi libre',
    'Smart TV',
    'Calefacción',
    'Cocina equipada con vajilla completa',
    'Lavasecarropas y lavavajillas',
    'Cafetera Nespresso con cápsulas',
    'Ropa blanca y toallas de primera calidad',
    'Limpieza y cambio de ropa blanca cada 3 días',
    'Caja de seguridad y cortinas black-out',
    'Locker con llave para esquís y valijas',
    'Estacionamiento a pedido, sin cargo',
  ],
  en: [
    'Free Wi-Fi',
    'Smart TV',
    'Heating',
    'Equipped kitchen with full tableware',
    'Washer-dryer and dishwasher',
    'Nespresso machine with capsules',
    'Quality linens and towels',
    'Cleaning and fresh linens every 3 days',
    'Safe and blackout curtains',
    'Lockable locker for skis and luggage',
    'Free parking on request',
  ],
}

export const apartments: Apartment[] = [
  {
    n: 1,
    pax: 6,
    bedrooms: 2,
    beds: { es: '1 cama King · 2 camas de plaza y media · sofá cama', en: '1 king bed · 2 large single beds · sofa bed' },
    sizeLine: { es: 'Living-comedor · 2 dormitorios · Cocina completa', en: 'Living-dining · 2 bedrooms · Full kitchen' },
    summary: {
      es: 'Amplio, moderno y muy luminoso. Living-comedor espacioso y cocina completamente equipada.',
      en: 'Spacious, modern and bright, with a large living-dining room and a fully equipped kitchen.',
    },
    p1: {
      es: 'Amplio, moderno y con mucho estilo. Excelentes terminaciones y detalles de decoración que lo hacen muy cálido y confortable. Cuenta con un living-comedor espacioso y una cocina grande, completamente equipada.',
      en: 'Spacious, modern and stylish. Excellent finishes and decorative details make it very warm and comfortable. It has a large living-dining room and a big, fully equipped kitchen.',
    },
    p2: {
      es: 'Dos dormitorios luminosos con placard — uno con cama King y otro con dos camas de plaza y media — más un sofá cama en el living para el quinto y sexto huésped. Baño completo. Pensado para familias o grupos que quieren espacio de sobra.',
      en: 'Two bright bedrooms with closets — one with a king bed and one with two large single beds — plus a sofa bed in the living room for the fifth and sixth guest. Full bathroom. Designed for families or groups who want plenty of room.',
    },
    rooms: {
      es: ['Living-comedor', 'Cocina completa', '2 dormitorios', 'Sofá cama', 'Baño completo'],
      en: ['Living-dining room', 'Full kitchen', '2 bedrooms', 'Sofa bed', 'Full bathroom'],
    },
    prices: {
      low: [
        { minPax: 1, maxPax: 4, usd: 140 },
        { minPax: 5, maxPax: 6, usd: 170 },
      ],
      high: [
        { minPax: 1, maxPax: 4, usd: 150 },
        { minPax: 5, maxPax: 6, usd: 185 },
      ],
    },
    images: [
      { id: 'apartment-1', room: 'overview' },
      { id: 'apartment-3', room: 'living' },
      { id: 'apartment-4', room: 'dining' },
      { id: 'apartment-8', room: 'bedroom' },
      { id: 'apartment-2', room: 'kitchen' },
      { id: 'apartment-6', room: 'twin' },
      { id: 'apartment-20', room: 'bathroom' },
      { id: 'apartment-40', room: 'detail' },
    ],
    carousel: ['apartment-1', 'apartment-2', 'apartment-8'],
    airbnbUrl: 'https://www.airbnb.com/rooms/40944379',
  },
  {
    n: 2,
    pax: 6,
    bedrooms: 2,
    beds: { es: '1 cama King · 2 camas de plaza y media · sofá cama', en: '1 king bed · 2 large single beds · sofa bed' },
    sizeLine: { es: 'Living-comedor · 2 dormitorios · Cocina completa', en: 'Living-dining · 2 bedrooms · Full kitchen' },
    summary: {
      es: 'Espacioso y confortable, con living luminoso y cocina completa. Ideal para familias y grupos.',
      en: 'Roomy and comfortable, with a bright living room and full kitchen. Ideal for families and groups.',
    },
    p1: {
      es: 'Espacioso, luminoso y muy confortable. El living-comedor se integra con la cocina completa y una gran mesa familiar, ideal para compartir después de un día de excursiones.',
      en: 'Spacious, bright and very comfortable. The living-dining room opens onto the full kitchen and a large family table — ideal for gathering after a day of tours.',
    },
    p2: {
      es: 'Dos dormitorios — uno con cama King y otro con dos camas de plaza y media — y sofá cama en el living, con capacidad para hasta seis huéspedes. Decoración cálida, calefacción en todos los ambientes y vista a las montañas desde el living.',
      en: 'Two bedrooms — one with a king bed and one with two large single beds — and a sofa bed in the living room, sleeping up to six guests. Warm décor, heating in every room and mountain views from the living room.',
    },
    rooms: {
      es: ['Living-comedor', 'Cocina completa', '2 dormitorios', 'Sofá cama', 'Baño completo'],
      en: ['Living-dining room', 'Full kitchen', '2 bedrooms', 'Sofa bed', 'Full bathroom'],
    },
    prices: {
      low: [
        { minPax: 1, maxPax: 4, usd: 140 },
        { minPax: 5, maxPax: 6, usd: 170 },
      ],
      high: [
        { minPax: 1, maxPax: 4, usd: 150 },
        { minPax: 5, maxPax: 6, usd: 185 },
      ],
    },
    images: [
      { id: 'apartment-10', room: 'overview' },
      { id: 'apartment-12', room: 'living' },
      { id: 'apartment-15', room: 'dining' },
      { id: 'apartment-18', room: 'bedroom' },
      { id: 'apartment-11', room: 'kitchen' },
      { id: 'apartment-17', room: 'twin' },
      { id: 'apartment-21', room: 'bathroom' },
      { id: 'apartment-16', room: 'detail' },
    ],
    carousel: ['apartment-10', 'apartment-15', 'apartment-18'],
  },
  {
    n: 3,
    pax: 4,
    bedrooms: 1,
    beds: { es: '1 cama King · sofá cama Queen', en: '1 king bed · queen sofa bed' },
    sizeLine: { es: 'Living · 1 dormitorio · Cocina completa · Balcón', en: 'Living room · 1 bedroom · Full kitchen · Balcony' },
    summary: {
      es: 'Cálido y funcional, pensado para parejas — con lugar para uno o dos huéspedes más y un gran balcón.',
      en: 'Warm and functional, designed for couples — with room for one or two extra guests and a large balcony.',
    },
    p1: {
      es: 'Cálido y funcional, pensado para parejas que buscan comodidad, con lugar para uno o dos huéspedes más. Luminoso y silencioso, con decoración cuidada en cada detalle y un gran balcón con hermosas vistas.',
      en: 'Warm and functional, designed for couples seeking comfort — with room for one or two more guests. Bright and quiet, with carefully chosen décor in every detail and a large balcony with lovely views.',
    },
    p2: {
      es: 'Dormitorio con cama King, placard y caja de seguridad; living con sofá cama Queen, cocina completa y baño completo. Una base cómoda para recorrer Ushuaia y volver a descansar.',
      en: 'Bedroom with a king bed, closet and safe; living room with a queen sofa bed, full kitchen and full bathroom. A comfortable base to explore Ushuaia and come back to rest.',
    },
    rooms: {
      es: ['Living', 'Cocina completa', '1 dormitorio', 'Sofá cama', 'Baño completo', 'Balcón'],
      en: ['Living room', 'Full kitchen', '1 bedroom', 'Sofa bed', 'Full bathroom', 'Balcony'],
    },
    extraAmenities: { es: ['Gran balcón con vista'], en: ['Large balcony with views'] },
    prices: {
      low: [
        { minPax: 1, maxPax: 2, usd: 100 },
        { minPax: 3, maxPax: 4, usd: 125 },
      ],
      high: [
        { minPax: 1, maxPax: 2, usd: 110 },
        { minPax: 3, maxPax: 4, usd: 135 },
      ],
    },
    images: [
      { id: 'apartment-25', room: 'overview' },
      { id: 'apartment-24', room: 'dining' },
      { id: 'apartment-22', room: 'balcony' },
      { id: 'apartment-31', room: 'bedroom' },
      { id: 'apartment-26', room: 'kitchen' },
      { id: 'apartment-23', room: 'living' },
      { id: 'apartment-32', room: 'bathroom' },
      { id: 'apartment-29', room: 'detail' },
    ],
    carousel: ['apartment-25', 'apartment-22', 'apartment-31'],
  },
  {
    n: 4,
    pax: 4,
    bedrooms: 2,
    beds: { es: '1 cama King · 2 camas de plaza y media', en: '1 king bed · 2 large single beds' },
    sizeLine: { es: 'Living-comedor · 2 dormitorios · Cocina completa · Balcón', en: 'Living-dining · 2 bedrooms · Full kitchen · Balcony' },
    summary: {
      es: 'Cómodo y completo para cuatro huéspedes, con dos dormitorios y un gran balcón con vista.',
      en: 'Comfortable and complete for four guests, with two bedrooms and a large balcony with views.',
    },
    p1: {
      es: 'Cómodo y completo para cuatro huéspedes. Living-comedor con cocina equipada y dos dormitorios independientes, para que cada uno tenga su espacio. Gran balcón con hermosas vistas.',
      en: 'Comfortable and complete for four guests. Living-dining room with an equipped kitchen and two separate bedrooms, so everyone has their own space. Large balcony with lovely views.',
    },
    p2: {
      es: 'Dormitorio principal con cama King y segundo dormitorio con dos camas de plaza y media, ambos con placard y caja de seguridad. Baño completo, calefacción y todos los servicios incluidos.',
      en: 'Main bedroom with a king bed and a second bedroom with two large single beds, both with closets and a safe. Full bathroom, heating and all services included.',
    },
    rooms: {
      es: ['Living-comedor', 'Cocina completa', '2 dormitorios', 'Baño completo', 'Balcón'],
      en: ['Living-dining room', 'Full kitchen', '2 bedrooms', 'Full bathroom', 'Balcony'],
    },
    extraAmenities: { es: ['Gran balcón con vista'], en: ['Large balcony with views'] },
    prices: {
      low: [{ minPax: 1, maxPax: 4, usd: 135 }],
      high: [{ minPax: 1, maxPax: 4, usd: 145 }],
    },
    images: [
      { id: 'apartment-34', room: 'overview' },
      { id: 'apartment-33', room: 'living' },
      { id: 'apartment-36', room: 'balcony' },
      { id: 'apartment-42', room: 'bedroom' },
      { id: 'apartment-27', room: 'kitchen' },
      { id: 'apartment-41', room: 'twin' },
      { id: 'apartment-43', room: 'bathroom' },
      { id: 'apartment-37', room: 'balcony' },
    ],
    carousel: ['apartment-34', 'apartment-36', 'apartment-42'],
    airbnbUrl: 'https://www.airbnb.com/rooms/40944392',
  },
  {
    n: 5,
    pax: 2,
    bedrooms: 0,
    beds: { es: '1 cama King', en: '1 king bed' },
    sizeLine: { es: 'Monoambiente · Cocina completa · Baño privado', en: 'Studio · Full kitchen · Private bathroom' },
    summary: {
      es: 'Compacto y acogedor, ideal para dos. La base perfecta para explorar Ushuaia.',
      en: 'Compact and cosy, ideal for two — the perfect base to explore Ushuaia.',
    },
    p1: {
      es: 'Compacto y acogedor, ideal para dos. Un monoambiente con cama King, mesa, barra desayunadora, cocina completa y baño privado, con la misma calidez y terminaciones que el resto del edificio.',
      en: 'Compact and cosy, ideal for two. A studio with a king bed, table, breakfast bar, full kitchen and private bathroom, with the same warmth and finishes as the rest of the building.',
    },
    p2: {
      es: 'La opción más accesible para una escapada a Ushuaia: todo lo necesario para descansar bien y salir a recorrer el fin del mundo.',
      en: 'The most affordable option for an Ushuaia getaway: everything you need to rest well and head out to explore the end of the world.',
    },
    rooms: {
      es: ['Monoambiente', 'Cocina completa', 'Cama King', 'Barra desayunadora', 'Baño privado'],
      en: ['Studio', 'Full kitchen', 'King bed', 'Breakfast bar', 'Private bathroom'],
    },
    notes: {
      es: ['Está en el 4° piso: el ascensor llega hasta el 3° y sigue un tramo corto de escalera. Te ayudamos con el equipaje.'],
      en: ['It is on the 4th floor: the lift goes up to the 3rd and then there is a short flight of stairs. We help with your luggage.'],
    },
    prices: {
      low: [{ minPax: 2, maxPax: 2, usd: 69 }],
      high: [{ minPax: 2, maxPax: 2, usd: 79 }],
    },
    images: [
      { id: 'apartment-50', room: 'overview' },
      { id: 'apartment-46', room: 'living' },
      { id: 'apartment-47', room: 'detail' },
      { id: 'apartment-49', room: 'bedroom' },
      { id: 'apartment-48', room: 'kitchen' },
      { id: 'apartment-51', room: 'bathroom' },
    ],
    carousel: ['apartment-50', 'apartment-46', 'apartment-49'],
    airbnbUrl: 'https://www.airbnb.com/rooms/40943900',
  },
]

export const apartmentSlug = (n: number, locale: Locale) => (locale === 'es' ? `departamento-${n}` : `apartment-${n}`)

export function apartmentFromSlug(slug: string, locale: Locale) {
  const m = slug.match(locale === 'es' ? /^departamento-(\d)$/ : /^apartment-(\d)$/)
  return m ? apartments.find((a) => a.n === Number(m[1])) : undefined
}

export const minPrice = (a: Apartment) => Math.min(...a.prices.low.map((p) => p.usd))
export const allPrices = apartments.flatMap((a) => [...a.prices.low, ...a.prices.high].map((p) => p.usd))

/** "4 pax" / "5/6 pax" / "Hasta 4 pax" — mismo formato que el diseño */
export function tierLabel(t: PriceTier, single: boolean, locale: Locale) {
  if (t.minPax === t.maxPax) return `${t.maxPax} pax`
  if (single) return locale === 'es' ? `Hasta ${t.maxPax} pax` : `Up to ${t.maxPax} pax`
  if (t.minPax === 1) return `${t.maxPax} pax`
  return `${t.minPax}/${t.maxPax} pax`
}

/** Línea compacta para la home: "4 pax U$S 140 · 5/6 pax U$S 170" o "U$S 135" */
export function priceLine(tiers: PriceTier[], locale: Locale) {
  if (tiers.length === 1) return `U$S ${tiers[0].usd}`
  return tiers.map((t) => `${tierLabel(t, false, locale)} U$S ${t.usd}`).join(' · ')
}
