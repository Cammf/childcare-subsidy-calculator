// =============================================================================
// GLOBAL TYPE DEFINITIONS — Child Care Subsidy Calculator
// =============================================================================

// ─── Wizard Steps ──────────────────────────────────────────────────────────

export type WizardStep = 1 | 2 | 3 | 4 | 5;

// ─── Domain Enums ──────────────────────────────────────────────────────────

export type CareType =
  | 'centre_based_day_care'  // CBDC — most common
  | 'family_day_care'        // FDC
  | 'outside_school_hours'   // OSHC — before/after school + vacation care
  | 'in_home_care';          // IHC — nanny-style, per family

export type State = 'ACT' | 'NSW' | 'NT' | 'QLD' | 'SA' | 'TAS' | 'VIC' | 'WA';

// ─── Wizard Input Types ─────────────────────────────────────────────────────

export interface WizardInputs {
  // Step 1 — Family situation
  numberOfChildren: number;         // number of children in approved childcare
  youngestChildAge: 'under_6' | '6_to_13';  // determines rate cap tier

  // Step 2 — Income
  combinedAnnualIncome: number;     // AUD/year — combined family income

  // Step 3 — Childcare details
  careType: CareType;
  state: State;
  daysPerWeek: number;              // 1–5
  hoursPerDay: number;              // hours per day (e.g. 10 for full day)
  feePerDay: number | null;         // actual daily fee; null → use state average
  useStateAverage: boolean;

  // Step 4 — Work situation (optional)
  includeBackToWork: boolean;
  currentAnnualIncome: number;      // income if NOT working / current income
  proposedAnnualIncome: number;     // income if working / proposed income
  workRelatedCostsPerWeek: number;  // transport, uniforms, meals, etc.
}

// ─── CCS Rates Data Types ───────────────────────────────────────────────────

export interface CCSIncomeThreshold {
  incomeMin: number;
  incomeMax: number | null;    // null = no upper limit
  subsidyPercent: number;
}

export interface HourlyRateCap {
  careType: CareType;
  ageGroup: 'below_school_age' | 'school_age' | 'all';
  ratePerHour: number;
}

export interface CCSRates {
  financialYear: string;
  effectiveDate: string;
  source: string;
  standardSubsidy: {
    maxSubsidyPercent: number;
    baseIncomeThreshold: number;     // income at or below which max rate applies
    taperPer5000: number;            // percentage points lost per $5,000 above threshold
    minSubsidyPercent: number;
  };
  higherSubsidy: {
    description: string;
    additionalPercentagePoints: number;   // added to eldest child's rate for younger children
    maxSubsidyPercent: number;
    appliesTo: string;
  };
  hourlyRateCaps: HourlyRateCap[];
  annualSubsidyCap: {
    incomeThreshold: number;         // above this → annual cap applies
    capAmountPerChild: number;       // max $ subsidy paid per child per year
    uncappedBelow: boolean;          // true = no cap if income <= threshold
  };
  threeDayGuarantee: {
    effectiveDate: string;
    minHoursPerFortnight: number;
    description: string;
  };
  withholdingPercent: number;        // % withheld per fortnight for end-of-year reconciliation
}

// ─── Tax Rates Data Types ───────────────────────────────────────────────────

export interface TaxBracket {
  min: number;
  max: number | null;
  baseTax: number;
  rate: number;                      // marginal rate as decimal, e.g. 0.325
}

export interface TaxRates {
  financialYear: string;
  source: string;
  brackets: TaxBracket[];
  medicareLevy: {
    rate: number;                    // 0.02
    lowIncomeThreshold: number;      // income below which no levy applies
    phaseInRate: number;             // rate at which levy phases in above threshold
    shadeInThreshold: number;        // income at which full levy applies
  };
  lito: {
    maxOffset: number;               // maximum Low Income Tax Offset
    fullOffsetTo: number;            // income at which full LITO starts reducing
    phaseOut1Rate: number;           // cents per dollar reduction, first phase
    phaseOut1To: number;             // income at end of first phase
    phaseOut2Rate: number;           // cents per dollar reduction, second phase
    phaseOut2To: number;             // income at which LITO reaches zero
  };
}

// ─── State Average Data Types ───────────────────────────────────────────────

export interface StateAverageEntry {
  state: State;
  stateName: string;
  averageDailyFee: {
    centre_based_day_care: number;   // $ per day, below school age
    family_day_care: number;         // $ per day
    outside_school_hours: number;    // $ per day (before/after school session)
  };
  lastUpdated: string;
  source: string;
}

// ─── Calculation Result Types ───────────────────────────────────────────────

export interface CCSResult {
  // Core outputs
  subsidyPercent: number;            // e.g. 72 (%)
  hourlyRateCap: number;             // applicable hourly rate cap
  hourlySubsidyAmount: number;       // $ per hour subsidised
  weeklyGovSubsidy: number;          // $ per week government pays
  weeklyOutOfPocket: number;         // $ per week family pays (after withholding)
  annualOutOfPocket: number;         // $ per year family pays
  annualGovSubsidy: number;          // $ per year government pays (before withholding)

  // Breakdown
  calculationBreakdown: {
    combinedIncome: number;
    ccsPercent: number;
    hourlyRateCapApplied: number;
    sessionHoursPerFortnight: number;
    grossFeePerFortnight: number;
    subsidisedHourlyRate: number;
    subsidyPerFortnight: number;
    outOfPocketPerFortnight: number;
    withholdingPerFortnight: number;  // 5% withheld for end-of-year reconciliation
    netOutOfPocketPerFortnight: number;
  };

  // Data provenance
  ratesVersion: string;
  calculatedAt: string;
}

export interface BackToWorkResult {
  additionalGrossIncome: number;
  additionalNetIncome: number;       // after tax
  additionalChildcareCost: number;   // extra childcare cost from working more days
  workRelatedCosts: number;          // per year
  netFinancialBenefit: number;       // additionalNetIncome - additionalChildcareCost - workRelatedCosts
  isWorthReturning: boolean;
  effectiveHourlyRate: number | null; // net benefit / additional hours worked

  calculationBreakdown: {
    currentNetIncome: number;
    proposedNetIncome: number;
    currentChildcareCost: number;
    proposedChildcareCost: number;
    currentTaxPaid: number;
    proposedTaxPaid: number;
  };
}

export interface IncomeSensitivityRow {
  income: number;
  subsidyPercent: number;
  weeklyOutOfPocket: number;
  annualOutOfPocket: number;
  annualGovSubsidy: number;
}
