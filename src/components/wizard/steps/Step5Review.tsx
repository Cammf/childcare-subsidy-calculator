'use client';
// =============================================================================
// STEP 5 — Review & Calculate
// =============================================================================
// The final step before results. Shows a structured summary of everything the
// user entered across Steps 1–4, with an [Edit] link on each section so they
// can fix anything without re-entering all fields.
//
// Shows a live CCS% preview from the calculation engine — giving users a
// meaningful teaser before the full results display.
//
// On "Calculate My Childcare Cost", encodes all inputs into URL search params
// and navigates to /childcare-subsidy-calculator/results (Phase 4).
// =============================================================================

import { useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/contexts/WizardContext';
import {
  calculateCCSPercentage,
  calculateHigherCCSPercentage,
} from '@/lib/ccsCalculations';
import { isEligibleForHigherRate, INCOME_RANGE_LABELS } from '@/lib/resolveInputs';
import { formatDollars } from '@/lib/format';
import type { CareType, CCSRates, State } from '@/lib/types';

// Import rates data for the live CCS preview
import ccsRatesJson from '@/data/ccs/current.json';
const ccsRates = ccsRatesJson as unknown as CCSRates;

// ─── Label maps ─────────────────────────────────────────────────────────────

const CARE_TYPE_LABELS: Record<CareType, string> = {
  centre_based_day_care: 'Centre-based day care',
  family_day_care: 'Family day care',
  outside_school_hours: 'Outside school hours care (OSHC)',
  in_home_care: 'In-home care',
};

const STATE_NAMES: Record<State, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  SA: 'South Australia',
  WA: 'Western Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
};

// ─── Review section shell ────────────────────────────────────────────────────

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-main">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          aria-label={`Edit ${title}`}
        >
          Edit
          <svg
            className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted flex-shrink-0">{label}</dt>
      <dd className="font-medium text-text-main text-right">{value}</dd>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Step5Review() {
  const router = useRouter();
  const { state, goToStep, prevStep } = useWizard();
  const { inputs, incomeRange, exactIncome, relationshipStatus } = state;

  // ── Live CCS% preview (runs the real calculation engine) ──────────────────
  const ccsPreview = useMemo(() => {
    const result = calculateCCSPercentage(inputs.combinedAnnualIncome, ccsRates);
    const eligible = isEligibleForHigherRate(
      inputs.numberOfChildren,
      inputs.youngestChildAge
    );
    const higher = eligible
      ? calculateHigherCCSPercentage(result.percent, ccsRates)
      : null;
    return { standard: result.percent, higher, eligible };
  }, [
    inputs.combinedAnnualIncome,
    inputs.numberOfChildren,
    inputs.youngestChildAge,
  ]);

  // ── Display helpers ────────────────────────────────────────────────────────
  const incomeDisplay =
    exactIncome !== null
      ? `${formatDollars(exactIncome)}/year (exact)`
      : `${INCOME_RANGE_LABELS[incomeRange]} (range)`;

  const feeDisplay = inputs.useStateAverage
    ? `${inputs.state} state average`
    : inputs.feePerDay !== null
      ? `${formatDollars(inputs.feePerDay)}/day`
      : 'State average';

  const childrenLabel =
    inputs.numberOfChildren === 1 ? '1 child' : `${inputs.numberOfChildren} children`;

  // ── Navigate to results page ───────────────────────────────────────────────
  // All inputs are encoded as URL search params so the results page can decode
  // and recalculate without needing shared React state across routes.
  function handleCalculate() {
    const params = new URLSearchParams({
      n:   String(inputs.numberOfChildren),
      ya:  inputs.youngestChildAge,
      i:   String(inputs.combinedAnnualIncome),
      ir:  incomeRange,
      // ei = exact income, empty if user selected a range bucket (not exact)
      ei:  exactIncome !== null ? String(exactIncome) : '',
      ct:  inputs.careType,
      st:  inputs.state,
      d:   String(inputs.daysPerWeek),
      h:   String(inputs.hoursPerDay),
      f:   inputs.feePerDay !== null ? String(inputs.feePerDay) : '',
      sa:  inputs.useStateAverage ? '1' : '0',
      btw: inputs.includeBackToWork ? '1' : '0',
      ci:  String(inputs.currentAnnualIncome),
      pi:  String(inputs.proposedAnnualIncome),
      wc:  String(inputs.workRelatedCostsPerWeek),
      rs:  relationshipStatus,
    });
    router.push(`/childcare-subsidy-calculator/results?${params.toString()}`);
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* Heading */}
      <div>
        <h2 className="text-base font-semibold text-text-main mb-1">
          Review your answers
        </h2>
        <p className="text-sm text-muted">
          Everything look right? Click{' '}
          <strong>Edit</strong> on any section to make changes, then calculate
          when you&apos;re ready.
        </p>
      </div>

      {/* ── Section 1: Family Situation ──────────────────────────────────── */}
      <ReviewSection title="Family Situation" onEdit={() => goToStep(1)}>
        <ReviewRow label="Children in care" value={childrenLabel} />
        <ReviewRow
          label="Youngest child's age"
          value={inputs.youngestChildAge === 'under_6' ? 'Under 6 years' : '6 to 13 years'}
        />
        <ReviewRow label="State / Territory" value={STATE_NAMES[inputs.state]} />
        <ReviewRow
          label="Family status"
          value={relationshipStatus === 'single' ? 'Single parent' : 'Partnered'}
        />
        {ccsPreview.eligible && (
          <div className="mt-1 px-3 py-2 bg-teal-50 rounded-lg text-xs text-primary font-medium">
            ✓ Higher CCS rate applies for younger children (up to 95%)
          </div>
        )}
      </ReviewSection>

      {/* ── Section 2: Income ────────────────────────────────────────────── */}
      <ReviewSection title="Income" onEdit={() => goToStep(2)}>
        <ReviewRow
          label={relationshipStatus === 'single' ? 'Your income' : 'Combined income'}
          value={incomeDisplay}
        />
      </ReviewSection>

      {/* ── Section 3: Childcare Details ─────────────────────────────────── */}
      <ReviewSection title="Childcare Details" onEdit={() => goToStep(3)}>
        <ReviewRow label="Care type" value={CARE_TYPE_LABELS[inputs.careType]} />
        <ReviewRow
          label="Days per week"
          value={`${inputs.daysPerWeek} ${inputs.daysPerWeek === 1 ? 'day' : 'days'}`}
        />
        <ReviewRow label="Daily fee" value={feeDisplay} />
      </ReviewSection>

      {/* ── Section 4: Work Situation ─────────────────────────────────────── */}
      <ReviewSection title="Work Situation" onEdit={() => goToStep(4)}>
        {inputs.includeBackToWork ? (
          <>
            <ReviewRow
              label="Current income"
              value={
                inputs.currentAnnualIncome > 0
                  ? `${formatDollars(inputs.currentAnnualIncome)}/year`
                  : 'Not currently working'
              }
            />
            <ReviewRow
              label="Proposed FTE salary"
              value={`${formatDollars(inputs.proposedAnnualIncome)}/year`}
            />
            <ReviewRow
              label="Weekly work costs"
              value={
                inputs.workRelatedCostsPerWeek > 0
                  ? `${formatDollars(inputs.workRelatedCostsPerWeek)}/week`
                  : 'None ($0)'
              }
            />
          </>
        ) : (
          <ReviewRow
            label="Analysis type"
            value="Childcare costs only"
          />
        )}
      </ReviewSection>

      {/* ── CCS rate preview card ─────────────────────────────────────────── */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">
          Your estimated CCS rate
        </p>
        <div className="flex items-end gap-8 flex-wrap">
          <div>
            <p className="text-4xl font-bold text-primary leading-none">
              {ccsPreview.standard}%
            </p>
            <p className="text-xs text-muted mt-1.5">
              {ccsPreview.eligible ? 'Eldest child — standard rate' : 'Your CCS subsidy rate'}
            </p>
          </div>
          {ccsPreview.eligible && ccsPreview.higher && (
            <div>
              <p className="text-4xl font-bold leading-none" style={{ color: '#065F46' }}>
                {ccsPreview.higher.higherPercent}%
              </p>
              <p className="text-xs text-muted mt-1.5">
                Younger {inputs.numberOfChildren > 2 ? 'children' : 'child'} — higher rate
                {ccsPreview.higher.wasCapped && ' (capped at 95%)'}
              </p>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs text-muted leading-relaxed">
          Full results include your gap fee, annual out-of-pocket cost, fortnightly
          breakdown
          {inputs.includeBackToWork
            ? ', back-to-work net benefit analysis,'
            : ','}
          {' '}and income sensitivity table.
        </p>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-text-main transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <button
          type="button"
          onClick={handleCalculate}
          className="btn-primary flex items-center gap-2 text-base px-7 py-3"
        >
          Calculate My Childcare Cost
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
