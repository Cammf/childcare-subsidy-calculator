// =============================================================================
// BACK-TO-WORK CALCULATOR — Page Route
// =============================================================================
// Server component: sets metadata, reads optional pre-fill URL params
// (from the main CCS calculator or direct link), and renders the BTWWizard.
//
// Supports pre-fill URL params using the same encoding as the CCS calculator:
//   rs  relationshipStatus   'single' | 'partnered'
//   ya  youngestChildAge     'under_6' | '6_to_13'
//   i   combinedAnnualIncome number
//   ir  incomeRange          IncomeRange label
//   ei  exactIncome          number | ''
//   ct  careType             CareType
//   st  state                State abbreviation
//   d   daysPerWeek          number
//   h   hoursPerDay          number
//   f   feePerDay            number | ''
//   sa  useStateAverage      '1' | '0'
// =============================================================================

import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import {
  resolveIncome,
  DEFAULT_HOURS_PER_DAY,
  type IncomeRange,
} from '@/lib/resolveInputs';
import type { CareType, State } from '@/lib/types';
import BTWWizard from '@/components/btw/BTWWizard';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Back-to-Work Calculator 2025–26 | ${SITE_NAME}`,
  description:
    'Find out if going back to work is financially worth it. Calculate your true net benefit across 1–5 day working scenarios — after tax, reduced Child Care Subsidy, extra childcare days, and work costs.',
  alternates: {
    canonical: `${SITE_URL}/back-to-work-calculator`,
  },
  openGraph: {
    title: 'Back-to-Work Calculator — Is returning to work worth it?',
    description:
      'See your real take-home return for 1–5 day scenarios after tax, CCS reduction, and childcare costs.',
    url: `${SITE_URL}/back-to-work-calculator`,
    type: 'website',
  },
};

// ─── JSON-LD schema ──────────────────────────────────────────────────────────

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Back-to-Work Calculator' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Back-to-Work Calculator',
  description:
    "Calculate whether returning to work is financially worthwhile for Australian parents — accounting for tax, reduced Child Care Subsidy, and work costs.",
  url: `${SITE_URL}/back-to-work-calculator`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
};

// ─── Param parse helpers ──────────────────────────────────────────────────────

function parseNum(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

const VALID_INCOME_RANGES: IncomeRange[] = [
  'under_85279', '85280_120000', '120001_160000', '160001_220000', '220001_350000', 'over_350000',
];
const VALID_CARE_TYPES: CareType[] = [
  'centre_based_day_care', 'family_day_care', 'outside_school_hours', 'in_home_care',
];
const VALID_STATES: State[] = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function BackToWorkCalculatorPage({ searchParams }: PageProps) {
  const p = searchParams as Record<string, string | undefined>;

  // ── Optional pre-fill from CCS calculator or deep link ───────────────────
  // Any params present will override the wizard defaults. Missing params are
  // simply left as defaults — the user can fill them in the wizard.
  const hasPrefill = Boolean(p.i || p.ct || p.d || p.pi);

  let initialInputs: Record<string, unknown> | undefined;

  if (hasPrefill) {
    const incomeRange: IncomeRange = VALID_INCOME_RANGES.includes(p.ir as IncomeRange)
      ? (p.ir as IncomeRange) : 'under_85279';
    const exactIncome: number | null = (p.ei && p.ei !== '') ? Number(p.ei) : null;
    const careType: CareType = VALID_CARE_TYPES.includes(p.ct as CareType)
      ? (p.ct as CareType) : 'centre_based_day_care';
    const state: State = VALID_STATES.includes(p.st as State) ? (p.st as State) : 'NSW';
    const hoursPerDay = p.h ? parseNum(p.h, DEFAULT_HOURS_PER_DAY[careType]) : DEFAULT_HOURS_PER_DAY[careType];

    initialInputs = {
      ...(p.rs === 'single' || p.rs === 'partnered' ? { relationshipStatus: p.rs } : {}),
      ...(p.ya === 'under_6' || p.ya === '6_to_13' ? { youngestChildAge: p.ya } : {}),
      incomeRange,
      exactIncome,
      combinedAnnualIncome: p.i ? parseNum(p.i, 60000) : resolveIncome(incomeRange, exactIncome),
      careType,
      state,
      ...(p.d ? { daysPerWeek: parseNum(p.d, 3) } : {}),
      hoursPerDay,
      ...(p.f && p.f !== '' ? { feePerDay: parseNum(p.f, 0), useStateAverage: false } : {}),
      ...(p.sa === '0' ? { useStateAverage: false } : {}),
      ...(p.sa === '1' ? { useStateAverage: true } : {}),
    };
  }

  return (
    <>
      {/* Structured data */}
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
        <div className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-xs font-medium text-primary mb-1">
              FY 2025–26 rates · Takes about 3 minutes
            </p>
            <h1 className="text-2xl font-bold text-text-main sm:text-3xl">
              Back-to-Work Calculator
            </h1>
            <p className="mt-1 text-base text-muted">
              Find out the real financial impact of returning to work — after tax,
              reduced childcare subsidy, and extra costs.
            </p>
          </div>
        </div>

        {/* Wizard */}
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <BTWWizard initialInputs={initialInputs as Parameters<typeof BTWWizard>[0]['initialInputs']} />
        </div>
      </main>
    </>
  );
}
