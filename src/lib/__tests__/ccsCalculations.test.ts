// =============================================================================
// TESTS — CCS Calculation Engine
// =============================================================================

import {
  calculateCCSPercentage,
  calculateHigherCCSPercentage,
  getHourlyRateCap,
  getStateAverageDailyFee,
  calculateSessionCCS,
  calculateAnnualCost,
  type SessionCCSResult,
} from '../ccsCalculations';
import { TEST_CCS_RATES, TEST_STATE_AVERAGES } from './fixtures';

// ─── 2.1: calculateCCSPercentage ────────────────────────────────────────────

describe('calculateCCSPercentage', () => {
  it('returns 90% at or below the base income threshold ($85,279)', () => {
    const result = calculateCCSPercentage(85279, TEST_CCS_RATES);
    expect(result.percent).toBe(90);
    expect(result.incomeAboveThreshold).toBe(0);
    expect(result.bracketsAbove).toBe(0);
    expect(result.percentReduction).toBe(0);
  });

  it('returns 90% for income well below threshold', () => {
    const result = calculateCCSPercentage(60000, TEST_CCS_RATES);
    expect(result.percent).toBe(90);
  });

  it('returns 90% for zero income', () => {
    const result = calculateCCSPercentage(0, TEST_CCS_RATES);
    expect(result.percent).toBe(90);
  });

  it('returns 90% for negative income (edge case)', () => {
    const result = calculateCCSPercentage(-10000, TEST_CCS_RATES);
    expect(result.percent).toBe(90);
  });

  it('tapers to 89% at $85,280 — ceil(1/5000) = 1 bracket', () => {
    const result = calculateCCSPercentage(85280, TEST_CCS_RATES);
    expect(result.percent).toBe(89);
    expect(result.incomeAboveThreshold).toBe(1);
    expect(result.bracketsAbove).toBe(1);
    expect(result.percentReduction).toBe(1);
  });

  it('stays at 89% at $90,279 — ceil(5000/5000) = 1 bracket', () => {
    const result = calculateCCSPercentage(90279, TEST_CCS_RATES);
    expect(result.percent).toBe(89);
    expect(result.incomeAboveThreshold).toBe(5000);
    expect(result.bracketsAbove).toBe(1);
  });

  it('tapers to 88% at $90,280 — ceil(5001/5000) = 2 brackets', () => {
    const result = calculateCCSPercentage(90280, TEST_CCS_RATES);
    expect(result.percent).toBe(88);
    expect(result.bracketsAbove).toBe(2);
  });

  it('tapers to 87% at $100,000 — ceil(14721/5000) = 3 brackets', () => {
    const result = calculateCCSPercentage(100000, TEST_CCS_RATES);
    expect(result.percent).toBe(87);
    expect(result.incomeAboveThreshold).toBe(14721);
    expect(result.bracketsAbove).toBe(3);
  });

  it('tapers to 80% at $135,279 — ceil(50000/5000) = 10 brackets', () => {
    const result = calculateCCSPercentage(135279, TEST_CCS_RATES);
    expect(result.percent).toBe(80);
    expect(result.bracketsAbove).toBe(10);
  });

  it('reaches 0% at $535,279 — ceil(450000/5000) = 90 brackets', () => {
    const result = calculateCCSPercentage(535279, TEST_CCS_RATES);
    expect(result.percent).toBe(0);
    expect(result.bracketsAbove).toBe(90);
    expect(result.percentReduction).toBe(90);
  });

  it('clamps to 0% for income well above taper range ($600k)', () => {
    const result = calculateCCSPercentage(600000, TEST_CCS_RATES);
    expect(result.percent).toBe(0);
  });
});

// ─── 2.2: calculateHigherCCSPercentage ──────────────────────────────────────

describe('calculateHigherCCSPercentage', () => {
  it('caps at 95% when standard rate is 90% (90 + 30 = 120 → 95)', () => {
    const result = calculateHigherCCSPercentage(90, TEST_CCS_RATES);
    expect(result.higherPercent).toBe(95);
    expect(result.standardPercent).toBe(90);
    expect(result.additionalPoints).toBe(30);
    expect(result.wasCapped).toBe(true);
  });

  it('caps at 95% when standard rate is 85% (85 + 30 = 115 → 95)', () => {
    const result = calculateHigherCCSPercentage(85, TEST_CCS_RATES);
    expect(result.higherPercent).toBe(95);
    expect(result.wasCapped).toBe(true);
  });

  it('lands exactly at 95% when standard rate is 65% (65 + 30 = 95)', () => {
    const result = calculateHigherCCSPercentage(65, TEST_CCS_RATES);
    expect(result.higherPercent).toBe(95);
    // 65 + 30 = 95, not > 95, so wasCapped is false
    expect(result.wasCapped).toBe(false);
  });

  it('returns 94% when standard rate is 64% (64 + 30 = 94)', () => {
    const result = calculateHigherCCSPercentage(64, TEST_CCS_RATES);
    expect(result.higherPercent).toBe(94);
    expect(result.wasCapped).toBe(false);
  });

  it('returns 80% when standard rate is 50% (50 + 30 = 80)', () => {
    const result = calculateHigherCCSPercentage(50, TEST_CCS_RATES);
    expect(result.higherPercent).toBe(80);
    expect(result.wasCapped).toBe(false);
  });

  it('returns 30% when standard rate is 0% (0 + 30 = 30)', () => {
    const result = calculateHigherCCSPercentage(0, TEST_CCS_RATES);
    expect(result.higherPercent).toBe(30);
    expect(result.wasCapped).toBe(false);
  });
});

// ─── Hourly Rate Cap Lookup ─────────────────────────────────────────────────

describe('getHourlyRateCap', () => {
  it('returns $14.63 for centre-based below school age', () => {
    expect(
      getHourlyRateCap('centre_based_day_care', 'below_school_age', TEST_CCS_RATES)
    ).toBe(14.63);
  });

  it('returns $12.81 for centre-based school age', () => {
    expect(
      getHourlyRateCap('centre_based_day_care', 'school_age', TEST_CCS_RATES)
    ).toBe(12.81);
  });

  it('returns $12.43 for family day care (all ages)', () => {
    expect(
      getHourlyRateCap('family_day_care', 'below_school_age', TEST_CCS_RATES)
    ).toBe(12.43);
  });

  it('returns $12.81 for OSHC school age', () => {
    expect(
      getHourlyRateCap('outside_school_hours', 'school_age', TEST_CCS_RATES)
    ).toBe(12.81);
  });

  it('returns $35.40 for in-home care (all ages)', () => {
    expect(
      getHourlyRateCap('in_home_care', 'below_school_age', TEST_CCS_RATES)
    ).toBe(35.40);
  });
});

// ─── State Average Fee Lookup ───────────────────────────────────────────────

describe('getStateAverageDailyFee', () => {
  it('returns $158 for NSW centre-based day care', () => {
    expect(
      getStateAverageDailyFee('NSW', 'centre_based_day_care', TEST_STATE_AVERAGES)
    ).toBe(158);
  });

  it('returns $122 for VIC family day care', () => {
    expect(
      getStateAverageDailyFee('VIC', 'family_day_care', TEST_STATE_AVERAGES)
    ).toBe(122);
  });

  it('returns $55 for ACT outside school hours', () => {
    expect(
      getStateAverageDailyFee('ACT', 'outside_school_hours', TEST_STATE_AVERAGES)
    ).toBe(55);
  });

  it('throws for unknown state', () => {
    expect(() =>
      getStateAverageDailyFee('QLD' as any, 'centre_based_day_care', TEST_STATE_AVERAGES)
    ).toThrow('No state average data found');
  });
});

// ─── 2.3: calculateSessionCCS ──────────────────────────────────────────────

describe('calculateSessionCCS', () => {
  it('calculates correctly when fee is below hourly rate cap', () => {
    // $100/day, 10hr → $10/hr. Cap is $14.63. Fee is below cap.
    const result = calculateSessionCCS(
      100, 10, 80,
      'centre_based_day_care', 'below_school_age',
      TEST_CCS_RATES
    );

    expect(result.dailyFeeUsed).toBe(100);
    expect(result.hourlyFee).toBe(10);
    expect(result.hourlyRateCap).toBe(14.63);
    expect(result.effectiveHourlyRate).toBe(10);
    expect(result.feeAboveCapPerHour).toBe(0);
    expect(result.subsidyPerHour).toBe(8);       // 10 × 0.80
    expect(result.subsidyPerSession).toBe(80);    // 8 × 10
    expect(result.outOfPocketPerSession).toBe(20); // 100 − 80
    expect(result.ccsPercent).toBe(80);
  });

  it('calculates correctly when fee is above hourly rate cap', () => {
    // $150/day, 10hr → $15/hr. Cap is $14.63. Fee is ABOVE cap.
    const result = calculateSessionCCS(
      150, 10, 80,
      'centre_based_day_care', 'below_school_age',
      TEST_CCS_RATES
    );

    expect(result.hourlyFee).toBe(15);
    expect(result.hourlyRateCap).toBe(14.63);
    expect(result.effectiveHourlyRate).toBe(14.63);
    expect(result.feeAboveCapPerHour).toBeCloseTo(0.37, 2);
    // Subsidy: 14.63 × 0.80 = 11.704
    expect(result.subsidyPerHour).toBeCloseTo(11.70, 2);
    // Session: 11.704 × 10 = 117.04
    expect(result.subsidyPerSession).toBeCloseTo(117.04, 2);
    // OOP: 150 − 117.04 = 32.96
    expect(result.outOfPocketPerSession).toBeCloseTo(32.96, 2);
  });

  it('returns zero subsidy when CCS% is 0', () => {
    const result = calculateSessionCCS(
      100, 10, 0,
      'centre_based_day_care', 'below_school_age',
      TEST_CCS_RATES
    );

    expect(result.subsidyPerHour).toBe(0);
    expect(result.subsidyPerSession).toBe(0);
    expect(result.outOfPocketPerSession).toBe(100);
  });

  it('returns zero subsidy when daily fee is $0 (free childcare)', () => {
    const result = calculateSessionCCS(
      0, 10, 90,
      'centre_based_day_care', 'below_school_age',
      TEST_CCS_RATES
    );

    expect(result.hourlyFee).toBe(0);
    expect(result.subsidyPerSession).toBe(0);
    expect(result.outOfPocketPerSession).toBe(0);
  });

  it('throws if hoursPerDay is zero or negative', () => {
    expect(() =>
      calculateSessionCCS(100, 0, 80, 'centre_based_day_care', 'below_school_age', TEST_CCS_RATES)
    ).toThrow('hoursPerDay must be greater than 0');
  });

  it('throws if daily fee is negative', () => {
    expect(() =>
      calculateSessionCCS(-50, 10, 80, 'centre_based_day_care', 'below_school_age', TEST_CCS_RATES)
    ).toThrow('dailyFee cannot be negative');
  });
});

// ─── 2.4: calculateAnnualCost ───────────────────────────────────────────────

describe('calculateAnnualCost', () => {
  // Build a clean mock session: $100/day, $80 subsidy, $20 OOP
  const mockSession: SessionCCSResult = {
    dailyFeeUsed: 100,
    hourlyFee: 10,
    hourlyRateCap: 14.63,
    effectiveHourlyRate: 10,
    feeAboveCapPerHour: 0,
    subsidyPerHour: 8,
    subsidyPerSession: 80,
    outOfPocketPerSession: 20,
    ccsPercent: 80,
  };

  it('annualises correctly at 2 days/week with 5% withholding', () => {
    const result = calculateAnnualCost(mockSession, 2, 5);

    // Per fortnight (4 sessions)
    expect(result.grossFeePerFortnight).toBe(400);   // 100 × 4
    expect(result.subsidyPerFortnight).toBe(320);     // 80 × 4
    expect(result.outOfPocketPerFortnight).toBe(80);  // 400 − 320
    expect(result.withholdingPerFortnight).toBe(16);  // 320 × 0.05
    expect(result.netOutOfPocketPerFortnight).toBe(96); // 80 + 16

    // Per week (2 sessions)
    expect(result.grossFeePerWeek).toBe(200);         // 100 × 2
    expect(result.subsidyPerWeek).toBe(160);           // 80 × 2
    expect(result.outOfPocketPerWeek).toBe(40);        // 200 − 160
    expect(result.netOutOfPocketPerWeek).toBe(48);     // 40 + 8

    // Per year (52 weeks)
    expect(result.grossFeePerYear).toBe(10400);       // 100 × 2 × 52
    expect(result.subsidyPerYear).toBe(8320);          // 80 × 2 × 52
    expect(result.outOfPocketPerYear).toBe(2080);      // 10400 − 8320
    expect(result.withholdingPerYear).toBe(416);       // 8320 × 0.05
    expect(result.netOutOfPocketPerYear).toBe(2496);   // 2080 + 416
  });

  it('annualises at 5 days/week (full-time)', () => {
    const result = calculateAnnualCost(mockSession, 5, 5);

    expect(result.grossFeePerWeek).toBe(500);          // 100 × 5
    expect(result.subsidyPerWeek).toBe(400);            // 80 × 5
    expect(result.outOfPocketPerWeek).toBe(100);        // 500 − 400
    expect(result.grossFeePerYear).toBe(26000);         // 100 × 5 × 52
    expect(result.subsidyPerYear).toBe(20800);          // 80 × 5 × 52
    expect(result.outOfPocketPerYear).toBe(5200);       // 26000 − 20800
  });

  it('handles 0% withholding correctly', () => {
    const result = calculateAnnualCost(mockSession, 2, 0);

    expect(result.withholdingPerFortnight).toBe(0);
    expect(result.netOutOfPocketPerFortnight).toBe(80);
    expect(result.withholdingPerYear).toBe(0);
    expect(result.netOutOfPocketPerYear).toBe(2080);
  });

  it('throws for days outside 1–5 range', () => {
    expect(() => calculateAnnualCost(mockSession, 0, 5)).toThrow(
      'daysPerWeek must be between 1 and 5'
    );
    expect(() => calculateAnnualCost(mockSession, 6, 5)).toThrow(
      'daysPerWeek must be between 1 and 5'
    );
  });
});
