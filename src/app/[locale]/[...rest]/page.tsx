import { notFound } from 'next/navigation'

/** Cualquier ruta desconocida dentro de un idioma → 404 del diseño ([locale]/not-found.tsx). */
export default function CatchAll() {
  notFound()
}
