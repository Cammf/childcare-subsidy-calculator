// =============================================================================
// CALCULATION ORCHESTRATOR — Single Entry Point
// =============================================================================
// Chains all calculation functions in the correct order.
// Called from the results page with raw WizardInputs.
//
// Flow:
//   1. resolveInputs      → concrete values (fee, age group, etc.)
//   2. calculateCCSPercentage  → standard rate for eldest/only child
//   3. calculateHigherCSSPercentage → younger children rate (if eligible)
//   4. calculateSessionCCS → per-session subsidy breakdown
//   5. calculateAnnualCost → fortnightly / weekly / annual figures
//   6. calculateBackToWork → optional, 1–5 day scenarios (if Step 4)
//   7. calculateIncomeSensitivity → income vs cost data series
// =============================================================================

import type { WizardInputs, CCSRates, TaxRates, StateAverageEntry } from './types';
import { resolveInputs, type ResolvedInputs } from './resolveInputs';
import {
  calculateCCSPercentage,
  calculateHigherCCSPercentage,
  calculateSessionCCS,
  calculateAnnualCost,
  type CCSPercentageResult,
  type HigherCCSResult,
  type SessionCCSResult,
  type AnnualCostResult,
} from './ccsCalculations';
import { calculateBackToWork, type BackToWorkResult } from './backToWorkCalculations';
import {
  calculateIncomeSensitivity,
  type IncomeSensitivityResult,
} from './incomeSensitivity';

// ─── Output Type ────────────────────────────────────────────────────────────

export interface CalculationOutput {
  /** Fully resolved inputs — what was actually used in calculations */
  resolved: ResolvedInputs;

  // ── CCS Results ──

  /** Standard CCS% and taper breakdown for eldest/only child */
  ccsPercentage: CCSPercentageResult;

  /**
   * Higher rate for younger children (only present if numberOfChildren ≥ 2
   * and youngest child is under 6). Absent for single-child families.
   */
  higherCCS: HigherCCSResult | null;

  /**
   * Per-session subsidy calculation.
   * Uses higherCCS rate if eligible, otherwise standard rate.
   * For multi-child families, this represents the younger child's session.
   * The eldest child session is in `eldestChildSession`.
   */
  session: SessionCCSResult;

  /**
   * Per-session for eldest child (standard rate).
   * Only present when higherCCS is also present — otherwise same as `session`.
   */
  eldestChildSession: SessionCCSResult | null;

  /** Annualised cost at the primary session rate (younger child if multi-child) */
  annual: AnnualCostResult;

  /** Annualised cost for eldest child (standard rate). Null for single-child. */
  eldestChildAnnual: AnnualCostResult | null;

  // ── Combined Family Totals (multi-child) ──

  /**
   * Total annual out-of-pocket for all children combined.
   * For single-child: same as annual.outOfPocketPerYear
   * For multi-child: youngest + eldest annual costs
   */
  totalAnnualOutOfPocket: number;
  totalAnnualGovSubsidy: number;
  totalWeeklyOutOfPocket: number;

  // ── Back-to-Work ──

  /** Back-to-work scenarios (null if user skipped Step 4) */
  backToWork: BackToWorkResult | null;

  // ── Income Sensitivity ──

  /** Income sensitivity data series for chart/table */
  sensitivity: IncomeSensitivityResult;

  // ── Metadata ──

  ratesVersion: string;
  calculatedAt: string;
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

/**
 * Run the complete calculation suite from raw wizard inputs.
 *
 * This is the single entry point called by the results page.
 * All intermediate results are returned for transparency/display.
 *
 * @param inputs         Raw wizard inputs from the wizard context.
 * @param ccsRates       CCS rates data (from current.json).
 * @param taxRates       Tax rates data (from current.json).
 * @param stateAverages  State average fee data (from state-averages.json).
 * @returns              Complete calculation output.
 */
export function runCalculations(
  inputs: WizardInputs,
  ccsRates: CCSRates,
  taxRates: TaxRates,
  stateAverages: StateAverageEntry[]
): CalculationOutput {
  const now = new Date().toISOString();

  // ── Step 1: Resolve inputs ──────────────────────────────────────────────
  const resolved = resolveInputs(inputs, stateAverages);

  // ── Step 2: Standard CCS percentage ────────────────────────────────────
  const ccsPercentage = calculateCCSPercentage(
    resolved.combinedAnnualIncome,
    ccsRates
  );

  // ── Step 3: Higher rate (if eligible) ──────────────────────────────────
  const higherCCS = resolved.eligibleForHigherRate
    ? calculateHigherCCSPercentage(ccsPercentage.percent, ccsRates)
    : null;

  // ── Step 4: Per-session subsidy ─────────────────────────────────────────
  //
  // For multi-child families:
  //   - Youngest child → higher rate session
  //   - Eldest child   → standard rate session
  // For single-child families:
  //   - Only child     → standard rate session

  // Primary session: younger child (higher rate) or only child (standard)
  const primaryCCSPercent = higherCCS
    ? higherCCS.higherPercent
    : ccsPercentage.percent;

  const session = calculateSessionCCS(
    resolved.dailyFee,
    resolved.hoursPerDay,
    primaryCCSPercent,
    resolved.careType,
    resolved.ageGroup,
    ccsRates
  );

  // Eldest child session (standard rate) — only for multi-child families
  const eldestChildSession = higherCCS
    ? calculateSessionCCS(
        resolved.dailyFee,
        resolved.hoursPerDay,
        ccsPercentage.percent,
        resolved.careType,
        resolved.ageGroup,
        ccsRates
      )
    : null;

  // ── Step 5: Annualise ───────────────────────────────────────────────────
  const annual = calculateAnnualCost(
    session,
    resolved.daysPerWeek,
    ccsRates.withholdingPercent
  );

  const eldestChildAnnual = eldestChildSession
    ? calculateAnnualCost(
        eldestChildSession,
        resolved.daysPerWeek,
        ccsRates.withholdingPercent
      )
    : null;

  // ── Step 5b: Combined family totals ────────────────────────────────────
  // For multi-child: youngest child cost + (numberOfChildren - 1) × eldest child cost
  // This is a simplification — assumes all children use the same care type/days/fee
  const youngerChildrenCount = resolved.numberOfChildren - 1;
  const totalAnnualOutOfPocket = eldestChildAnnual
    ? round2(
        annual.outOfPocketPerYear +
          eldestChildAnnual.outOfPocketPerYear * youngerChildrenCount
      )
    : annual.outOfPocketPerYear;

  const totalAnnualGovSubsidy = eldestChildAnnual
    ? round2(
        annual.subsidyPerYear +
          eldestChildAnnual.subsidyPerYear * youngerChildrenCount
      )
    : annual.subsidyPerYear;

  const totalWeeklyOutOfPocket = eldestChildAnnual
    ? round2(
        annual.outOfPocketPerWeek +
          eldestChildAnnual.outOfPocketPerWeek * youngerChildrenCount
      )
    : annual.outOfPocketPerWeek;

  // ── Step 6: Back-to-work analysis (optional) ────────────────────────────
  const backToWork = resolved.includeBackToWork
    ? calculateBackToWork(
        {
          combinedAnnualIncome: resolved.combinedAnnualIncome,
          currentIndividualIncome: resolved.currentIndividualIncome,
          proposedFTEIncome: resolved.proposedFTEIncome,
          workRelatedCostsPerWeek: resolved.workRelatedCostsPerWeek,
          currentDaysInCare: resolved.daysPerWeek,
          dailyFee: resolved.dailyFee,
          hoursPerDay: resolved.hoursPerDay,
          careType: resolved.careType,
          ageGroup: resolved.ageGroup,
        },
        ccsRates,
        taxRates
      )
    : null;

  // ── Step 7: Income sensitivity ──────────────────────────────────────────
  const sensitivity = calculateIncomeSensitivity(
    {
      userIncome: resolved.combinedAnnualIncome,
      dailyFee: resolved.dailyFee,
      hoursPerDay: resolved.hoursPerDay,
      daysPerWeek: resolved.daysPerWeek,
      careType: resolved.careType,
      ageGroup: resolved.ageGroup,
    },
    ccsRates
  );

  // ── Assemble output ─────────────────────────────────────────────────────
  return {
    resolved,
    ccsPercentage,
    higherCCS,
    session,
    eldestChildSession,
    annual,
    eldestChildAnnual,
    totalAnnualOutOfPocket,
    totalAnnualGovSubsidy,
    totalWeeklyOutOfPocket,
    backToWork,
    sensitivity,
    ratesVersion: ccsRates.financialYear,
    calculatedAt: now,
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

