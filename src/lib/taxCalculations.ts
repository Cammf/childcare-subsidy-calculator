// =============================================================================
// AUSTRALIAN INCOME TAX CALCULATION ENGINE — FY 2025-26
// =============================================================================
// All functions are pure — they take explicit inputs (including rates object)
// and return typed results with calculation breakdowns.
//
// Source: Australian Taxation Office (ATO)
// https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
//
// FY 2025-26 uses the revised Stage 3 tax cuts (effective 1 July 2024):
//   $0–$18,200:      0%
//   $18,201–$45,000:  16%
//   $45,001–$135,000: 30%
//   $135,001–$190,000: 37%
//   $190,001+:         45%
// =============================================================================

import type { TaxRates, TaxBracket } from './types';

// ─── Result Types ───────────────────────────────────────────────────────────

export interface IncomeTaxResult {
  /** Gross income before any deductions */
  grossIncome: number;
  /** Base income tax from progressive brackets (before offsets) */
  incomeTax: number;
  /** Medicare levy (2%, with low-income exemption/phasing) */
  medicareLevy: number;
  /** Low Income Tax Offset — reduces tax liability (cannot create refund) */
  litoOffset: number;
  /** Tax after LITO is applied: max(0, incomeTax − LITO) */
  taxAfterLITO: number;
  /** Total tax payable: taxAfterLITO + medicareLevy */
  totalTax: number;
  /** Net income after all tax: grossIncome − totalTax */
  netIncome: number;
  /** Effective tax rate: totalTax / grossIncome (0 if no income) */
  effectiveRate: number;
  /** Marginal rate of the bracket income falls into */
  marginalRate: number;
  /** The tax bracket the income falls into */
  bracket: TaxBracket;
}

// ─── 2.5a: Base Income Tax ──────────────────────────────────────────────────
//
// Progressive tax: baseTax + (income − bracketFloor) × marginalRate
//
// Worked examples (FY 2025-26):
//   $18,200  → $0          (tax-free threshold)
//   $18,201  → $0.16       (1 dollar above threshold × 16%)
//   $30,000  → $1,888      ((30000−18200) × 0.16 = 11800 × 0.16)
//   $45,000  → $4,288      ((45000−18200) × 0.16 = 26800 × 0.16)
//   $45,001  → $4,288.30   ($4,288 + $1 × 0.30)
//   $100,000 → $20,788     ($4,288 + (100000−45000) × 0.30 = $4,288 + $16,500)
//   $135,000 → $31,288     ($4,288 + (135000−45000) × 0.30)
//   $190,000 → $51,638     ($31,288 + (190000−135000) × 0.37)
//   $250,000 → $78,638     ($51,638 + (250000−190000) × 0.45)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the base income tax from progressive brackets.
 *
 * @param income   Taxable income (AUD). Negative/0 returns $0.
 * @param brackets Tax bracket data from current.json.
 * @returns        Object with tax amount, bracket, and marginal rate.
 */
export function calculateBaseIncomeTax(
  income: number,
  brackets: TaxBracket[]
): { tax: number; bracket: TaxBracket; marginalRate: number } {
  if (income <= 0) {
    return { tax: 0, bracket: brackets[0], marginalRate: 0 };
  }

  // Find the bracket that contains this income
  const bracket = brackets.find(
    (b) => income >= b.min && (b.max === null || income <= b.max)
  );

  if (!bracket) {
    // Fallback to highest bracket (should never happen with valid data)
    const highest = brackets[brackets.length - 1];
    return {
      tax: highest.baseTax + (income - highest.min + 1) * highest.rate,
      bracket: highest,
      marginalRate: highest.rate,
    };
  }

  // For the tax-free bracket (rate = 0), tax is always 0
  if (bracket.rate === 0) {
    return { tax: 0, bracket, marginalRate: 0 };
  }

  // baseTax + (income − bracketFloor) × rate
  // bracketFloor = min − 1 (e.g., bracket min 18201, floor is 18200)
  const bracketFloor = bracket.min - 1;
  const tax = bracket.baseTax + (income - bracketFloor) * bracket.rate;

  return {
    tax: round2(tax),
    bracket,
    marginalRate: bracket.rate,
  };
}

// ─── 2.5b: Medicare Levy ────────────────────────────────────────────────────
//
// Standard rate: 2% of taxable income.
// Low-income exemption: nil below $26,000.
// Phase-in: 10 cents per dollar from $26,001 to $32,500.
// Above $32,500: full 2% of total income.
//
// Worked examples:
//   $20,000  → $0          (below threshold)
//   $26,000  → $0          (at threshold)
//   $26,001  → $0.10       (10c × $1 above threshold)
//   $29,250  → $325        (10c × $3,250)
//   $32,500  → $650        (10c × $6,500 = 2% × $32,500 — shade-in point)
//   $50,000  → $1,000      (2% × $50,000)
//   $100,000 → $2,000      (2% × $100,000)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the Medicare levy.
 *
 * @param income       Taxable income (AUD).
 * @param medicareData Medicare levy rates from current.json.
 * @returns            Medicare levy amount in AUD.
 */
export function calculateMedicareLevy(
  income: number,
  medicareData: TaxRates['medicareLevy']
): number {
  if (income <= medicareData.lowIncomeThreshold) {
    return 0;
  }

  // Phase-in zone: levy = phaseInRate × (income − lowIncomeThreshold)
  if (income <= medicareData.shadeInThreshold) {
    return round2(
      medicareData.phaseInRate * (income - medicareData.lowIncomeThreshold)
    );
  }

  // Above shade-in: full 2% of total income
  return round2(income * medicareData.rate);
}

// ─── 2.5c: Low Income Tax Offset (LITO) ────────────────────────────────────
//
// Reduces income tax liability (not Medicare). Cannot create a refund.
//
// FY 2025-26:
//   $0–$37,500:      $700 (full offset)
//   $37,501–$45,000: $700 − ($income − $37,500) × $0.05
//   $45,001–$66,667: $325 − ($income − $45,000) × $0.015
//   $66,668+:        $0
//
// Worked examples:
//   $30,000  → $700   (full)
//   $37,500  → $700   (full, at boundary)
//   $40,000  → $575   ($700 − $2,500 × 0.05 = $700 − $125)
//   $45,000  → $325   ($700 − $7,500 × 0.05 = $700 − $375)
//   $50,000  → $250   ($325 − $5,000 × 0.015 = $325 − $75)
//   $66,667  → $0     ($325 − $21,667 × 0.015 = $325 − $325)
//   $80,000  → $0     (above phase-out)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the Low Income Tax Offset.
 *
 * @param income   Taxable income (AUD).
 * @param litoData LITO rates from current.json.
 * @returns        LITO amount in AUD (always ≥ 0).
 */
export function calculateLITO(
  income: number,
  litoData: TaxRates['lito']
): number {
  if (income <= 0) {
    return litoData.maxOffset;
  }

  // Full offset
  if (income <= litoData.fullOffsetTo) {
    return litoData.maxOffset;
  }

  // Phase-out 1: reduces by 5c per dollar from $37,501 to $45,000
  if (income <= litoData.phaseOut1To) {
    const reduction = (income - litoData.fullOffsetTo) * litoData.phaseOut1Rate;
    return round2(Math.max(0, litoData.maxOffset - reduction));
  }

  // Phase-out 2: reduces by 1.5c per dollar from $45,001 to $66,667
  if (income <= litoData.phaseOut2To) {
    // First phase fully applied: $700 − ($45,000 − $37,500) × 0.05 = $325
    const afterPhase1 =
      litoData.maxOffset -
      (litoData.phaseOut1To - litoData.fullOffsetTo) * litoData.phaseOut1Rate;
    const reduction = (income - litoData.phaseOut1To) * litoData.phaseOut2Rate;
    return round2(Math.max(0, afterPhase1 - reduction));
  }

  // Above phase-out: no offset
  return 0;
}

// ─── 2.5: Full Income Tax Calculation ───────────────────────────────────────

/**
 * Calculate complete individual income tax including Medicare levy and LITO.
 *
 * LITO reduces income tax only (not Medicare levy) and cannot create a refund
 * (clamped to $0). Total tax = max(0, incomeTax − LITO) + medicareLevy.
 *
 * @param income  Individual taxable income (AUD).
 * @param rates   Tax rates data loaded from current.json.
 * @returns       Complete tax breakdown including net income and effective rate.
 */
export function calculateIncomeTax(
  income: number,
  rates: TaxRates
): IncomeTaxResult {
  if (income <= 0) {
    return {
      grossIncome: 0,
      incomeTax: 0,
      medicareLevy: 0,
      litoOffset: 0,
      taxAfterLITO: 0,
      totalTax: 0,
      netIncome: 0,
      effectiveRate: 0,
      marginalRate: 0,
      bracket: rates.brackets[0],
    };
  }

  const { tax: incomeTax, bracket, marginalRate } = calculateBaseIncomeTax(
    income,
    rates.brackets
  );
  const medicareLevy = calculateMedicareLevy(income, rates.medicareLevy);
  const litoOffset = calculateLITO(income, rates.lito);

  // LITO reduces income tax only — cannot make it negative
  const taxAfterLITO = round2(Math.max(0, incomeTax - litoOffset));

  // Total: income tax (after LITO) + Medicare levy
  const totalTax = round2(taxAfterLITO + medicareLevy);
  const netIncome = round2(income - totalTax);
  const effectiveRate = income > 0 ? round4(totalTax / income) : 0;

  return {
    grossIncome: income,
    incomeTax: round2(incomeTax),
    medicareLevy,
    litoOffset: round2(litoOffset),
    taxAfterLITO,
    totalTax,
    netIncome,
    effectiveRate,
    marginalRate,
    bracket,
  };
}

/**
 * Convenience function: calculate net income after all tax.
 */
export function calculateNetIncome(
  grossIncome: number,
  rates: TaxRates
): number {
  return calculateIncomeTax(grossIncome, rates).netIncome;
}

// ─── Utilities ──────────────────────────────────────────────────────────────

/** Round to 2 decimal places (cents). */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Round to 4 decimal places (for rates like 0.2345). */
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
