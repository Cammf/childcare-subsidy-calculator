// =============================================================================
// TESTS — Australian Income Tax Calculation Engine (FY 2025-26)
// =============================================================================

import {
  calculateBaseIncomeTax,
  calculateMedicareLevy,
  calculateLITO,
  calculateIncomeTax,
  calculateNetIncome,
} from '../taxCalculations';
import { TEST_TAX_RATES } from './fixtures';

// ─── 2.5a: calculateBaseIncomeTax ───────────────────────────────────────────

describe('calculateBaseIncomeTax', () => {
  const brackets = TEST_TAX_RATES.brackets;

  it('returns $0 tax for $0 income', () => {
    expect(calculateBaseIncomeTax(0, brackets).tax).toBe(0);
  });

  it('returns $0 tax at tax-free threshold ($18,200)', () => {
    expect(calculateBaseIncomeTax(18200, brackets).tax).toBe(0);
  });

  it('returns $0.16 tax at $18,201 (first dollar above threshold at 16%)', () => {
    const result = calculateBaseIncomeTax(18201, brackets);
    expect(result.tax).toBeCloseTo(0.16, 2);
    expect(result.marginalRate).toBe(0.16);
  });

  it('returns $1,888 at $30,000 — (30000−18200) × 0.16', () => {
    expect(calculateBaseIncomeTax(30000, brackets).tax).toBe(1888);
  });

  it('returns $4,288 at $45,000 — top of 16% bracket', () => {
    expect(calculateBaseIncomeTax(45000, brackets).tax).toBe(4288);
  });

  it('returns $4,288.30 at $45,001 — first dollar in 30% bracket', () => {
    const result = calculateBaseIncomeTax(45001, brackets);
    expect(result.tax).toBeCloseTo(4288.3, 2);
    expect(result.marginalRate).toBe(0.30);
  });

  it('returns $20,788 at $100,000 — $4,288 + (100000−45000) × 0.30', () => {
    expect(calculateBaseIncomeTax(100000, brackets).tax).toBe(20788);
  });

  it('returns $31,288 at $135,000 — top of 30% bracket', () => {
    expect(calculateBaseIncomeTax(135000, brackets).tax).toBe(31288);
  });

  it('returns $51,638 at $190,000 — top of 37% bracket', () => {
    expect(calculateBaseIncomeTax(190000, brackets).tax).toBe(51638);
  });

  it('returns $78,638 at $250,000 — $51,638 + (250000−190000) × 0.45', () => {
    expect(calculateBaseIncomeTax(250000, brackets).tax).toBe(78638);
  });

  it('returns $0 for negative income', () => {
    expect(calculateBaseIncomeTax(-5000, brackets).tax).toBe(0);
  });
});

// ─── 2.5b: calculateMedicareLevy ────────────────────────────────────────────

describe('calculateMedicareLevy', () => {
  const medicare = TEST_TAX_RATES.medicareLevy;

  it('returns $0 below the low-income threshold ($26,000)', () => {
    expect(calculateMedicareLevy(20000, medicare)).toBe(0);
  });

  it('returns $0 at exactly $26,000', () => {
    expect(calculateMedicareLevy(26000, medicare)).toBe(0);
  });

  it('phases in at $26,001 — 10c × $1 = $0.10', () => {
    expect(calculateMedicareLevy(26001, medicare)).toBeCloseTo(0.10, 2);
  });

  it('phases in at $29,250 — 10c × $3,250 = $325', () => {
    expect(calculateMedicareLevy(29250, medicare)).toBe(325);
  });

  it('reaches full rate at shade-in threshold ($32,500) — 10c × $6,500 = $650', () => {
    // This should also equal 2% × $32,500 = $650
    expect(calculateMedicareLevy(32500, medicare)).toBe(650);
  });

  it('returns 2% of income above shade-in — $50,000 → $1,000', () => {
    expect(calculateMedicareLevy(50000, medicare)).toBe(1000);
  });

  it('returns $2,000 at $100,000', () => {
    expect(calculateMedicareLevy(100000, medicare)).toBe(2000);
  });
});

// ─── 2.5c: calculateLITO ───────────────────────────────────────────────────

describe('calculateLITO', () => {
  const lito = TEST_TAX_RATES.lito;

  it('returns full $700 offset for income below $37,500', () => {
    expect(calculateLITO(30000, lito)).toBe(700);
  });

  it('returns full $700 at exactly $37,500', () => {
    expect(calculateLITO(37500, lito)).toBe(700);
  });

  it('phase-out 1: returns $575 at $40,000 — $700 − ($2,500 × 0.05)', () => {
    expect(calculateLITO(40000, lito)).toBe(575);
  });

  it('phase-out 1: returns $325 at $45,000 — $700 − ($7,500 × 0.05)', () => {
    expect(calculateLITO(45000, lito)).toBe(325);
  });

  it('phase-out 2: returns $250 at $50,000 — $325 − ($5,000 × 0.015)', () => {
    expect(calculateLITO(50000, lito)).toBe(250);
  });

  it('phase-out 2: reaches $0 at $66,667', () => {
    expect(calculateLITO(66667, lito)).toBe(0);
  });

  it('returns $0 above complete phase-out ($80,000)', () => {
    expect(calculateLITO(80000, lito)).toBe(0);
  });

  it('returns full $700 for zero income', () => {
    expect(calculateLITO(0, lito)).toBe(700);
  });
});

// ─── 2.5: calculateIncomeTax (full integration) ────────────────────────────

describe('calculateIncomeTax', () => {
  it('returns all zeros for $0 income', () => {
    const result = calculateIncomeTax(0, TEST_TAX_RATES);
    expect(result.grossIncome).toBe(0);
    expect(result.totalTax).toBe(0);
    expect(result.netIncome).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it('returns $0 total tax at $18,200 (tax-free threshold)', () => {
    const result = calculateIncomeTax(18200, TEST_TAX_RATES);
    expect(result.incomeTax).toBe(0);
    expect(result.medicareLevy).toBe(0);   // below $26k
    expect(result.litoOffset).toBe(700);
    expect(result.totalTax).toBe(0);
    expect(result.netIncome).toBe(18200);
  });

  it('calculates $6,538 total tax at $50,000', () => {
    // baseTax: 4288 + (50000−45000)×0.30 = $5,788
    // Medicare: 2% × 50000 = $1,000
    // LITO: 325 − (50000−45000)×0.015 = $250
    // taxAfterLITO: max(0, 5788−250) = $5,538
    // totalTax: 5538 + 1000 = $6,538
    // netIncome: 50000 − 6538 = $43,462
    const result = calculateIncomeTax(50000, TEST_TAX_RATES);
    expect(result.incomeTax).toBe(5788);
    expect(result.medicareLevy).toBe(1000);
    expect(result.litoOffset).toBe(250);
    expect(result.taxAfterLITO).toBe(5538);
    expect(result.totalTax).toBe(6538);
    expect(result.netIncome).toBe(43462);
  });

  it('calculates $22,788 total tax at $100,000', () => {
    // baseTax: $20,788
    // Medicare: $2,000
    // LITO: $0 (income > $66,667)
    // totalTax: 20788 + 2000 = $22,788
    // netIncome: 100000 − 22788 = $77,212
    const result = calculateIncomeTax(100000, TEST_TAX_RATES);
    expect(result.incomeTax).toBe(20788);
    expect(result.medicareLevy).toBe(2000);
    expect(result.litoOffset).toBe(0);
    expect(result.totalTax).toBe(22788);
    expect(result.netIncome).toBe(77212);
    expect(result.marginalRate).toBe(0.30);
  });

  it('calculates correctly at $250,000 (top bracket)', () => {
    // baseTax: $78,638
    // Medicare: $5,000
    // LITO: $0
    // totalTax: 78638 + 5000 = $83,638
    // netIncome: 250000 − 83638 = $166,362
    const result = calculateIncomeTax(250000, TEST_TAX_RATES);
    expect(result.totalTax).toBe(83638);
    expect(result.netIncome).toBe(166362);
    expect(result.marginalRate).toBe(0.45);
  });

  it('has correct effective rate at $100,000', () => {
    const result = calculateIncomeTax(100000, TEST_TAX_RATES);
    // 22788 / 100000 = 0.22788 → round4 = 0.2279
    expect(result.effectiveRate).toBeCloseTo(0.2279, 4);
  });

  it('LITO cannot create a tax refund (taxAfterLITO ≥ 0)', () => {
    // At $20,000: baseTax = (20000−18200)×0.16 = $288, LITO = $700
    // taxAfterLITO = max(0, 288 − 700) = $0
    const result = calculateIncomeTax(20000, TEST_TAX_RATES);
    expect(result.taxAfterLITO).toBe(0);
    expect(result.totalTax).toBe(0); // Medicare also $0 (below $26k)
    expect(result.netIncome).toBe(20000);
  });
});

// ─── calculateNetIncome (convenience) ───────────────────────────────────────

describe('calculateNetIncome', () => {
  it('returns $43,462 for $50,000 gross', () => {
    expect(calculateNetIncome(50000, TEST_TAX_RATES)).toBe(43462);
  });

  it('returns $77,212 for $100,000 gross', () => {
    expect(calculateNetIncome(100000, TEST_TAX_RATES)).toBe(77212);
  });

  it('returns $0 for $0 gross', () => {
    expect(calculateNetIncome(0, TEST_TAX_RATES)).toBe(0);
  });
});
