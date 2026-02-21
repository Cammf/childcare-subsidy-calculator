'use client';
// =============================================================================
// STEP 2 — Income
// =============================================================================
// Collects: combined family income (range bucket OR exact amount).
//
// Why range-first?
//   Many users don't know their exact combined income. A range bucket gives
//   a useful estimate, while the optional exact input improves precision for
//   users near a CCS threshold boundary.
//
// The income drives: CCS percentage (the single biggest lever on subsidy).
//
// The income-selection UI is handled by <IncomeRangeSelector> — a reusable
// component that owns the RadioCards, exact-input toggle, and live chip.
// =============================================================================

import InfoTooltip from '@/components/wizard/InfoTooltip';
import StepAside from '@/components/wizard/StepAside';
import IncomeRangeSelector from '@/components/wizard/IncomeRangeSelector';
import { useWizard } from '@/contexts/WizardContext';
import type { IncomeRange } from '@/lib/resolveInputs';

export default function Step2Income() {
  const { state, setIncomeRange, nextStep, prevStep } = useWizard();
  const { incomeRange, exactIncome, relationshipStatus } = state;

  const incomeLabel =
    relationshipStatus === 'single'
      ? 'Your annual income'
      : 'Combined family income';

  function handleChange(range: IncomeRange, exact: number | null) {
    setIncomeRange(range, exact);
  }

  return (
    <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8">
      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="space-y-6">

        {/* Heading */}
        <div>
          <h2 className="text-base font-semibold text-text-main mb-1">
            {incomeLabel}
          </h2>
          <p className="text-sm text-muted">
            Select the range that best matches your{' '}
            {relationshipStatus === 'single' ? 'taxable income' : 'combined taxable income'}.
            This is the most important factor in calculating your CCS.
          </p>
        </div>

        {/* Income range selector (RadioCards + exact input toggle + live chip) */}
        <IncomeRangeSelector
          incomeRange={incomeRange}
          exactIncome={exactIncome}
          onChange={handleChange}
          incomeLabel={incomeLabel}
        />

        {/* InfoTooltip: what counts as income */}
        <InfoTooltip trigger="What counts as combined family income?">
          <p className="mb-2">
            Combined family income is the total <strong>taxable income</strong> for
            you and your partner (if partnered) for the financial year.
          </p>
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>Wages and salaries</li>
            <li>Investment income (rent, dividends, interest)</li>
            <li>Business income</li>
            <li>Taxable Centrelink payments</li>
            <li>Superannuation contributions above cap (in some cases)</li>
          </ul>
          <p className="mt-2">
            It does <strong>not</strong> include the Family Tax Benefit, CCS itself,
            or tax-free government payments.
          </p>
          <p className="mt-2 text-xs text-muted">
            Tip: Use your most recent tax return as a guide. You can update your
            income estimate on myGov if it changes during the year.
          </p>
        </InfoTooltip>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 text-sm font-medium text-muted hover:text-text-main transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="btn-primary flex items-center gap-2"
          >
            Next: Childcare Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Aside ──────────────────────────────────────────────────────── */}
      <StepAside title="How income affects your subsidy">
        <p>
          Your CCS rate is calculated using your{' '}
          <strong>combined family taxable income</strong>.
        </p>
        <div className="mt-3 space-y-1.5">
          {[
            { label: 'Under $85,279', rate: '90% (maximum)' },
            { label: '$85,280 – $120,000', rate: '87–89%' },
            { label: '$120,001 – $160,000', rate: '80–87%' },
            { label: '$160,001 – $220,000', rate: '72–80%' },
            { label: 'Over $220,000', rate: 'tapering to 0%' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs gap-2">
              <span className="text-muted">{row.label}</span>
              <span className="font-medium text-text-main whitespace-nowrap">{row.rate}</span>
            </div>
          ))}
        </div>
        <p className="mt-3">
          For every <strong>$5,000</strong> above $85,279, your rate reduces by{' '}
          <strong>1 percentage point</strong>.
        </p>
        <p className="mt-2 text-xs text-muted">
          Subsidy reaches 0% at $535,279 combined income.
        </p>
      </StepAside>
    </div>
  );
}
