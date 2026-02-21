'use client';
// =============================================================================
// STEP 1 — Family Situation
// =============================================================================
// Collects: relationship status, number of children in approved childcare,
// youngest child's age group, and state/territory.
//
// These drive:
//   • Number of children → higher CCS rate eligibility
//   • Youngest child age → hourly rate cap tier + higher rate eligibility
//   • State → state average fee lookup if user doesn't know their fee
// =============================================================================

import RadioCard from '@/components/wizard/RadioCard';
import StepAside from '@/components/wizard/StepAside';
import { useWizard } from '@/contexts/WizardContext';
import type { State } from '@/lib/types';
import type { RelationshipStatus } from '@/contexts/WizardContext';

// ─── Australian States & Territories ────────────────────────────────────────

const STATES: { value: State; label: string }[] = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA',  label: 'South Australia' },
  { value: 'WA',  label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT',  label: 'Northern Territory' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step1FamilySituation() {
  const { state, dispatch, updateInput, nextStep } = useWizard();
  const { inputs, relationshipStatus } = state;

  // ── Derived state ──────────────────────────────────────────────────────────
  const isMultiChild = inputs.numberOfChildren >= 2;
  const eligibleForHigherRate =
    isMultiChild && inputs.youngestChildAge === 'under_6';

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleRelationshipChange(val: string) {
    dispatch({
      type: 'SET_RELATIONSHIP_STATUS',
      payload: val as RelationshipStatus,
    });
  }

  function handleChildrenChange(val: string) {
    updateInput({ numberOfChildren: parseInt(val, 10) });
  }

  function handleYoungestAgeChange(val: string) {
    updateInput({
      youngestChildAge: val as 'under_6' | '6_to_13',
    });
  }

  function handleStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateInput({ state: e.target.value as State });
  }

  return (
    <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8">
      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Q1: Relationship status */}
        <fieldset>
          <legend className="text-base font-semibold text-text-main mb-3">
            Are you single or partnered?
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'partnered', label: 'Partnered', description: 'Combined income used for CCS' },
              { value: 'single',    label: 'Single parent', description: 'Your income only' },
            ] as const).map((opt) => (
              <RadioCard
                key={opt.value}
                id={`relationship-${opt.value}`}
                name="relationshipStatus"
                value={opt.value}
                checked={relationshipStatus === opt.value}
                onChange={handleRelationshipChange}
                label={opt.label}
                description={opt.description}
              />
            ))}
          </div>
        </fieldset>

        {/* Q2: Number of children */}
        <fieldset>
          <legend className="text-base font-semibold text-text-main mb-1">
            How many children are in approved childcare?
          </legend>
          <p className="text-sm text-muted mb-3">
            Count only children currently enrolled in CCS-approved care.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: '1', label: '1 child', badge: undefined },
                { value: '2', label: '2 children', badge: undefined },
                { value: '3', label: '3 or more', badge: 'Higher rate applies' },
              ] satisfies Array<{ value: string; label: string; badge?: string }>
            ).map((opt) => (
              <RadioCard
                key={opt.value}
                id={`children-${opt.value}`}
                name="numberOfChildren"
                value={opt.value}
                checked={inputs.numberOfChildren === parseInt(opt.value, 10)}
                onChange={handleChildrenChange}
                label={opt.label}
                badge={opt.badge}
              />
            ))}
          </div>

          {/* Contextual note for multi-child families */}
          {isMultiChild && (
            <div className="mt-3 p-3 bg-teal-50 border border-primary/20 rounded-lg text-sm text-primary">
              <strong>Higher CCS rate may apply.</strong> Families with 2+ children in approved
              care can receive up to 95% CCS for younger children (from 10 July 2023).
            </div>
          )}
        </fieldset>

        {/* Q3: Youngest child's age */}
        <fieldset>
          <legend className="text-base font-semibold text-text-main mb-1">
            How old is your youngest child in care?
          </legend>
          <p className="text-sm text-muted mb-3">
            This determines the hourly rate cap and higher-rate eligibility.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              id="age-under6"
              name="youngestChildAge"
              value="under_6"
              checked={inputs.youngestChildAge === 'under_6'}
              onChange={handleYoungestAgeChange}
              label="Under 6 years"
              description="Below school age — attracts higher hourly rate cap"
              badge={eligibleForHigherRate ? 'Higher rate eligible' : undefined}
            />
            <RadioCard
              id="age-6to13"
              name="youngestChildAge"
              value="6_to_13"
              checked={inputs.youngestChildAge === '6_to_13'}
              onChange={handleYoungestAgeChange}
              label="6 to 13 years"
              description="School age — standard hourly rate cap applies"
            />
          </div>
        </fieldset>

        {/* Q4: State / territory */}
        <div>
          <label
            htmlFor="state-select"
            className="block text-base font-semibold text-text-main mb-1"
          >
            Which state or territory do you live in?
          </label>
          <p className="text-sm text-muted mb-3">
            Used to look up average childcare fees in your area.
          </p>
          <select
            id="state-select"
            value={inputs.state}
            onChange={handleStateChange}
            className={[
              'w-full sm:w-72 px-3 py-2.5 rounded-lg border-2 bg-card text-text-main',
              'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
              'focus:outline-none transition-colors duration-150',
            ].join(' ')}
          >
            {STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={nextStep}
            className="btn-primary flex items-center gap-2"
          >
            Next: Income
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Aside ──────────────────────────────────────────────────────── */}
      <StepAside title="About the Child Care Subsidy">
        <p>
          The Child Care Subsidy (CCS) is paid directly to your childcare provider,
          reducing the fee you pay each day.
        </p>
        <p>
          How much you receive depends on your <strong>family income</strong>,
          your child&apos;s <strong>age</strong>, and the <strong>type</strong> of
          care you use.
        </p>
        {isMultiChild ? (
          <p>
            With <strong>{inputs.numberOfChildren} children</strong> in care,
            younger children are eligible for the <strong>higher CCS rate</strong> —
            up to 95% — if the youngest is under 6.
          </p>
        ) : (
          <p>
            The <strong>standard maximum rate is 90%</strong> for families earning
            under $85,279. It tapers down by 1% for every $5,000 above that.
          </p>
        )}
        <p className="mt-2 text-xs text-muted">
          Source: Services Australia · FY 2025–26 rates
        </p>
      </StepAside>
    </div>
  );
}
