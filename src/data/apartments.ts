import type { Locale } from '@/i18n/routing'
import type { ImageId } from './image-manifest'
import type { L } from './site'

export type RoomKey =
  | 'overview'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'bedroom'
  | 'twin'
  | 'bathroom'
  | 'balcony'
  | 'detail'
  | 'hall'
  | 'laundry'
  // compartidas / del edificio
  | 'breakfast'
  | 'aperitif'
  | 'lockers'
  | 'building'
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
  /**
   * Fotos de images/apartments/depto-N (la primera es la portada elegida por el cliente), luego los desayunos
   * sacados en ese depto y al final las del edificio (lockers y fachada, images/building).
   * Las 5 primeras forman el mosaico de /departamentos y la grilla de la ficha (usar horizontales); el resto se ve en el lightbox.
   */
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
  hall: { es: 'Pasillo', en: 'Hallway' },
  laundry: { es: 'Lavadero', en: 'Laundry' },
  breakfast: { es: 'Desayuno', en: 'Breakfast' },
  aperitif: { es: 'Picada con vino', en: 'Wine and snacks' },
  lockers: { es: 'Lockers para esquís y valijas', en: 'Lockers for skis and luggage' },
  building: { es: 'Fachada del edificio', en: 'The building' },
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

/** Fotos del edificio (images/building) que cierran la galería de todos los departamentos. */
export const SHARED_ROOMS: RoomKey[] = ['lockers', 'building']
const buildingPhotos: ApartmentImage[] = [
  { id: 'lockers-1', room: 'lockers' },
  { id: 'lockers-2', room: 'lockers' },
  { id: 'edificio-fachada', room: 'building' },
]

export const apartments: Apartment[] = [
  {
    n: 1,
    pax: 6,
    bedrooms: 2,
    beds: {
      es: '1 cama King · 2 camas de plaza y media · sofá cama',
      en: '1 king bed · 2 large single beds · sofa bed',
    },
    sizeLine: {
      es: 'Living-comedor · 2 dormitorios · Cocina completa',
      en: 'Living-dining · 2 bedrooms · Full kitchen',
    },
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
      { id: 'depto-1-portada', room: 'dining' },
      { id: 'depto-1-02', room: 'living' },
      { id: 'depto-1-03', room: 'kitchen' },
      { id: 'depto-1-05', room: 'bedroom' },
      { id: 'depto-1-08', room: 'twin' },
      { id: 'depto-1-04', room: 'living' },
      { id: 'depto-1-10', room: 'dining' },
      { id: 'depto-1-09', room: 'bedroom' },
      { id: 'depto-1-07', room: 'twin' },
      { id: 'depto-1-06', room: 'laundry' },
      // desayunos sacados en este depto (identificados por mobiliario)
      { id: 'desayuno-1', room: 'aperitif' },
      { id: 'desayuno-7', room: 'breakfast' },
      { id: 'desayuno-6', room: 'breakfast' },
      ...buildingPhotos,
    ],
    carousel: ['depto-1-portada', 'depto-1-02', 'depto-1-05'],
    airbnbUrl: 'https://www.airbnb.com/rooms/40944379',
  },
  {
    n: 2,
    pax: 6,
    bedrooms: 2,
    beds: {
      es: '1 cama King · 2 camas de plaza y media · sofá cama',
      en: '1 king bed · 2 large single beds · sofa bed',
    },
    sizeLine: {
      es: 'Living-comedor · 2 dormitorios · Cocina completa',
      en: 'Living-dining · 2 bedrooms · Full kitchen',
    },
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
      { id: 'depto-2-portada', room: 'living' },
      { id: 'depto-2-05', room: 'dining' },
      { id: 'depto-2-02', room: 'kitchen' },
      { id: 'depto-2-10', room: 'bedroom' },
      { id: 'depto-2-11', room: 'twin' },
      { id: 'depto-2-03', room: 'living' },
      { id: 'depto-2-04', room: 'living' },
      { id: 'depto-2-06', room: 'kitchen' },
      { id: 'depto-2-07', room: 'kitchen' },
      { id: 'depto-2-09', room: 'bathroom' },
      { id: 'depto-2-13', room: 'bathroom' },
      { id: 'depto-2-08', room: 'hall' },
      { id: 'depto-2-12', room: 'laundry' },
      // desayunos sacados en este depto (identificados por mobiliario)
      { id: 'desayuno-3', room: 'breakfast' },
      { id: 'desayuno-4', room: 'breakfast' },
      ...buildingPhotos,
    ],
    carousel: ['depto-2-portada', 'depto-2-05', 'depto-2-02'],
  },
  {
    n: 3,
    pax: 4,
    bedrooms: 1,
    beds: { es: '1 cama King · sofá cama Queen', en: '1 king bed · queen sofa bed' },
    sizeLine: {
      es: 'Living · 1 dormitorio · Cocina completa · Balcón',
      en: 'Living room · 1 bedroom · Full kitchen · Balcony',
    },
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
      { id: 'depto-3-portada', room: 'dining' },
      { id: 'depto-3-03', room: 'living' },
      { id: 'depto-3-04', room: 'balcony' },
      { id: 'depto-3-11', room: 'bedroom' },
      { id: 'depto-3-05', room: 'kitchen' },
      { id: 'depto-3-02', room: 'living' },
      { id: 'depto-3-06', room: 'kitchen' },
      { id: 'depto-3-07', room: 'bedroom' },
      { id: 'depto-3-09', room: 'bedroom' },
      { id: 'depto-3-08', room: 'detail' },
      { id: 'depto-3-10', room: 'bathroom' },
      ...buildingPhotos,
    ],
    carousel: ['depto-3-portada', 'depto-3-04', 'depto-3-11'],
  },
  {
    n: 4,
    pax: 4,
    bedrooms: 2,
    beds: { es: '1 cama King · 2 camas de plaza y media', en: '1 king bed · 2 large single beds' },
    sizeLine: {
      es: 'Living-comedor · 2 dormitorios · Cocina completa · Balcón',
      en: 'Living-dining · 2 bedrooms · Full kitchen · Balcony',
    },
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
      { id: 'depto-4-portada', room: 'living' },
      { id: 'depto-4-02', room: 'dining' },
      { id: 'depto-4-04', room: 'balcony' },
      { id: 'depto-4-08', room: 'bedroom' },
      { id: 'depto-4-10', room: 'twin' },
      { id: 'depto-4-03', room: 'balcony' },
      { id: 'depto-4-07', room: 'detail' },
      { id: 'depto-4-05', room: 'kitchen' },
      { id: 'depto-4-06', room: 'kitchen' },
      { id: 'depto-4-09', room: 'bathroom' },
      { id: 'depto-4-11', room: 'laundry' },
      ...buildingPhotos,
    ],
    carousel: ['depto-4-portada', 'depto-4-04', 'depto-4-08'],
    airbnbUrl: 'https://www.airbnb.com/rooms/40944392',
  },
  {
    n: 5,
    pax: 2,
    bedrooms: 0,
    beds: { es: '1 cama King', en: '1 king bed' },
    sizeLine: {
      es: 'Monoambiente · Cocina completa · Baño privado',
      en: 'Studio · Full kitchen · Private bathroom',
    },
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
      es: [
        'Está en el 4° piso: el ascensor llega hasta el 3° y sigue un tramo corto de escalera. Te ayudamos con el equipaje.',
      ],
      en: [
        'It is on the 4th floor: the lift goes up to the 3rd and then there is a short flight of stairs. We help with your luggage.',
      ],
    },
    prices: {
      low: [{ minPax: 2, maxPax: 2, usd: 69 }],
      high: [{ minPax: 2, maxPax: 2, usd: 79 }],
    },
    images: [
      { id: 'depto-5-portada', room: 'bedroom' },
      { id: 'depto-5-07', room: 'overview' },
      { id: 'depto-5-03', room: 'kitchen' },
      { id: 'depto-5-02', room: 'hall' },
      { id: 'depto-5-04', room: 'kitchen' },
      { id: 'depto-5-05', room: 'detail' },
      { id: 'depto-5-06', room: 'bathroom' },
      ...buildingPhotos,
    ],
    carousel: ['depto-5-portada', 'depto-5-07', 'depto-5-03'],
    airbnbUrl: 'https://www.airbnb.com/rooms/40943900',
  },
]

export const apartmentSlug = (n: number, locale: Locale) =>
  locale === 'es' ? `departamento-${n}` : `apartment-${n}`

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
