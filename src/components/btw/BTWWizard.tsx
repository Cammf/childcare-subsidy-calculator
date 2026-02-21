'use client';
// =============================================================================
// BACK-TO-WORK WIZARD — Standalone 2-Step Calculator
// =============================================================================
// A streamlined wizard for parents wanting to know: "Is going back to work
// financially worth it?" — independent of the main CCS calculator.
//
// Step 1: Current situation — income, care type, fee, days in care
// Step 2: Work scenario    — proposed salary, current income, work costs
// → Navigate to /back-to-work-calculator/results with all inputs as URL params
//
// Reuses: RadioCard, InfoTooltip, StepAside, IncomeRangeSelector
// Calculation: calculateBackToWork() runs server-side on the results page.
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioCard from '@/components/wizard/RadioCard';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import StepAside from '@/components/wizard/StepAside';
import IncomeRangeSelector from '@/components/wizard/IncomeRangeSelector';
import {
  resolveIncome,
  DEFAULT_HOURS_PER_DAY,
  type IncomeRange,
} from '@/lib/resolveInputs';
import { formatDollars } from '@/lib/format';
import type { CareType, State } from '@/lib/types';

// ─── Input State ─────────────────────────────────────────────────────────────

interface BTWInputs {
  relationshipStatus: 'single' | 'partnered';
  youngestChildAge: 'under_6' | '6_to_13';

  // Income (uses same IncomeRangeSelector as main calculator)
  incomeRange: IncomeRange;
  exactIncome: number | null;
  combinedAnnualIncome: number; // resolved value

  // Childcare details
  careType: CareType;
  state: State;
  daysPerWeek: number;
  hoursPerDay: number;
  feePerDay: number | null;
  useStateAverage: boolean;

  // Work scenario (Step 2)
  currentIndividualIncome: number;
  proposedFTEIncome: number;
  workRelatedCostsPerWeek: number;
}

const DEFAULT_INPUTS: BTWInputs = {
  relationshipStatus: 'partnered',
  youngestChildAge: 'under_6',
  incomeRange: 'under_85279',
  exactIncome: null,
  combinedAnnualIncome: 60000,
  careType: 'centre_based_day_care',
  state: 'NSW',
  daysPerWeek: 3,
  hoursPerDay: 10,
  feePerDay: null,
  useStateAverage: true,
  currentIndividualIncome: 0,
  proposedFTEIncome: 0,
  workRelatedCostsPerWeek: 0,
};

// ─── Care type options ────────────────────────────────────────────────────────

const CARE_TYPES: { value: CareType; label: string; description: string; badge?: string }[] = [
  {
    value: 'centre_based_day_care',
    label: 'Centre-based day care',
    description: 'Long day care, creche, early learning centre',
    badge: 'Most common',
  },
  {
    value: 'family_day_care',
    label: 'Family day care',
    description: "Care in an educator's home",
  },
  {
    value: 'outside_school_hours',
    label: 'Outside school hours (OSHC)',
    description: 'Before/after school or vacation care',
  },
  {
    value: 'in_home_care',
    label: 'In-home care',
    description: 'Nanny — subsidy per family, no state average',
  },
];

const STATES: State[] = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

const STATE_AVERAGE_NOTE: Record<State, string> = {
  NSW: '~$158/day', VIC: '~$148/day', QLD: '~$140/day', SA: '~$133/day',
  WA: '~$139/day', TAS: '~$125/day', ACT: '~$167/day', NT: '~$120/day',
};

// ─── Progress bar ─────────────────────────────────────────────────────────────

function BTWProgress({ step }: { step: 1 | 2 }) {
  const steps: Array<{ label: string }> = [
    { label: 'Current situation' },
    { label: 'Work scenario' },
  ];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted">
          Step {step} of 2 —{' '}
          <span className="text-text-main">{steps[step - 1].label}</span>
        </span>
        <span className="text-sm text-muted">{step === 1 ? '50' : '100'}% complete</span>
      </div>
      <div
        className="flex items-center gap-1.5"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={2}
        aria-label={`Step ${step} of 2`}
      >
        {steps.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const cur = n === step;
          return (
            <div key={n} className="flex items-center flex-1">
              <div
                className={[
                  'w-3 h-3 rounded-full flex-shrink-0 transition-colors duration-200',
                  done ? 'bg-primary' : cur ? 'bg-primary ring-2 ring-primary ring-offset-2' : 'bg-border',
                ].join(' ')}
                aria-hidden="true"
              />
              {n < 2 && (
                <div
                  className={['flex-1 h-0.5 mx-1 transition-colors duration-200', done ? 'bg-primary' : 'bg-border'].join(' ')}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Nav button helpers ───────────────────────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-muted hover:text-text-main transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}

// ─── Dollar input ─────────────────────────────────────────────────────────────

function DollarInput({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  suffix = '/year',
  required = false,
  borderVariant = 'default',
}: {
  id: string;
  label: React.ReactNode;
  hint?: string;
  value: string;
  onChange: (raw: string, parsed: number) => void;
  placeholder: string;
  suffix?: string;
  required?: boolean;
  borderVariant?: 'default' | 'validated' | 'error';
}) {
  const borderClass =
    borderVariant === 'validated' ? 'border-primary' :
    borderVariant === 'error'     ? 'border-amber-400' :
    'border-border';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-text-main mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-sm text-muted mb-2">{hint}</p>}
      <div className="relative w-full sm:w-56">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            onChange(raw, raw === '' ? 0 : parseInt(raw, 10));
          }}
          placeholder={placeholder}
          className={[
            'w-full pl-7 pr-14 py-2.5 rounded-lg border-2 bg-white text-text-main',
            borderClass,
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            'focus:outline-none transition-colors duration-150',
          ].join(' ')}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted select-none">
          {suffix}
        </span>
      </div>
    </div>
  );
}

// ─── Step 1: Current situation ────────────────────────────────────────────────

function Step1({
  inputs,
  update,
  onNext,
}: {
  inputs: BTWInputs;
  update: (updates: Partial<BTWInputs>) => void;
  onNext: () => void;
}) {
  // Local string state for fee input (partial typing)
  const [feeStr, setFeeStr] = useState<string>(
    inputs.feePerDay !== null ? String(inputs.feePerDay) : ''
  );
  const [useKnownFee, setUseKnownFee] = useState<boolean>(
    inputs.feePerDay !== null && !inputs.useStateAverage
  );

  const isInHomeCare = inputs.careType === 'in_home_care';

  function handleCareTypeChange(val: string) {
    const careType = val as CareType;
    update({ careType, hoursPerDay: DEFAULT_HOURS_PER_DAY[careType] });
  }

  function handleFeeOptionChange(knownFee: boolean) {
    setUseKnownFee(knownFee);
    if (!knownFee) {
      update({ useStateAverage: true, feePerDay: null });
    } else {
      update({ useStateAverage: false });
    }
  }

  return (
    <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8">
      <div className="space-y-8">

        {/* Relationship status */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            Family status
          </p>
          <p className="text-sm text-muted mb-3">
            This affects how we label income fields.
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            {(['single', 'partnered'] as const).map((rs) => (
              <button
                key={rs}
                type="button"
                onClick={() => update({ relationshipStatus: rs })}
                className={[
                  'flex items-center justify-center py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all duration-150',
                  inputs.relationshipStatus === rs
                    ? 'border-primary bg-teal-50 text-primary'
                    : 'border-border bg-white text-text-main hover:border-primary/40',
                ].join(' ')}
                aria-pressed={inputs.relationshipStatus === rs}
              >
                {rs === 'single' ? 'Single parent' : 'Partnered'}
              </button>
            ))}
          </div>
        </div>

        {/* Income */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            {inputs.relationshipStatus === 'single' ? 'Your annual income' : 'Combined family income'}
          </p>
          <p className="text-sm text-muted mb-3">
            Total taxable income — this determines your current CCS rate and acts
            as the baseline for the work-scenario comparison.
          </p>
          <IncomeRangeSelector
            incomeRange={inputs.incomeRange}
            exactIncome={inputs.exactIncome}
            onChange={(range, exact) => {
              update({
                incomeRange: range,
                exactIncome: exact,
                combinedAnnualIncome: resolveIncome(range, exact),
              });
            }}
            incomeLabel={
              inputs.relationshipStatus === 'single' ? 'Your income' : 'Combined family income'
            }
          />
        </div>

        {/* Care type */}
        <fieldset>
          <legend className="text-base font-semibold text-text-main mb-1">
            Type of childcare
          </legend>
          <p className="text-sm text-muted mb-3">
            Different care types have different government hourly rate caps.
          </p>
          <div className="space-y-2">
            {CARE_TYPES.map((opt) => (
              <RadioCard
                key={opt.value}
                id={`btw-care-${opt.value}`}
                name="btwCareType"
                value={opt.value}
                checked={inputs.careType === opt.value}
                onChange={handleCareTypeChange}
                label={opt.label}
                description={opt.description}
                badge={opt.badge}
              />
            ))}
          </div>
        </fieldset>

        {/* Youngest child's age */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            Youngest child&apos;s age
          </p>
          <p className="text-sm text-muted mb-3">
            This determines which hourly rate cap applies.
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-sm">
            {([
              { value: 'under_6', label: 'Under 6 years', note: 'Higher rate cap' },
              { value: '6_to_13', label: '6 to 13 years', note: 'School-age rate cap' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ youngestChildAge: opt.value })}
                className={[
                  'flex flex-col items-center justify-center p-3 rounded-lg border-2 text-sm transition-all duration-150 min-h-[64px]',
                  inputs.youngestChildAge === opt.value
                    ? 'border-primary bg-teal-50 text-primary'
                    : 'border-border bg-white text-text-main hover:border-primary/40',
                ].join(' ')}
                aria-pressed={inputs.youngestChildAge === opt.value}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs mt-0.5 opacity-70">{opt.note}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Days in care */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            Current days per week in care
          </p>
          <p className="text-sm text-muted mb-3">
            Your child&apos;s current attendance. We&apos;ll model additional days if your
            working scenario requires more.
          </p>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}
            role="group"
            aria-label="Days per week"
          >
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => update({ daysPerWeek: d })}
                className={[
                  'flex flex-col items-center justify-center py-3 rounded-lg border-2',
                  'font-medium text-sm transition-all duration-150 min-h-[56px]',
                  inputs.daysPerWeek === d
                    ? 'border-primary bg-teal-50 text-primary'
                    : 'border-border bg-white text-text-main hover:border-primary/40',
                ].join(' ')}
                aria-pressed={inputs.daysPerWeek === d}
              >
                <span className="text-lg font-bold">{d}</span>
                <span className="text-xs">{d === 1 ? 'day' : 'days'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily fee */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            Daily childcare fee
          </p>
          <p className="text-sm text-muted mb-3">
            The total fee charged by your provider before CCS is applied.
          </p>

          <div className="space-y-2">
            {/* Option A: state average */}
            {!isInHomeCare && (
              <button
                type="button"
                onClick={() => handleFeeOptionChange(false)}
                className={[
                  'w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-150',
                  !useKnownFee ? 'border-primary bg-teal-50' : 'border-border bg-white hover:border-primary/40 hover:bg-gray-50',
                ].join(' ')}
              >
                <div className={['mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center', !useKnownFee ? 'border-primary' : 'border-gray-300'].join(' ')} aria-hidden="true">
                  {!useKnownFee && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <span className={['font-medium', !useKnownFee ? 'text-primary' : 'text-text-main'].join(' ')}>
                    Use the state average
                  </span>
                  <p className="text-sm text-muted mt-0.5">
                    {STATE_AVERAGE_NOTE[inputs.state]} for {inputs.state} · Good enough for a quick estimate
                  </p>
                </div>
              </button>
            )}

            {/* Option B: known fee */}
            <button
              type="button"
              onClick={() => handleFeeOptionChange(true)}
              className={[
                'w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-150',
                useKnownFee ? 'border-primary bg-teal-50' : 'border-border bg-white hover:border-primary/40 hover:bg-gray-50',
                isInHomeCare ? 'border-primary bg-teal-50' : '',
              ].join(' ')}
            >
              <div className={['mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center', useKnownFee ? 'border-primary' : 'border-gray-300'].join(' ')} aria-hidden="true">
                {useKnownFee && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <div>
                <span className={['font-medium', useKnownFee ? 'text-primary' : 'text-text-main'].join(' ')}>
                  I know my daily fee
                </span>
                <p className="text-sm text-muted mt-0.5">
                  {isInHomeCare ? 'In-home care has no state average — enter your actual fee.' : 'Enter it for a more accurate result'}
                </p>
              </div>
            </button>
          </div>

          {/* State selector (shown when using state average) */}
          {!useKnownFee && !isInHomeCare && (
            <div className="mt-3 flex items-center gap-3">
              <label htmlFor="btw-state" className="text-sm font-medium text-text-main whitespace-nowrap">
                Your state / territory:
              </label>
              <select
                id="btw-state"
                value={inputs.state}
                onChange={(e) => update({ state: e.target.value as State })}
                className="rounded-lg border-2 border-border bg-white text-text-main px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Fee text input */}
          {(useKnownFee || isInHomeCare) && (
            <div className="mt-3 p-4 bg-teal-50 border border-primary/20 rounded-lg">
              <label htmlFor="btw-fee" className="block text-sm font-medium text-text-main mb-2">
                Daily fee (AUD, per child)
              </label>
              <div className="relative w-full sm:w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">$</span>
                <input
                  id="btw-fee"
                  type="text"
                  inputMode="decimal"
                  value={feeStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, '');
                    setFeeStr(raw);
                    const parsed = raw === '' ? null : parseFloat(raw);
                    update({ feePerDay: parsed });
                  }}
                  placeholder="e.g. 150"
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border-2 bg-white text-text-main border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                Total fee charged by your provider before CCS.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onNext}
            className="btn-primary flex items-center gap-2"
          >
            Next: Work Scenario
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Aside */}
      <StepAside title="What eats into your salary?">
        <p>
          Returning to work triggers a <strong>cascade of costs</strong> that
          many parents don&apos;t see coming. This calculator accounts for all four:
        </p>
        <div className="mt-3 space-y-2.5">
          {[
            { n: '1', title: 'Income tax', desc: 'On your new earnings — 16–45% depending on your bracket.' },
            { n: '2', title: 'Reduced CCS rate', desc: 'Higher combined income → lower subsidy. 1pp per $5,000 above $85,279.' },
            { n: '3', title: 'More childcare days', desc: 'Extra days of care needed to cover work hours, at reduced CCS.' },
            { n: '4', title: 'Work expenses', desc: 'Transport, parking, uniforms, lunches out.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex gap-2">
              <span className="text-primary font-bold flex-shrink-0 mt-0.5">{n}.</span>
              <div>
                <p className="font-medium text-xs text-text-main">{title}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Your <strong>net benefit</strong> is what remains after all four costs
          are deducted. Sometimes working 3 days/week earns a better effective
          hourly rate than 5 days.
        </p>
      </StepAside>
    </div>
  );
}

// ─── Step 2: Work scenario ────────────────────────────────────────────────────

function Step2({
  inputs,
  update,
  onBack,
  onCalculate,
}: {
  inputs: BTWInputs;
  update: (updates: Partial<BTWInputs>) => void;
  onBack: () => void;
  onCalculate: () => void;
}) {
  const [currentIncomeStr, setCurrentIncomeStr] = useState<string>(
    inputs.currentIndividualIncome > 0 ? String(inputs.currentIndividualIncome) : ''
  );
  const [proposedIncomeStr, setProposedIncomeStr] = useState<string>(
    inputs.proposedFTEIncome > 0 ? String(inputs.proposedFTEIncome) : ''
  );
  const [workCostsStr, setWorkCostsStr] = useState<string>(
    inputs.workRelatedCostsPerWeek > 0 ? String(inputs.workRelatedCostsPerWeek) : ''
  );

  const canProceed = inputs.proposedFTEIncome > 0;

  const partnerIncome = Math.max(
    0,
    inputs.combinedAnnualIncome - inputs.currentIndividualIncome
  );

  return (
    <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8">
      <div className="space-y-6">

        <div>
          <h2 className="text-base font-semibold text-text-main mb-1">
            The work scenario
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            We&apos;ll calculate the net financial benefit for 1, 2, 3, 4, and 5 working
            days per week — so you can find the sweet spot.
          </p>
        </div>

        {/* Current individual income */}
        <DollarInput
          id="btw-current-income"
          label={
            <>
              Your current individual income
            </>
          }
          hint={
            inputs.currentIndividualIncome === 0
              ? "Leave as $0 if you're not currently earning."
              : "Your current earnings before tax."
          }
          value={currentIncomeStr}
          onChange={(raw, parsed) => {
            setCurrentIncomeStr(raw);
            update({ currentIndividualIncome: parsed });
          }}
          placeholder="0"
        />
        {/* Partner income context hint */}
        {inputs.relationshipStatus === 'partnered' && inputs.combinedAnnualIncome > 0 && (
          <p className="-mt-4 text-xs text-muted">
            Combined family income: {formatDollars(inputs.combinedAnnualIncome)}.
            {partnerIncome > 0 && <> Partner&apos;s income: ~{formatDollars(partnerIncome)}.</>}
          </p>
        )}

        {/* Proposed FTE salary */}
        <div>
          <DollarInput
            id="btw-proposed-income"
            label="Proposed full-time annual salary"
            hint={`Enter what the full-time equivalent would pay. We'll calculate proportional income for each day scenario.`}
            value={proposedIncomeStr}
            onChange={(raw, parsed) => {
              setProposedIncomeStr(raw);
              update({ proposedFTEIncome: parsed });
            }}
            placeholder="e.g. 80000"
            required
            borderVariant={
              inputs.proposedFTEIncome === 0 && proposedIncomeStr === '' ? 'default' :
              inputs.proposedFTEIncome > 0 ? 'validated' : 'error'
            }
          />
          {inputs.proposedFTEIncome > 0 && (
            <p className="mt-1.5 text-xs text-muted">
              3-day scenario: ~{formatDollars(Math.round(inputs.proposedFTEIncome * 0.6))}/yr gross ·
              5-day: {formatDollars(inputs.proposedFTEIncome)}/yr
            </p>
          )}
        </div>

        {/* Weekly work costs */}
        <div>
          <DollarInput
            id="btw-work-costs"
            label="Weekly work-related costs (estimate)"
            hint="Transport, parking, uniforms, lunches out, professional memberships — anything you spend specifically because you work."
            value={workCostsStr}
            onChange={(raw, parsed) => {
              setWorkCostsStr(raw);
              update({ workRelatedCostsPerWeek: parsed });
            }}
            placeholder="e.g. 60"
            suffix="/week"
          />
          {inputs.workRelatedCostsPerWeek > 0 && (
            <p className="mt-1.5 text-xs text-muted">
              ≈ {formatDollars(inputs.workRelatedCostsPerWeek * 52)}/year (proportional to days worked)
            </p>
          )}
        </div>

        {/* InfoTooltip */}
        <InfoTooltip trigger="How does returning to work affect my CCS?">
          <p className="mb-2">
            When you start earning (or earn more), your{' '}
            <strong>combined family income</strong> increases. A higher combined
            income means a <strong>lower CCS percentage</strong> — so childcare
            costs more.
          </p>
          <p className="mb-2">
            You may also need <strong>more days of care</strong> to cover your
            working hours, further increasing your annual childcare bill.
          </p>
          <p>
            Your <strong>net benefit</strong> is what you actually pocket after
            tax, reduced CCS, extra childcare days, and work costs are all
            subtracted.
          </p>
        </InfoTooltip>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <BackBtn onClick={onBack} />
          <button
            type="button"
            onClick={onCalculate}
            disabled={!canProceed}
            className={[
              'btn-primary flex items-center gap-2 text-base px-7 py-3',
              !canProceed ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            Calculate my return
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Aside */}
      <StepAside title="How we calculate your net benefit">
        <p>
          For each working scenario (1–5 days/week), we calculate:
        </p>
        <div className="mt-3 space-y-2">
          <div className="p-2.5 rounded-lg bg-white border border-border text-xs font-mono leading-relaxed">
            <p className="font-bold text-primary mb-1">Net benefit =</p>
            <p>  + new net income after tax</p>
            <p>  − current net income</p>
            <p>  − extra childcare cost</p>
            <p>  − work-related costs</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          The <strong>effective hourly rate</strong> is your net benefit divided
          by total hours worked annually. It can be surprisingly low — sometimes
          below minimum wage — even at a good salary.
        </p>
        <p className="mt-2 text-xs text-muted">
          We analyse all 5 scenarios so you can choose the number of days that
          maximises your return.
        </p>
      </StepAside>
    </div>
  );
}

// ─── Main wizard component ────────────────────────────────────────────────────

export interface BTWWizardProps {
  /** Optional pre-fill from main CCS calculator params or URL. */
  initialInputs?: Partial<BTWInputs>;
}

export default function BTWWizard({ initialInputs }: BTWWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState<BTWInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });

  function update(updates: Partial<BTWInputs>) {
    setInputs((prev) => ({ ...prev, ...updates }));
  }

  function handleCalculate() {
    const params = new URLSearchParams({
      rs:  inputs.relationshipStatus,
      ya:  inputs.youngestChildAge,
      i:   String(inputs.combinedAnnualIncome),
      ir:  inputs.incomeRange,
      ei:  inputs.exactIncome !== null ? String(inputs.exactIncome) : '',
      ct:  inputs.careType,
      st:  inputs.state,
      d:   String(inputs.daysPerWeek),
      h:   String(inputs.hoursPerDay),
      f:   inputs.feePerDay !== null ? String(inputs.feePerDay) : '',
      sa:  inputs.useStateAverage ? '1' : '0',
      ci:  String(inputs.currentIndividualIncome),
      pi:  String(inputs.proposedFTEIncome),
      wc:  String(inputs.workRelatedCostsPerWeek),
    });
    router.push(`/back-to-work-calculator/results?${params.toString()}`);
  }

  return (
    <div className="w-full">
      <BTWProgress step={step} />
      {step === 1 ? (
        <Step1 inputs={inputs} update={update} onNext={() => setStep(2)} />
      ) : (
        <Step2 inputs={inputs} update={update} onBack={() => setStep(1)} onCalculate={handleCalculate} />
      )}
    </div>
  );
}
