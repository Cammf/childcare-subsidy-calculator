'use client';
// =============================================================================
// WIZARD CONTEXT — CCS Calculator State Management
// =============================================================================
// Single source of truth for all wizard state: current step, user inputs,
// income range selection, and relationship status.
//
// Architecture: useReducer for predictable state transitions + React Context
// for component-tree-wide access without prop drilling.
// =============================================================================

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { WizardInputs, WizardStep, CareType, State } from '@/lib/types';
import {
  resolveIncome,
  type IncomeRange,
} from '@/lib/resolveInputs';

// ─── Wizard State ────────────────────────────────────────────────────────────

export type RelationshipStatus = 'single' | 'partnered';

export interface WizardState {
  /** Current active step (1–5). */
  currentStep: WizardStep;
  /** All wizard input values, kept in sync with resolved income. */
  inputs: WizardInputs;
  /** Income range bucket selected in Step 2. */
  incomeRange: IncomeRange;
  /** Exact income if the user chose to enter one (overrides range midpoint). */
  exactIncome: number | null;
  /** Whether the user is single or partnered (affects income label wording). */
  relationshipStatus: RelationshipStatus;
}

// Default inputs — all have sensible pre-selections so the wizard feels
// pre-populated rather than blank. User must actively confirm / change.
const DEFAULT_INPUTS: WizardInputs = {
  numberOfChildren: 1,
  youngestChildAge: 'under_6',
  combinedAnnualIncome: 60000,  // midpoint of 'under_85279' range
  careType: 'centre_based_day_care',
  state: 'NSW',
  daysPerWeek: 3,
  hoursPerDay: 10,
  feePerDay: null,
  useStateAverage: true,
  includeBackToWork: false,
  currentAnnualIncome: 0,
  proposedAnnualIncome: 0,
  workRelatedCostsPerWeek: 0,
};

const INITIAL_STATE: WizardState = {
  currentStep: 1,
  inputs: DEFAULT_INPUTS,
  incomeRange: 'under_85279',
  exactIncome: null,
  relationshipStatus: 'partnered',
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export type WizardAction =
  | { type: 'GO_TO_STEP'; payload: WizardStep }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_RELATIONSHIP_STATUS'; payload: RelationshipStatus }
  | { type: 'UPDATE_INPUT'; payload: Partial<WizardInputs> }
  | {
      type: 'SET_INCOME_RANGE';
      payload: { range: IncomeRange; exactIncome: number | null };
    }
  | { type: 'RESET' }
  /** Restore the full wizard state from a previous session (used by Edit Answers flow). */
  | { type: 'RESTORE'; payload: WizardState };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(5, state.currentStep + 1) as WizardStep,
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1) as WizardStep,
      };

    case 'SET_RELATIONSHIP_STATUS':
      return { ...state, relationshipStatus: action.payload };

    case 'UPDATE_INPUT':
      return {
        ...state,
        inputs: { ...state.inputs, ...action.payload },
      };

    case 'SET_INCOME_RANGE': {
      const resolved = resolveIncome(
        action.payload.range,
        action.payload.exactIncome
      );
      return {
        ...state,
        incomeRange: action.payload.range,
        exactIncome: action.payload.exactIncome,
        inputs: { ...state.inputs, combinedAnnualIncome: resolved },
      };
    }

    case 'RESET':
      return INITIAL_STATE;

    case 'RESTORE':
      return action.payload;

    default:
      return state;
  }
}

// ─── Restore Utilities ────────────────────────────────────────────────────────
//
// Parse URL search params (from the results page "Edit answers" flow) back into
// a WizardState so the wizard can be pre-populated without the user re-entering
// all their answers.
//
// URL params used:
//   restore=1       flag — signals that restore should be applied
//   step=N          which wizard step to land on (default 5 — Review)
//   n, ya, i, ir, ei, ct, st, d, h, f, sa, btw, ci, pi, wc, rs
//   (same encoding as Step5Review.handleCalculate)
// ─────────────────────────────────────────────────────────────────────────────

const VALID_INCOME_RANGES: IncomeRange[] = [
  'under_85279',
  '85280_120000',
  '120001_160000',
  '160001_220000',
  '220001_350000',
  'over_350000',
];

const VALID_CARE_TYPES: CareType[] = [
  'centre_based_day_care',
  'family_day_care',
  'outside_school_hours',
  'in_home_care',
];

const VALID_STATES: State[] = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

function pNum(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Parse URL search params into a WizardState for the "Edit Answers" restore flow.
 *
 * @param p  Raw URL search params (string values only).
 * @returns  A fully-typed WizardState ready to pass as `initialState` to WizardProvider.
 */
export function parseRestoreParams(
  p: Record<string, string | undefined>
): WizardState {
  const incomeRange: IncomeRange = VALID_INCOME_RANGES.includes(p.ir as IncomeRange)
    ? (p.ir as IncomeRange)
    : 'under_85279';

  const exactIncome: number | null =
    p.ei && p.ei !== '' ? Number(p.ei) : null;

  const stepNum = Number(p.step);
  const currentStep: WizardStep = ([1, 2, 3, 4, 5].includes(stepNum)
    ? stepNum
    : 5) as WizardStep;

  const careType: CareType = VALID_CARE_TYPES.includes(p.ct as CareType)
    ? (p.ct as CareType)
    : 'centre_based_day_care';

  const state: State = VALID_STATES.includes(p.st as State)
    ? (p.st as State)
    : 'NSW';

  const inputs: WizardInputs = {
    numberOfChildren:        pNum(p.n,  1),
    youngestChildAge:        p.ya === '6_to_13' ? '6_to_13' : 'under_6',
    combinedAnnualIncome:    pNum(p.i,  60000),
    careType,
    state,
    daysPerWeek:             pNum(p.d,  3),
    hoursPerDay:             pNum(p.h,  10),
    feePerDay:               (p.f && p.f !== '') ? pNum(p.f, 0) : null,
    useStateAverage:         p.sa === '1',
    includeBackToWork:       p.btw === '1',
    currentAnnualIncome:     pNum(p.ci, 0),
    proposedAnnualIncome:    pNum(p.pi, 0),
    workRelatedCostsPerWeek: pNum(p.wc, 0),
  };

  return {
    currentStep,
    inputs,
    incomeRange,
    exactIncome,
    relationshipStatus: p.rs === 'single' ? 'single' : 'partnered',
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  // ── Convenience helpers ──────────────────────────────────────────────
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateInput: (updates: Partial<WizardInputs>) => void;
  setIncomeRange: (range: IncomeRange, exactIncome: number | null) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function WizardProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  /** Optional pre-populated state for the Edit Answers restore flow. */
  initialState?: WizardState;
}) {
  const [state, dispatch] = useReducer(wizardReducer, initialState ?? INITIAL_STATE);

  const value: WizardContextValue = {
    state,
    dispatch,
    goToStep: (step) => dispatch({ type: 'GO_TO_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    updateInput: (updates) =>
      dispatch({ type: 'UPDATE_INPUT', payload: updates }),
    setIncomeRange: (range, exactIncome) =>
      dispatch({ type: 'SET_INCOME_RANGE', payload: { range, exactIncome } }),
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Access wizard state and dispatch from any descendant of WizardProvider.
 * Throws if used outside of WizardProvider.
 */
export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error('useWizard must be used within a <WizardProvider>.');
  }
  return ctx;
}
