import Image from 'next/image'
import type { ReactNode } from 'react'
import type { ImageId } from '@/data/image-manifest'
import type { Locale } from '@/i18n/routing'
import { Photo } from '@/components/ui/Photo'
import { LangSwitch } from './LangSwitch'

type Props = {
  locale: Locale
  image: ImageId
  imagePosition: string
  logoHref?: string
  langLabel: string
  switchTo: string
  children: ReactNode
}

/** Plantilla compartida por 404 y mantenimiento (design/extracted/404 y /mantenimiento). */
export function FullscreenMessage({
  locale,
  image,
  imagePosition,
  logoHref,
  langLabel,
  switchTo,
  children,
}: Props) {
  const logo = (
    <Image
      src="/images/brand/logo-tile.png"
      alt="Monte Olivia Suites"
      width={127}
      height={54}
      loading="eager"
      className="block h-[54px] w-auto rounded-[10px]"
    />
  )
  return (
    <main className="bg-ink relative flex min-h-svh flex-col overflow-hidden text-[18px] text-white">
      <div className="animate-mo-zoom-slow absolute inset-0">
        <Photo
          id={image}
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: imagePosition }}
          alt=""
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,27,38,.55)_0%,rgba(7,27,38,.35)_40%,rgba(7,27,38,.92)_100%)]" />
      <header className="relative z-2 flex items-center justify-between gap-4 px-[clamp(16px,4vw,40px)] py-[18px]">
        {logoHref ? (
          <a href={logoHref} className="flex">
            {logo}
          </a>
        ) : (
          logo
        )}
        <LangSwitch locale={locale} label={langLabel} switchTo={switchTo} variant="dark" />
      </header>
      <div className="relative z-2 mx-auto box-border flex w-full max-w-[1180px] flex-1 items-end px-[clamp(18px,5vw,64px)] pt-10 pb-[clamp(48px,9vh,96px)]">
        <div className="flex max-w-[720px] flex-col gap-[18px]">{children}</div>
      </div>
    </main>
  )
}

export const fsEyebrow = 'm-0 text-[15px] font-semibold uppercase tracking-[3px] text-orange'
export const fsTitle =
  'm-0 font-display text-[clamp(2.8rem,7vw,5rem)] font-normal leading-[1.05] text-balance [text-shadow:0_2px_24px_rgba(7,27,38,.6)]'
export const fsLead =
  'm-0 max-w-[54ch] text-[clamp(18px,2.2vw,20px)] leading-[1.65] text-pretty text-white/92 [text-shadow:0_1px_14px_rgba(7,27,38,.7)]'
