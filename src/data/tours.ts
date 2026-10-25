import type { ImageId } from './image-manifest'
import type { L } from './site'

export type Tour = { id: string; name: L; desc: L; distance: L; contact: L; image: ImageId }

/**
 * Las 4 primeras son las del diseño aprobado; las 4 siguientes vienen de la sección Excursiones del sitio anterior.
 * Distancias del diseño a validar con el cliente (.docs/pending.md).
 */
export const tours: Tour[] = [
  {
    id: 'canal-beagle',
    name: { es: 'Canal Beagle', en: 'Beagle Channel' },
    desc: {
      es: 'Navegación al Faro Les Éclaireurs e Isla de los Lobos.',
      en: 'Sail to Les Éclaireurs lighthouse and the sea lion colony.',
    },
    distance: { es: 'Puerto de Ushuaia · a 5 min', en: 'Ushuaia port · 5 min away' },
    contact: { es: 'Operadores del puerto · reservamos por vos', en: 'Port operators · we book for you' },
    image: 'hero-maintenance',
  },
  {
    id: 'parque-nacional',
    name: { es: 'Parque Nacional', en: 'National Park' },
    desc: {
      es: 'Tierra del Fuego y Bahía Lapataia, medio día entre bosques y costa.',
      en: 'Tierra del Fuego & Lapataia Bay — half a day of forest and coast.',
    },
    distance: { es: '12 km · 20 min en auto', en: '12 km · 20 min by car' },
    contact: { es: 'Traslado y guía · lo coordinamos', en: 'Transfer & guide · we arrange it' },
    image: 'landscape-45',
  },
  {
    id: 'tren-fin-del-mundo',
    name: { es: 'Tren del Fin del Mundo', en: 'End of the World Train' },
    desc: {
      es: 'El histórico ferrocarril austral, dentro del Parque Nacional.',
      en: 'The historic southern railway, inside the National Park.',
    },
    distance: { es: '8 km · 15 min en auto', en: '8 km · 15 min by car' },
    contact: { es: 'Estación del Fin del Mundo · boletería', en: 'End of the World Station · ticket office' },
    image: 'landscape-5',
  },
  {
    id: 'laguna-esmeralda',
    name: { es: 'Laguna Esmeralda', en: 'Laguna Esmeralda' },
    desc: { es: 'Trekking de día completo hasta la laguna turquesa.', en: 'Full-day trek to the turquoise lagoon.' },
    distance: { es: '18 km · 25 min en auto', en: '18 km · 25 min by car' },
    contact: { es: 'Guías habilitados · lo coordinamos', en: 'Licensed guides · we arrange it' },
    image: 'landscape-9',
  },
  {
    id: 'glaciar-martial',
    name: { es: 'Glaciar Martial', en: 'Martial Glacier' },
    desc: {
      es: 'Sin salir de la ciudad: miradores panorámicos, casa de té y el sendero al glaciar.',
      en: 'Without leaving town: panoramic viewpoints, a tea house and the trail up to the glacier.',
    },
    distance: { es: 'A 10 min de los departamentos', en: '10 min from the apartments' },
    contact: { es: 'Sendero libre · te pasamos el recorrido', en: 'Self-guided trail · we share the route' },
    image: 'landscape-41',
  },
  {
    id: 'invierno',
    name: { es: 'Actividades de invierno', en: 'Winter activities' },
    desc: {
      es: 'Esquí, raquetas y paseos en la nieve: una de las temporadas más largas del país.',
      en: 'Skiing, snowshoeing and snow walks: one of the longest seasons in the country.',
    },
    distance: { es: 'Centros invernales · 20–30 min', en: 'Winter centres · 20–30 min' },
    contact: { es: 'Locker para tu equipo · te asesoramos', en: 'Locker for your gear · we advise you' },
    image: 'landscape-3',
  },
  {
    id: 'city-tour',
    name: { es: 'City tour', en: 'City tour' },
    desc: {
      es: 'El casco céntrico en diez cuadras: la calle San Martín, museos y la costanera.',
      en: 'Downtown in ten blocks: San Martín street, museums and the waterfront.',
    },
    distance: { es: 'Centro · 20 min a pie', en: 'Downtown · 20 min on foot' },
    contact: { es: 'A tu ritmo · te damos recomendaciones', en: 'At your own pace · we share our tips' },
    image: 'hero-404',
  },
  {
    id: 'lagos',
    name: { es: 'Lagos Escondido y Fagnano', en: 'Escondido & Fagnano lakes' },
    desc: {
      es: 'Excursión de día completo por la ruta 3, entre bosques, montañas y uno de los lagos más grandes de América.',
      en: 'A full-day trip along Route 3 through forests and mountains to one of the largest lakes in the Americas.',
    },
    distance: { es: '≈100 km · día completo', en: '≈100 km · full day' },
    contact: { es: 'Operadores locales · lo coordinamos', en: 'Local operators · we arrange it' },
    image: 'landscape-37',
  },
]
