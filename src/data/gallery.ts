import type { ImageId } from './image-manifest'
import type { L } from './site'

export type GalleryItem = { id: ImageId; alt: L }

const g = (id: ImageId, es: string, en: string): GalleryItem => ({ id, alt: { es, en } })

/**
 * Galería de la home: SOLO paisajes (fotos propias del cliente + las del diseño).
 * Fila superior (desplaza a la izquierda) y fila inferior (a la derecha).
 */
export const galleryTop: GalleryItem[] = [
  g('hero-home', 'Ushuaia y el Monte Olivia nevado', 'Ushuaia and snow-capped Mount Olivia'),
  g('landscape-9', 'Laguna Esmeralda', 'Laguna Esmeralda'),
  g('hero-404', 'Puerto de Ushuaia en invierno', 'Ushuaia port in winter'),
  g('landscape-1', 'Ruta nevada entre bosques de lenga', 'Snowy road through lenga forest'),
  g('landscape-47', 'Canal Beagle y la cordillera', 'Beagle Channel and the mountains'),
  g('landscape-6', 'Río y puente en el bosque fueguino', 'River and bridge in the Fuegian forest'),
  g('hero-apartments', 'La bahía de Ushuaia y los Andes fueguinos', 'Ushuaia bay and the Fuegian Andes'),
  g('landscape-3', 'Puente de madera en el bosque nevado', 'Wooden bridge in the snowy forest'),
]
export const galleryBottom: GalleryItem[] = [
  g('landscape-16', 'Laguna congelada en invierno', 'Frozen lagoon in winter'),
  g('landscape-46', 'Canal Beagle', 'Beagle Channel'),
  g('landscape-5', 'Río y dique de castores en el valle', 'River and beaver dam in the valley'),
  g('hero-maintenance', 'Veleros en la bahía de Ushuaia', 'Sailboats in Ushuaia bay'),
  g('landscape-20', 'Bosque fueguino en otoño', 'Fuegian forest in autumn'),
  g('landscape-45', 'Costa del Canal Beagle', 'Beagle Channel coast'),
  g('landscape-38', 'Cascada en el bosque', 'Waterfall in the forest'),
  g('landscape-14', 'Montaña nevada entre lengas', 'Snowy mountain among lenga trees'),
]
export const galleryAll = [...galleryTop, ...galleryBottom]
