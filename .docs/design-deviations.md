# Desvíos respecto del diseño aprobado

Referencia: `design/*.dc.html` (abrir en el navegador) y `design/extracted/*/template.html`.
Todo lo demás replica el diseño: tokens, tipografías, tamaños, espaciados, radios, SVG animados y timings.

## Accesibilidad (público mayor)

| Elemento                                               | Diseño                               | Implementado                                                                                                     | Por qué                          | Cómo revertir                          |
| ------------------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------- |
| Eyebrows sobre fondo claro (14 px)                     | `#D97F1E` (2,7:1)                    | `#A85C08` (4,6:1)                                                                                                | WCAG AA para texto chico         | `--color-orange-text` en `globals.css` |
| Labels chicos (12–13 px)                               | `#8FA3AC` (2,4–2,6:1)                | `#587079` (4,8:1)                                                                                                | idem                             | `--color-muted`                        |
| Nota de reseñas sobre navy                             | blanco 35 % (2,8:1)                  | blanco 65 %                                                                                                      | idem                             | `Guests.tsx`                           |
| Copyright footer                                       | blanco 50 %                          | blanco 60 %                                                                                                      | margen sobre 4,5:1               | `SiteFooter.tsx`                       |
| Inputs del widget de departamento                      | 15 px                                | 16 px                                                                                                            | iOS hace zoom en inputs <16 px   | `ApartmentBooking.tsx`                 |
| Áreas táctiles                                         | dots 8 px, redes 42 px, ES/EN ~32 px | dots con 32 px de alto clickeable, redes 44 px, ES/EN 40×44 px                                                   | dedos de personas mayores        | —                                      |
| Dots del carrusel                                      | decorativos                          | botones (se puede elegir foto) + swipe                                                                           | usabilidad mobile                | `ApartmentCarousel.tsx`                |
| Marquees (reseñas y galería)                           | solo pausa con hover                 | + pausa con foco, con toque (mobile) y fuera de pantalla; con "reducir movimiento" quedan quietos y scrolleables | WCAG 2.2.2 y performance         | `Marquee.tsx`                          |
| Header                                                 | blur siempre                         | blur solo en desktop; en mobile crema sólido 97 %                                                                | performance y bugs de Safari iOS | `globals.css` `.mo-nav`                |
| Skip link, focus visible, `<dialog>` con foco atrapado | —                                    | agregados                                                                                                        | teclado / lectores de pantalla   | —                                      |

## UX / contenido

| Elemento                                            | Diseño                                  | Implementado                                                                                            |
| --------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Fichas individuales `/departamentos/departamento-N` | no existían                             | Mismo bloque del diseño como página completa + breadcrumb + anterior/siguiente + cierre (pedido de SEO) |
| Atajos a cada departamento                          | —                                       | Fila de chips debajo del hero de `/departamentos`                                                       |
| Botón "Ver las N fotos"                             | —                                       | Sobre el mosaico (cada depto tiene 6–8 fotos, el mosaico muestra 5)                                     |
| Bloque "Camas" y "Bueno saber"                      | —                                       | En cada departamento (D5: aviso de escalera)                                                            |
| Reseñas                                             | estrellas + texto corto                 | sin estrellas (no hay puntaje real), nombre · ciudad · fecha, texto recortado a 7 líneas                |
| Excursiones                                         | 4 cards sin flechas                     | 8 cards + flechas en desktop                                                                            |
| Mapa                                                | iframe OSM con pin "referencial" y nota | iframe OSM con pin en Primer Argentino (a confirmar), sin nota                                          |
| Ubicación                                           | 3 bullets                               | 4 bullets con datos reales                                                                              |
| Tarifas                                             | —                                       | Nota al pie de cobro en pesos para residentes                                                           |
| Lightbox en mobile                                  | flechas a los costados                  | flechas abajo (no tapan la foto) + swipe                                                                |
| Facebook en footer                                  | "f" con link vacío                      | ícono con link real                                                                                     |
| Hero                                                | 100vh                                   | 100svh (evita saltos con la barra del navegador mobile)                                                 |
| Logo                                                | PNG del diseño                          | mismo PNG optimizado (no hay SVG)                                                                       |

## Iteración 1.1 (pedidos de Martín, 25/10/2026)

| Elemento                                 | Antes (diseño)                    | Ahora                                                                                                                                                                         |
| ---------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eyebrow del hero (home y /departamentos) | texto naranja 15 px sobre la foto | píldora con fondo navy translúcido, ícono de ubicación, 14–17 px                                                                                                              |
| Título del hero                          | aparece todo junto                | "Tu lugar en" se pinta de entrada y se desliza; "el fin del mundo" aparece palabra por palabra con fundido suave (opacidad + desenfoque + leve subida), sin cursor (CSS puro) |
| Indicador de scroll                      | línea vertical                    | botón circular con flecha que flota y un anillo que pulsa; lleva a "Datos rápidos"                                                                                            |
| Datos rápidos                            | 4 + 1 en dos filas                | desktop (≥1024): los 5 en una fila con ícono arriba y separadores; mobile igual que el diseño                                                                                 |
| Ícono "Lockers de ski"                   | locker con esquís dentro          | locker + par de esquís naranjas apoyados que se balancean + copo de nieve                                                                                                     |
| Sección Departamentos (home)             | sin animación                     | título/bajada suben al entrar; foto y texto de cada departamento entran desde su lado                                                                                         |
| Reseñas                                  | sin estrellas (iteración 1)       | ★★★★★ en cada reseña (puntaje asignado, ver pendientes), pausa con hover y flechas anterior/siguiente sobre un degradé en los bordes                                          |
| Galería                                  | paisajes + interiores             | solo paisajes                                                                                                                                                                 |
| Botón de WhatsApp                        | 20 px del borde                   | 24 px (mobile 20 px)                                                                                                                                                          |
| Logo del footer                          | logo sobre recuadro blanco        | logo blanco con sol y "SUITES" en naranja (`npm run brand:logo`)                                                                                                              |
| Hero de /departamentos                   | bahía de Ushuaia                  | foto `apartment-24` (living con balcón)                                                                                                                                       |
| Atajos a departamentos                   | chips con scroll horizontal       | selector de 5 columnas siempre visible, fijo bajo el header, marca el departamento en pantalla                                                                                |
| Ficha individual                         | mismo mosaico que /departamentos  | galería propia: desktop 1 grande + 4 (66 % del alto), mobile carrusel a ancho completo y alto; precios y consulta fijos a la derecha                                          |
| Marquees (reseñas y galería)             | animación CSS                     | motor propio (requestAnimationFrame): flechas y swipe avanzan una tarjeta; las dos filas de la galería son clickeables siempre (antes la copia del loop tenía `inert`)        |
| Navegación entre páginas                 | corte seco                        | fundido sutil con View Transitions (sale 160 ms, entra 380 ms con leve subida); header y WhatsApp quedan fijos                                                                |
