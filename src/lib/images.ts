import { imageManifest, type ImageId } from '@/data/image-manifest'
import type { LightboxItem } from '@/components/ui/Lightbox'

export function toItem(id: ImageId, alt: string, caption?: string): LightboxItem {
  const a = imageManifest[id]
  return { src: a.src, width: a.width, height: a.height, blurDataURL: a.blurDataURL, alt, caption }
}
