import Image, { type ImageProps } from 'next/image'
import { imageManifest, type ImageId } from '@/data/image-manifest'

type Props = Omit<ImageProps, 'src' | 'width' | 'height' | 'placeholder' | 'blurDataURL' | 'alt'> & {
  id: ImageId
  alt: string
  /** fill = ocupa el contenedor (posicionado) con object-cover */
  fill?: boolean
  blur?: boolean
}

/** next/image alimentado por el manifest generado (dimensiones reales + placeholder blur). */
export function Photo({ id, alt, fill, blur = true, className, ...rest }: Props) {
  const a = imageManifest[id]
  const common = {
    src: a.src,
    placeholder: blur ? ('blur' as const) : ('empty' as const),
    blurDataURL: a.blurDataURL,
    ...rest,
  }
  if (fill) return <Image {...common} alt={alt} fill className={className ?? 'object-cover'} />
  return <Image {...common} alt={alt} width={a.width} height={a.height} className={className} />
}

export const imageSrc = (id: ImageId) => imageManifest[id]
