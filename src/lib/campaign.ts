/**
 * Links cortos para poner en redes con UTM (atribución en GA4 aunque el navegador in-app no envíe referrer).
 *   monteoliviasuites.com.ar/ig      → bio de Instagram
 *   monteoliviasuites.com.ar/fb      → página de Facebook
 *   monteoliviasuites.com.ar/airbnb  → perfil/anuncios de Airbnb
 *   monteoliviasuites.com.ar/wa      → estados/mensajes de WhatsApp
 */
export const campaigns = {
  ig: { utm_source: 'instagram', utm_medium: 'social', utm_campaign: 'bio' },
  fb: { utm_source: 'facebook', utm_medium: 'social', utm_campaign: 'page' },
  airbnb: { utm_source: 'airbnb', utm_medium: 'referral', utm_campaign: 'profile' },
  wa: { utm_source: 'whatsapp', utm_medium: 'social', utm_campaign: 'status' },
} as const

export function campaignRedirect(request: Request, key: keyof typeof campaigns) {
  const incoming = new URL(request.url)
  const target = new URL(incoming.searchParams.get('to') === 'en' ? '/en' : '/', incoming)
  for (const [k, v] of Object.entries(campaigns[key])) target.searchParams.set(k, v)
  // utm_content opcional: /ig?c=historia-julio
  const content = incoming.searchParams.get('c')
  if (content) target.searchParams.set('utm_content', content.slice(0, 60))
  return Response.redirect(target, 302)
}
