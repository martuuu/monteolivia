# Cambios de copy respecto del diseño aprobado

El copy del diseño se mantuvo. Se agregaron **datos verificados del sitio anterior** (monteoliviasuites.com.ar, Joomla) y se reemplazaron placeholders. Todo está en `messages/*.json` y `src/data/*`; cada fila indica dónde editar.

**Para validar con el cliente.** Marcar ✅ / ✏️ en la última columna.

## Datos agregados

| Dónde | Diseño | Ahora | Fuente | Archivo | OK |
|---|---|---|---|---|---|
| Comodidades (cada depto) | Wi-Fi, TV, calefacción, vajilla, ropa blanca, estacionamiento | + Smart TV, lavasecarropas y lavavajillas, cafetera Nespresso con cápsulas, limpieza y cambio de ropa blanca cada 3 días, caja de seguridad y cortinas black-out, locker con llave para esquís y valijas | Fichas de cada depto del sitio anterior | `src/data/apartments.ts` → `commonAmenities` | |
| Línea de amenities (home) | "Wi-Fi libre · Cocina equipada · TV · …" | + Smart TV y lavasecarropas | idem | `messages/*.json` → `HomeApartments.amenityLine` | |
| Camas (nuevo bloque) | — | D1/D2: 1 King + 2 de plaza y media + sofá cama · D3: King + sofá cama Queen · D4: King + 2 de plaza y media · D5: King | Fichas del sitio anterior | `apartments.ts` → `beds` | |
| D1 / D2 párrafo 2 | "cama matrimonial … dos camas individuales" | "cama King … dos camas de plaza y media" | idem | `apartments.ts` → `p2` | |
| D3 y D4 | sin balcón | "Gran balcón con vista" (comodidad + ambiente + texto) | idem | `apartments.ts` | |
| D5 "Bueno saber" (nuevo) | — | "Está en el 4° piso: el ascensor llega hasta el 3° y sigue un tramo corto de escalera. Te ayudamos con el equipaje." | Ficha D5 + reseña de huésped | `apartments.ts` → `notes` | |
| D5 ambientes | "Ambiente integrado" | "Monoambiente · barra desayunadora · cama King" | Ficha D5 | `apartments.ts` | |
| Ubicación (bullets) | "A minutos del centro y del puerto" | "A 200 m: supermercados, rotiserías y parada de taxis" + "A 20 minutos a pie del centro y del puerto" | Home del sitio anterior | `messages/*.json` → `Location.b2`, `b3` | |
| Tarifas (nota al pie) | — | "Para residentes argentinos, los valores se cobran en pesos según la cotización del día del Banco Nación." | Página Tarifas del sitio anterior | `Rates.residents` | |
| Excursiones | 4 cards | 8 cards: + Glaciar Martial, Actividades de invierno, City tour, Lagos Escondido y Fagnano | Página Excursiones del sitio anterior | `src/data/tours.ts` | |
| Reseñas | 12 de muestra, inventadas, con estrellas | 21 reales (2019–2023), en su idioma original, sin estrellas (no tenían puntaje) | Página Comentarios del sitio anterior (58 en total en `reviews-archive.json`) | `src/data/reviews.ts` | |
| Redes | instagram.com / airbnb.com genéricos, Facebook "#" | @monteoliviasuites, facebook.com/MonteOliviaSuites, perfil de Airbnb del anfitrión | Sitio anterior | `src/data/site.ts` | |
| Botón Airbnb por depto | Airbnb genérico | Anuncio propio de D1, D4 y D5; D2 y D3 van al perfil (faltan sus links) | Búsqueda en Airbnb | `apartments.ts` → `airbnbUrl` | |

## Textos de interfaz nuevos (no estaban en el diseño)

| Texto | Dónde |
|---|---|
| "Reseñas reales de huéspedes, en su idioma original." (reemplaza la nota "Reseñas de muestra…") | Huéspedes |
| Campo "Email (opcional, no se publica)" en el modal de reseña | Modal |
| "Tocá una foto para verla en grande." (se quitó "Los recuadros punteados esperan fotos reales…") | Galería |
| "Ir a un departamento" + atajos "Departamento N · Hasta X huéspedes" | Departamentos |
| "Ver las N fotos", "Camas", "Bueno saber", breadcrumb, "Departamento anterior/siguiente" | Departamentos y fichas |
| "La salida tiene que ser posterior a la llegada." | Formularios |
| Línea "Noches: N" en el mensaje de WhatsApp/email | Mensaje armado |

## Metadata SEO (títulos y descripciones)

En `messages/*.json` → `Meta`. Orientados a "departamentos en Ushuaia", "alquiler temporario Ushuaia", "apartments in Ushuaia".

## A confirmar con el cliente

- Distancias de excursiones del diseño ("Puerto a 5 min", "Parque Nacional 12 km · 20 min", "Tren 8 km · 15 min", "Laguna Esmeralda 18 km · 25 min").
- Textos nuevos de excursiones (Glaciar Martial, invierno, city tour, lagos).
- Que la limpieza cada 3 días y el resto del equipamiento siguen vigentes.
- Qué reseñas publicar (se eligieron las más cortas y recientes).
