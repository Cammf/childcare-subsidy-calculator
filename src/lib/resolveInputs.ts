// =============================================================================
// RESOLVE INPUTS — Wizard → Calculation-Ready Values
// =============================================================================
// Converts raw wizard selections (ranges, "use average", etc.) into
// concrete numbers ready for pure calculation functions.
//
// Keeps all lookup/conversion logic out of the calculation engine so the
// calculation functions remain pure and independently testable.
// =============================================================================

import type {
  WizardInputs,
  CareType,
  State,
  StateAverageEntry,
  CCSRates,
} from './types';
import { getStateAverageDailyFee } from './ccsCalculations';

// ─── Income Range Support ───────────────────────────────────────────────────
//
// The wizard may offer income range buckets for users who don't know
// their exact combined income. Each range maps to a representative midpoint.
//
// Ranges are designed around the CCS threshold at $85,279 — that boundary
// is shown explicitly as a range boundary so users near it can self-identify.
// ────────────────────────────────────────────────────────────────────────────

export type IncomeRange =
  | 'under_85279'      // ≤ $85,279   → midpoint $60,000
  | '85280_120000'     // $85,280 – $120,000  → midpoint $102,640
  | '120001_160000'    // $120,001 – $160,000 → midpoint $140,000
  | '160001_220000'    // $160,001 – $220,000 → midpoint $190,000
  | '220001_350000'    // $220,001 – $350,000 → midpoint $285,000
  | 'over_350000';     // > $350,000  → midpoint $400,000 (well above max subsidy)

/** Map of income ranges to representative midpoint incomes. */
export const INCOME_RANGE_MIDPOINTS: Record<IncomeRange, number> = {
  under_85279: 60000,
  '85280_120000': 102640,
  '120001_160000': 140000,
  '160001_220000': 190000,
  '220001_350000': 285000,
  over_350000: 400000,
};

/** Human-readable label for each income range. */
export const INCOME_RANGE_LABELS: Record<IncomeRange, string> = {
  under_85279: 'Under $85,279',
  '85280_120000': '$85,280 – $120,000',
  '120001_160000': '$120,001 – $160,000',
  '160001_220000': '$160,001 – $220,000',
  '220001_350000': '$220,001 – $350,000',
  over_350000: 'Over $350,000',
};

/**
 * Convert an income range selection to a midpoint income value.
 *
 * If the user provided an exact income, that takes precedence.
 *
 * @param range        Income range bucket selected in the wizard.
 * @param exactIncome  Exact income if the user knows it (overrides range).
 * @returns            Concrete income value in AUD.
 */
export function resolveIncome(
  range: IncomeRange,
  exactIncome: number | null
): number {
  if (exactIncome !== null && exactIncome >= 0) {
    return exactIncome;
  }
  return INCOME_RANGE_MIDPOINTS[range];
}

// ─── Age Group Derivation ────────────────────────────────────────────────────

/**
 * Derive the hourly rate cap age group from the child's age category.
 *
 * 'under_6' → 'below_school_age' (attracts higher hourly rate cap for CBDC)
 * '6_to_13' → 'school_age'       (lower rate cap)
 */
export function resolveAgeGroup(
  youngestChildAge: WizardInputs['youngestChildAge']
): 'below_school_age' | 'school_age' {
  return youngestChildAge === 'under_6' ? 'below_school_age' : 'school_age';
}

// ─── Daily Fee Resolution ────────────────────────────────────────────────────

/**
 * Resolve the daily childcare fee to use in calculations.
 *
 * Priority:
 *   1. User's known daily fee (if provided and > 0)
 *   2. State average for the selected state and care type
 *
 * In-home care has no state average — the user must provide the actual fee.
 *
 * @param inputs         Wizard inputs.
 * @param stateAverages  State average data.
 * @returns              Daily fee in AUD.
 */
export function resolveDailyFee(
  inputs: Pick<WizardInputs, 'feePerDay' | 'useStateAverage' | 'state' | 'careType'>,
  stateAverages: StateAverageEntry[]
): number {
  // User provided a fee and opted to use it
  if (!inputs.useStateAverage && inputs.feePerDay != null && inputs.feePerDay > 0) {
    return inputs.feePerDay;
  }

  // In-home care: no state average — return zero as sentinel (UI must warn)
  if (inputs.careType === 'in_home_care') {
    return inputs.feePerDay ?? 0;
  }

  // Look up state average
  return getStateAverageDailyFee(
    inputs.state,
    inputs.careType as Exclude<CareType, 'in_home_care'>,
    stateAverages
  );
}

// ─── Hours Per Day Default ───────────────────────────────────────────────────

/**
 * Default hours per day by care type (if user doesn't specify).
 *
 * CBDC full day:  10 hours
 * Family day care: 9 hours
 * OSHC (before + after school combined): 4 hours
 * In-home care:   10 hours
 */
export const DEFAULT_HOURS_PER_DAY: Record<CareType, number> = {
  centre_based_day_care: 10,
  family_day_care: 9,
  outside_school_hours: 4,
  in_home_care: 10,
};

export function resolveHoursPerDay(
  hoursPerDay: number | null,
  careType: CareType
): number {
  if (hoursPerDay != null && hoursPerDay > 0) {
    return hoursPerDay;
  }
  return DEFAULT_HOURS_PER_DAY[careType];
}

// ─── Higher Rate Eligibility ────────────────────────────────────────────────

/**
 * Determine whether the family qualifies for the higher CCS rate on
 * younger children.
 *
 * Eligibility (from 10 July 2023):
 *   - 2 or more children currently in approved childcare
 *   - Youngest child is aged 5 or under (under_6)
 *
 * The ELDEST child in care receives the standard rate.
 * All younger children receive the higher rate.
 */
export function isEligibleForHigherRate(
  numberOfChildren: number,
  youngestChildAge: WizardInputs['youngestChildAge']
): boolean {
  return numberOfChildren >= 2 && youngestChildAge === 'under_6';
}

// ─── Resolved Inputs Type ───────────────────────────────────────────────────

/**
 * Fully resolved inputs — all concrete values, ready for calculation functions.
 * No ranges, no nulls, no "use average" flags.
 */
export interface ResolvedInputs {
  // Family
  numberOfChildren: number;
  youngestChildAge: WizardInputs['youngestChildAge'];
  ageGroup: 'below_school_age' | 'school_age';
  eligibleForHigherRate: boolean;

  // Income
  combinedAnnualIncome: number;

  // Childcare
  careType: CareType;
  state: State;
  daysPerWeek: number;
  hoursPerDay: number;
  dailyFee: number;
  usingStateAverage: boolean;

  // Back-to-work (optional)
  includeBackToWork: boolean;
  currentIndividualIncome: number;
  proposedFTEIncome: number;
  workRelatedCostsPerWeek: number;
  partnerIncome: number;
}

// ─── Main Resolver ──────────────────────────────────────────────────────────

/**
 * Resolve all wizard inputs into concrete calculation-ready values.
 *
 * @param inputs         Raw wizard inputs.
 * @param stateAverages  State average fee data.
 * @returns              Fully resolved inputs.
 */
export function resolveInputs(
  inputs: WizardInputs,
  stateAverages: StateAverageEntry[]
): ResolvedInputs {
  const ageGroup = resolveAgeGroup(inputs.youngestChildAge);
  const dailyFee = resolveDailyFee(inputs, stateAverages);
  const hoursPerDay = resolveHoursPerDay(inputs.hoursPerDay, inputs.careType);
  const eligibleForHigherRate = isEligibleForHigherRate(
    inputs.numberOfChildren,
    inputs.youngestChildAge
  );

  // Derive partner income (combined minus user's current individual income)
  const partnerIncome = Math.max(
    0,
    inputs.combinedAnnualIncome - inputs.currentAnnualIncome
  );

  return {
    // Family
    numberOfChildren: inputs.numberOfChildren,
    youngestChildAge: inputs.youngestChildAge,
    ageGroup,
    eligibleForHigherRate,

    // Income
    combinedAnnualIncome: inputs.combinedAnnualIncome,

    // Childcare
    careType: inputs.careType,
    state: inputs.state,
    daysPerWeek: inputs.daysPerWeek,
    hoursPerDay,
    dailyFee,
    usingStateAverage: inputs.useStateAverage,

    // Back-to-work
    includeBackToWork: inputs.includeBackToWork,
    currentIndividualIncome: inputs.currentAnnualIncome,
    proposedFTEIncome: inputs.proposedAnnualIncome,
    workRelatedCostsPerWeek: inputs.workRelatedCostsPerWeek,
    partnerIncome,
  };
}
