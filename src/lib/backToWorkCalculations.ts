// =============================================================================
// BACK-TO-WORK CALCULATION ENGINE
// =============================================================================
// The signature differentiator: "Is it financially worth going back to work?"
//
// Compares the family's financial position across 1–5 day working scenarios,
// accounting for:
//   1. Additional income tax on the second earner
//   2. Reduced CCS% due to higher combined family income
//   3. Work-related costs (transport, uniforms, meals)
//
// All functions are pure. They compose ccsCalculations and taxCalculations.
// =============================================================================

import type { CCSRates, CareType, TaxRates } from './types';
import {
  calculateCCSPercentage,
  calculateSessionCCS,
  calculateAnnualCost,
  type SessionCCSResult,
  type AnnualCostResult,
} from './ccsCalculations';
import { calculateIncomeTax, type IncomeTaxResult } from './taxCalculations';

// ─── Result Types ───────────────────────────────────────────────────────────

export interface BackToWorkScenario {
  /** Number of days working per week (1–5) */
  daysWorking: number;
  /** Gross income proportional to FTE: (days/5) × fteIncome */
  grossIncome: number;
  /** Individual income tax breakdown */
  tax: IncomeTaxResult;
  /** Net individual income after tax */
  netIncome: number;
  /** Combined family income at this scenario */
  combinedFamilyIncome: number;
  /** CCS percentage at this combined income */
  ccsPercent: number;
  /** Per-session childcare breakdown at new CCS% */
  sessionCCS: SessionCCSResult;
  /** Annualised childcare cost at this scenario's days and CCS% */
  annualChildcare: AnnualCostResult;
  /** Annual work-related costs: (days/5) × weeklyWorkCosts × 52 */
  annualWorkCosts: number;
  /** Net financial benefit vs. current situation */
  netBenefit: number;
  /** Effective hourly rate: netBenefit / (days × hoursPerDay × 52) */
  effectiveHourlyRate: number | null;
  /** Whether returning to work is financially positive */
  isWorthIt: boolean;
}

export interface CurrentSituation {
  /** Current individual income */
  grossIncome: number;
  /** Tax on current individual income */
  tax: IncomeTaxResult;
  /** Net income after tax */
  netIncome: number;
  /** Current combined family income */
  combinedFamilyIncome: number;
  /** Current CCS percentage */
  ccsPercent: number;
  /** Current annual childcare out-of-pocket */
  annualChildcareCost: number;
}

export interface BackToWorkResult {
  /** Current financial situation (baseline) */
  current: CurrentSituation;
  /** Scenarios for 1–5 working days */
  scenarios: BackToWorkScenario[];
  /** Best scenario (highest net benefit), or null if all negative */
  bestScenario: BackToWorkScenario | null;
  /** Break-even income: minimum FTE salary where at least 1 scenario is positive */
  breakEvenFTEIncome: number | null;
}

// ─── Input Parameters ───────────────────────────────────────────────────────

export interface BackToWorkParams {
  /** Current combined family income (from Step 2) */
  combinedAnnualIncome: number;
  /** Current individual income of the person considering work (could be $0) */
  currentIndividualIncome: number;
  /** Proposed full-time equivalent (FTE) annual income */
  proposedFTEIncome: number;
  /** Weekly work-related costs (transport, uniforms, meals, etc.) */
  workRelatedCostsPerWeek: number;
  /** Current days of childcare per week (from Step 3) */
  currentDaysInCare: number;
  /** Daily childcare fee */
  dailyFee: number;
  /** Hours per day of care */
  hoursPerDay: number;
  /** Type of care */
  careType: CareType;
  /** Child age group for rate cap */
  ageGroup: 'below_school_age' | 'school_age';
  /** Standard work hours per day (for effective hourly rate calc) */
  workHoursPerDay?: number;
}

// ─── 2.6: Back-to-Work Calculation ──────────────────────────────────────────
//
// For each scenario (1–5 days working per week):
//
//   1. Proportional income = (daysWorking / 5) × proposedFTEIncome
//   2. Partner income = combinedIncome − currentIndividualIncome
//   3. New combined = partner income + proportional income
//   4. New CCS% at higher combined income (LOWER subsidy)
//   5. New annual childcare cost at new CCS% and max(currentDays, daysWorking)
//   6. Individual tax on proportional income
//   7. Annual work costs proportional to days
//   8. Net benefit = (newNetIncome − currentNetIncome)
//                  − (newChildcareCost − currentChildcareCost)
//                  − annualWorkCosts
//
// Worked example (partner earns $100k, FTE offer $80k, $160/day × 10hr,
//                 centre-based below school age, 3 days currently in care):
//
//   Current: combined = $100k, CCS = 88%, childcare OOP ≈ $2,995/yr (3 days)
//   3-day scenario: income = $48k, combined = $148k, CCS = 78%,
//     childcare OOP ≈ $5,491/yr, tax ≈ $5,928, work costs ≈ $3,120
//     Net benefit = ($48k − $5,928) − ($5,491 − $2,995) − $3,120 = $36,456
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the full back-to-work analysis with scenarios for 1–5 days.
 *
 * @param params    Input parameters (income, childcare details, work costs).
 * @param ccsRates  CCS rates data.
 * @param taxRates  Tax rates data.
 * @returns         Current situation, 1–5 day scenarios, best scenario.
 */
export function calculateBackToWork(
  params: BackToWorkParams,
  ccsRates: CCSRates,
  taxRates: TaxRates
): BackToWorkResult {
  const {
    combinedAnnualIncome,
    currentIndividualIncome,
    proposedFTEIncome,
    workRelatedCostsPerWeek,
    currentDaysInCare,
    dailyFee,
    hoursPerDay,
    careType,
    ageGroup,
    workHoursPerDay = 8,
  } = params;

  const partnerIncome = combinedAnnualIncome - currentIndividualIncome;

  // ── Current baseline ──────────────────────────────────────────────────
  const currentTax = calculateIncomeTax(currentIndividualIncome, taxRates);
  const currentCCSResult = calculateCCSPercentage(
    combinedAnnualIncome,
    ccsRates
  );
  const currentSession = calculateSessionCCS(
    dailyFee,
    hoursPerDay,
    currentCCSResult.percent,
    careType,
    ageGroup,
    ccsRates
  );

  // Use currentDaysInCare (clamped to 1–5) for current childcare cost
  const clampedCurrentDays = Math.max(1, Math.min(5, currentDaysInCare));
  const currentAnnual = calculateAnnualCost(
    currentSession,
    clampedCurrentDays,
    ccsRates.withholdingPercent
  );

  const current: CurrentSituation = {
    grossIncome: currentIndividualIncome,
    tax: currentTax,
    netIncome: currentTax.netIncome,
    combinedFamilyIncome: combinedAnnualIncome,
    ccsPercent: currentCCSResult.percent,
    annualChildcareCost: currentAnnual.outOfPocketPerYear,
  };

  // ── Generate 1–5 day scenarios ────────────────────────────────────────
  const scenarios: BackToWorkScenario[] = [];

  for (let days = 1; days <= 5; days++) {
    // 1. Proportional income
    const grossIncome = round2((days / 5) * proposedFTEIncome);

    // 2. New combined income
    const newCombinedIncome = round2(partnerIncome + grossIncome);

    // 3. Tax on individual income
    const tax = calculateIncomeTax(grossIncome, taxRates);

    // 4. CCS% at new combined income
    const ccsResult = calculateCCSPercentage(newCombinedIncome, ccsRates);

    // 5. Childcare cost: child needs max(currentDays, daysWorking) days
    const childcareDays = Math.max(clampedCurrentDays, days);
    const session = calculateSessionCCS(
      dailyFee,
      hoursPerDay,
      ccsResult.percent,
      careType,
      ageGroup,
      ccsRates
    );
    const annualChildcare = calculateAnnualCost(
      session,
      childcareDays,
      ccsRates.withholdingPercent
    );

    // 6. Work costs (proportional to days worked)
    const annualWorkCosts = round2(
      workRelatedCostsPerWeek * (days / 5) * 52
    );

    // 7. Net benefit
    //    = (newNetIncome − currentNetIncome)
    //    − (newChildcareCost − currentChildcareCost)
    //    − workCosts
    const additionalNetIncome = tax.netIncome - current.netIncome;
    const additionalChildcareCost =
      annualChildcare.outOfPocketPerYear - current.annualChildcareCost;
    const netBenefit = round2(
      additionalNetIncome - additionalChildcareCost - annualWorkCosts
    );

    // 8. Effective hourly rate
    const annualHoursWorked = days * workHoursPerDay * 52;
    const effectiveHourlyRate =
      annualHoursWorked > 0
        ? round2(netBenefit / annualHoursWorked)
        : null;

    scenarios.push({
      daysWorking: days,
      grossIncome,
      tax,
      netIncome: tax.netIncome,
      combinedFamilyIncome: newCombinedIncome,
      ccsPercent: ccsResult.percent,
      sessionCCS: session,
      annualChildcare,
      annualWorkCosts,
      netBenefit,
      effectiveHourlyRate,
      isWorthIt: netBenefit > 0,
    });
  }

  // ── Find best scenario ────────────────────────────────────────────────
  const positiveScenarios = scenarios.filter((s) => s.netBenefit > 0);
  const bestScenario =
    positiveScenarios.length > 0
      ? positiveScenarios.reduce((best, s) =>
          s.netBenefit > best.netBenefit ? s : best
        )
      : null;

  return {
    current,
    scenarios,
    bestScenario,
    breakEvenFTEIncome: null, // TODO: binary search for break-even if needed
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
