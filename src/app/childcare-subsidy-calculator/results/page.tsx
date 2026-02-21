// =============================================================================
// RESULTS PAGE — Childcare Subsidy Calculator
// =============================================================================
// Server component: decodes URL search params, assembles WizardInputs, runs
// the full calculation suite via runCalculations(), then renders the page
// header and passes CalculationOutput to the ResultsClient client component.
//
// URL param key reference (compact form to keep URLs short):
//   n   numberOfChildren        number
//   ya  youngestChildAge        'under_6' | '6_to_13'
//   i   combinedAnnualIncome    number
//   ir  incomeRange             IncomeRange string (display only)
//   ct  careType                CareType string
//   st  state                   State string
//   d   daysPerWeek             number
//   h   hoursPerDay             number
//   f   feePerDay               number | '' (empty = use state average)
//   sa  useStateAverage         '1' | '0'
//   btw includeBackToWork       '1' | '0'
//   ci  currentAnnualIncome     number
//   pi  proposedAnnualIncome    number
//   wc  workRelatedCostsPerWeek number
//   rs  relationshipStatus      'single' | 'partnered' (display only)
// =============================================================================

import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { runCalculations } from '@/lib/runCalculations';
import { formatDollars } from '@/lib/format';
import type { CCSRates, TaxRates, StateAverageEntry, CareType, State, WizardInputs } from '@/lib/types';
import ResultsClient from './ResultsClient';

// ─── Data imports ─────────────────────────────────────────────────────────────

import ccsRatesJson      from '@/data/ccs/current.json';
import taxRatesJson      from '@/data/tax/current.json';
import stateAveragesJson from '@/data/childcare-costs/state-averages.json';

const ccsRates: CCSRates                 = ccsRatesJson      as unknown as CCSRates;
const taxRates: TaxRates                 = taxRatesJson      as unknown as TaxRates;
const stateAverages: StateAverageEntry[] = stateAveragesJson as unknown as StateAverageEntry[];

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Your CCS Results | ${SITE_NAME}`,
  description:
    'Your personalised Child Care Subsidy estimate for FY 2025–26 — gap fee, annual out-of-pocket cost, fortnightly breakdown and more.',
  alternates: {
    canonical: `${SITE_URL}/childcare-subsidy-calculator/results`,
  },
  robots: { index: false }, // results pages are params-based; not indexed
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

export default function ResultsPage({ searchParams }: PageProps) {
  // ── Decode URL params ─────────────────────────────────────────────────────
  const p = searchParams as Record<string, string | undefined>;

  const numberOfChildren        = parseNum(p.n,  1);
  const youngestChildAge        = (p.ya === '6_to_13' ? '6_to_13' : 'under_6') as WizardInputs['youngestChildAge'];
  const combinedAnnualIncome    = parseNum(p.i,  60000);
  const careType                = (p.ct ?? 'centre_based_day_care') as CareType;
  const state                   = (p.st ?? 'NSW') as State;
  const daysPerWeek             = parseNum(p.d,  3);
  const hoursPerDay             = parseNum(p.h,  10);
  const feePerDay               = (p.f && p.f !== '') ? parseNum(p.f, 0) : null;
  const useStateAverage         = parseBool(p.sa);
  const includeBackToWork       = parseBool(p.btw);
  const currentAnnualIncome     = parseNum(p.ci, 0);
  const proposedAnnualIncome    = parseNum(p.pi, 0);
  const workRelatedCostsPerWeek = parseNum(p.wc, 0);
  const relationshipStatus      = (p.rs === 'single' ? 'single' : 'partnered') as 'single' | 'partnered';

  // ── Assemble WizardInputs ─────────────────────────────────────────────────
  const inputs: WizardInputs = {
    numberOfChildren,
    youngestChildAge,
    combinedAnnualIncome,
    careType,
    state,
    daysPerWeek,
    hoursPerDay,
    feePerDay,
    useStateAverage,
    includeBackToWork,
    currentAnnualIncome,
    proposedAnnualIncome,
    workRelatedCostsPerWeek,
  };

  // ── Run full calculation suite ────────────────────────────────────────────
  const output = runCalculations(inputs, ccsRates, taxRates, stateAverages);

  // ── Build restore URL for "Edit answers" links ────────────────────────────
  // Passes all original URL params back to the wizard page with restore=1 and
  // step=5 so the user lands on the Review step with all answers pre-filled.
  const restoreParams = new URLSearchParams();
  restoreParams.set('restore', '1');
  restoreParams.set('step', '5');
  // Forward all original input params (including ir, ei if set by Step5Review)
  const INPUT_PARAM_KEYS = ['n','ya','i','ir','ei','ct','st','d','h','f','sa','btw','ci','pi','wc','rs'] as const;
  for (const key of INPUT_PARAM_KEYS) {
    if (p[key] !== undefined) restoreParams.set(key, p[key]!);
  }
  const restoreUrl = `/childcare-subsidy-calculator?${restoreParams.toString()}`;

  // ── Page header display helpers ───────────────────────────────────────────
  const incomeLabel = formatDollars(combinedAnnualIncome);
  const rateLabel   = output.higherCCS
    ? `${output.ccsPercentage.percent}% / ${output.higherCCS.higherPercent}%`
    : `${output.ccsPercentage.percent}%`;

  return (
    <main className="min-h-screen bg-background">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs text-primary font-medium mb-1">
            CCS rate: {rateLabel} · FY {output.ratesVersion}
          </p>
          <h1 className="text-2xl font-bold text-text-main sm:text-3xl">
            Your CCS Results
          </h1>
          <p className="mt-1 text-base text-muted">
            Based on{' '}
            {relationshipStatus === 'single' ? 'your' : 'combined family'} income of{' '}
            {incomeLabel}/year
          </p>
        </div>
      </div>

      {/* ── Results panels (client component) ───────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <ResultsClient
          output={output}
          relationshipStatus={relationshipStatus}
          restoreUrl={restoreUrl}
        />
      </div>
    </main>
  );
}
