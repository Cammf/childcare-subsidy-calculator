// =============================================================================
// INCOME SENSITIVITY CALCULATOR — Page Route
// =============================================================================
// Shows how CCS% and out-of-pocket childcare costs change across the full
// income spectrum ($40k–$600k). Fully client-side interactive — no URL params.
//
// Architecture:
//   - Server component (this file): metadata, JSON-LD, renders client wrapper
//   - IncomeSensitivityClient: all interactive state, calculations, and display
// =============================================================================

import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import IncomeSensitivityClient from '@/components/income-sensitivity/IncomeSensitivityClient';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Income Sensitivity Calculator — How Income Affects Childcare Costs | ${SITE_NAME}`,
  description:
    'See how your out-of-pocket childcare costs change at every income level from $40,000 to $600,000. Find your sweet spot, identify pain points, and understand the CCS taper rate in real dollars.',
  alternates: { canonical: `${SITE_URL}/income-sensitivity-calculator` },
  openGraph: {
    title: 'Income Sensitivity Calculator \u2014 Childcare Cost vs Income',
    description:
      'Interactive table showing CCS% and out-of-pocket childcare costs at every $5,000 income increment. Find your pain points and sweet spots.',
    url: `${SITE_URL}/income-sensitivity-calculator`,
    type: 'website',
  },
};

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Income Sensitivity Calculator' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Childcare Income Sensitivity Calculator',
  description:
    'See how CCS% and out-of-pocket childcare costs change across the full income spectrum from $40,000 to $600,000.',
  url: `${SITE_URL}/income-sensitivity-calculator`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IncomeSensitivityCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-background">
        {/* Page header */}
        <div className="bg-primary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-1 text-sm text-teal-200">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li aria-hidden="true" className="text-teal-300">›</li>
                <li className="text-white font-medium" aria-current="page">Income Sensitivity Calculator</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold text-teal-200 uppercase tracking-wide mb-2">
              FY 2025–26 rates
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Income Sensitivity Calculator
            </h1>
            <p className="text-teal-100 text-base sm:text-lg leading-relaxed max-w-2xl">
              See exactly how your childcare costs change at every income level — from $40,000
              to $600,000. Enter your care details below to find your sweet spots and pain points.
            </p>
          </div>
        </div>

        {/* Client component handles all interactivity */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <IncomeSensitivityClient />
        </div>
      </main>
    </>
  );
}
