import type { Locale } from '@/i18n/routing'

export type Review = {
  n: number
  /** Estrellas (1–5). Las reseñas del sitio anterior no tenían puntaje: se asignó 5 por su contenido (validar con el cliente). */
  rating: number
  name: string
  city?: string
  date: string
  lang: 'es' | 'en' | 'pt'
  text: string
}

/**
 * Reseñas reales publicadas en el sitio anterior (monteoliviasuites.com.ar/es/comentarios, 2019–2023).
 * Texto original sin traducir. Selección curada; el archivo completo (58) está en reviews-archive.json.
 */
export const reviews: Review[] = [
  {
    n: 58,
    rating: 5,
    name: 'Herminia',
    city: 'Buenos Aires',
    date: '2023-09-17',
    lang: 'es',
    text: 'Estuvimos en la semana del 10/9 2023. Nos alojamos en el depto 2. Impecable todo! Muy lindo puesto, super amplio. Camas comodas, buena ducha bien calefaccionado. Muy buena atención! Súper completo Fui con mi familia y quedamos súper contentos. Lo recomiendo a full. Muchas Gracias por todo',
  },
  {
    n: 57,
    rating: 5,
    name: 'Carolina',
    city: 'Buenos Aires',
    date: '2023-07-30',
    lang: 'es',
    text: 'Nos alojamos del 13 al 20 de julio de 2023. Estuvimos en el depto 4, IMPECABLE, muy comodo y no le faltó nada. Está perfectamente decorado, limpio y con una vista hermosa para disfrutar con la familia de los desayunos. Volveremos sin duda el próximo año. Muchas gracias por la hospitalidad y la buena Atencion.',
  },
  {
    n: 54,
    rating: 5,
    name: 'Marisol',
    date: '2023-03-11',
    lang: 'es',
    text: 'Nos alojamos con otras dos parejas de amigos en el departamento dos. Realmente impecable, los detalles de reposición de higiene a mitad de semana un lujo!Super amables! Muy recomendable! Espacios amplios y todo limpio! Gracias por hacer nuestro viaje más agradable aún!',
  },
  {
    n: 52,
    rating: 5,
    name: 'Patricia',
    date: '2023-02-14',
    lang: 'es',
    text: 'Excelente departamento, ubicación y atención! Tiene todo lo necesario y más !!Cocina completisima, lavadero, baño con productos orgánicos de cortesía. Guardarropas de recepción. Lockers , cochera, vistas, excelentes muebles!! Para largas estadías y disfrutar!!',
  },
  {
    n: 50,
    rating: 5,
    name: 'Florencia',
    date: '2023-01-25',
    lang: 'es',
    text: 'Estuvimos una semana, somos una familia de 5 y es súper cómodo, equipado y confortable! Todo nuevo y súper limpio! La atención genial! Sin duda volveríamos!!!',
  },
  {
    n: 43,
    rating: 5,
    name: 'Andrea',
    date: '2022-10-06',
    lang: 'es',
    text: 'Excelente el departamento. Muy confortable, electrodomésticos impecables, ducha impecable, camas muy cómodas.... todo de lujo. Muy buena ubicación, a 20 minutos del centro si estás en auto. Con variedad de negocios a una cuadra de distancia... Recomendable !! Gracias Matías por la atención de todas las consultas y tu amabilidad!',
  },
  {
    n: 38,
    rating: 5,
    name: 'Verónica',
    date: '2022-09-05',
    lang: 'es',
    text: 'Excelente departamento, super cómodo, todo impecable y unas vistas increíbles desde todos sus ambientes Sin dudas volvería! Gracias Matias por tu atención!',
  },
  {
    n: 36,
    rating: 5,
    name: 'María Inés',
    date: '2022-08-27',
    lang: 'es',
    text: 'El departamento es perfecto, súper cómodo, hermoso, más lindo que las fotos, totalmente equipado, no le falta nada. La limpieza es excelente. La atención tanto de Gabriela como de Matías fueron impecables. Si tuviera que dar un puntaje sería 10. Sin dudas volveremos.',
  },
  {
    n: 34,
    rating: 5,
    name: 'Romina',
    date: '2022-08-22',
    lang: 'es',
    text: 'No lo duden! Es todo perfecto! Primero la atención de Matías que te asesora con todo y siempre con la mejor onda. Los departamentos son impecables, con un equipamiento perfecto, cómodos, con vistas preciosas y todo lo necesario para querer recomendar y volver pronto! Gracias por todo !',
  },
  {
    n: 27,
    rating: 5,
    name: 'Florencia',
    date: '2021-09-02',
    lang: 'es',
    text: 'Hermoso departamento! Impecable, super cómodo y muy bien equipado, con una vista espectacular a la montaña. Destacamos la atención de Matías, que nos recibió un sábado a la noche y siempre estuvo predispuesto para coordinar el check in, el check out y los horarios para la limpieza del departamento. Muy recomendable!',
  },
  {
    n: 26,
    rating: 5,
    name: 'Mariana',
    city: 'Argentina',
    date: '2021-08-25',
    lang: 'es',
    text: 'Mucho mas y mejor de lo imaginado!! todos los detalles de confort y calidad. Muebles, vajilla, ropa de cama, electrodomesticos. Hemos viajado muchas veces a US y esta opcion es la mejor relacion de precio/calidad/confort que conozco. Volveriamos sin duda!!!!',
  },
  {
    n: 25,
    rating: 5,
    name: 'Gabriel',
    date: '2021-08-05',
    lang: 'es',
    text: 'Excelente departamento. Tal cual como se muestra en las fotos y mejor. Todo nuevo y en funcionamiento. La calefacción perfecta y la atención del anfitrión muy personal. Volveremos con seguridad.',
  },
  {
    n: 13,
    rating: 5,
    name: 'Lucre',
    city: 'Buenos Aires',
    date: '2020-02-04',
    lang: 'es',
    text: 'Se trata de un departamento impecable, muy lindo y confortable, excelentemente equipado, y decorado con muy buen gusto. Es como hospedarse en un hotel de categoría, pero con las ventajas que brinda la privacidad y comodidad de un departamento propio. Volveríamos sin dudarlo.',
  },
  {
    n: 20,
    rating: 5,
    name: 'Jochen',
    city: 'Amberes, Bélgica',
    date: '2020-02-28',
    lang: 'en',
    text: "This is the perfect place! Everything is very new and of high quality. The apartment instantly felt like home. Amazing amenities and services make it feel like you're staying in a classy hotel while still having the luxury of having your own apartment with a great kitchen, including a washing machine, a dryer and even a dishwasher. The center can be reached by foot in 15 minutes and there is a supermarket round the corner. Highly recommended!",
  },
  {
    n: 9,
    rating: 5,
    name: 'Hannah',
    city: 'Portland, EE.UU.',
    date: '2020-01-26',
    lang: 'en',
    text: 'Incredibly clean, cozy and upscale apartment right outside the downtown of Ushuaia. Great use of space perfect for a weeks stay. Gabriela and Matais were excellent hosts. Always accommodating and professional. More than a 5 star experience! Thank you again',
  },
  {
    n: 6,
    rating: 5,
    name: 'Peggy',
    city: 'Arizona, EE.UU.',
    date: '2020-01-09',
    lang: 'en',
    text: 'This is a very comfortable space for a family or two couples to stay! The apartment is brand new and very well appointed. It is located in a quiet neighborhood. Taxis are abundant, and it is simple and inexpensive to travel anywhere in town. We would highly recommend this well-run vacation rental!',
  },
  {
    n: 2,
    rating: 5,
    name: 'Teresa',
    city: 'Zúrich, Suiza',
    date: '2019-12-20',
    lang: 'en',
    text: 'Very good, super clean and very friendly host. Everything is new. We were the second to rent the appartment. Excellent for the price. For us the best thing was the washmachine and the shower after some days in la Isla Navarino !! We could even park in their own parkingslot! We can just recommend you this place. It is just great.',
  },
  {
    n: 22,
    rating: 5,
    name: 'Eduarda',
    city: 'Río de Janeiro, Brasil',
    date: '2020-09-09',
    lang: 'en',
    text: 'The best experiencie I have had until now in AirBnb!!! The truly superhost! Matias was very a nice host and helped whenever needed. The apartament is perfect, very clean and tidy with a beautiful view to the montains. We also found a lot of facilities that made the experiencie even better. It looks even better than the pictures! Muchas gracias!',
  },
  {
    n: 19,
    rating: 5,
    name: 'Sandra',
    city: 'Brasilia, Brasil',
    date: '2020-02-25',
    lang: 'pt',
    text: 'Apartamento novo, muito bem equipado, limpo, cama super confortável, vista linda das montanhas. O Matias nos recebeu, sempre muito pontual, tirou nossas dúvidas, não tenho nada a reclamar do apartamento. Apesar de não ser no centro, tem tudo por perto, mercado, armazém, padaria e fica num bairro bem tranquilo. Recomendo, ficaria mais dias e voltarei quando puder.',
  },
  {
    n: 14,
    rating: 5,
    name: 'Amarildo',
    city: 'Brasilia, Brasil',
    date: '2020-02-07',
    lang: 'pt',
    text: 'Amamos o lugar, espaço super acolhedor, confortável com uma vista linda e com uma hospitalidade muito grande do Matias, nosso contato, que nos respondeu prontamente a todas as nossas dúvidas. Recomendamos!!!',
  },
  {
    n: 21,
    rating: 5,
    name: 'Amanda',
    city: 'Coronel Vivida, Brasil',
    date: '2020-03-04',
    lang: 'pt',
    text: 'Apartamento excelente! Tudo muito bonito e limpo. Matias nos recebeu super bem e nos ajudou com tudo que precisamos.',
  },
]

/** Ordena primero las reseñas en el idioma de la página (el resto queda en su idioma original). */
export function reviewsFor(locale: Locale) {
  return [...reviews].sort(
    (a, b) => Number(b.lang === locale) - Number(a.lang === locale) || b.date.localeCompare(a.date),
  )
}
