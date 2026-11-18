import type { Metadata } from 'next'
import LegalDoc from '@/components/LegalDoc'
import { TERMS_SECTIONS } from '@/lib/legal'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern access to and use of the VoltSage website, assessment tools and subscriptions.',
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return <LegalDoc title="Terms of Service" sections={TERMS_SECTIONS} current="/terms" />
}
