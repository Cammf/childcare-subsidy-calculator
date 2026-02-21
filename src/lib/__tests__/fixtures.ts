// =============================================================================
// TEST FIXTURES — Shared rate data for all calculation tests
// =============================================================================
// These fixtures match the FY 2025-26 data in src/data/ but are inlined
// so tests are independent of data files and explicitly typed.
// =============================================================================

import type { CCSRates, TaxRates, StateAverageEntry } from '../types';

/** FY 2025-26 CCS rates fixture */
export const TEST_CCS_RATES: CCSRates = {
  financialYear: '2025-26',
  effectiveDate: '2025-07-01',
  source: 'test fixture',
  standardSubsidy: {
    maxSubsidyPercent: 90,
    baseIncomeThreshold: 85279,
    taperPer5000: 1,
    minSubsidyPercent: 0,
  },
  higherSubsidy: {
    description: 'Higher rate for younger children',
    additionalPercentagePoints: 30,
    maxSubsidyPercent: 95,
    appliesTo: 'Younger children in multi-child families',
  },
  hourlyRateCaps: [
    { careType: 'centre_based_day_care', ageGroup: 'below_school_age', ratePerHour: 14.63 },
    { careType: 'centre_based_day_care', ageGroup: 'school_age', ratePerHour: 12.81 },
    { careType: 'family_day_care', ageGroup: 'all', ratePerHour: 12.43 },
    { careType: 'outside_school_hours', ageGroup: 'school_age', ratePerHour: 12.81 },
    { careType: 'in_home_care', ageGroup: 'all', ratePerHour: 35.40 },
  ],
  annualSubsidyCap: {
    incomeThreshold: 85279,
    capAmountPerChild: 11003,
    uncappedBelow: true,
  },
  threeDayGuarantee: {
    effectiveDate: '2026-01-05',
    minHoursPerFortnight: 72,
    description: '3-Day Guarantee',
  },
  withholdingPercent: 5,
};

/** FY 2025-26 tax rates fixture (revised Stage 3) */
export const TEST_TAX_RATES: TaxRates = {
  financialYear: '2025-26',
  source: 'test fixture',
  brackets: [
    { min: 0, max: 18200, baseTax: 0, rate: 0 },
    { min: 18201, max: 45000, baseTax: 0, rate: 0.16 },
    { min: 45001, max: 135000, baseTax: 4288, rate: 0.30 },
    { min: 135001, max: 190000, baseTax: 31288, rate: 0.37 },
    { min: 190001, max: null, baseTax: 51638, rate: 0.45 },
  ],
  medicareLevy: {
    rate: 0.02,
    lowIncomeThreshold: 26000,
    phaseInRate: 0.10,
    shadeInThreshold: 32500,
  },
  lito: {
    maxOffset: 700,
    fullOffsetTo: 37500,
    phaseOut1Rate: 0.05,
    phaseOut1To: 45000,
    phaseOut2Rate: 0.015,
    phaseOut2To: 66667,
  },
};

/** State averages fixture (subset for testing) */
export const TEST_STATE_AVERAGES: StateAverageEntry[] = [
  {
    state: 'NSW',
    stateName: 'New South Wales',
    averageDailyFee: {
      centre_based_day_care: 158,
      family_day_care: 128,
      outside_school_hours: 50,
    },
    lastUpdated: '2025-07-01',
    source: 'test fixture',
  },
  {
    state: 'VIC',
    stateName: 'Victoria',
    averageDailyFee: {
      centre_based_day_care: 148,
      family_day_care: 122,
      outside_school_hours: 48,
    },
    lastUpdated: '2025-07-01',
    source: 'test fixture',
  },
  {
    state: 'ACT',
    stateName: 'Australian Capital Territory',
    averageDailyFee: {
      centre_based_day_care: 175,
      family_day_care: 140,
      outside_school_hours: 55,
    },
    lastUpdated: '2025-07-01',
    source: 'test fixture',
  },
];
