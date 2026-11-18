import type { Metadata } from 'next'
import LegalDoc from '@/components/LegalDoc'
import { FAIR_USE_INTRO, FAIR_USE_SECTIONS } from '@/lib/legal'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Fair Use & Subscription Access Policy',
  description: 'How VoltSage subscriptions, user seats and platform resources may be used.',
  alternates: { canonical: `${SITE_URL}/fair-use` },
}

export default function FairUsePage() {
  return <LegalDoc title="Fair Use & Subscription Access Policy" intro={FAIR_USE_INTRO} sections={FAIR_USE_SECTIONS} current="/fair-use" />
}
