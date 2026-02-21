// =============================================================================
// CCS CALCULATION ENGINE
// =============================================================================
// All functions are pure — they take explicit inputs (including rates object)
// and return typed results with calculation breakdowns.
//
// Source: Services Australia & Department of Education
// https://www.servicesaustralia.gov.au/child-care-subsidy
// https://www.education.gov.au/early-childhood/child-care-subsidy
// =============================================================================

import type {
  CCSRates,
  CareType,
  State,
  StateAverageEntry,
} from './types';

// ─── Result Types ───────────────────────────────────────────────────────────

export interface CCSPercentageResult {
  /** CCS subsidy percentage (0–90 for standard, 0–95 for higher rate) */
  percent: number;
  /** Dollars above the base income threshold ($85,279) */
  incomeAboveThreshold: number;
  /** Number of $5,000 brackets above threshold (used to calculate reduction) */
  bracketsAbove: number;
  /** Total percentage points lost due to income taper */
  percentReduction: number;
}

export interface HigherCCSResult {
  /** The higher CCS rate for younger children (0–95%) */
  higherPercent: number;
  /** The standard CCS rate (eldest child's rate) */
  standardPercent: number;
  /** Percentage points added to eldest child's rate */
  additionalPoints: number;
  /** Whether the result was capped at 95% */
  wasCapped: boolean;
}

export interface SessionCCSResult {
  /** Daily fee used in calculation (actual or state average) */
  dailyFeeUsed: number;
  /** Calculated hourly fee (dailyFee / hoursPerDay) */
  hourlyFee: number;
  /** Applicable hourly rate cap for care type + age group */
  hourlyRateCap: number;
  /** Lower of hourlyFee and hourlyRateCap — rate subsidy applies to */
  effectiveHourlyRate: number;
  /** Hourly fee above cap — always fully out-of-pocket */
  feeAboveCapPerHour: number;
  /** Subsidy per hour: effectiveHourlyRate × (ccsPercent / 100) */
  subsidyPerHour: number;
  /** Subsidy per session (day): subsidyPerHour × hoursPerDay */
  subsidyPerSession: number;
  /** Family pays per session: dailyFee − subsidyPerSession */
  outOfPocketPerSession: number;
  /** The CCS percentage applied */
  ccsPercent: number;
}

export interface AnnualCostResult {
  // ── Per fortnight ──
  grossFeePerFortnight: number;
  subsidyPerFortnight: number;
  withholdingPerFortnight: number;
  /** Gap fee excluding withholding */
  outOfPocketPerFortnight: number;
  /** Gap fee + withholding — what family actually pays each fortnight */
  netOutOfPocketPerFortnight: number;

  // ── Per week ──
  grossFeePerWeek: number;
  subsidyPerWeek: number;
  outOfPocketPerWeek: number;
  /** What family actually pays per week (including withholding effect) */
  netOutOfPocketPerWeek: number;

  // ── Per year ──
  grossFeePerYear: number;
  subsidyPerYear: number;
  withholdingPerYear: number;
  /** Total gap fee per year (before withholding reconciliation) */
  outOfPocketPerYear: number;
  /** What family pays per year during the year (gap + withholding) */
  netOutOfPocketPerYear: number;
}

// ─── 2.1: Standard CCS Percentage ──────────────────────────────────────────
//
// Formula: max(0, 90 − ceil((income − 85279) / 5000) × 1)
//
// Worked examples:
//   $80,000  → 90%   (at or below threshold)
//   $85,279  → 90%   (exactly at threshold)
//   $85,280  → 89%   (ceil(1/5000) = 1 bracket → −1%)
//   $90,279  → 89%   (ceil(5000/5000) = 1 bracket → −1%)
//   $90,280  → 88%   (ceil(5001/5000) = 2 brackets → −2%)
//   $135,279 → 80%   (ceil(50000/5000) = 10 brackets → −10%)
//   $535,279 → 0%    (ceil(450000/5000) = 90 brackets → −90%)
//   $600,000 → 0%    (clamped to 0%)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the standard CCS subsidy percentage based on combined family income.
 *
 * @param income  Combined annual family income (AUD). Values ≤ 0 treated as
 *                below threshold (returns max rate).
 * @param rates   CCS rates data loaded from current.json.
 * @returns       CCS percentage and calculation breakdown.
 */
export function calculateCCSPercentage(
  income: number,
  rates: CCSRates
): CCSPercentageResult {
  const {
    maxSubsidyPercent,
    baseIncomeThreshold,
    taperPer5000,
    minSubsidyPercent,
  } = rates.standardSubsidy;

  // At or below threshold → maximum rate
  if (income <= baseIncomeThreshold) {
    return {
      percent: maxSubsidyPercent,
      incomeAboveThreshold: 0,
      bracketsAbove: 0,
      percentReduction: 0,
    };
  }

  // Calculate income taper
  const incomeAboveThreshold = income - baseIncomeThreshold;
  const bracketsAbove = Math.ceil(incomeAboveThreshold / 5000);
  const percentReduction = bracketsAbove * taperPer5000;
  const percent = Math.max(minSubsidyPercent, maxSubsidyPercent - percentReduction);

  return {
    percent,
    incomeAboveThreshold,
    bracketsAbove,
    percentReduction,
  };
}

// ─── 2.2: Higher CCS Percentage (Multiple Children) ────────────────────────
//
// From 10 July 2023, families with 2+ children aged 5 or under in approved
// childcare receive a higher rate for each younger child:
//
//   higherRate = min(95%, standardRate + 30 percentage points)
//
// The eldest child in approved care still receives the standard rate.
//
// Worked examples (standard → higher):
//   90% → min(95, 120) = 95%  (capped)
//   85% → min(95, 115) = 95%  (capped)
//   65% → min(95, 95)  = 95%  (exactly at cap)
//   64% → min(95, 94)  = 94%
//   50% → min(95, 80)  = 80%
//   20% → min(95, 50)  = 50%
//   0%  → min(95, 30)  = 30%
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the higher CCS rate for younger children in multi-child families.
 *
 * @param standardPercent  The standard CCS% from calculateCCSPercentage().
 * @param rates            CCS rates data.
 * @returns                Higher rate result and breakdown.
 */
export function calculateHigherCCSPercentage(
  standardPercent: number,
  rates: CCSRates
): HigherCCSResult {
  const { additionalPercentagePoints, maxSubsidyPercent } = rates.higherSubsidy;

  const uncapped = standardPercent + additionalPercentagePoints;
  const higherPercent = Math.min(maxSubsidyPercent, uncapped);

  return {
    higherPercent,
    standardPercent,
    additionalPoints: additionalPercentagePoints,
    wasCapped: uncapped > maxSubsidyPercent,
  };
}

// ─── Hourly Rate Cap Lookup ─────────────────────────────────────────────────

/**
 * Get the applicable hourly rate cap for a given care type and age group.
 *
 * Rate caps limit the hourly fee on which the subsidy is calculated.
 * Any fee above the cap is fully out-of-pocket for the family.
 *
 * FY 2025–26 caps:
 *   Centre-based (below school age):  $14.63/hr
 *   Centre-based (school age):        $12.81/hr
 *   Family day care (all ages):       $12.43/hr
 *   OSHC (school age):                $12.81/hr
 *   In-home care (all ages):          $35.40/hr (per family)
 *
 * @param careType  Type of childcare service.
 * @param ageGroup  'below_school_age' or 'school_age'.
 * @param rates     CCS rates data.
 * @returns         Hourly rate cap in AUD.
 * @throws          Error if no matching cap found (data integrity issue).
 */
export function getHourlyRateCap(
  careType: CareType,
  ageGroup: 'below_school_age' | 'school_age',
  rates: CCSRates
): number {
  // Try exact match first, then fallback to 'all' age group
  const cap = rates.hourlyRateCaps.find(
    (c) =>
      c.careType === careType &&
      (c.ageGroup === ageGroup || c.ageGroup === 'all')
  );

  if (!cap) {
    throw new Error(
      `No hourly rate cap found for care type "${careType}" and age group "${ageGroup}". ` +
        `Check CCS rates data integrity.`
    );
  }

  return cap.ratePerHour;
}

// ─── State Average Fee Lookup ───────────────────────────────────────────────

/**
 * Get the average daily fee for a state and care type.
 *
 * Used when the user doesn't know their exact daily fee and opts to use
 * the state average instead.
 *
 * @param state          Australian state/territory code.
 * @param careType       Type of childcare. In-home care is not supported
 *                       (no meaningful average — user must enter actual fee).
 * @param stateAverages  State average data loaded from state-averages.json.
 * @returns              Average daily fee in AUD.
 * @throws               Error if state not found or care type not available.
 */
export function getStateAverageDailyFee(
  state: State,
  careType: Exclude<CareType, 'in_home_care'>,
  stateAverages: StateAverageEntry[]
): number {
  const entry = stateAverages.find((s) => s.state === state);
  if (!entry) {
    throw new Error(`No state average data found for "${state}".`);
  }

  const fee = entry.averageDailyFee[careType];
  if (fee == null) {
    throw new Error(
      `No average daily fee found for "${careType}" in "${state}".`
    );
  }

  return fee;
}

// ─── 2.3: Per-Session CCS Amount ────────────────────────────────────────────
//
// The subsidy is calculated on the LOWER of the actual hourly fee or the
// hourly rate cap. Any fee above the cap is fully out-of-pocket.
//
// Worked example (centre-based, below school age, $160/day, 10hr, 85% CCS):
//   Hourly fee:        $160 / 10 = $16.00/hr
//   Rate cap:          $14.63/hr
//   Effective hourly:  min($16.00, $14.63) = $14.63/hr
//   Fee above cap:     $16.00 − $14.63 = $1.37/hr (family always pays this)
//   Subsidy/hr:        $14.63 × 0.85 = $12.44/hr
//   Subsidy/session:   $12.44 × 10 = $124.36
//   Out-of-pocket:     $160.00 − $124.36 = $35.64/session
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the CCS subsidy for a single childcare session (one day).
 *
 * @param dailyFee     Daily fee charged by the provider (AUD).
 * @param hoursPerDay  Hours of care per session (e.g. 10 for full day).
 * @param ccsPercent   The applicable CCS percentage (0–95).
 * @param careType     Type of care (determines which rate cap applies).
 * @param ageGroup     Child's age group for rate cap purposes.
 * @param rates        CCS rates data.
 * @returns            Per-session subsidy breakdown.
 */
export function calculateSessionCCS(
  dailyFee: number,
  hoursPerDay: number,
  ccsPercent: number,
  careType: CareType,
  ageGroup: 'below_school_age' | 'school_age',
  rates: CCSRates
): SessionCCSResult {
  if (hoursPerDay <= 0) {
    throw new Error('hoursPerDay must be greater than 0.');
  }
  if (dailyFee < 0) {
    throw new Error('dailyFee cannot be negative.');
  }

  const hourlyFee = dailyFee / hoursPerDay;
  const hourlyRateCap = getHourlyRateCap(careType, ageGroup, rates);
  const effectiveHourlyRate = Math.min(hourlyFee, hourlyRateCap);
  const feeAboveCapPerHour = Math.max(0, hourlyFee - hourlyRateCap);

  const subsidyPerHour = effectiveHourlyRate * (ccsPercent / 100);
  const subsidyPerSession = subsidyPerHour * hoursPerDay;
  const outOfPocketPerSession = dailyFee - subsidyPerSession;

  return {
    dailyFeeUsed: round2(dailyFee),
    hourlyFee: round2(hourlyFee),
    hourlyRateCap,
    effectiveHourlyRate: round2(effectiveHourlyRate),
    feeAboveCapPerHour: round2(feeAboveCapPerHour),
    subsidyPerHour: round2(subsidyPerHour),
    subsidyPerSession: round2(subsidyPerSession),
    outOfPocketPerSession: round2(outOfPocketPerSession),
    ccsPercent,
  };
}

// ─── 2.4: Annual Cost Calculation ───────────────────────────────────────────
//
// Annualises per-session costs and applies 5% withholding.
//
// Services Australia withholds 5% of CCS each fortnight as a buffer against
// end-of-year reconciliation debts. The withheld amount is refunded at year
// end for most families (those who estimated income correctly).
//
// During the year, the family pays:
//   gap fee + withholding = (dailyFee − subsidy) + (subsidy × 5%)
//
// After reconciliation, if income was estimated correctly:
//   annual cost = gap fee only (withholding refunded)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Annualise a per-session result into fortnightly, weekly, and annual figures.
 *
 * @param session             Per-session CCS result from calculateSessionCCS().
 * @param daysPerWeek         Days of care per week (1–5).
 * @param withholdingPercent  Percentage of CCS withheld (default 5%).
 * @param weeksPerYear        Weeks of care per year (default 52).
 * @returns                   Annualised cost breakdown at all time horizons.
 */
export function calculateAnnualCost(
  session: SessionCCSResult,
  daysPerWeek: number,
  withholdingPercent: number = 5,
  weeksPerYear: number = 52
): AnnualCostResult {
  if (daysPerWeek < 1 || daysPerWeek > 5) {
    throw new Error('daysPerWeek must be between 1 and 5.');
  }

  // ── Per fortnight (base unit for CCS payments) ──
  const sessionsPerFortnight = daysPerWeek * 2;
  const grossFeePerFortnight = session.dailyFeeUsed * sessionsPerFortnight;
  const subsidyPerFortnight = session.subsidyPerSession * sessionsPerFortnight;
  const withholdingPerFortnight =
    subsidyPerFortnight * (withholdingPercent / 100);
  const outOfPocketPerFortnight = grossFeePerFortnight - subsidyPerFortnight;
  const netOutOfPocketPerFortnight =
    outOfPocketPerFortnight + withholdingPerFortnight;

  // ── Per week (for easy comparison with weekly budgets) ──
  const grossFeePerWeek = session.dailyFeeUsed * daysPerWeek;
  const subsidyPerWeek = session.subsidyPerSession * daysPerWeek;
  const outOfPocketPerWeek = grossFeePerWeek - subsidyPerWeek;
  const netOutOfPocketPerWeek =
    outOfPocketPerWeek + withholdingPerFortnight / 2;

  // ── Per year (52 weeks standard) ──
  const grossFeePerYear = session.dailyFeeUsed * daysPerWeek * weeksPerYear;
  const subsidyPerYear = session.subsidyPerSession * daysPerWeek * weeksPerYear;
  const withholdingPerYear = subsidyPerYear * (withholdingPercent / 100);
  const outOfPocketPerYear = grossFeePerYear - subsidyPerYear;
  const netOutOfPocketPerYear = outOfPocketPerYear + withholdingPerYear;

  return {
    grossFeePerFortnight: round2(grossFeePerFortnight),
    subsidyPerFortnight: round2(subsidyPerFortnight),
    withholdingPerFortnight: round2(withholdingPerFortnight),
    outOfPocketPerFortnight: round2(outOfPocketPerFortnight),
    netOutOfPocketPerFortnight: round2(netOutOfPocketPerFortnight),

    grossFeePerWeek: round2(grossFeePerWeek),
    subsidyPerWeek: round2(subsidyPerWeek),
    outOfPocketPerWeek: round2(outOfPocketPerWeek),
    netOutOfPocketPerWeek: round2(netOutOfPocketPerWeek),

    grossFeePerYear: round2(grossFeePerYear),
    subsidyPerYear: round2(subsidyPerYear),
    withholdingPerYear: round2(withholdingPerYear),
    outOfPocketPerYear: round2(outOfPocketPerYear),
    netOutOfPocketPerYear: round2(netOutOfPocketPerYear),
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────

/** Round to 2 decimal places (cents). */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
