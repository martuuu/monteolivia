import { campaignRedirect } from '@/lib/campaign'

export function GET(request: Request) {
  return campaignRedirect(request, 'ig')
}
