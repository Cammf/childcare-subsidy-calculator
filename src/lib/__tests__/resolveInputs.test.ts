// =============================================================================
// TESTS — Input Resolution (Wizard → Calculation-Ready Values)
// =============================================================================

import {
  resolveIncome,
  resolveAgeGroup,
  resolveDailyFee,
  resolveHoursPerDay,
  isEligibleForHigherRate,
  resolveInputs,
  INCOME_RANGE_MIDPOINTS,
  DEFAULT_HOURS_PER_DAY,
  type IncomeRange,
} from '../resolveInputs';
import type { WizardInputs } from '../types';
import { TEST_STATE_AVERAGES } from './fixtures';

// ─── resolveIncome ──────────────────────────────────────────────────────────

describe('resolveIncome', () => {
  it('returns exact income when provided (overrides range)', () => {
    expect(resolveIncome('under_85279', 120000)).toBe(120000);
  });

  it('returns exact income of $0 when explicitly set', () => {
    expect(resolveIncome('over_350000', 0)).toBe(0);
  });

  it('falls back to range midpoint when exact income is null', () => {
    expect(resolveIncome('under_85279', null)).toBe(60000);
    expect(resolveIncome('85280_120000', null)).toBe(102640);
    expect(resolveIncome('120001_160000', null)).toBe(140000);
    expect(resolveIncome('160001_220000', null)).toBe(190000);
    expect(resolveIncome('220001_350000', null)).toBe(285000);
    expect(resolveIncome('over_350000', null)).toBe(400000);
  });

  it('falls back to range midpoint when exact income is negative', () => {
    // Negative income → exactIncome condition fails (< 0), uses midpoint
    expect(resolveIncome('under_85279', -1)).toBe(60000);
  });
});

// ─── resolveAgeGroup ────────────────────────────────────────────────────────

describe('resolveAgeGroup', () => {
  it('maps under_6 to below_school_age', () => {
    expect(resolveAgeGroup('under_6')).toBe('below_school_age');
  });

  it('maps 6_to_13 to school_age', () => {
    expect(resolveAgeGroup('6_to_13')).toBe('school_age');
  });
});

// ─── resolveDailyFee ────────────────────────────────────────────────────────

describe('resolveDailyFee', () => {
  it('returns user-provided fee when useStateAverage is false', () => {
    const fee = resolveDailyFee(
      {
        feePerDay: 150,
        useStateAverage: false,
        state: 'NSW',
        careType: 'centre_based_day_care',
      },
      TEST_STATE_AVERAGES
    );
    expect(fee).toBe(150);
  });

  it('returns state average when useStateAverage is true', () => {
    const fee = resolveDailyFee(
      {
        feePerDay: 150,
        useStateAverage: true,
        state: 'NSW',
        careType: 'centre_based_day_care',
      },
      TEST_STATE_AVERAGES
    );
    expect(fee).toBe(158); // NSW CBDC average
  });

  it('returns state average when fee is null', () => {
    const fee = resolveDailyFee(
      {
        feePerDay: null,
        useStateAverage: false,
        state: 'VIC',
        careType: 'family_day_care',
      },
      TEST_STATE_AVERAGES
    );
    // null fee + useStateAverage false → feePerDay == null triggers state average lookup
    // Wait, actually: the code checks !inputs.useStateAverage && inputs.feePerDay != null && > 0
    // If feePerDay is null, condition fails → falls through to state average
    expect(fee).toBe(122); // VIC FDC average
  });

  it('returns feePerDay or 0 for in_home_care (no state average)', () => {
    const fee = resolveDailyFee(
      {
        feePerDay: 300,
        useStateAverage: true,
        state: 'NSW',
        careType: 'in_home_care',
      },
      TEST_STATE_AVERAGES
    );
    // For in_home_care, returns inputs.feePerDay ?? 0
    expect(fee).toBe(300);
  });

  it('returns 0 for in_home_care when fee is null', () => {
    const fee = resolveDailyFee(
      {
        feePerDay: null,
        useStateAverage: true,
        state: 'NSW',
        careType: 'in_home_care',
      },
      TEST_STATE_AVERAGES
    );
    expect(fee).toBe(0);
  });
});

// ─── resolveHoursPerDay ─────────────────────────────────────────────────────

describe('resolveHoursPerDay', () => {
  it('returns user-provided hours when > 0', () => {
    expect(resolveHoursPerDay(8, 'centre_based_day_care')).toBe(8);
  });

  it('returns default for centre-based (10 hrs) when null', () => {
    expect(resolveHoursPerDay(null, 'centre_based_day_care')).toBe(10);
  });

  it('returns default for family day care (9 hrs) when null', () => {
    expect(resolveHoursPerDay(null, 'family_day_care')).toBe(9);
  });

  it('returns default for OSHC (4 hrs) when null', () => {
    expect(resolveHoursPerDay(null, 'outside_school_hours')).toBe(4);
  });

  it('returns default for in-home care (10 hrs) when null', () => {
    expect(resolveHoursPerDay(null, 'in_home_care')).toBe(10);
  });

  it('returns default when hours is 0', () => {
    expect(resolveHoursPerDay(0, 'centre_based_day_care')).toBe(10);
  });
});

// ─── isEligibleForHigherRate ────────────────────────────────────────────────

describe('isEligibleForHigherRate', () => {
  it('returns true for 2 children with youngest under 6', () => {
    expect(isEligibleForHigherRate(2, 'under_6')).toBe(true);
  });

  it('returns true for 3 children with youngest under 6', () => {
    expect(isEligibleForHigherRate(3, 'under_6')).toBe(true);
  });

  it('returns false for 1 child (even if under 6)', () => {
    expect(isEligibleForHigherRate(1, 'under_6')).toBe(false);
  });

  it('returns false for 2 children with youngest 6–13', () => {
    expect(isEligibleForHigherRate(2, '6_to_13')).toBe(false);
  });

  it('returns false for 1 child aged 6–13', () => {
    expect(isEligibleForHigherRate(1, '6_to_13')).toBe(false);
  });
});

// ─── resolveInputs (integration) ───────────────────────────────────────────

describe('resolveInputs', () => {
  const baseInputs: WizardInputs = {
    numberOfChildren: 1,
    youngestChildAge: 'under_6',
    combinedAnnualIncome: 100000,
    careType: 'centre_based_day_care',
    state: 'NSW',
    daysPerWeek: 3,
    hoursPerDay: 10,
    feePerDay: 150,
    useStateAverage: false,
    includeBackToWork: false,
    currentAnnualIncome: 0,
    proposedAnnualIncome: 0,
    workRelatedCostsPerWeek: 0,
  };

  it('resolves all fields for a single-child family', () => {
    const resolved = resolveInputs(baseInputs, TEST_STATE_AVERAGES);

    expect(resolved.numberOfChildren).toBe(1);
    expect(resolved.youngestChildAge).toBe('under_6');
    expect(resolved.ageGroup).toBe('below_school_age');
    expect(resolved.eligibleForHigherRate).toBe(false);
    expect(resolved.combinedAnnualIncome).toBe(100000);
    expect(resolved.careType).toBe('centre_based_day_care');
    expect(resolved.state).toBe('NSW');
    expect(resolved.daysPerWeek).toBe(3);
    expect(resolved.hoursPerDay).toBe(10);
    expect(resolved.dailyFee).toBe(150);
    expect(resolved.usingStateAverage).toBe(false);
    expect(resolved.includeBackToWork).toBe(false);
  });

  it('resolves multi-child family as eligible for higher rate', () => {
    const inputs: WizardInputs = {
      ...baseInputs,
      numberOfChildren: 2,
      youngestChildAge: 'under_6',
    };
    const resolved = resolveInputs(inputs, TEST_STATE_AVERAGES);

    expect(resolved.eligibleForHigherRate).toBe(true);
  });

  it('resolves school-age child correctly', () => {
    const inputs: WizardInputs = {
      ...baseInputs,
      youngestChildAge: '6_to_13',
    };
    const resolved = resolveInputs(inputs, TEST_STATE_AVERAGES);

    expect(resolved.ageGroup).toBe('school_age');
    expect(resolved.eligibleForHigherRate).toBe(false);
  });

  it('derives partner income from combined minus current individual', () => {
    const inputs: WizardInputs = {
      ...baseInputs,
      combinedAnnualIncome: 150000,
      currentAnnualIncome: 30000,
    };
    const resolved = resolveInputs(inputs, TEST_STATE_AVERAGES);

    expect(resolved.partnerIncome).toBe(120000);
  });

  it('clamps partner income to 0 when current exceeds combined', () => {
    const inputs: WizardInputs = {
      ...baseInputs,
      combinedAnnualIncome: 50000,
      currentAnnualIncome: 60000,
    };
    const resolved = resolveInputs(inputs, TEST_STATE_AVERAGES);

    expect(resolved.partnerIncome).toBe(0);
  });

  it('uses state average fee when useStateAverage is true', () => {
    const inputs: WizardInputs = {
      ...baseInputs,
      useStateAverage: true,
      state: 'VIC',
      careType: 'centre_based_day_care',
    };
    const resolved = resolveInputs(inputs, TEST_STATE_AVERAGES);

    expect(resolved.dailyFee).toBe(148); // VIC CBDC average
    expect(resolved.usingStateAverage).toBe(true);
  });

  it('populates back-to-work fields when included', () => {
    const inputs: WizardInputs = {
      ...baseInputs,
      includeBackToWork: true,
      currentAnnualIncome: 30000,
      proposedAnnualIncome: 80000,
      workRelatedCostsPerWeek: 75,
    };
    const resolved = resolveInputs(inputs, TEST_STATE_AVERAGES);

    expect(resolved.includeBackToWork).toBe(true);
    expect(resolved.currentIndividualIncome).toBe(30000);
    expect(resolved.proposedFTEIncome).toBe(80000);
    expect(resolved.workRelatedCostsPerWeek).toBe(75);
  });
});
