import { getTranslations } from 'next-intl/server'
import { waUrl } from '@/data/site'
import { WhatsAppIcon } from '@/components/icons'

export async function WhatsAppFab({ message }: { message?: string }) {
  const c = await getTranslations('Common')
  return (
    <a
      href={waUrl(message ?? c('waHello'))}
      target="_blank"
      rel="noopener"
      aria-label={c('whatsappLabel')}
      className="bg-wa fixed right-6 bottom-6 z-70 flex h-[70px] w-[70px] items-center justify-center rounded-full text-white shadow-[0_8px_22px_rgba(11,40,54,.32)] transition-transform duration-200 hover:scale-[1.07] hover:text-white max-[480px]:right-5 max-[480px]:bottom-5 max-[480px]:h-16 max-[480px]:w-16"
      data-track="whatsapp_click"
      data-track-location="fab"
    >
      <WhatsAppIcon size={36} />
    </a>
  )
}
