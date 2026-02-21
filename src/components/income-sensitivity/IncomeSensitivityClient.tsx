'use client';

// =============================================================================
// INCOME SENSITIVITY CLIENT — Interactive Calculator
// =============================================================================
// Lets users enter their care details and see the full income vs cost table
// at every $5,000 income increment from $40,000 to $600,000.
//
// All calculation is done client-side using calculateIncomeSensitivity().
// Data (CCS rates, state averages) is imported as JSON.
// =============================================================================

import React, { useState, useMemo } from 'react';
import { calculateIncomeSensitivity } from '@/lib/incomeSensitivity';
import { formatDollars } from '@/lib/format';
import type { CCSRates, CareType, State, StateAverageEntry, IncomeSensitivityRow } from '@/lib/types';
import { DEFAULT_HOURS_PER_DAY } from '@/lib/resolveInputs';
import { getStateAverageDailyFee } from '@/lib/ccsCalculations';

// JSON data imports
import ccsRatesJson      from '@/data/ccs/current.json';
import stateAveragesJson from '@/data/childcare-costs/state-averages.json';

const ccsRates: CCSRates                 = ccsRatesJson      as unknown as CCSRates;
const stateAverages: StateAverageEntry[] = stateAveragesJson as unknown as StateAverageEntry[];

// ─── Types ───────────────────────────────────────────────────────────────────

interface Inputs {
  careType:    CareType;
  ageGroup:    'below_school_age' | 'school_age';
  state:       State;
  useStateAvg: boolean;
  customFee:   string;           // raw string for controlled input
  daysPerWeek: number;
  hoursPerDay: string;           // raw string — default by care type
  yourIncome:  string;           // optional, to highlight user row
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATES: State[] = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

const STATE_NAMES: Record<State, string> = {
  ACT: 'Australian Capital Territory',
  NSW: 'New South Wales',
  NT:  'Northern Territory',
  QLD: 'Queensland',
  SA:  'South Australia',
  TAS: 'Tasmania',
  VIC: 'Victoria',
  WA:  'Western Australia',
};

const CARE_TYPE_LABELS: Record<CareType, string> = {
  centre_based_day_care: 'Centre-Based Day Care',
  family_day_care:       'Family Day Care',
  outside_school_hours:  'Outside School Hours (OSHC)',
  in_home_care:          'In-Home Care',
};

const CONDENSED_CONTEXT = 4; // rows either side of user's income to show

// Default inputs shown on first load
const DEFAULT_INPUTS: Inputs = {
  careType:    'centre_based_day_care',
  ageGroup:    'below_school_age',
  state:       'NSW',
  useStateAvg: true,
  customFee:   '',
  daysPerWeek: 3,
  hoursPerDay: String(DEFAULT_HOURS_PER_DAY['centre_based_day_care']),
  yourIncome:  '120000',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCondensedIndices(rows: IncomeSensitivityRow[], userRowIndex: number): Set<number> {
  const indices = new Set<number>();
  indices.add(0);
  indices.add(rows.length - 1);
  for (let i = Math.max(0, userRowIndex - CONDENSED_CONTEXT); i <= Math.min(rows.length - 1, userRowIndex + CONDENSED_CONTEXT); i++) {
    indices.add(i);
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].subsidyPercent === 0 && i > 0) {
      indices.add(i - 1);
      indices.add(i);
      break;
    }
  }
  const thresholdIndex = rows.findIndex((r) => r.income >= 85000);
  if (thresholdIndex >= 0) {
    indices.add(Math.max(0, thresholdIndex - 1));
    indices.add(thresholdIndex);
    indices.add(Math.min(rows.length - 1, thresholdIndex + 1));
  }
  return indices;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IncomeSensitivityClient() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [showAll, setShowAll] = useState(false);

  // ── Derived values ────────────────────────────────────────────────────────

  const dailyFee = useMemo((): number => {
    if (inputs.careType === 'in_home_care') {
      return Math.max(0, Number(inputs.customFee) || 0);
    }
    if (inputs.useStateAvg) {
      return getStateAverageDailyFee(
        inputs.state,
        inputs.careType as Exclude<CareType, 'in_home_care'>,
        stateAverages
      );
    }
    return Math.max(0, Number(inputs.customFee) || 0);
  }, [inputs.careType, inputs.useStateAvg, inputs.state, inputs.customFee]);

  const hoursPerDay = useMemo(() => {
    const n = Number(inputs.hoursPerDay);
    return (Number.isFinite(n) && n > 0) ? n : DEFAULT_HOURS_PER_DAY[inputs.careType];
  }, [inputs.hoursPerDay, inputs.careType]);

  const userIncome = useMemo(() => {
    const n = Number(inputs.yourIncome.replace(/,/g, ''));
    return (Number.isFinite(n) && n >= 0) ? n : 120000;
  }, [inputs.yourIncome]);

  const sensitivity = useMemo(() => {
    if (dailyFee <= 0) return null;
    return calculateIncomeSensitivity(
      {
        userIncome,
        dailyFee,
        hoursPerDay,
        daysPerWeek: inputs.daysPerWeek,
        careType:    inputs.careType,
        ageGroup:    inputs.ageGroup,
      },
      ccsRates
    );
  }, [dailyFee, hoursPerDay, inputs.daysPerWeek, inputs.careType, inputs.ageGroup, userIncome]);

  // ── Input helpers ─────────────────────────────────────────────────────────

  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function handleCareTypeChange(ct: CareType) {
    setInputs((prev) => ({
      ...prev,
      careType:    ct,
      ageGroup:    ct === 'outside_school_hours' ? 'school_age' : prev.ageGroup,
      hoursPerDay: String(DEFAULT_HOURS_PER_DAY[ct]),
      useStateAvg: ct !== 'in_home_care' ? prev.useStateAvg : false,
    }));
  }

  // ── Table rows ────────────────────────────────────────────────────────────

  const visibleRows = useMemo(() => {
    if (!sensitivity) return [];
    const { rows, userRowIndex } = sensitivity;
    const condensedIndices = getCondensedIndices(rows, userRowIndex);
    const sortedIndices = showAll
      ? rows.map((_, i) => i)
      : Array.from(condensedIndices).sort((a, b) => a - b);

    const result: { row: IncomeSensitivityRow; index: number; marginalCost: number | null; gapFromPrev: boolean }[] = [];
    let prevIndex = -1;
    for (const i of sortedIndices) {
      const marginalCost = i > 0
        ? Math.round((rows[i].annualOutOfPocket - rows[i - 1].annualOutOfPocket) * 100) / 100
        : null;
      const gapFromPrev = !showAll && prevIndex >= 0 && i - prevIndex > 1;
      result.push({ row: rows[i], index: i, marginalCost, gapFromPrev });
      prevIndex = i;
    }
    return result;
  }, [sensitivity, showAll]);

  // ── Render ────────────────────────────────────────────────────────────────

  const hasIncome = inputs.yourIncome.trim() !== '';

  return (
    <div className="space-y-6">

      {/* ================================================================ */}
      {/* INPUTS PANEL                                                     */}
      {/* ================================================================ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-text-main mb-4">Your childcare details</h2>

        <div className="grid sm:grid-cols-2 gap-5">

          {/* Care type */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Type of care
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CARE_TYPE_LABELS) as CareType[]).map((ct) => (
                <button
                  key={ct}
                  type="button"
                  onClick={() => handleCareTypeChange(ct)}
                  className={[
                    'px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors',
                    inputs.careType === ct
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-text-main hover:border-primary/50',
                  ].join(' ')}
                >
                  {CARE_TYPE_LABELS[ct]}
                </button>
              ))}
            </div>
          </div>

          {/* Age group — only show for CBDC */}
          {inputs.careType === 'centre_based_day_care' && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Child&apos;s age group
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['below_school_age', 'school_age'] as const).map((ag) => (
                  <button
                    key={ag}
                    type="button"
                    onClick={() => set('ageGroup', ag)}
                    className={[
                      'px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                      inputs.ageGroup === ag
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-text-main hover:border-primary/50',
                    ].join(' ')}
                  >
                    {ag === 'below_school_age' ? 'Under school age' : 'School age'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-1.5">
                Rate cap: <span className="font-medium">{inputs.ageGroup === 'below_school_age' ? '$14.63/hr' : '$12.81/hr'}</span>
              </p>
            </div>
          )}

          {/* Fee source */}
          {inputs.careType !== 'in_home_care' && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Daily fee
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => set('useStateAvg', true)}
                  className={[
                    'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                    inputs.useStateAvg
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-text-main hover:border-primary/50',
                  ].join(' ')}
                >
                  Use state average
                </button>
                <button
                  type="button"
                  onClick={() => set('useStateAvg', false)}
                  className={[
                    'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                    !inputs.useStateAvg
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-text-main hover:border-primary/50',
                  ].join(' ')}
                >
                  Enter my fee
                </button>
              </div>

              {inputs.useStateAvg ? (
                <div>
                  <select
                    value={inputs.state}
                    onChange={(e) => set('state', e.target.value as State)}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="State"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s} — {STATE_NAMES[s]}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1.5">
                    State average: <span className="font-medium text-text-main">${dailyFee}/day</span>
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="1"
                    value={inputs.customFee}
                    onChange={(e) => set('customFee', e.target.value)}
                    placeholder="e.g. 165"
                    className="w-full border border-border rounded-lg pl-7 pr-12 py-2.5 text-sm bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Daily fee in dollars"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">/day</span>
                </div>
              )}
            </div>
          )}

          {/* In-home care fee */}
          {inputs.careType === 'in_home_care' && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Daily fee
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="1"
                  value={inputs.customFee}
                  onChange={(e) => set('customFee', e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full border border-border rounded-lg pl-7 pr-12 py-2.5 text-sm bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="Daily in-home care fee in dollars"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">/day</span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                In-home care rate cap: $35.40/hr ($354/day for 10 hrs)
              </p>
            </div>
          )}

          {/* Days per week */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Days per week
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set('daysPerWeek', d)}
                  className={[
                    'flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                    inputs.daysPerWeek === d
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-text-main hover:border-primary/50',
                  ].join(' ')}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Hours per day */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Hours per day
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={inputs.hoursPerDay}
                onChange={(e) => set('hoursPerDay', e.target.value)}
                className="w-full border border-border rounded-lg px-3 pr-16 py-2.5 text-sm bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Hours per day"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">hrs/day</span>
            </div>
            <p className="text-xs text-muted mt-1.5">
              Default for {CARE_TYPE_LABELS[inputs.careType]}: {DEFAULT_HOURS_PER_DAY[inputs.careType]} hrs
            </p>
          </div>

          {/* Your income */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Your combined family income
              <span className="text-muted font-normal ml-1">(optional — highlights your row)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input
                type="number"
                min="0"
                max="2000000"
                step="1000"
                value={inputs.yourIncome}
                onChange={(e) => set('yourIncome', e.target.value)}
                placeholder="e.g. 120000"
                className="w-full border border-border rounded-lg pl-7 pr-16 py-2.5 text-sm bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Your combined family income"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">/year</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================================ */}
      {/* NO FEE STATE                                                     */}
      {/* ================================================================ */}
      {!sensitivity && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted text-sm">
            {inputs.careType === 'in_home_care' && !inputs.customFee
              ? 'Enter your daily in-home care fee above to see the income sensitivity table.'
              : !inputs.useStateAvg && !inputs.customFee
              ? 'Enter your daily fee above to see the income sensitivity table.'
              : 'Enter your care details above to see the income sensitivity table.'}
          </p>
        </div>
      )}

      {/* ================================================================ */}
      {/* RESULTS                                                          */}
      {/* ================================================================ */}
      {sensitivity && (() => {
        const { rows, userRowIndex, zeroCCSIncome, highestMarginalRange, lowestMarginalRange } = sensitivity;
        const userRow = rows[userRowIndex];

        return (
          <div className="space-y-5">

            {/* ── Summary line ─────────────────────────────────────────── */}
            <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 px-5 py-4">
              <p className="text-sm text-teal-800 dark:text-teal-200">
                Showing costs for <strong>{inputs.daysPerWeek} day{inputs.daysPerWeek > 1 ? 's' : ''}/week</strong> of{' '}
                <strong>{CARE_TYPE_LABELS[inputs.careType].toLowerCase()}</strong> at{' '}
                <strong>${dailyFee}/day</strong> ({hoursPerDay} hrs/day).
                {hasIncome && (
                  <> Your income of <strong>{formatDollars(userIncome)}</strong> is highlighted in the table.</>
                )}
              </p>
            </div>

            {/* ── Insight cards ────────────────────────────────────────── */}
            <div className="grid sm:grid-cols-2 gap-3">

              {/* User position — only if income entered */}
              {hasIncome && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-4">
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">Your position</p>
                  <p className="text-2xl font-bold text-primary mt-1">{userRow.subsidyPercent}% CCS</p>
                  <p className="text-xs text-muted mt-1">
                    at {formatDollars(userRow.income)}/yr &middot;{' '}
                    {formatDollars(userRow.weeklyOutOfPocket)}/wk out-of-pocket
                  </p>
                </div>
              )}

              {/* Zero-CCS income */}
              <div className="rounded-xl bg-card border border-border px-4 py-4">
                <p className="text-xs text-muted font-medium uppercase tracking-wide">CCS cuts out at</p>
                <p className="text-2xl font-bold text-text-main mt-1">{formatDollars(zeroCCSIncome)}</p>
                <p className="text-xs text-muted mt-1">
                  {hasIncome && zeroCCSIncome > userIncome
                    ? `${formatDollars(zeroCCSIncome - userIncome)} above your income`
                    : hasIncome && zeroCCSIncome <= userIncome
                    ? 'Your income is above this threshold'
                    : 'Combined family income threshold'}
                </p>
              </div>

              {/* Pain point */}
              {highestMarginalRange && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-4">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium uppercase tracking-wide">Biggest cost jump</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    +{formatDollars(highestMarginalRange.costIncrease)}/yr
                  </p>
                  <p className="text-xs text-muted mt-1">
                    per extra $5,000 between {formatDollars(highestMarginalRange.incomeFrom)}&ndash;{formatDollars(highestMarginalRange.incomeTo)}
                  </p>
                </div>
              )}

              {/* Sweet spot */}
              {lowestMarginalRange && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-4">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wide">Smallest cost jump</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    +{formatDollars(lowestMarginalRange.costIncrease)}/yr
                  </p>
                  <p className="text-xs text-muted mt-1">
                    per extra $5,000 between {formatDollars(lowestMarginalRange.incomeFrom)}&ndash;{formatDollars(lowestMarginalRange.incomeTo)}
                  </p>
                </div>
              )}
            </div>

            {/* ── Table ────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 pt-5 pb-3 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-text-main">
                    {showAll ? 'Full income range ($40k–$600k)' : 'Key income levels'}
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    {showAll ? `${rows.length} rows` : 'Showing your area + key thresholds · '}
                    {!showAll && (
                      <button
                        type="button"
                        onClick={() => setShowAll(true)}
                        className="text-primary hover:underline"
                      >
                        Show all {rows.length} rows
                      </button>
                    )}
                    {showAll && (
                      <button
                        type="button"
                        onClick={() => setShowAll(false)}
                        className="text-primary hover:underline"
                      >
                        Show condensed view
                      </button>
                    )}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[540px]">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left text-xs font-semibold text-muted px-4 py-3">Income</th>
                      <th className="text-right text-xs font-semibold text-muted px-3 py-3">CCS %</th>
                      <th className="text-right text-xs font-semibold text-muted px-3 py-3">Weekly cost</th>
                      <th className="text-right text-xs font-semibold text-muted px-3 py-3">Annual cost</th>
                      <th className="text-right text-xs font-semibold text-muted px-4 py-3">Marginal +$5k</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map(({ row, index, marginalCost, gapFromPrev }) => {
                      const isUser       = hasIncome && index === userRowIndex;
                      const isZero       = row.subsidyPercent === 0;
                      const isPainPoint  = highestMarginalRange && row.income === highestMarginalRange.incomeTo;
                      const isSweetSpot  = lowestMarginalRange  && row.income === lowestMarginalRange.incomeTo;

                      return (
                        <React.Fragment key={row.income}>
                          {gapFromPrev && (
                            <tr>
                              <td colSpan={5} className="py-1 text-center">
                                <span className="text-xs text-muted">···</span>
                              </td>
                            </tr>
                          )}
                          <tr className={[
                            'border-b border-border/50 transition-colors',
                            isUser ? 'bg-primary/10 font-semibold' : '',
                            index % 2 === 0 && !isUser ? 'bg-background/40' : '',
                          ].join(' ')}>
                            {/* Income */}
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <span className={isUser ? 'text-primary' : isZero ? 'text-muted' : 'text-text-main'}>
                                {formatDollars(row.income)}
                              </span>
                              {isUser && (
                                <span className="ml-2 text-[10px] font-bold text-primary bg-primary/15 rounded-full px-2 py-0.5">
                                  You
                                </span>
                              )}
                            </td>

                            {/* CCS % */}
                            <td className={[
                              'px-3 py-2.5 text-right tabular-nums',
                              isUser ? 'text-primary' : isZero ? 'text-muted' : 'text-text-main',
                            ].join(' ')}>
                              {row.subsidyPercent}%
                            </td>

                            {/* Weekly */}
                            <td className={`px-3 py-2.5 text-right tabular-nums ${isZero && !isUser ? 'text-muted' : 'text-text-main'}`}>
                              {formatDollars(row.weeklyOutOfPocket)}
                            </td>

                            {/* Annual */}
                            <td className={`px-3 py-2.5 text-right tabular-nums ${isZero && !isUser ? 'text-muted' : 'text-text-main'}`}>
                              {formatDollars(row.annualOutOfPocket)}
                            </td>

                            {/* Marginal */}
                            <td className={[
                              'px-4 py-2.5 text-right tabular-nums text-xs',
                              isPainPoint  ? 'text-red-600 dark:text-red-400 font-semibold' : '',
                              isSweetSpot  ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : '',
                              !isPainPoint && !isSweetSpot ? 'text-muted' : '',
                            ].join(' ')}>
                              {marginalCost !== null
                                ? marginalCost > 0
                                  ? `+${formatDollars(marginalCost)}`
                                  : marginalCost === 0 ? '—' : formatDollars(marginalCost)
                                : '—'}
                              {isPainPoint  && <span className="ml-1" title="Biggest cost jump">🔴</span>}
                              {isSweetSpot  && <span className="ml-1" title="Smallest cost jump">🟢</span>}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Explainer ────────────────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted space-y-2">
              <p>
                <strong className="text-text-main">How to read this table:</strong> The{' '}
                <em>Marginal +$5k</em> column shows how much your annual out-of-pocket childcare
                cost increases for each extra $5,000 of family income. A higher number means
                that income range is more &ldquo;expensive&rdquo; in terms of lost CCS.
              </p>
              <p>
                🔴 <strong className="text-text-main">Biggest jump (pain point)</strong> — the
                $5,000 income band where earning more costs you the most in lost CCS.
              </p>
              <p>
                🟢 <strong className="text-text-main">Smallest jump (sweet spot)</strong> — the
                $5,000 income band where earning more has the least CCS impact. Good timing
                for a pay rise or extra income.
              </p>
              <p>
                <strong className="text-text-main">Annual cost uses 5% withholding.</strong>{' '}
                Services Australia withholds 5% of CCS each fortnight as a buffer against
                overpayment. The withheld amount is reconciled at year-end, so your true annual
                cost is the gap fee — not the withheld amount.
              </p>
            </div>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-main">Want a full personalised estimate?</p>
                <p className="text-xs text-muted mt-0.5">
                  The CCS Calculator includes back-to-work analysis, multi-child comparisons, and next steps.
                </p>
              </div>
              <a
                href="/childcare-subsidy-calculator"
                className="flex-shrink-0 inline-block bg-primary text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-cyan-800 transition-colors whitespace-nowrap"
              >
                CCS Calculator →
              </a>
            </div>

          </div>
        );
      })()}
    </div>
  );
}
