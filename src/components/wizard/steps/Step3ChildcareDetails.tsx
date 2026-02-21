'use client';
// =============================================================================
// STEP 3 — Childcare Details
// =============================================================================
// Collects: care type, days per week, and daily fee (known or state average).
//
// These drive:
//   • Care type → hourly rate cap that applies
//   • Days per week → total annual childcare spend
//   • Daily fee → out-of-pocket gap fee after CCS
// =============================================================================

import { useState } from 'react';
import RadioCard from '@/components/wizard/RadioCard';
import InfoTooltip from '@/components/wizard/InfoTooltip';
import StepAside from '@/components/wizard/StepAside';
import { useWizard } from '@/contexts/WizardContext';
import type { CareType } from '@/lib/types';
import { DEFAULT_HOURS_PER_DAY } from '@/lib/resolveInputs';
import { formatDollars } from '@/lib/format';

// ─── Care type options ───────────────────────────────────────────────────────

const CARE_TYPES: {
  value: CareType;
  label: string;
  description: string;
  badge?: string;
  cap: string;
}[] = [
  {
    value: 'centre_based_day_care',
    label: 'Centre-based day care',
    description: 'Long day care, creche, early learning centre',
    badge: 'Most common',
    cap: '$14.63/hr (under 6) · $12.81/hr (6+)',
  },
  {
    value: 'family_day_care',
    label: 'Family day care',
    description: 'Care in an educator\'s home',
    cap: '$12.43/hr (all ages)',
  },
  {
    value: 'outside_school_hours',
    label: 'Outside school hours care (OSHC)',
    description: 'Before/after school or vacation care',
    cap: '$12.81/hr',
  },
  {
    value: 'in_home_care',
    label: 'In-home care',
    description: 'Nanny or au pair — subsidy per family',
    cap: '$35.40/hr',
  },
];

// ─── State average daily fees (for the aside panel, approximate) ─────────────
const STATE_AVERAGE_NOTE: Record<string, string> = {
  NSW: '~$158/day (centre-based)',
  VIC: '~$148/day (centre-based)',
  QLD: '~$140/day (centre-based)',
  SA:  '~$133/day (centre-based)',
  WA:  '~$139/day (centre-based)',
  TAS: '~$125/day (centre-based)',
  ACT: '~$167/day (centre-based)',
  NT:  '~$120/day (centre-based)',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step3ChildcareDetails() {
  const { state, updateInput, nextStep, prevStep } = useWizard();
  const { inputs } = state;

  const selectedCap = CARE_TYPES.find((c) => c.value === inputs.careType)?.cap;
  const stateAvgNote = STATE_AVERAGE_NOTE[inputs.state] ?? '';

  // Local state for fee input string
  const [feeStr, setFeeStr] = useState<string>(
    inputs.feePerDay !== null ? String(inputs.feePerDay) : ''
  );
  const [useKnownFee, setUseKnownFee] = useState<boolean>(
    inputs.feePerDay !== null && !inputs.useStateAverage
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleCareTypeChange(val: string) {
    const careType = val as CareType;
    // Update hours to the default for the new care type
    updateInput({
      careType,
      hoursPerDay: DEFAULT_HOURS_PER_DAY[careType],
    });
  }

  function handleDaysChange(days: number) {
    updateInput({ daysPerWeek: days });
  }

  function handleFeeOptionChange(knownFee: boolean) {
    setUseKnownFee(knownFee);
    if (!knownFee) {
      updateInput({ useStateAverage: true, feePerDay: null });
    } else {
      updateInput({ useStateAverage: false });
    }
  }

  function handleFeeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setFeeStr(raw);
    const parsed = raw === '' ? null : parseFloat(raw);
    updateInput({ feePerDay: parsed });
  }

  // ── In-home care: no state average available ───────────────────────────────
  const isInHomeCare = inputs.careType === 'in_home_care';

  // ── Active hourly rate cap for current care type ───────────────────────────
  const hoursDefault = DEFAULT_HOURS_PER_DAY[inputs.careType];

  return (
    <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8">
      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Q1: Care type */}
        <fieldset>
          <legend className="text-base font-semibold text-text-main mb-1">
            What type of childcare do you use?
          </legend>
          <p className="text-sm text-muted mb-3">
            Different care types have different hourly rate caps — this affects
            how much CCS you can receive.
          </p>
          <div className="space-y-2">
            {CARE_TYPES.map((opt) => (
              <RadioCard
                key={opt.value}
                id={`care-${opt.value}`}
                name="careType"
                value={opt.value}
                checked={inputs.careType === opt.value}
                onChange={handleCareTypeChange}
                label={opt.label}
                description={opt.description}
                badge={opt.badge}
              />
            ))}
          </div>
          {selectedCap && (
            <p className="mt-2 text-xs text-muted">
              Hourly rate cap for{' '}
              {CARE_TYPES.find((c) => c.value === inputs.careType)?.label}:{' '}
              <span className="font-medium text-text-main">{selectedCap}</span>
            </p>
          )}
        </fieldset>

        {/* Q2: Days per week */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            How many days per week is your child in care?
          </p>
          <p className="text-sm text-muted mb-3">
            The CCS cap is 100 hours per fortnight (approximately 5 days / week).
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
                onClick={() => handleDaysChange(d)}
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
          <p className="mt-2 text-xs text-muted">
            Default hours: <span className="font-medium">{hoursDefault} hrs/day</span>{' '}
            for {CARE_TYPES.find((c) => c.value === inputs.careType)?.label?.toLowerCase()}.
          </p>
        </div>

        {/* Q3: Daily fee */}
        <div>
          <p className="text-base font-semibold text-text-main mb-1">
            What is your daily childcare fee?
          </p>
          <p className="text-sm text-muted mb-3">
            The CCS is applied to the <strong>lower</strong> of your actual fee
            or the hourly rate cap. Any amount above the cap is fully out-of-pocket.
          </p>

          <div className="space-y-2">
            {/* Option A: use state average */}
            {!isInHomeCare && (
              <button
                type="button"
                onClick={() => handleFeeOptionChange(false)}
                className={[
                  'w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left',
                  'transition-all duration-150',
                  !useKnownFee
                    ? 'border-primary bg-teal-50'
                    : 'border-border bg-white hover:border-primary/40 hover:bg-gray-50',
                ].join(' ')}
              >
                <div
                  className={[
                    'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    !useKnownFee
                      ? 'border-primary'
                      : 'border-gray-300',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {!useKnownFee && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <span className={['font-medium', !useKnownFee ? 'text-primary' : 'text-text-main'].join(' ')}>
                    Use the {inputs.state} state average
                  </span>
                  <p className="text-sm text-muted mt-0.5">
                    {stateAvgNote} · Good enough for a quick estimate
                  </p>
                </div>
              </button>
            )}

            {/* Option B: enter known fee */}
            <button
              type="button"
              onClick={() => handleFeeOptionChange(true)}
              className={[
                'w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left',
                'transition-all duration-150',
                useKnownFee
                  ? 'border-primary bg-teal-50'
                  : 'border-border bg-white hover:border-primary/40 hover:bg-gray-50',
                isInHomeCare ? 'border-primary bg-teal-50' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                  useKnownFee ? 'border-primary' : 'border-gray-300',
                ].join(' ')}
                aria-hidden="true"
              >
                {useKnownFee && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <span className={['font-medium', useKnownFee ? 'text-primary' : 'text-text-main'].join(' ')}>
                  I know my daily fee
                </span>
                <p className="text-sm text-muted mt-0.5">
                  {isInHomeCare
                    ? 'In-home care has no state average — please enter your actual fee.'
                    : 'Enter it for a more accurate result'}
                </p>
              </div>
            </button>
          </div>

          {/* Fee text input */}
          {(useKnownFee || isInHomeCare) && (
            <div className="mt-3 p-4 bg-teal-50 border border-primary/20 rounded-lg">
              <label
                htmlFor="daily-fee"
                className="block text-sm font-medium text-text-main mb-2"
              >
                Daily fee (AUD, per child)
              </label>
              <div className="relative w-full sm:w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">
                  $
                </span>
                <input
                  id="daily-fee"
                  type="text"
                  inputMode="decimal"
                  value={feeStr}
                  onChange={handleFeeInput}
                  placeholder="e.g. 150"
                  className={[
                    'w-full pl-7 pr-3 py-2.5 rounded-lg border-2 bg-white text-text-main',
                    'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'focus:outline-none transition-colors duration-150',
                  ].join(' ')}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                This is the <strong>total daily fee</strong> charged by your provider
                before CCS is applied.
              </p>
            </div>
          )}

          {/* InfoTooltip: hourly rate cap */}
          <InfoTooltip trigger="What is the hourly rate cap?">
            <p className="mb-2">
              The CCS is only applied to fees up to a government-set{' '}
              <strong>hourly rate cap</strong>. Any fee above the cap is paid entirely
              by you — no subsidy applies to the excess.
            </p>
            <p className="mb-2">
              For example, if the cap is <strong>$14.63/hr</strong> and your provider
              charges <strong>$16.00/hr</strong>, the subsidy is calculated on
              $14.63, not $16.00. You pay the $1.37/hr difference yourself.
            </p>
            <p className="text-xs text-muted">
              FY 2025–26 hourly rate caps: Centre-based under-6s $14.63 ·
              School age / OSHC $12.81 · Family day care $12.43 · In-home care $35.40.
            </p>
          </InfoTooltip>
        </div>

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
            Next: Work Situation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Aside ──────────────────────────────────────────────────────── */}
      <StepAside title="About the hourly rate cap">
        <p>
          The government sets an <strong>hourly rate cap</strong> for each type
          of care. CCS is only paid up to this cap — fees above it are fully
          out-of-pocket.
        </p>
        <div className="mt-3 space-y-2">
          <div>
            <p className="font-medium text-xs text-text-main">Centre-based day care</p>
            <p className="text-xs text-muted">Under 6: $14.63/hr · School age: $12.81/hr</p>
          </div>
          <div>
            <p className="font-medium text-xs text-text-main">Family day care</p>
            <p className="text-xs text-muted">All ages: $12.43/hr</p>
          </div>
          <div>
            <p className="font-medium text-xs text-text-main">OSHC</p>
            <p className="text-xs text-muted">School age: $12.81/hr</p>
          </div>
          <div>
            <p className="font-medium text-xs text-text-main">In-home care</p>
            <p className="text-xs text-muted">All ages: $35.40/hr (per family)</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Caps are indexed annually. These are the FY 2025–26 rates.
        </p>
      </StepAside>
    </div>
  );
}
