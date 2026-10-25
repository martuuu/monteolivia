import type { Metadata } from 'next'
import { Archivo, Marcellus } from 'next/font/google'
import { NotFoundView } from '@/components/layout/NotFoundView'
import '@/styles/globals.css'

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})
const archivo = Archivo({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Página no encontrada · Monte Olivia Suites',
  robots: { index: false },
}

/** URLs que no matchean ninguna ruta (p. ej. /algo.php): 404 del diseño en español. */
export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${marcellus.variable} ${archivo.variable}`}>
      <body>
        <NotFoundView locale="es" />
      </body>
    </html>
  )
}
