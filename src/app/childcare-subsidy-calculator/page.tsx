// =============================================================================
// CHILDCARE SUBSIDY CALCULATOR — Page Route
// =============================================================================
// Server component: sets metadata, renders the wizard in its provider.
// All interactivity is inside the client component tree below.
// =============================================================================

import type { Metadata } from 'next';
import { WizardProvider, parseRestoreParams } from '@/contexts/WizardContext';
import WizardContainer from '@/components/wizard/WizardContainer';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Child Care Subsidy Calculator 2025–26 | ${SITE_NAME}`,
  description:
    'Calculate your Child Care Subsidy (CCS) amount for FY 2025–26. Enter your family income, care type, and daily fee to get an instant estimate of your subsidy, gap fee, and annual childcare costs.',
  alternates: {
    canonical: `${SITE_URL}/childcare-subsidy-calculator`,
  },
  openGraph: {
    title: 'Child Care Subsidy Calculator 2025–26',
    description:
      'Find out exactly how much CCS you receive — and what childcare will actually cost your family.',
    url: `${SITE_URL}/childcare-subsidy-calculator`,
    type: 'website',
  },
};

// ─── JSON-LD schema ──────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Child Care Subsidy Calculator',
  description:
    'Calculate your Australian Child Care Subsidy (CCS) entitlement for FY 2025–26.',
  url: `${SITE_URL}/childcare-subsidy-calculator`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ChildcareSubsidyCalculatorPage({ searchParams }: PageProps) {
  // ── Edit Answers restore flow ─────────────────────────────────────────────
  // When the user clicks "Edit answers" on the results page, they arrive here
  // with restore=1 in the URL params. We parse those params back into a
  // WizardState and pass it as initialState to the WizardProvider, so the
  // wizard opens pre-populated at the Review step (or whichever step was specified).
  const p = searchParams as Record<string, string | undefined>;
  const initialState = p.restore === '1' ? parseRestoreParams(p) : undefined;

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-text-main sm:text-3xl">
              Child Care Subsidy Calculator
            </h1>
            <p className="mt-1 text-base text-muted">
              {initialState
                ? 'Edit your answers below and recalculate when ready.'
                : 'FY 2025–26 rates · Takes about 2 minutes'}
            </p>
          </div>
        </div>

        {/* Wizard */}
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <WizardProvider initialState={initialState}>
            <WizardContainer />
          </WizardProvider>
        </div>
      </main>
    </>
  );
}
