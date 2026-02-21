'use client';
// =============================================================================
// INCOME RANGE SELECTOR — Reusable income picker component
// =============================================================================
// Renders the full income-selection UI as a self-contained, controlled widget:
//   • 6 RadioCards for income range buckets
//   • Collapsible exact-income input toggle
//   • Live "Using income: $X (Exact / Range midpoint)" estimate chip
//
// Used in Step 2 of the wizard. Extracted as a standalone component so it can
// be re-used anywhere income collection is needed (e.g. back-to-work scenarios,
// sensitivity table overrides) without duplicating the range-picker logic.
//
// Props:
//   incomeRange   — the currently selected IncomeRange bucket
//   exactIncome   — exact dollar amount entered by user, or null (uses midpoint)
//   onChange      — called with (newRange, newExactIncome) on any change
//   incomeLabel   — label shown above the exact income input (default: 'Income')
// =============================================================================

import { useState } from 'react';
import RadioCard from '@/components/wizard/RadioCard';
import {
  INCOME_RANGE_LABELS,
  INCOME_RANGE_MIDPOINTS,
  type IncomeRange,
} from '@/lib/resolveInputs';
import { formatDollars } from '@/lib/format';

// ─── Range option definitions ─────────────────────────────────────────────────
// Defined here (rather than imported) so this component is fully self-contained.

const INCOME_RANGES: {
  value: IncomeRange;
  badge?: string;
  description: string;
}[] = [
  {
    value: 'under_85279',
    badge: 'Maximum subsidy',
    description: 'CCS rate: up to 90%',
  },
  {
    value: '85280_120000',
    description: 'CCS rate: ~87–89%',
  },
  {
    value: '120001_160000',
    description: 'CCS rate: ~80–87%',
  },
  {
    value: '160001_220000',
    description: 'CCS rate: ~72–80%',
  },
  {
    value: '220001_350000',
    description: 'CCS rate: ~37–72%',
  },
  {
    value: 'over_350000',
    badge: 'No subsidy above $535k',
    description: 'CCS rate: 0–37%',
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface IncomeRangeSelectorProps {
  /** The currently selected income range bucket. */
  incomeRange: IncomeRange;
  /** Exact dollar income if the user has entered one; null means use range midpoint. */
  exactIncome: number | null;
  /** Called whenever range or exact income changes. */
  onChange: (range: IncomeRange, exactIncome: number | null) => void;
  /**
   * Label shown on the exact income input field.
   * Defaults to 'Income'. Pass 'Your income' or 'Combined family income'
   * based on relationship status.
   */
  incomeLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function IncomeRangeSelector({
  incomeRange,
  exactIncome,
  onChange,
  incomeLabel = 'Income',
}: IncomeRangeSelectorProps) {
  // Local state: manage string representation of exact input (handles partial typing)
  const [exactInputStr, setExactInputStr] = useState<string>(
    exactIncome !== null ? String(exactIncome) : ''
  );
  const [showExactInput, setShowExactInput] = useState(exactIncome !== null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleRangeChange(val: string) {
    // Keep any existing exact income when switching ranges
    onChange(val as IncomeRange, exactIncome);
  }

  function handleExactInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setExactInputStr(raw);
    const parsed = raw === '' ? null : parseInt(raw, 10);
    onChange(incomeRange, parsed);
  }

  function handleToggleExact() {
    const next = !showExactInput;
    setShowExactInput(next);
    if (!next) {
      // Collapsing exact panel — clear the exact value; revert to range midpoint
      setExactInputStr('');
      onChange(incomeRange, null);
    }
  }

  // ── Effective income for the live chip ──────────────────────────────────────
  const effectiveIncome =
    exactIncome !== null
      ? exactIncome
      : INCOME_RANGE_MIDPOINTS[incomeRange];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Range selector */}
      <fieldset>
        <legend className="sr-only">{incomeLabel} range</legend>
        <div className="space-y-2">
          {INCOME_RANGES.map((opt) => (
            <RadioCard
              key={opt.value}
              id={`income-${opt.value}`}
              name="incomeRange"
              value={opt.value}
              checked={incomeRange === opt.value}
              onChange={handleRangeChange}
              label={INCOME_RANGE_LABELS[opt.value]}
              description={opt.description}
              badge={opt.badge}
            />
          ))}
        </div>
      </fieldset>

      {/* Exact income toggle */}
      <div>
        <button
          type="button"
          onClick={handleToggleExact}
          className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline focus:outline-none focus:underline"
        >
          <svg
            className={[
              'w-4 h-4 flex-shrink-0 transition-transform duration-150',
              showExactInput ? 'rotate-90' : '',
            ].join(' ')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {showExactInput ? 'Use a range instead' : 'I know my exact income — enter it'}
        </button>

        {showExactInput && (
          <div className="mt-3 p-4 bg-teal-50 border border-primary/20 rounded-lg">
            <label
              htmlFor="exact-income"
              className="block text-sm font-medium text-text-main mb-2"
            >
              {incomeLabel} (AUD / year)
            </label>
            <div className="relative w-full sm:w-56">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">
                $
              </span>
              <input
                id="exact-income"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={exactInputStr}
                onChange={handleExactInputChange}
                placeholder="e.g. 95000"
                className={[
                  'w-full pl-7 pr-3 py-2.5 rounded-lg border-2 bg-card text-text-main',
                  'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'focus:outline-none transition-colors duration-150',
                ].join(' ')}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Entering your exact income gives a more precise result, especially
              near the $85,279 threshold.
            </p>
          </div>
        )}
      </div>

      {/* Live estimate chip */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted">Using income:</span>
        <span className="font-semibold text-primary">
          {formatDollars(effectiveIncome)}
        </span>
        {exactIncome !== null ? (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Exact
          </span>
        ) : (
          <span className="text-xs bg-gray-100 text-muted px-2 py-0.5 rounded-full">
            Range midpoint
          </span>
        )}
      </div>
    </div>
  );
}
