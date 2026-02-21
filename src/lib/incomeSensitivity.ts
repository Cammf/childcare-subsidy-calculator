// =============================================================================
// INCOME SENSITIVITY ANALYSIS
// =============================================================================
// Generates a data series showing how CCS% and out-of-pocket childcare cost
// change across the full income spectrum ($40k–$600k).
//
// Used to render:
//   - Income vs. cost charts/tables on the results page
//   - "Sweet spots" where the effective marginal rate is lowest
//   - "Pain points" where earning $1 more costs the family most
//
// All functions are pure.
// =============================================================================

import type { CCSRates, CareType, IncomeSensitivityRow } from './types';
import {
  calculateCCSPercentage,
  calculateSessionCCS,
  calculateAnnualCost,
} from './ccsCalculations';

// ─── Result Types ───────────────────────────────────────────────────────────

export interface IncomeSensitivityResult {
  /** Data rows at every $5,000 income increment */
  rows: IncomeSensitivityRow[];
  /** User's position in the table (closest row to their income) */
  userRowIndex: number;
  /** Income at which CCS% first drops to 0 */
  zeroCCSIncome: number;
  /** Income range where effective marginal rate is highest (worst value) */
  highestMarginalRange: {
    incomeFrom: number;
    incomeTo: number;
    costIncrease: number;
  } | null;
  /** Income range where effective marginal rate is lowest (best value) */
  lowestMarginalRange: {
    incomeFrom: number;
    incomeTo: number;
    costIncrease: number;
  } | null;
}

// ─── Input Parameters ───────────────────────────────────────────────────────

export interface IncomeSensitivityParams {
  /** User's combined annual family income (to highlight in results) */
  userIncome: number;
  /** Daily childcare fee */
  dailyFee: number;
  /** Hours per day of care */
  hoursPerDay: number;
  /** Days per week of care */
  daysPerWeek: number;
  /** Type of care */
  careType: CareType;
  /** Child age group for rate cap */
  ageGroup: 'below_school_age' | 'school_age';
  /** Minimum income to start from (default $40,000) */
  incomeMin?: number;
  /** Maximum income to end at (default $600,000) */
  incomeMax?: number;
  /** Increment between rows (default $5,000) */
  increment?: number;
}

// ─── 2.7: Income Sensitivity Calculation ────────────────────────────────────
//
// For each income point from $40k to $600k (every $5k):
//   1. Calculate CCS% at that income
//   2. Calculate per-session subsidy
//   3. Annualise to get weekly/annual out-of-pocket and government subsidy
//   4. Track where CCS drops to 0%
//   5. Find the $5k range with the biggest/smallest cost jump
//
// The "effective marginal rate on childcare" is the increase in annual
// out-of-pocket cost for each $5,000 income increase. High marginal
// ranges are where earning more hurts the most.
// ────────────────────────────────────────────────────────────────────────────

/**
 * Generate an income sensitivity data series.
 *
 * @param params    Input parameters (childcare details + income range).
 * @param ccsRates  CCS rates data.
 * @returns         Data rows, user position, and marginal rate insights.
 */
export function calculateIncomeSensitivity(
  params: IncomeSensitivityParams,
  ccsRates: CCSRates
): IncomeSensitivityResult {
  const {
    userIncome,
    dailyFee,
    hoursPerDay,
    daysPerWeek,
    careType,
    ageGroup,
    incomeMin = 40000,
    incomeMax = 600000,
    increment = 5000,
  } = params;

  const rows: IncomeSensitivityRow[] = [];
  let zeroCCSIncome = incomeMax;
  let userRowIndex = 0;
  let minUserDistance = Infinity;

  // Generate rows
  for (let income = incomeMin; income <= incomeMax; income += increment) {
    const ccsResult = calculateCCSPercentage(income, ccsRates);

    const session = calculateSessionCCS(
      dailyFee,
      hoursPerDay,
      ccsResult.percent,
      careType,
      ageGroup,
      ccsRates
    );

    const annual = calculateAnnualCost(
      session,
      daysPerWeek,
      ccsRates.withholdingPercent
    );

    rows.push({
      income,
      subsidyPercent: ccsResult.percent,
      weeklyOutOfPocket: annual.outOfPocketPerWeek,
      annualOutOfPocket: annual.outOfPocketPerYear,
      annualGovSubsidy: annual.subsidyPerYear,
    });

    // Track first income where CCS = 0%
    if (ccsResult.percent === 0 && income < zeroCCSIncome) {
      zeroCCSIncome = income;
    }

    // Track closest row to user's income
    const distance = Math.abs(income - userIncome);
    if (distance < minUserDistance) {
      minUserDistance = distance;
      userRowIndex = rows.length - 1;
    }
  }

  // ── Find highest and lowest marginal ranges ────────────────────────────
  let highestMarginalRange: IncomeSensitivityResult['highestMarginalRange'] =
    null;
  let lowestMarginalRange: IncomeSensitivityResult['lowestMarginalRange'] =
    null;
  let maxCostJump = -Infinity;
  let minCostJump = Infinity;

  for (let i = 1; i < rows.length; i++) {
    const costIncrease = round2(
      rows[i].annualOutOfPocket - rows[i - 1].annualOutOfPocket
    );

    // Only consider ranges where there's actually a CCS change
    if (rows[i - 1].subsidyPercent > 0) {
      if (costIncrease > maxCostJump) {
        maxCostJump = costIncrease;
        highestMarginalRange = {
          incomeFrom: rows[i - 1].income,
          incomeTo: rows[i].income,
          costIncrease,
        };
      }

      if (costIncrease < minCostJump && costIncrease > 0) {
        minCostJump = costIncrease;
        lowestMarginalRange = {
          incomeFrom: rows[i - 1].income,
          incomeTo: rows[i].income,
          costIncrease,
        };
      }
    }
  }

  return {
    rows,
    userRowIndex,
    zeroCCSIncome,
    highestMarginalRange,
    lowestMarginalRange,
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
