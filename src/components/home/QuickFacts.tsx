import { getTranslations } from 'next-intl/server'
import { BuildingIcon, CarIcon, GuestsIcon, LockerIcon, WifiIcon } from '@/components/icons/animated'

export async function QuickFacts() {
  const t = await getTranslations('Facts')
  const facts = [
    { icon: <BuildingIcon />, title: t('apartmentsTitle'), text: t('apartmentsText') },
    { icon: <WifiIcon />, title: t('wifiTitle'), text: t('wifiText') },
    { icon: <CarIcon />, title: t('parkingTitle'), text: t('parkingText') },
    { icon: <LockerIcon />, title: t('lockersTitle'), text: t('lockersText') },
    { icon: <GuestsIcon />, title: t('guestsTitle'), text: t('guestsText') },
  ]
  return (
    <section aria-labelledby="facts-title" data-section="datos" className="border-ink/7 border-b bg-white">
      <h2 id="facts-title" className="sr-only">
        {t('heading')}
      </h2>
      <ul className="wrap-wide m-0 flex list-none flex-wrap justify-center gap-x-[clamp(18px,2.5vw,28px)] gap-y-[clamp(22px,3vw,36px)] py-[clamp(26px,4vw,40px)]">
        {facts.map((f) => (
          <li key={f.title} className="flex min-w-0 flex-[0_1_230px] items-center gap-3.5">
            {f.icon}
            <div>
              <p className="font-display text-ink m-0 text-[21px] leading-[1.2]">{f.title}</p>
              <p className="text-slate mt-1 mb-0 text-[15.5px] leading-[1.45]">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
