'use client';
// =============================================================================
// STEP 4 — Work Situation (Optional)
// =============================================================================
// The signature differentiator: "Is going back to work worth it financially?"
//
// This step is OPTIONAL. Many parents just want a subsidy estimate — they
// shouldn't be forced through a work-scenario step. So we open with a clear
// opt-in/opt-out choice.
//
// If opted in, we collect three inputs:
//   1. Current individual income (could be $0 if not working at all)
//   2. Proposed full-time salary (what the job offer or role pays)
//   3. Weekly work-related costs (transport, parking, meals, etc.)
//
// The calculation engine generates 1–5 day scenarios automatically from the
// FTE salary, so we don't need a day selector here — that's shown in results.
//
// Why this matters:
//   Returning to work increases family income → lowers CCS rate → increases
//   childcare costs. But you also earn more. The net benefit can be
//   surprisingly low (or even negative) once tax, CCS reduction, and work
//   costs are factored in. Many parents don't know this until they see the
//   numbers side-by-side. That's why this calculator exists.
// =============================================================================

import { useState } from 'react';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import StepAside from '@/components/wizard/StepAside';
import { useWizard } from '@/contexts/WizardContext';
import { formatDollars } from '@/lib/format';

export default function Step4WorkSituation() {
  const { state, updateInput, nextStep, prevStep } = useWizard();
  const { inputs, relationshipStatus } = state;

  // Whether the user wants back-to-work analysis
  const includeBackToWork = inputs.includeBackToWork;

  // Local string state for numeric inputs (so partial typing works naturally)
  const [currentIncomeStr, setCurrentIncomeStr] = useState<string>(
    inputs.currentAnnualIncome > 0 ? String(inputs.currentAnnualIncome) : ''
  );
  const [proposedIncomeStr, setProposedIncomeStr] = useState<string>(
    inputs.proposedAnnualIncome > 0 ? String(inputs.proposedAnnualIncome) : ''
  );
  const [workCostsStr, setWorkCostsStr] = useState<string>(
    inputs.workRelatedCostsPerWeek > 0
      ? String(inputs.workRelatedCostsPerWeek)
      : ''
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleOptIn() {
    updateInput({ includeBackToWork: true });
  }

  function handleOptOut() {
    updateInput({
      includeBackToWork: false,
      currentAnnualIncome: 0,
      proposedAnnualIncome: 0,
      workRelatedCostsPerWeek: 0,
    });
    setCurrentIncomeStr('');
    setProposedIncomeStr('');
    setWorkCostsStr('');
    nextStep();
  }

  function handleCurrentIncome(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCurrentIncomeStr(raw);
    updateInput({ currentAnnualIncome: raw === '' ? 0 : parseInt(raw, 10) });
  }

  function handleProposedIncome(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setProposedIncomeStr(raw);
    updateInput({ proposedAnnualIncome: raw === '' ? 0 : parseInt(raw, 10) });
  }

  function handleWorkCosts(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setWorkCostsStr(raw);
    updateInput({
      workRelatedCostsPerWeek: raw === '' ? 0 : parseInt(raw, 10),
    });
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const canProceed =
    !includeBackToWork ||
    (inputs.proposedAnnualIncome > 0);

  // The combined income context hint shown near the current income field
  const partnerIncome = Math.max(
    0,
    inputs.combinedAnnualIncome - inputs.currentAnnualIncome
  );

  return (
    <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8">
      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="space-y-6">

        {/* ── Opt-in / opt-out ────────────────────────────────────────── */}
        {!includeBackToWork ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-text-main mb-2">
                Would you like a back-to-work analysis?
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                If you&apos;re thinking about returning to work (or changing hours),
                we can show you the real financial impact — including how extra
                income affects your CCS rate, childcare costs, and tax.
              </p>
            </div>

            {/* Opt-in card */}
            <button
              type="button"
              onClick={handleOptIn}
              className={[
                'w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left',
                'transition-all duration-150',
                'border-primary/30 bg-card hover:border-primary hover:bg-teal-50',
              ].join(' ')}
            >
              <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-text-main">
                  Yes, show me the analysis
                </span>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Compare 1–5 day working scenarios side by side.
                  See your net benefit after tax, reduced CCS, and work costs.
                </p>
              </div>
            </button>

            {/* Opt-out card */}
            <button
              type="button"
              onClick={handleOptOut}
              className={[
                'w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left',
                'transition-all duration-150',
                'border-border bg-card hover:border-primary/40 hover:bg-gray-50',
              ].join(' ')}
            >
              <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center" aria-hidden="true">
                <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-text-main">
                  No thanks, just show my childcare costs
                </span>
                <p className="text-sm text-muted mt-1">
                  Skip straight to your CCS estimate and annual childcare costs.
                </p>
              </div>
            </button>

            {/* Back navigation (for opt-in/out screen) */}
            <div className="flex items-center pt-2">
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
            </div>
          </div>
        ) : (
          /* ── Input fields (shown after opting in) ──────────────────── */
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-text-main mb-1">
                Tell us about the work scenario
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                We&apos;ll calculate the net financial benefit for 1, 2, 3, 4, and 5
                working days per week — so you can compare and find the sweet spot.
              </p>
            </div>

            {/* ── Field 1: Current individual income ────────────────────── */}
            <div>
              <label
                htmlFor="current-income"
                className="block text-sm font-semibold text-text-main mb-1"
              >
                Your current individual income
              </label>
              <p className="text-sm text-muted mb-2">
                {inputs.currentAnnualIncome === 0
                  ? 'Leave as $0 if you\'re not currently earning.'
                  : `Your current earnings before tax.`}
              </p>
              <div className="relative w-full sm:w-56">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">
                  $
                </span>
                <input
                  id="current-income"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentIncomeStr}
                  onChange={handleCurrentIncome}
                  placeholder="0"
                  className={[
                    'w-full pl-7 pr-14 py-2.5 rounded-lg border-2 bg-card text-text-main',
                    'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'focus:outline-none transition-colors duration-150',
                  ].join(' ')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted select-none">
                  /year
                </span>
              </div>
              {/* Context: partner income derivation */}
              {relationshipStatus === 'partnered' &&
                inputs.combinedAnnualIncome > 0 && (
                  <p className="mt-1.5 text-xs text-muted">
                    Combined family income: {formatDollars(inputs.combinedAnnualIncome)}.
                    {partnerIncome > 0 && (
                      <>
                        {' '}Partner income: ~{formatDollars(partnerIncome)}.
                      </>
                    )}
                  </p>
                )}
            </div>

            {/* ── Field 2: Proposed FTE salary ──────────────────────────── */}
            <div>
              <label
                htmlFor="proposed-income"
                className="block text-sm font-semibold text-text-main mb-1"
              >
                Proposed full-time annual salary{' '}
                <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-muted mb-2">
                The annual salary for the role you&apos;re considering. If the role
                is part-time, enter what the <strong>full-time equivalent</strong> would
                be — we&apos;ll calculate proportional income for each day scenario.
              </p>
              <div className="relative w-full sm:w-56">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">
                  $
                </span>
                <input
                  id="proposed-income"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={proposedIncomeStr}
                  onChange={handleProposedIncome}
                  placeholder="e.g. 80000"
                  className={[
                    'w-full pl-7 pr-14 py-2.5 rounded-lg border-2 bg-card text-text-main',
                    inputs.proposedAnnualIncome === 0 && proposedIncomeStr === ''
                      ? 'border-border'
                      : inputs.proposedAnnualIncome > 0
                        ? 'border-primary'
                        : 'border-amber-400',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'focus:outline-none transition-colors duration-150',
                  ].join(' ')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted select-none">
                  /year
                </span>
              </div>
              {inputs.proposedAnnualIncome > 0 && (
                <p className="mt-1.5 text-xs text-muted">
                  3-day scenario: ~{formatDollars(Math.round(inputs.proposedAnnualIncome * 0.6))}/year gross
                  {' '}· 5-day: {formatDollars(inputs.proposedAnnualIncome)}/year
                </p>
              )}
            </div>

            {/* ── Field 3: Weekly work-related costs ────────────────────── */}
            <div>
              <label
                htmlFor="work-costs"
                className="block text-sm font-semibold text-text-main mb-1"
              >
                Weekly work-related costs (estimate)
              </label>
              <p className="text-sm text-muted mb-2">
                Transport, parking, uniforms, lunches out, professional memberships
                — anything you spend specifically because you work.
              </p>
              <div className="relative w-full sm:w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">
                  $
                </span>
                <input
                  id="work-costs"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={workCostsStr}
                  onChange={handleWorkCosts}
                  placeholder="e.g. 60"
                  className={[
                    'w-full pl-7 pr-14 py-2.5 rounded-lg border-2 bg-card text-text-main',
                    'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'focus:outline-none transition-colors duration-150',
                  ].join(' ')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted select-none">
                  /week
                </span>
              </div>
              {inputs.workRelatedCostsPerWeek > 0 && (
                <p className="mt-1.5 text-xs text-muted">
                  ≈ {formatDollars(inputs.workRelatedCostsPerWeek * 52)}/year
                  {' '}(proportional to days worked)
                </p>
              )}
            </div>

            {/* InfoTooltip */}
            <InfoTooltip trigger="How does returning to work affect my CCS?">
              <p className="mb-2">
                When you start earning (or earn more), your{' '}
                <strong>combined family income</strong> increases. A higher combined
                income means a <strong>lower CCS percentage</strong> — so you pay
                more for childcare.
              </p>
              <p className="mb-2">
                At the same time, you may need <strong>more days of care</strong> to
                cover your working hours, which further increases your annual
                childcare bill.
              </p>
              <p className="mb-2">
                Our analysis accounts for all of this:
              </p>
              <ul className="space-y-1 list-disc list-inside text-sm mb-2">
                <li>Income tax on your new earnings</li>
                <li>Reduced CCS percentage from higher combined income</li>
                <li>Additional childcare days needed</li>
                <li>Your estimated work-related costs</li>
              </ul>
              <p>
                The <strong>net benefit</strong> is what you actually take home after
                all these costs are subtracted. Sometimes working 3 days per week
                produces a better return per hour than 5 days.
              </p>
            </InfoTooltip>

            {/* ── "Change my mind" link ─────────────────────────────────── */}
            <button
              type="button"
              onClick={() =>
                updateInput({
                  includeBackToWork: false,
                  currentAnnualIncome: 0,
                  proposedAnnualIncome: 0,
                  workRelatedCostsPerWeek: 0,
                })
              }
              className="text-xs text-muted hover:text-primary underline transition-colors"
            >
              Skip this analysis — just show childcare costs
            </button>

            {/* ── Navigation ─────────────────────────────────────────────── */}
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
                disabled={!canProceed}
                className={[
                  'flex items-center gap-2',
                  canProceed ? 'btn-primary' : 'btn-primary opacity-50 cursor-not-allowed',
                ].join(' ')}
              >
                Next: Review
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Aside ──────────────────────────────────────────────────────── */}
      <StepAside title="The real cost of going back to work">
        <p>
          Many parents assume their full salary goes into their pocket. In
          reality, returning to work triggers a cascade of costs:
        </p>
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <span className="text-primary flex-shrink-0 mt-0.5" aria-hidden="true">1.</span>
            <p>
              <strong>Income tax</strong> on your new earnings (16–45% depending
              on total income).
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary flex-shrink-0 mt-0.5" aria-hidden="true">2.</span>
            <p>
              <strong>Reduced CCS rate</strong> — higher combined income pushes
              your subsidy down by 1% per $5,000.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary flex-shrink-0 mt-0.5" aria-hidden="true">3.</span>
            <p>
              <strong>More childcare days</strong> to cover the hours you&apos;re
              at work.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary flex-shrink-0 mt-0.5" aria-hidden="true">4.</span>
            <p>
              <strong>Work expenses</strong> — transport, meals, clothing.
            </p>
          </div>
        </div>
        <p className="mt-3">
          Our analysis shows the <strong>net benefit</strong> for each scenario
          so you can make an informed decision.
        </p>
        <p className="mt-2 text-xs text-muted">
          This is a financial estimate only. The value of career progression,
          social connection, and personal fulfilment is also very real — even
          when the short-term numbers are tight.
        </p>
      </StepAside>
    </div>
  );
}
