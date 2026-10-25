# QA manual

Lo automatizado ya pasa (`npm run test:e2e`: 43 tests de rutas, 301, 404, SEO, GA, formularios, lightbox, axe, mobile). Esto es lo que necesita ojos y dedos reales. Marcar ✅ / ❌ con nota.

**Dispositivos:** iPhone (Safari), Android (Chrome), notebook (Chrome y Safari). Ideal: una persona mayor probando el celular.

## 1. Visual contra el diseño (desktop 1440 y mobile 390)

Abrir `design/Monte Olivia - Sitio v2.dc.html` y `Departamentos.dc.html` en el navegador al lado del sitio (`npm run dev`).

- [ ] Hero: zoom lento de la foto, botón de scroll animado, botones.
- [ ] Datos rápidos: los 5 íconos animados (ventanas que titilan, wifi, auto, ski, tercer huésped que aparece).
- [ ] Departamentos (home): carrusel cambia cada ~4 s, alternado izquierda/derecha, íconos de personas en ola.
- [ ] Huéspedes y galería: marquees continuos, se frenan con el mouse.
- [ ] Departamentos: mosaico se queda fijo al scrollear (desktop), zoom al pasar el mouse, lightbox crece desde la foto clickeada.
- [ ] 404 y mantenimiento (`/mantenimiento`): humo animado en la casita.
- [ ] Header se esconde al bajar y aparece al subir.

## 1.1 Cambios de la iteración 1.1

- [ ] Hero: "el fin del mundo" se tipea con cursor naranja; el resto entra suave. El botón redondo de abajo baja a "Datos rápidos".
- [ ] Datos rápidos en una sola fila en notebook; ícono de lockers nuevo (esquís que se balancean).
- [ ] Departamentos (home): foto y texto entran cada uno desde su lado al hacer scroll.
- [ ] Reseñas: estrellas visibles; el carrusel se frena con el mouse encima y sigue al salir.
- [ ] Galería: solo paisajes.
- [ ] Footer: logo blanco con sol y "SUITES" naranjas.
- [ ] /departamentos: selector de 1 a 5 siempre visible, se queda fijo al bajar y marca el departamento que estás mirando.
- [ ] Ficha: galería grande (desktop) / carrusel alto (mobile); en desktop la columna de precios y consulta acompaña el scroll.

## 2. Mobile (lo más importante para el cliente)

- [ ] Menú hamburguesa: abre, links grandes, cierra con ✕ y al tocar un link.
- [ ] Carrusel: se puede deslizar con el dedo y tocar los puntitos.
- [ ] Lightbox: swipe izquierda/derecha, flechas abajo, cerrar.
- [ ] Selector de departamentos (1 a 5) debajo del hero de `/departamentos`: entra completo y queda fijo al bajar.
- [ ] Selector de fechas nativo en el widget de cada departamento (iPhone y Android). La salida no deja elegir un día anterior a la llegada.
- [ ] Botón "WhatsApp" del widget abre WhatsApp con el mensaje armado (depto, fechas, noches, huéspedes).
- [ ] Botón flotante de WhatsApp no tapa nada importante.
- [ ] Textos legibles sin hacer zoom; ningún input hace zoom al tocarlo (iPhone).
- [ ] Marquee de reseñas: tocar lo frena / lo reanuda.

## 3. Formularios y salidas

- [ ] Reserva (home) → WhatsApp: mensaje con nombre, fechas dd/mm/aaaa, noches, huéspedes, depto, mensaje.
- [ ] Reserva → Email: abre el mail con asunto y cuerpo.
- [ ] "Dejar comentario": sin datos muestra error; con datos (con Resend configurado) llega el mail a `REVIEW_TO_EMAIL`; sin Resend abre el mail.
- [ ] "Cómo llegar" abre Google Maps en la dirección correcta.
- [ ] Instagram, Facebook y Airbnb abren los perfiles correctos. Airbnb de D1/D4/D5 abre su anuncio.

## 4. Idiomas

- [ ] ES ↔ EN en cada página lleva a la misma página en el otro idioma (también desde una ficha y desde una sección con #).
- [ ] Revisar el inglés completo (lo ideal: alguien nativo o con muy buen inglés).

## 5. Accesibilidad / público mayor

- [ ] Navegar la home solo con teclado (Tab): se ve siempre el foco, el menú y el lightbox se cierran con Esc.
- [ ] Con "Reducir movimiento" activado (iPhone: Accesibilidad → Movimiento): no hay animaciones, los marquees quedan quietos y se pueden deslizar.
- [ ] Zoom del navegador al 200 %: nada se superpone.
- [ ] VoiceOver (iPhone): anuncia "Departamento 1: Hasta 6 huéspedes", botones de fotos, formulario.

## 6. Analytics (con un GA de prueba o en preview con `NEXT_PUBLIC_GA_DEBUG=1`)

- [ ] GA4 DebugView recibe `page_view`, `section_view`, `section_time` (al pasar de sección), `whatsapp_click` con `location` y `apartment`, `booking_submit`, `lang_switch`, `lightbox_open`.
- [ ] Entrar por `/ig` → la sesión aparece como `instagram / social`.

## 7. Contenido (con el cliente)

- [ ] Precios y temporadas (`.docs/context.md`).
- [ ] Comodidades, camas, balcones, aviso de escalera del D5 (`.docs/copy-changes.md`).
- [ ] Fotos correctas en cada departamento.
- [ ] Reseñas elegidas.
- [ ] Pin del mapa en el edificio.
