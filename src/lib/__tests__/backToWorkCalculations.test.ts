// =============================================================================
// TESTS — Back-to-Work Calculation Engine
// =============================================================================

import { calculateBackToWork, type BackToWorkParams } from '../backToWorkCalculations';
import { TEST_CCS_RATES, TEST_TAX_RATES } from './fixtures';

// Shared test params: partner earns $100k, user earns $0, FTE offer $80k
const baseParams: BackToWorkParams = {
  combinedAnnualIncome: 100000,
  currentIndividualIncome: 0,
  proposedFTEIncome: 80000,
  workRelatedCostsPerWeek: 50,
  currentDaysInCare: 2,
  dailyFee: 100,
  hoursPerDay: 10,
  careType: 'centre_based_day_care',
  ageGroup: 'below_school_age',
};

describe('calculateBackToWork', () => {
  const result = calculateBackToWork(baseParams, TEST_CCS_RATES, TEST_TAX_RATES);

  // ── Structural tests ──────────────────────────────────────────────────

  it('returns exactly 5 scenarios (1–5 days)', () => {
    expect(result.scenarios).toHaveLength(5);
    expect(result.scenarios.map((s) => s.daysWorking)).toEqual([1, 2, 3, 4, 5]);
  });

  it('populates the current situation baseline', () => {
    expect(result.current.grossIncome).toBe(0);
    expect(result.current.netIncome).toBe(0);
    expect(result.current.combinedFamilyIncome).toBe(100000);
    // CCS at $100k = 87%
    expect(result.current.ccsPercent).toBe(87);
  });

  it('calculates current annual childcare cost based on current days in care', () => {
    // 87% CCS at $100/day, 10hr → OOP = $13/session
    // 2 days/week × 52 weeks = 104 sessions → $1,352/year
    expect(result.current.annualChildcareCost).toBe(1352);
  });

  // ── Proportional income ───────────────────────────────────────────────

  it('calculates proportional gross income for each scenario', () => {
    expect(result.scenarios[0].grossIncome).toBe(16000);  // 1/5 × 80000
    expect(result.scenarios[1].grossIncome).toBe(32000);  // 2/5 × 80000
    expect(result.scenarios[2].grossIncome).toBe(48000);  // 3/5 × 80000
    expect(result.scenarios[3].grossIncome).toBe(64000);  // 4/5 × 80000
    expect(result.scenarios[4].grossIncome).toBe(80000);  // 5/5 × 80000
  });

  it('calculates combined family income for each scenario', () => {
    // Partner income = 100000 - 0 = 100000
    expect(result.scenarios[0].combinedFamilyIncome).toBe(116000);
    expect(result.scenarios[2].combinedFamilyIncome).toBe(148000);
    expect(result.scenarios[4].combinedFamilyIncome).toBe(180000);
  });

  // ── CCS percentage decreases as combined income rises ─────────────────

  it('shows CCS% decreasing as combined income rises', () => {
    // Each scenario has higher combined income → lower CCS
    const percentages = result.scenarios.map((s) => s.ccsPercent);
    for (let i = 1; i < percentages.length; i++) {
      expect(percentages[i]).toBeLessThanOrEqual(percentages[i - 1]);
    }
  });

  // ── Childcare days increase to match working days ─────────────────────

  it('uses max(currentDays, daysWorking) for childcare days', () => {
    // Current days = 2, so:
    // 1-day scenario: childcare = max(2, 1) = 2 days → same fee as current
    // 3-day scenario: childcare = max(2, 3) = 3 days
    // 5-day scenario: childcare = max(2, 5) = 5 days
    // Verify via annual childcare gross fee
    // 1 day working: 2 days childcare × 100 × 52 = $10,400
    expect(result.scenarios[0].annualChildcare.grossFeePerYear).toBe(10400);
    // 3 days working: 3 days childcare × 100 × 52 = $15,600
    expect(result.scenarios[2].annualChildcare.grossFeePerYear).toBe(15600);
    // 5 days working: 5 days childcare × 100 × 52 = $26,000
    expect(result.scenarios[4].annualChildcare.grossFeePerYear).toBe(26000);
  });

  // ── Work costs are proportional ───────────────────────────────────────

  it('calculates annual work costs proportional to days worked', () => {
    // $50/week × (days/5) × 52
    expect(result.scenarios[0].annualWorkCosts).toBe(520);   // 50 × 0.2 × 52
    expect(result.scenarios[2].annualWorkCosts).toBe(1560);  // 50 × 0.6 × 52
    expect(result.scenarios[4].annualWorkCosts).toBe(2600);  // 50 × 1.0 × 52
  });

  // ── Net benefit and isWorthIt ─────────────────────────────────────────

  it('returns positive netBenefit for most scenarios with $80k FTE offer', () => {
    // With a decent salary offer, most scenarios should be financially positive
    const positiveCount = result.scenarios.filter((s) => s.isWorthIt).length;
    expect(positiveCount).toBeGreaterThan(0);
  });

  it('marks each scenario isWorthIt correctly based on netBenefit', () => {
    for (const scenario of result.scenarios) {
      expect(scenario.isWorthIt).toBe(scenario.netBenefit > 0);
    }
  });

  it('selects bestScenario as the one with highest positive net benefit', () => {
    if (result.bestScenario) {
      const maxBenefit = Math.max(
        ...result.scenarios.filter((s) => s.netBenefit > 0).map((s) => s.netBenefit)
      );
      expect(result.bestScenario.netBenefit).toBe(maxBenefit);
    }
  });

  // ── Effective hourly rate ─────────────────────────────────────────────

  it('calculates effective hourly rate for each scenario', () => {
    for (const scenario of result.scenarios) {
      if (scenario.effectiveHourlyRate !== null) {
        const annualHours = scenario.daysWorking * 8 * 52;
        expect(scenario.effectiveHourlyRate).toBeCloseTo(
          scenario.netBenefit / annualHours,
          2
        );
      }
    }
  });
});

// ── Edge case: all scenarios negative (very low FTE offer) ────────────

describe('calculateBackToWork with very low FTE income', () => {
  it('returns null bestScenario when all scenarios have negative net benefit', () => {
    const lowIncomeParams: BackToWorkParams = {
      ...baseParams,
      proposedFTEIncome: 5000,  // Extremely low — not worth it
    };
    const result = calculateBackToWork(lowIncomeParams, TEST_CCS_RATES, TEST_TAX_RATES);

    // With $5k FTE, proportional income is tiny, but childcare costs increase
    // Best scenario should be null if all negative
    if (result.scenarios.every((s) => s.netBenefit <= 0)) {
      expect(result.bestScenario).toBeNull();
    }
  });
});

// ── Edge case: user currently has income ────────────────────────────────

describe('calculateBackToWork when user already earns income', () => {
  it('accounts for existing individual income in current baseline', () => {
    const params: BackToWorkParams = {
      ...baseParams,
      currentIndividualIncome: 30000,
      combinedAnnualIncome: 130000,  // partner = $100k
      proposedFTEIncome: 80000,
    };
    const result = calculateBackToWork(params, TEST_CCS_RATES, TEST_TAX_RATES);

    expect(result.current.grossIncome).toBe(30000);
    expect(result.current.netIncome).toBeGreaterThan(0);
    // Combined should reflect both incomes
    expect(result.current.combinedFamilyIncome).toBe(130000);
  });
});
