import type { ImageId } from './image-manifest'
import type { L } from './site'

export type GalleryItem = { id: ImageId; alt: L }

const g = (id: ImageId, es: string, en: string): GalleryItem => ({ id, alt: { es, en } })

/** Fila superior del marquee (desplaza a la izquierda) y fila inferior (a la derecha). Patrón del diseño: paisaje / interior alternados. */
export const galleryTop: GalleryItem[] = [
  g('hero-home', 'Ushuaia y el Monte Olivia', 'Ushuaia and Mount Olivia'),
  g('apartment-14', 'Living de uno de los departamentos', 'Living room in one of the apartments'),
  g('landscape-9', 'Laguna Esmeralda', 'Laguna Esmeralda'),
  g('apartment-9', 'Dormitorio con cama King', 'Bedroom with a king bed'),
  g('hero-404', 'Puerto de Ushuaia en invierno', 'Ushuaia port in winter'),
  g('apartment-13', 'Cocina equipada', 'Equipped kitchen'),
  g('landscape-1', 'Ruta nevada camino a los centros invernales', 'Snowy road to the winter centres'),
  g('apartment-52', 'Fachada del edificio Monte Olivia Suites', 'Monte Olivia Suites building'),
]
export const galleryBottom: GalleryItem[] = [
  g('apartment-43', 'Baño completo', 'Full bathroom'),
  g('landscape-16', 'Laguna congelada en invierno', 'Frozen lagoon in winter'),
  g('apartment-37', 'Vista de las montañas desde el balcón', 'Mountain view from the balcony'),
  g('landscape-46', 'Canal Beagle', 'Beagle Channel'),
  g('apartment-58', 'Desayuno con vista a la ciudad', 'Breakfast with a view of town'),
  g('landscape-6', 'Río y puente en el bosque fueguino', 'River and bridge in the Fuegian forest'),
  g('apartment-53', 'Lockers individuales para esquís y valijas', 'Private lockers for skis and luggage'),
  g('hero-maintenance', 'Veleros en la bahía de Ushuaia', 'Sailboats in Ushuaia bay'),
]
export const galleryAll = [...galleryTop, ...galleryBottom]
