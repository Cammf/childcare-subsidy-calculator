// =============================================================================
// BTW RESULTS PAGE — Back-to-Work Calculator Results
// =============================================================================
// Server component: decodes URL search params, resolves daily fee, runs
// calculateBackToWork(), then renders the page header and passes the result
// to the BTWResultsClient client component.
//
// URL param key reference (matches BTWWizard handleCalculate output):
//   rs  relationshipStatus        'single' | 'partnered'
//   ya  youngestChildAge          'under_6' | '6_to_13'
//   i   combinedAnnualIncome      number
//   ir  incomeRange               IncomeRange string (display only)
//   ei  exactIncome               number | '' (display only)
//   ct  careType                  CareType string
//   st  state                     State abbreviation
//   d   daysPerWeek               number
//   h   hoursPerDay               number
//   f   feePerDay                 number | '' (empty = use state average)
//   sa  useStateAverage           '1' | '0'
//   ci  currentIndividualIncome   number
//   pi  proposedFTEIncome         number
//   wc  workRelatedCostsPerWeek   number
// =============================================================================

import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { calculateBackToWork } from '@/lib/backToWorkCalculations';
import { resolveDailyFee, resolveAgeGroup } from '@/lib/resolveInputs';
import { formatDollars } from '@/lib/format';
import type { CCSRates, TaxRates, StateAverageEntry, CareType, State } from '@/lib/types';
import BTWResultsClient from './BTWResultsClient';

// ─── Data imports ─────────────────────────────────────────────────────────────

import ccsRatesJson      from '@/data/ccs/current.json';
import taxRatesJson      from '@/data/tax/current.json';
import stateAveragesJson from '@/data/childcare-costs/state-averages.json';

const ccsRates: CCSRates                 = ccsRatesJson      as unknown as CCSRates;
const taxRates: TaxRates                 = taxRatesJson      as unknown as TaxRates;
const stateAverages: StateAverageEntry[] = stateAveragesJson as unknown as StateAverageEntry[];

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Your Back-to-Work Results | ${SITE_NAME}`,
  description:
    'Your personalised back-to-work financial analysis — net benefit across 1–5 day scenarios after tax, reduced CCS, extra childcare costs, and work expenses.',
  alternates: {
    canonical: `${SITE_URL}/back-to-work-calculator/results`,
  },
  robots: { index: false }, // results pages are params-based; not indexed
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CARE_TYPE_LABELS: Record<CareType, string> = {
  centre_based_day_care: 'Centre-based day care',
  family_day_care:       'Family day care',
  outside_school_hours:  'Outside school hours (OSHC)',
  in_home_care:          'In-home care',
};

// ─── Param parsing helpers ────────────────────────────────────────────────────

function parseNum(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseBool(v: string | undefined): boolean {
  return v === '1';
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function BTWResultsPage({ searchParams }: PageProps) {
  // ── Decode URL params ─────────────────────────────────────────────────────
  const p = searchParams as Record<string, string | undefined>;

  const relationshipStatus       = (p.rs === 'single' ? 'single' : 'partnered') as 'single' | 'partnered';
  const youngestChildAge         = (p.ya === '6_to_13' ? '6_to_13' : 'under_6') as 'under_6' | '6_to_13';
  const combinedAnnualIncome     = parseNum(p.i,  60000);
  const careType                 = (p.ct ?? 'centre_based_day_care') as CareType;
  const state                    = (p.st ?? 'NSW') as State;
  const daysPerWeek              = parseNum(p.d,  3);
  const hoursPerDay              = parseNum(p.h,  10);
  const feePerDayRaw             = (p.f && p.f !== '') ? parseNum(p.f, 0) : null;
  const useStateAverage          = parseBool(p.sa);
  const currentIndividualIncome  = parseNum(p.ci, 0);
  const proposedFTEIncome        = parseNum(p.pi, 0);
  const workRelatedCostsPerWeek  = parseNum(p.wc, 0);

  // ── Resolve daily fee ──────────────────────────────────────────────────────
  const dailyFee = resolveDailyFee(
    { feePerDay: feePerDayRaw, useStateAverage, state, careType },
    stateAverages
  );

  // ── Derive age group and display metadata ──────────────────────────────────
  const ageGroup      = resolveAgeGroup(youngestChildAge);
  const careTypeLabel = CARE_TYPE_LABELS[careType] ?? careType;
  const stateEntry    = stateAverages.find((e) => e.state === state);
  const stateName     = stateEntry?.stateName ?? state;
  const ratesVersion  = ccsRates.financialYear; // e.g. "2025-26"

  // ── Run calculation ────────────────────────────────────────────────────────
  const result = calculateBackToWork(
    {
      combinedAnnualIncome,
      currentIndividualIncome,
      proposedFTEIncome,
      workRelatedCostsPerWeek,
      currentDaysInCare: daysPerWeek,
      dailyFee,
      hoursPerDay,
      careType,
      ageGroup,
    },
    ccsRates,
    taxRates
  );

  // ── Build restore URL ──────────────────────────────────────────────────────
  // Sends the user back to the BTW wizard page with all inputs pre-filled.
  // The BTW wizard page reads initialInputs from URL params when any of the
  // key params are present (hasPrefill check in page.tsx).
  const restoreParams = new URLSearchParams();
  const INPUT_PARAM_KEYS = ['rs','ya','i','ir','ei','ct','st','d','h','f','sa','ci','pi','wc'] as const;
  for (const key of INPUT_PARAM_KEYS) {
    if (p[key] !== undefined) restoreParams.set(key, p[key]!);
  }
  const restoreUrl = `/back-to-work-calculator?${restoreParams.toString()}`;

  // ── Page header display helpers ────────────────────────────────────────────
  const incomeLabel = formatDollars(combinedAnnualIncome);
  const { bestScenario } = result;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs text-primary font-medium mb-1">
            {bestScenario
              ? `Best scenario: ${bestScenario.daysWorking} day${bestScenario.daysWorking === 1 ? '' : 's'}/week`
              : 'All scenarios negative'}{' '}
            · FY {ratesVersion}
          </p>
          <h1 className="text-2xl font-bold text-text-main sm:text-3xl">
            Your Back-to-Work Results
          </h1>
          <p className="mt-1 text-base text-muted">
            Based on{' '}
            {relationshipStatus === 'single' ? 'your' : 'combined family'} income of{' '}
            {incomeLabel}/year · {formatDollars(proposedFTEIncome)} FTE proposed salary
          </p>
        </div>
      </div>

      {/* ── Results panels (client component) ────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <BTWResultsClient
          result={result}
          fteIncome={proposedFTEIncome}
          combinedAnnualIncome={combinedAnnualIncome}
          currentIndividualIncome={currentIndividualIncome}
          workCostsPerWeek={workRelatedCostsPerWeek}
          careTypeLabel={careTypeLabel}
          daysPerWeek={daysPerWeek}
          dailyFee={dailyFee}
          usingStateAverage={useStateAverage}
          stateName={stateName}
          relationshipStatus={relationshipStatus}
          ratesVersion={ratesVersion}
          restoreUrl={restoreUrl}
        />
      </div>
    </main>
  );
}
