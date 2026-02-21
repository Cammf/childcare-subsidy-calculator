'use client';
// =============================================================================
// RESULTS CLIENT — CCS Calculator Results Page (Client Shell)
// =============================================================================
// Receives the full CalculationOutput from the server component and renders
// all results panels. Client component so it can own UI state:
//   • period toggle (daily / weekly / fortnightly / annual)
//   • calculation accordion (open / closed)
//
// Phase 4 build order:
//   4.1  Cost Summary Card  ← BUILT IN THIS TASK
//   4.2  Back-to-Work Analysis Panel
//   4.3  Income Sensitivity Panel
//   4.4  Multiple Child Comparison Panel
//   4.5  Key Insights Accordion
//   4.6  "What This Actually Means" interpretation layer
//   4.7  Next Steps panel
//   4.8  Sharing functionality
//   4.9  "Edit Answers" flow
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import type { CalculationOutput } from '@/lib/runCalculations';
import type { SessionCCSResult, AnnualCostResult } from '@/lib/ccsCalculations';
import type { BackToWorkScenario, CurrentSituation } from '@/lib/backToWorkCalculations';
import type { IncomeSensitivityRow } from '@/lib/types';
import type { IncomeSensitivityResult } from '@/lib/incomeSensitivity';
import { formatDollars, formatDollarsAndCents, formatNumber } from '@/lib/format';

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = 'daily' | 'weekly' | 'fortnightly' | 'annual';

export interface ResultsClientProps {
  output: CalculationOutput;
  relationshipStatus: 'single' | 'partnered';
  /** URL to pre-populate the wizard with current answers (Edit Answers flow). */
  restoreUrl: string;
}

// ─── Period-value helper ──────────────────────────────────────────────────────
// Extracts the right numbers from session/annual data for the selected period.

interface PeriodValues {
  gross: number;
  subsidy: number;
  gap: number;
  withholding: number;
  netGap: number;
  suffix: string;
}

function getPeriodValues(
  period: Period,
  session: SessionCCSResult,
  annual: AnnualCostResult,
  withholdingPercent = 5
): PeriodValues {
  const withholdingPerSession = Math.round(session.subsidyPerSession * (withholdingPercent / 100) * 100) / 100;

  switch (period) {
    case 'daily':
      return {
        gross: session.dailyFeeUsed,
        subsidy: session.subsidyPerSession,
        gap: session.outOfPocketPerSession,
        withholding: withholdingPerSession,
        netGap: Math.round((session.outOfPocketPerSession + withholdingPerSession) * 100) / 100,
        suffix: '/day',
      };
    case 'weekly':
      return {
        gross: annual.grossFeePerWeek,
        subsidy: annual.subsidyPerWeek,
        gap: annual.outOfPocketPerWeek,
        withholding: Math.round(annual.withholdingPerFortnight / 2 * 100) / 100,
        netGap: annual.netOutOfPocketPerWeek,
        suffix: '/week',
      };
    case 'fortnightly':
      return {
        gross: annual.grossFeePerFortnight,
        subsidy: annual.subsidyPerFortnight,
        gap: annual.outOfPocketPerFortnight,
        withholding: annual.withholdingPerFortnight,
        netGap: annual.netOutOfPocketPerFortnight,
        suffix: '/fortnight',
      };
    case 'annual':
      return {
        gross: annual.grossFeePerYear,
        subsidy: annual.subsidyPerYear,
        gap: annual.outOfPocketPerYear,
        withholding: annual.withholdingPerYear,
        netGap: annual.netOutOfPocketPerYear,
        suffix: '/year',
      };
  }
}

// Combined totals across all children (matches runCalculations.ts logic)
function getCombinedValues(
  period: Period,
  output: CalculationOutput,
  withholdingPercent = 5
): PeriodValues {
  const { session, annual, eldestChildSession, eldestChildAnnual, resolved } = output;
  const youngerChildrenCount = resolved.numberOfChildren - 1;

  if (!eldestChildAnnual || !eldestChildSession) {
    // Single child — use primary directly
    return getPeriodValues(period, session, annual, withholdingPercent);
  }

  // Multi-child: youngest (primary, higher rate) + eldest children (standard rate)
  // Matches runCalculations combined total logic.
  const younger = getPeriodValues(period, session, annual, withholdingPercent);
  const eldest = getPeriodValues(period, eldestChildSession, eldestChildAnnual, withholdingPercent);

  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    gross:       r(younger.gross       + eldest.gross       * youngerChildrenCount),
    subsidy:     r(younger.subsidy     + eldest.subsidy     * youngerChildrenCount),
    gap:         r(younger.gap         + eldest.gap         * youngerChildrenCount),
    withholding: r(younger.withholding + eldest.withholding * youngerChildrenCount),
    netGap:      r(younger.netGap      + eldest.netGap      * youngerChildrenCount),
    suffix: younger.suffix,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PeriodToggle({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const options: { label: string; value: Period }[] = [
    { label: 'Daily',       value: 'daily' },
    { label: 'Weekly',      value: 'weekly' },
    { label: 'Fortnightly', value: 'fortnightly' },
    { label: 'Annual',      value: 'annual' },
  ];

  return (
    <div
      role="group"
      aria-label="View costs per period"
      className="inline-flex rounded-lg border border-border overflow-hidden text-sm"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={[
            'px-3 py-1.5 font-medium transition-colors duration-100',
            value === opt.value
              ? 'bg-primary text-white'
              : 'bg-white text-muted hover:bg-gray-50 hover:text-text-main',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Waterfall row component
function WaterfallRow({
  label,
  value,
  suffix,
  variant = 'default',
  subLabel,
}: {
  label: string;
  value: number;
  suffix: string;
  variant?: 'default' | 'deduct' | 'total' | 'reconciled' | 'divider';
  subLabel?: string;
}) {
  const formattedValue = formatDollars(Math.abs(value));
  const prefix = variant === 'deduct' ? '−' : variant === 'total' ? '=' : '';

  return (
    <div
      className={[
        'flex items-baseline justify-between gap-4 py-1.5',
        variant === 'total' ? 'border-t border-border mt-1 pt-2.5 font-semibold text-text-main' : '',
        variant === 'reconciled' ? 'text-muted text-xs' : 'text-sm',
        variant === 'divider' ? 'border-t border-dashed border-border mt-1 pt-2' : '',
      ].join(' ')}
    >
      <div>
        <span className={variant === 'total' ? 'text-base' : ''}>{label}</span>
        {subLabel && <p className="text-xs text-muted mt-0.5 font-normal">{subLabel}</p>}
      </div>
      <span
        className={[
          'font-medium tabular-nums whitespace-nowrap',
          variant === 'deduct' ? 'text-green-700' : '',
          variant === 'total' ? 'text-primary text-base' : '',
          variant === 'reconciled' ? 'text-muted' : '',
        ].join(' ')}
      >
        {prefix}{formattedValue}
        <span className="text-xs font-normal ml-0.5">{suffix}</span>
      </span>
    </div>
  );
}

// Rate badge
function RateBadge({
  rate,
  label,
  higher = false,
}: {
  rate: number;
  label: string;
  higher?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          'text-2xl font-bold leading-none',
          higher ? 'text-green-700' : 'text-primary',
        ].join(' ')}
      >
        {rate}%
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

// ─── Calculation Breakdown Accordion ─────────────────────────────────────────

function CalcBreakdownAccordion({
  output,
  period,
  daysPerWeek,
  withholdingPercent,
}: {
  output: CalculationOutput;
  period: Period;
  daysPerWeek: number;
  withholdingPercent: number;
}) {
  const [open, setOpen] = useState(false);
  const { ccsPercentage, session, resolved } = output;

  const stepLabel = period === 'annual' ? 'year' : period === 'fortnightly' ? 'fortnight' : period;
  const multiplier = period === 'daily' ? 1 : period === 'weekly' ? daysPerWeek : period === 'fortnightly' ? daysPerWeek * 2 : daysPerWeek * 52;

  return (
    <div className="border-t border-border mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-primary hover:underline focus:outline-none"
        aria-expanded={open}
      >
        <span>See how this is calculated</span>
        <svg
          className={['w-4 h-4 flex-shrink-0 transition-transform duration-150', open ? 'rotate-90' : ''].join(' ')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="pb-4 space-y-4 text-xs text-muted leading-relaxed">

          {/* Step 1: Income → CCS rate */}
          <div>
            <p className="font-semibold text-text-main text-xs uppercase tracking-wide mb-1.5">
              Step 1 — Income → CCS rate
            </p>
            <div className="space-y-1 font-mono">
              <p>Combined family income: <span className="text-text-main">{formatDollars(resolved.combinedAnnualIncome)}/yr</span></p>
              <p>CCS threshold: $85,279</p>
              {ccsPercentage.incomeAboveThreshold === 0 ? (
                <p>Income at or below threshold → <span className="text-primary font-semibold">90% maximum rate</span></p>
              ) : (
                <>
                  <p>Income above threshold: {formatDollars(ccsPercentage.incomeAboveThreshold)}</p>
                  <p>Brackets above ($5,000 each): ⌈{formatDollars(ccsPercentage.incomeAboveThreshold)} ÷ $5,000⌉ = {ccsPercentage.bracketsAbove}</p>
                  <p>Rate reduction: {ccsPercentage.bracketsAbove} × 1% = {ccsPercentage.percentReduction}%</p>
                  <p>CCS rate: 90% − {ccsPercentage.percentReduction}% = <span className="text-primary font-semibold">{ccsPercentage.percent}%</span></p>
                </>
              )}
            </div>
          </div>

          {/* Step 2: Fee → rate cap */}
          <div>
            <p className="font-semibold text-text-main text-xs uppercase tracking-wide mb-1.5">
              Step 2 — Daily fee → hourly fee → rate cap
            </p>
            <div className="space-y-1 font-mono">
              <p>Daily fee: <span className="text-text-main">{formatDollars(session.dailyFeeUsed)}</span></p>
              <p>Hours per day: {resolved.hoursPerDay}h</p>
              <p>Hourly fee: {formatDollars(session.dailyFeeUsed)} ÷ {resolved.hoursPerDay}h = <span className="text-text-main">{formatDollarsAndCents(session.hourlyFee)}/hr</span></p>
              <p>Rate cap ({resolved.careType.replace(/_/g, ' ')}, {resolved.ageGroup.replace(/_/g, ' ')}): <span className="text-text-main">{formatDollarsAndCents(session.hourlyRateCap)}/hr</span></p>
              {session.feeAboveCapPerHour > 0 ? (
                <>
                  <p className="text-amber-700">⚠ Fee above cap: {formatDollarsAndCents(session.feeAboveCapPerHour)}/hr — always out-of-pocket</p>
                  <p>Effective hourly rate: min({formatDollarsAndCents(session.hourlyFee)}, {formatDollarsAndCents(session.hourlyRateCap)}) = <span className="text-text-main">{formatDollarsAndCents(session.effectiveHourlyRate)}/hr</span></p>
                </>
              ) : (
                <p>Fee is below cap → effective rate: <span className="text-text-main">{formatDollarsAndCents(session.effectiveHourlyRate)}/hr</span></p>
              )}
            </div>
          </div>

          {/* Step 3: Subsidy & gap fee */}
          <div>
            <p className="font-semibold text-text-main text-xs uppercase tracking-wide mb-1.5">
              Step 3 — Subsidy & gap fee (per day)
            </p>
            <div className="space-y-1 font-mono">
              <p>Subsidy/hr: {formatDollarsAndCents(session.effectiveHourlyRate)} × {session.ccsPercent}% = <span className="text-text-main">{formatDollarsAndCents(session.subsidyPerHour)}/hr</span></p>
              <p>Subsidy/day: {formatDollarsAndCents(session.subsidyPerHour)} × {resolved.hoursPerDay}h = <span className="text-green-700 font-semibold">{formatDollars(session.subsidyPerSession)}/day</span></p>
              <p>Gap fee/day: {formatDollars(session.dailyFeeUsed)} − {formatDollars(session.subsidyPerSession)} = <span className="text-text-main font-semibold">{formatDollars(session.outOfPocketPerSession)}/day</span></p>
            </div>
          </div>

          {/* Step 4: Annualisation */}
          <div>
            <p className="font-semibold text-text-main text-xs uppercase tracking-wide mb-1.5">
              Step 4 — Scaling to {stepLabel}
            </p>
            <div className="space-y-1 font-mono">
              {period === 'daily' ? (
                <p>This is already per-day — no further scaling needed.</p>
              ) : (
                <>
                  <p>
                    Sessions per {stepLabel}: {daysPerWeek} days/week
                    {period === 'fortnightly' ? ' × 2 weeks' : period === 'annual' ? ' × 52 weeks' : ''}
                    {' '}= {multiplier} sessions
                  </p>
                  <p>Gap fee per {stepLabel}: {formatDollars(session.outOfPocketPerSession)} × {multiplier} = <span className="text-text-main">{formatDollars(session.outOfPocketPerSession * multiplier)}</span></p>
                  <p>Subsidy per {stepLabel}: {formatDollars(session.subsidyPerSession)} × {multiplier} = <span className="text-text-main">{formatDollars(session.subsidyPerSession * multiplier)}</span></p>
                  <p>5% withholding: {formatDollars(session.subsidyPerSession * multiplier)} × 5% = <span className="text-text-main">{formatDollars(session.subsidyPerSession * multiplier * 0.05)}</span></p>
                </>
              )}
              <p className="mt-1 text-muted not-italic">
                5% of CCS is withheld each fortnight as a buffer. It is returned after your annual income is confirmed — so your true cost is the gap fee only.
              </p>
            </div>
          </div>

          {output.higherCCS && (
            <p className="border-t border-border pt-3">
              Your younger {resolved.numberOfChildren > 2 ? 'children use' : 'child uses'} the same method above but with the
              higher {output.higherCCS.higherPercent}% rate instead of {ccsPercentage.percent}%.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Cost Summary Card (Task 4.1) ─────────────────────────────────────────────

function CostSummaryCard({
  output,
  period,
  onPeriodChange,
}: {
  output: CalculationOutput;
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const { resolved, ccsPercentage, higherCCS, session, annual, eldestChildSession, eldestChildAnnual } = output;
  const isMultiChild = !!higherCCS;
  const withholdingPercent = 5; // matches ccsRates.withholdingPercent

  // Combined family values for the primary waterfall
  const combined = getCombinedValues(period, output, withholdingPercent);

  // Per-child values (for the multi-child detail section)
  const youngerChildValues = isMultiChild
    ? getPeriodValues(period, session, annual, withholdingPercent)
    : null;
  const eldestChildValues = (isMultiChild && eldestChildSession && eldestChildAnnual)
    ? getPeriodValues(period, eldestChildSession, eldestChildAnnual, withholdingPercent)
    : null;

  const childrenLabel = resolved.numberOfChildren === 1
    ? '1 child'
    : `${resolved.numberOfChildren} children`;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">

      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
              Cost Summary
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {childrenLabel} · {resolved.daysPerWeek} day{resolved.daysPerWeek === 1 ? '' : 's'}/week
              {resolved.usingStateAverage ? ` · ${resolved.state} average fee` : ` · ${formatDollars(resolved.dailyFee)}/day`}
            </p>
          </div>
          <PeriodToggle value={period} onChange={onPeriodChange} />
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">

        {/* ── CCS rate display ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {isMultiChild ? (
            <>
              <RateBadge
                rate={ccsPercentage.percent}
                label="Eldest child · standard rate"
              />
              <RateBadge
                rate={higherCCS!.higherPercent}
                label={`Younger ${resolved.numberOfChildren > 2 ? 'children' : 'child'} · higher rate${higherCCS!.wasCapped ? ' (capped at 95%)' : ''}`}
                higher
              />
            </>
          ) : (
            <RateBadge rate={ccsPercentage.percent} label="Your CCS subsidy rate" />
          )}
          <div className="text-xs text-muted self-end pb-0.5 max-w-xs">
            {ccsPercentage.incomeAboveThreshold === 0
              ? 'Maximum rate — your income is at or below the $85,279 threshold.'
              : `Rate tapered from 90% — ${formatDollars(ccsPercentage.incomeAboveThreshold)} above the $85,279 threshold.`}
          </div>
        </div>

        {/* ── Rate cap alert (when fee exceeds cap) ──────────────────────── */}
        {session.feeAboveCapPerHour > 0 && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm">
            <p className="font-medium text-amber-800">
              Your fee exceeds the hourly rate cap by {formatDollarsAndCents(session.feeAboveCapPerHour)}/hr
            </p>
            <p className="text-amber-700 mt-0.5 text-xs">
              The cap is {formatDollarsAndCents(session.hourlyRateCap)}/hr for your care type and child age.
              The government subsidy only applies to fees up to this cap — the extra{' '}
              {formatDollars(session.feeAboveCapPerHour * resolved.hoursPerDay)}/day is fully out-of-pocket.
            </p>
          </div>
        )}

        {/* ── Primary cost waterfall ──────────────────────────────────────── */}
        <div>
          {isMultiChild && (
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Combined family total
            </p>
          )}
          <div className="space-y-0">
            <WaterfallRow
              label="Gross childcare fee"
              value={combined.gross}
              suffix={combined.suffix}
            />
            <WaterfallRow
              label={isMultiChild
                ? `Government pays (CCS − ${ccsPercentage.percent}% / ${higherCCS!.higherPercent}%)`
                : `Government pays (CCS − ${ccsPercentage.percent}%)`}
              value={combined.subsidy}
              suffix={combined.suffix}
              variant="deduct"
            />
            <WaterfallRow
              label="Your gap fee (during year)"
              value={combined.gap}
              suffix={combined.suffix}
              variant="divider"
            />
            <WaterfallRow
              label="+ 5% withholding (held by Services Australia)"
              value={combined.withholding}
              suffix={combined.suffix}
            />
            <WaterfallRow
              label="= What you pay"
              value={combined.netGap}
              suffix={combined.suffix}
              variant="total"
              subLabel="Includes withholding held in trust"
            />
            <WaterfallRow
              label="After year-end reconciliation"
              value={combined.gap}
              suffix={combined.suffix}
              variant="reconciled"
              subLabel="Withholding returned when income confirmed — your true annual cost"
            />
          </div>
        </div>

        {/* ── Per-child breakdown (multi-child only) ──────────────────────── */}
        {isMultiChild && youngerChildValues && eldestChildValues && (
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Per-child breakdown
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Eldest child */}
              <div className="rounded-xl bg-gray-50 border border-border px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary leading-none">
                    {ccsPercentage.percent}%
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-text-main">Eldest child</p>
                    <p className="text-xs text-muted">Standard rate</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Gross fee</span>
                    <span className="font-medium">{formatDollars(eldestChildValues.gross)}{eldestChildValues.suffix}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>CCS subsidy</span>
                    <span className="font-medium">−{formatDollars(eldestChildValues.subsidy)}{eldestChildValues.suffix}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5 mt-1">
                    <span className="text-muted">Gap fee</span>
                    <span className="font-semibold text-text-main">{formatDollars(eldestChildValues.gap)}{eldestChildValues.suffix}</span>
                  </div>
                </div>
              </div>

              {/* Younger child(ren) */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-green-700 leading-none">
                    {higherCCS!.higherPercent}%
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-text-main">
                      Younger {resolved.numberOfChildren > 2 ? 'children' : 'child'}
                    </p>
                    <p className="text-xs text-muted">
                      Higher rate{higherCCS!.wasCapped ? ' (capped at 95%)' : ''}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Gross fee</span>
                    <span className="font-medium">{formatDollars(youngerChildValues.gross)}{youngerChildValues.suffix}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>CCS subsidy</span>
                    <span className="font-medium">−{formatDollars(youngerChildValues.subsidy)}{youngerChildValues.suffix}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5 mt-1">
                    <span className="text-muted">Gap fee</span>
                    <span className="font-semibold text-text-main">{formatDollars(youngerChildValues.gap)}{youngerChildValues.suffix}</span>
                  </div>
                </div>
              </div>
            </div>

            {resolved.numberOfChildren > 2 && (
              <p className="mt-2 text-xs text-muted">
                * Younger children&apos;s gap fee shown per child. {resolved.numberOfChildren - 1} younger children in care.
              </p>
            )}
          </div>
        )}

        {/* ── Calculation breakdown accordion ─────────────────────────────── */}
        <CalcBreakdownAccordion
          output={output}
          period={period}
          daysPerWeek={resolved.daysPerWeek}
          withholdingPercent={withholdingPercent}
        />
      </div>
    </div>
  );
}

// ─── Back-to-Work Analysis Panel (Task 4.2) ──────────────────────────────────
//
// The flagship differentiator: compares 1–5 day working scenarios with a
// horizontal comparison table, verdict banner, and empathetic interpretation.
// ─────────────────────────────────────────────────────────────────────────────

function BackToWorkPanel({ output }: { output: CalculationOutput }) {
  const btw = output.backToWork!;
  const { current, scenarios, bestScenario } = btw;
  const { resolved } = output;

  const fteIncome = resolved.proposedFTEIncome;
  const isCurrentlyWorking = current.grossIncome > 0;
  const hasPositive = scenarios.some((s) => s.isWorthIt);
  const hasNegative = scenarios.some((s) => !s.isWorthIt);

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">

      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
          Back-to-Work Analysis
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Proposed FTE salary: {formatDollars(fteIncome)}/year
          {isCurrentlyWorking && ` · Current income: ${formatDollars(current.grossIncome)}/year`}
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">

        {/* ── Verdict banner ──────────────────────────────────────────────── */}
        {bestScenario ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-emerald-800">
                  Working {bestScenario.daysWorking} day{bestScenario.daysWorking === 1 ? '' : 's'}/week is financially positive
                </p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Net benefit: <strong>{formatDollars(bestScenario.netBenefit)}/year</strong>
                  {bestScenario.effectiveHourlyRate !== null && (
                    <> · Effective rate: <strong>{formatDollarsAndCents(bestScenario.effectiveHourlyRate)}/hr</strong></>
                  )}
                </p>
                {hasNegative && (
                  <p className="text-xs text-emerald-600 mt-1.5">
                    {bestScenario.daysWorking < 5
                      ? `${bestScenario.daysWorking} days offers the best return. More days may reduce your effective hourly rate.`
                      : 'Every scenario is financially positive — the more days you work, the more your family earns.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-amber-800">
                  Returning to work at this salary costs more than it earns
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Tax, reduced CCS, and work costs outweigh the additional income in all scenarios.
                  A higher salary or lower childcare fees would change this equation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Scenario comparison table ────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
            Scenario comparison (annual figures)
          </p>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted py-2 pr-3 sticky left-0 bg-white z-10 min-w-[130px]" />
                  <th className="text-right text-xs font-medium text-muted py-2 px-2 min-w-[90px]">
                    <span className="text-text-main">Current</span>
                  </th>
                  {scenarios.map((s) => (
                    <th
                      key={s.daysWorking}
                      className={[
                        'text-right text-xs font-medium py-2 px-2 min-w-[90px]',
                        bestScenario?.daysWorking === s.daysWorking ? 'text-primary' : 'text-muted',
                      ].join(' ')}
                    >
                      <span className="whitespace-nowrap">
                        {s.daysWorking} day{s.daysWorking === 1 ? '' : 's'}
                      </span>
                      {bestScenario?.daysWorking === s.daysWorking && (
                        <span className="block text-[10px] font-bold text-primary bg-primary/10 rounded-full px-1.5 py-0.5 mt-0.5 mx-auto w-fit">
                          Best
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* ── Income section ── */}
                <BTWTableSection label="Income" />
                <BTWTableRow
                  label="Your income"
                  currentValue={formatDollars(current.grossIncome)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.grossIncome)}
                />
                <BTWTableRow
                  label="Income tax"
                  currentValue={current.tax.totalTax > 0 ? `−${formatDollars(current.tax.totalTax)}` : '$0'}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => s.tax.totalTax > 0 ? `−${formatDollars(s.tax.totalTax)}` : '$0'}
                  muted
                />
                <BTWTableRow
                  label="Net income"
                  currentValue={formatDollars(current.netIncome)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.netIncome)}
                  bold
                />

                {/* ── CCS & childcare section ── */}
                <BTWTableSection label="CCS & Childcare Impact" />
                <BTWTableRow
                  label="Combined family income"
                  currentValue={formatDollars(current.combinedFamilyIncome)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.combinedFamilyIncome)}
                  muted
                />
                <BTWTableRow
                  label="CCS rate"
                  currentValue={`${current.ccsPercent}%`}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => {
                    const diff = s.ccsPercent - current.ccsPercent;
                    return (
                      <span>
                        {s.ccsPercent}%
                        {diff !== 0 && (
                          <span className={diff < 0 ? ' text-red-600' : ' text-green-700'}>
                            {' '}({diff > 0 ? '+' : ''}{diff})
                          </span>
                        )}
                      </span>
                    );
                  }}
                />
                <BTWTableRow
                  label="Extra childcare cost"
                  currentValue="—"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => {
                    const extra = s.annualChildcare.outOfPocketPerYear - current.annualChildcareCost;
                    if (extra <= 0) return <span className="text-green-700">−{formatDollars(Math.abs(extra))}</span>;
                    return <span className="text-red-600">+{formatDollars(extra)}</span>;
                  }}
                />

                {/* ── Costs section ── */}
                <BTWTableSection label="Work Costs" />
                <BTWTableRow
                  label="Work-related costs"
                  currentValue="—"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => s.annualWorkCosts > 0 ? `−${formatDollars(s.annualWorkCosts)}` : '$0'}
                  muted
                />

                {/* ── Result section ── */}
                <BTWTableSection label="Result" />
                <BTWTableRow
                  label="NET BENEFIT"
                  currentValue="Baseline"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => (
                    <span className={[
                      'font-bold',
                      s.netBenefit > 0 ? 'text-emerald-700' : s.netBenefit < 0 ? 'text-red-600' : 'text-muted',
                    ].join(' ')}>
                      {s.netBenefit > 0 ? '+' : ''}{formatDollars(s.netBenefit)}
                    </span>
                  )}
                  bold
                  highlight
                />
                <BTWTableRow
                  label="Effective $/hr"
                  currentValue="—"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => s.effectiveHourlyRate !== null
                    ? <span className={s.effectiveHourlyRate > 0 ? 'text-emerald-700' : 'text-red-600'}>{formatDollarsAndCents(s.effectiveHourlyRate)}</span>
                    : '—'
                  }
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* ── "What This Means" interpretation ─────────────────────────────── */}
        <div className="rounded-xl bg-gray-50 border border-border px-5 py-4">
          <p className="text-xs font-semibold text-text-main uppercase tracking-wide mb-3">
            What this means for your family
          </p>
          {bestScenario ? (
            <WhatThisMeansPositive
              current={current}
              best={bestScenario}
              scenarios={scenarios}
              fteIncome={fteIncome}
              isCurrentlyWorking={isCurrentlyWorking}
            />
          ) : (
            <WhatThisMeansNegative
              current={current}
              scenarios={scenarios}
              fteIncome={fteIncome}
            />
          )}
        </div>

        {/* ── Non-financial caveat ─────────────────────────────────────────── */}
        <div className="flex items-start gap-2.5 px-1 text-xs text-muted leading-relaxed">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p>
            This analysis covers <strong>short-term financial impact only</strong>.
            Career progression, superannuation contributions, social wellbeing,
            professional development, and personal fulfilment are all real and
            valuable — and are not captured by these numbers.
            Many parents find returning to work is worthwhile for reasons that
            go beyond the immediate financial equation.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Table sub-components ──────────────────────────────────────────────────────

function BTWTableSection({ label }: { label: string }) {
  return (
    <tr>
      <td
        colSpan={7}
        className="text-[10px] font-bold text-muted uppercase tracking-widest pt-4 pb-1 border-b border-border sticky left-0 bg-white"
      >
        {label}
      </td>
    </tr>
  );
}

function BTWTableRow({
  label,
  currentValue,
  scenarios,
  bestDay,
  renderCell,
  muted = false,
  bold = false,
  highlight = false,
}: {
  label: string;
  currentValue: React.ReactNode;
  scenarios: BackToWorkScenario[];
  bestDay?: number;
  renderCell: (s: BackToWorkScenario) => React.ReactNode;
  muted?: boolean;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <tr className={highlight ? 'bg-gray-50' : ''}>
      <td className={[
        'py-1.5 pr-3 text-left whitespace-nowrap sticky left-0 z-10',
        highlight ? 'bg-gray-50' : 'bg-white',
        bold ? 'font-semibold text-text-main' : muted ? 'text-muted' : 'text-text-main',
      ].join(' ')}>
        {label}
      </td>
      <td className={[
        'py-1.5 px-2 text-right tabular-nums whitespace-nowrap',
        highlight ? 'bg-gray-50' : '',
        'text-muted',
      ].join(' ')}>
        {currentValue}
      </td>
      {scenarios.map((s) => (
        <td
          key={s.daysWorking}
          className={[
            'py-1.5 px-2 text-right tabular-nums whitespace-nowrap',
            highlight ? 'bg-gray-50' : '',
            bestDay === s.daysWorking && !highlight ? 'bg-primary/5' : '',
            bestDay === s.daysWorking && highlight ? 'bg-primary/10' : '',
          ].join(' ')}
        >
          {renderCell(s)}
        </td>
      ))}
    </tr>
  );
}

// ── "What This Means" interpretation sub-components ───────────────────────────

function WhatThisMeansPositive({
  current,
  best,
  scenarios,
  fteIncome,
  isCurrentlyWorking,
}: {
  current: CurrentSituation;
  best: BackToWorkScenario;
  scenarios: BackToWorkScenario[];
  fteIncome: number;
  isCurrentlyWorking: boolean;
}) {
  const additionalNetIncome = best.netIncome - current.netIncome;
  const extraChildcareCost = best.annualChildcare.outOfPocketPerYear - current.annualChildcareCost;
  const negativeScenarios = scenarios.filter((s) => !s.isWorthIt);

  return (
    <div className="space-y-3 text-sm text-text-main leading-relaxed">
      <p>
        {isCurrentlyWorking ? 'Increasing your hours to' : 'Working'}{' '}
        <strong>{best.daysWorking} day{best.daysWorking === 1 ? '' : 's'} per week</strong>{' '}
        at a salary of {formatDollars(fteIncome)} FTE{' '}
        ({formatDollars(best.grossIncome)} proportional) would put{' '}
        <strong className="text-emerald-700">{formatDollars(best.netBenefit)}</strong>{' '}
        more into your family&apos;s pocket each year.
      </p>

      <div className="text-xs text-muted space-y-1 pl-3 border-l-2 border-border">
        <p>
          <span className="text-green-700 font-medium">+{formatDollars(additionalNetIncome)}</span>{' '}
          additional income after tax
        </p>
        {extraChildcareCost > 0 && (
          <p>
            <span className="text-red-600 font-medium">−{formatDollars(extraChildcareCost)}</span>{' '}
            extra childcare cost (CCS drops from {current.ccsPercent}% to {best.ccsPercent}%)
          </p>
        )}
        {extraChildcareCost <= 0 && (
          <p>
            <span className="text-green-700 font-medium">−{formatDollars(Math.abs(extraChildcareCost))}</span>{' '}
            in childcare savings (CCS improves from {current.ccsPercent}% to {best.ccsPercent}%)
          </p>
        )}
        {best.annualWorkCosts > 0 && (
          <p>
            <span className="text-red-600 font-medium">−{formatDollars(best.annualWorkCosts)}</span>{' '}
            work-related costs ({best.daysWorking}d/wk × {formatDollars(best.annualWorkCosts / best.daysWorking / 52)}/day × 52 wks)
          </p>
        )}
        <p className="font-medium text-text-main pt-1 border-t border-border">
          = {formatDollars(best.netBenefit)} net benefit per year
        </p>
      </div>

      {best.effectiveHourlyRate !== null && (
        <p className="text-xs text-muted">
          Your <strong>effective hourly rate</strong> — what you actually keep per hour worked
          after tax, childcare, and work costs — is{' '}
          <strong className="text-emerald-700">{formatDollarsAndCents(best.effectiveHourlyRate)}/hr</strong>.
          {best.effectiveHourlyRate < 15 && (
            <> This is below minimum wage in real terms, even though the salary is higher — the &ldquo;hidden costs&rdquo; of working are significant at this income level.</>
          )}
        </p>
      )}

      {negativeScenarios.length > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          Note: Working{' '}
          {negativeScenarios.map((s, i) => (
            <span key={s.daysWorking}>
              {i > 0 && i < negativeScenarios.length - 1 ? ', ' : ''}
              {i > 0 && i === negativeScenarios.length - 1 ? ' or ' : ''}
              {s.daysWorking} day{s.daysWorking === 1 ? '' : 's'}
            </span>
          ))}
          /week would actually cost your family money.
          The sweet spot is {best.daysWorking} day{best.daysWorking === 1 ? '' : 's'} for maximum financial benefit.
        </p>
      )}
    </div>
  );
}

function WhatThisMeansNegative({
  current,
  scenarios,
  fteIncome,
}: {
  current: CurrentSituation;
  scenarios: BackToWorkScenario[];
  fteIncome: number;
}) {
  const leastBad = scenarios.reduce((best, s) => s.netBenefit > best.netBenefit ? s : best);
  const lowestCCS = Math.min(...scenarios.map((s) => s.ccsPercent));

  return (
    <div className="space-y-3 text-sm text-text-main leading-relaxed">
      <p>
        At the proposed salary of {formatDollars(fteIncome)} FTE, returning to
        work would cost your family more than the additional income it generates — regardless
        of how many days you work.
      </p>

      <p className="text-xs text-muted">
        The closest to breaking even is{' '}
        <strong>{leastBad.daysWorking} day{leastBad.daysWorking === 1 ? '' : 's'}/week</strong>{' '}
        with a net cost of {formatDollars(Math.abs(leastBad.netBenefit))}/year.
        The main factors: income tax ({formatDollars(leastBad.tax.totalTax)}/year),
        CCS dropping from {current.ccsPercent}% to as low as {lowestCCS}%,
        and work-related costs.
      </p>

      <p className="text-xs text-muted">
        <strong>What would change this?</strong> A higher salary, lower childcare fees,
        or a change in family income could tip the balance. Try adjusting your inputs
        to explore different scenarios.
      </p>

      <p className="text-xs text-muted">
        Remember: this is a short-term financial snapshot. Career progression,
        superannuation contributions (which compound over decades), maintaining
        professional skills, and personal wellbeing are all real benefits that
        this calculator cannot quantify.
      </p>
    </div>
  );
}

// ─── Income Sensitivity Panel (Task 4.3) ───────────────────────────────────
//
// Shows how CCS% and out-of-pocket costs change across the income spectrum.
// Condensed view by default (rows around user + key thresholds), expandable
// to full $40k–$600k table. Highlights user position and marginal rate insights.
// ────────────────────────────────────────────────────────────────────────────

/** Number of rows to show above/below user position in condensed view */
const CONDENSED_CONTEXT = 5;

/**
 * Build the set of row indices to show in condensed mode.
 * Includes: user ±CONDENSED_CONTEXT, first row, last row with CCS > 0, last row.
 * Returns a Set of indices.
 */
function getCondensedIndices(rows: IncomeSensitivityRow[], userRowIndex: number): Set<number> {
  const indices = new Set<number>();

  // Always include first and last row
  indices.add(0);
  indices.add(rows.length - 1);

  // User position ± context
  for (let i = Math.max(0, userRowIndex - CONDENSED_CONTEXT); i <= Math.min(rows.length - 1, userRowIndex + CONDENSED_CONTEXT); i++) {
    indices.add(i);
  }

  // Last row with CCS > 0 (zero CCS boundary)
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].subsidyPercent === 0 && i > 0) {
      indices.add(i - 1); // last row with subsidy
      indices.add(i);     // first row at 0%
      break;
    }
  }

  // Include $85,000 area (CCS threshold is $85,279 — $85k row)
  const thresholdIndex = rows.findIndex((r) => r.income >= 85000);
  if (thresholdIndex >= 0) {
    indices.add(Math.max(0, thresholdIndex - 1));
    indices.add(thresholdIndex);
    indices.add(Math.min(rows.length - 1, thresholdIndex + 1));
  }

  return indices;
}

function IncomeSensitivityPanel({ output }: { output: CalculationOutput }) {
  const [showAll, setShowAll] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);

  const sensitivity = output.sensitivity;
  const { rows, userRowIndex, zeroCCSIncome, highestMarginalRange, lowestMarginalRange } = sensitivity;
  const userRow = rows[userRowIndex];

  const condensedIndices = getCondensedIndices(rows, userRowIndex);

  // Rows to show (condensed or full)
  const visibleRows: { row: IncomeSensitivityRow; index: number; marginalCost: number | null; gapFromPrev: boolean }[] = [];
  const sortedIndices = showAll
    ? rows.map((_, i) => i)
    : Array.from(condensedIndices).sort((a, b) => a - b);

  let prevIndex = -1;
  for (const i of sortedIndices) {
    const marginalCost = i > 0
      ? Math.round((rows[i].annualOutOfPocket - rows[i - 1].annualOutOfPocket) * 100) / 100
      : null;
    const gapFromPrev = !showAll && prevIndex >= 0 && i - prevIndex > 1;
    visibleRows.push({ row: rows[i], index: i, marginalCost, gapFromPrev });
    prevIndex = i;
  }

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">

      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
          Income Sensitivity
        </h2>
        <p className="text-xs text-muted mt-0.5">
          How your childcare cost changes at different income levels
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* ── Key insight cards ───────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-3">
          {/* User's current position */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3.5">
            <p className="text-xs text-muted font-medium">Your position</p>
            <p className="text-lg font-bold text-primary mt-0.5">
              {userRow.subsidyPercent}% CCS
            </p>
            <p className="text-xs text-muted mt-0.5">
              at {formatDollars(userRow.income)}/year · {formatDollars(userRow.weeklyOutOfPocket)}/week out-of-pocket
            </p>
          </div>

          {/* Zero CCS income */}
          <div className="rounded-xl bg-gray-50 border border-border px-4 py-3.5">
            <p className="text-xs text-muted font-medium">CCS cuts out entirely at</p>
            <p className="text-lg font-bold text-text-main mt-0.5">
              {formatDollars(zeroCCSIncome)}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {zeroCCSIncome - userRow.income > 0
                ? `${formatDollars(zeroCCSIncome - userRow.income)} above your current income`
                : 'Your income is above this threshold'}
            </p>
          </div>

          {/* Highest marginal range (pain point) */}
          {highestMarginalRange && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3.5">
              <p className="text-xs text-red-700 font-medium">Biggest cost jump</p>
              <p className="text-lg font-bold text-red-700 mt-0.5">
                +{formatDollars(highestMarginalRange.costIncrease)}/yr
              </p>
              <p className="text-xs text-muted mt-0.5">
                per $5,000 income increase between {formatDollars(highestMarginalRange.incomeFrom)} – {formatDollars(highestMarginalRange.incomeTo)}
              </p>
            </div>
          )}

          {/* Lowest marginal range (sweet spot) */}
          {lowestMarginalRange && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3.5">
              <p className="text-xs text-emerald-700 font-medium">Smallest cost jump</p>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">
                +{formatDollars(lowestMarginalRange.costIncrease)}/yr
              </p>
              <p className="text-xs text-muted mt-0.5">
                per $5,000 income increase between {formatDollars(lowestMarginalRange.incomeFrom)} – {formatDollars(lowestMarginalRange.incomeTo)}
              </p>
            </div>
          )}
        </div>

        {/* ── Sensitivity table ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide">
              {showAll ? 'Full income range' : 'Key income levels'}
            </p>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {showAll ? 'Show less' : 'Show all income levels'}
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted py-2 pr-3">
                    Income
                  </th>
                  <th className="text-right text-xs font-medium text-muted py-2 px-2">
                    CCS %
                  </th>
                  <th className="text-right text-xs font-medium text-muted py-2 px-2">
                    Weekly cost
                  </th>
                  <th className="text-right text-xs font-medium text-muted py-2 px-2">
                    Annual cost
                  </th>
                  <th className="text-right text-xs font-medium text-muted py-2 pl-2">
                    <span className="hidden sm:inline">Marginal +$5k</span>
                    <span className="sm:hidden">+$5k</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(({ row, index, marginalCost, gapFromPrev }) => {
                  const isUser = index === userRowIndex;
                  const isZero = row.subsidyPercent === 0;
                  const isPainPoint = highestMarginalRange && row.income === highestMarginalRange.incomeTo;
                  const isSweetSpot = lowestMarginalRange && row.income === lowestMarginalRange.incomeTo;

                  return (
                    <React.Fragment key={row.income}>
                      {gapFromPrev && (
                        <tr>
                          <td colSpan={5} className="py-1 text-center">
                            <span className="text-xs text-muted">···</span>
                          </td>
                        </tr>
                      )}
                      <tr
                        className={[
                          'transition-colors',
                          isUser ? 'bg-primary/10 font-semibold' : '',
                          isZero && !isUser ? 'text-muted' : '',
                        ].join(' ')}
                      >
                        <td className="py-1.5 pr-3 whitespace-nowrap">
                          <span className={isUser ? 'text-primary' : ''}>
                            {formatDollars(row.income)}
                          </span>
                          {isUser && (
                            <span className="ml-1.5 text-[10px] font-bold text-primary bg-primary/10 rounded-full px-1.5 py-0.5">
                              You
                            </span>
                          )}
                        </td>
                        <td className={[
                          'py-1.5 px-2 text-right tabular-nums',
                          isUser ? 'text-primary' : isZero ? 'text-muted' : '',
                        ].join(' ')}>
                          {row.subsidyPercent}%
                        </td>
                        <td className="py-1.5 px-2 text-right tabular-nums">
                          {formatDollars(row.weeklyOutOfPocket)}
                        </td>
                        <td className="py-1.5 px-2 text-right tabular-nums">
                          {formatDollars(row.annualOutOfPocket)}
                        </td>
                        <td className={[
                          'py-1.5 pl-2 text-right tabular-nums text-xs',
                          isPainPoint ? 'text-red-600 font-medium' : '',
                          isSweetSpot ? 'text-emerald-700 font-medium' : '',
                          !isPainPoint && !isSweetSpot ? 'text-muted' : '',
                        ].join(' ')}>
                          {marginalCost !== null
                            ? marginalCost > 0
                              ? `+${formatDollars(marginalCost)}`
                              : marginalCost === 0
                                ? '—'
                                : formatDollars(marginalCost)
                            : '—'}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!showAll && (
            <p className="text-xs text-muted mt-2 text-center">
              Showing {visibleRows.length} of {rows.length} income levels ·{' '}
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="text-primary hover:underline"
              >
                View all
              </button>
            </p>
          )}
        </div>

        {/* ── Explanation accordion ─────────────────────────────────────────── */}
        <div className="border-t border-border mt-1">
          <button
            type="button"
            onClick={() => setExplanationOpen((v) => !v)}
            className="w-full flex items-center justify-between py-3 text-sm font-medium text-primary hover:underline focus:outline-none"
            aria-expanded={explanationOpen}
          >
            <span>What does this mean?</span>
            <svg
              className={['w-4 h-4 flex-shrink-0 transition-transform duration-150', explanationOpen ? 'rotate-90' : ''].join(' ')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {explanationOpen && (
            <div className="pb-4 space-y-3 text-sm text-text-main leading-relaxed">
              <p>
                The Child Care Subsidy tapers off as your combined family income
                rises. For every $5,000 your family earns above the $85,279
                threshold, your CCS rate drops by 1 percentage point — from a
                maximum of 90% down to 0%.
              </p>

              <p>
                The <strong>&ldquo;Marginal +$5k&rdquo;</strong> column shows how
                much your annual childcare cost increases for each additional $5,000
                of income. This is the <em>effective childcare tax</em> — the hidden
                cost of earning more.
              </p>

              {highestMarginalRange && (
                <p>
                  The biggest jump of{' '}
                  <strong className="text-red-600">
                    +{formatDollars(highestMarginalRange.costIncrease)}/year
                  </strong>{' '}
                  occurs between {formatDollars(highestMarginalRange.incomeFrom)} and{' '}
                  {formatDollars(highestMarginalRange.incomeTo)}. In that range,
                  earning an extra $5,000 effectively costs you{' '}
                  {formatDollars(highestMarginalRange.costIncrease)} more in
                  childcare — reducing the real benefit of the pay rise.
                </p>
              )}

              {lowestMarginalRange && (
                <p>
                  The smallest jump of{' '}
                  <strong className="text-emerald-700">
                    +{formatDollars(lowestMarginalRange.costIncrease)}/year
                  </strong>{' '}
                  occurs between {formatDollars(lowestMarginalRange.incomeFrom)} and{' '}
                  {formatDollars(lowestMarginalRange.incomeTo)}. This is the
                  &ldquo;sweet spot&rdquo; where extra income has the least impact
                  on your childcare costs.
                </p>
              )}

              <p className="text-xs text-muted">
                Note: These figures are based on your current childcare arrangement
                ({output.resolved.daysPerWeek} days/week, {formatDollars(output.resolved.dailyFee)}/day).
                Changing your childcare usage would shift all the numbers proportionally.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Multiple Child Comparison Panel (Task 4.4) ──────────────────────────────
//
// Only rendered when output.higherCCS is non-null (2+ children, youngest ≤5).
// Shows standard vs higher rate per-child costs, annual saving, and rule
// explanation. Calculates saving as eldest-rate cost minus actual younger-rate cost.
// ─────────────────────────────────────────────────────────────────────────────

function MultiChildComparisonPanel({ output }: { output: CalculationOutput }) {
  const { ccsPercentage, higherCCS, annual, eldestChildAnnual, resolved } = output;
  const higherRate = higherCCS!;
  const youngerCount = resolved.numberOfChildren - 1;

  // Saving per younger child = what they would pay at the standard rate − what they actually pay at higher rate
  const savingPerYoungerChild =
    (eldestChildAnnual?.outOfPocketPerYear ?? 0) - annual.outOfPocketPerYear;
  const totalAnnualSaving = Math.round(savingPerYoungerChild * youngerCount * 100) / 100;
  const weeklySaving = Math.round((totalAnnualSaving / 52) * 100) / 100;

  const govSubsidyEldest = eldestChildAnnual?.subsidyPerYear ?? 0;
  const govSubsidyYounger = annual.subsidyPerYear;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">

      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
          Multiple Children — Higher Rate Benefit
        </h2>
        <p className="text-xs text-muted mt-0.5">
          {resolved.numberOfChildren} children in care · {ccsPercentage.percent}% standard rate · {higherRate.higherPercent}% higher rate
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* ── Annual saving highlight ──────────────────────────────────────── */}
        {totalAnnualSaving > 0 && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-emerald-800">
                  The higher rate saves you {formatDollars(totalAnnualSaving)}/year
                </p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  That&apos;s approximately <strong>{formatDollars(weeklySaving)}/week</strong> less
                  than if {youngerCount === 1 ? 'your younger child' : `all ${youngerCount} younger children`} were on the standard rate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Per-child rate comparison ────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
            Annual cost per child
          </p>
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Eldest child — standard rate */}
            <div className="rounded-xl bg-gray-50 border border-border px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-primary leading-none">{ccsPercentage.percent}%</span>
                <div>
                  <p className="text-xs font-semibold text-text-main">Eldest child</p>
                  <p className="text-xs text-muted">Standard CCS rate</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Gross fee/year</span>
                  <span className="tabular-nums">{formatDollars(eldestChildAnnual?.grossFeePerYear ?? 0)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Government pays</span>
                  <span className="tabular-nums font-medium">−{formatDollars(govSubsidyEldest)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-0.5 font-semibold">
                  <span className="text-text-main">Your gap fee</span>
                  <span className="text-text-main tabular-nums">{formatDollars(eldestChildAnnual?.outOfPocketPerYear ?? 0)}</span>
                </div>
              </div>
            </div>

            {/* Younger child(ren) — higher rate */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-green-700 leading-none">{higherRate.higherPercent}%</span>
                <div>
                  <p className="text-xs font-semibold text-text-main">
                    {youngerCount === 1 ? 'Younger child' : `${youngerCount} younger children`}
                  </p>
                  <p className="text-xs text-muted">
                    Higher CCS rate
                    {higherRate.wasCapped ? ' (capped at 95%)' : ` (+${higherRate.additionalPoints}pp)`}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Gross fee/year</span>
                  <span className="tabular-nums">{formatDollars(annual.grossFeePerYear)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Government pays</span>
                  <span className="tabular-nums font-medium">−{formatDollars(govSubsidyYounger)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-0.5 font-semibold">
                  <span className="text-text-main">Your gap fee</span>
                  <span className="text-green-700 tabular-nums">{formatDollars(annual.outOfPocketPerYear)}</span>
                </div>
              </div>
            </div>
          </div>

          {youngerCount > 1 && (
            <p className="mt-2 text-xs text-muted">
              * Per-child figures shown above. Your {youngerCount} younger children each have a gap fee of {formatDollars(annual.outOfPocketPerYear)}/year.
            </p>
          )}
        </div>

        {/* ── Saving breakdown ─────────────────────────────────────────────── */}
        {totalAnnualSaving > 0 && (
          <div className="rounded-xl bg-gray-50 border border-border px-4 py-3.5">
            <p className="text-xs font-semibold text-text-main uppercase tracking-wide mb-2.5">
              How the higher rate saves you money
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>
                  If {youngerCount === 1 ? 'younger child' : `${youngerCount} younger children`} were at standard {ccsPercentage.percent}%
                </span>
                <span className="tabular-nums text-text-main">
                  {formatDollars((eldestChildAnnual?.outOfPocketPerYear ?? 0) * youngerCount)}/yr
                </span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Actual cost at higher {higherRate.higherPercent}%</span>
                <span className="tabular-nums font-medium">
                  −{formatDollars(annual.outOfPocketPerYear * youngerCount)}/yr
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-0.5 font-semibold">
                <span className="text-text-main">Annual saving</span>
                <span className="text-emerald-700 tabular-nums">{formatDollars(totalAnnualSaving)}/yr</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Explanation ──────────────────────────────────────────────────── */}
        <div className="text-xs text-muted leading-relaxed space-y-2">
          <p>
            <strong className="text-text-main">Why does this apply?</strong>{' '}
            From 10 July 2023, families with 2 or more children aged 5 or under in
            approved childcare receive a higher CCS rate on all children except the
            eldest. The higher rate is your standard rate plus{' '}
            {higherRate.additionalPoints} percentage points, capped at 95%.
          </p>
          {higherRate.wasCapped && (
            <p>
              In your case, the uncapped rate would be {ccsPercentage.percent + higherRate.additionalPoints}%
              — but the maximum allowed is 95%, so the rate is capped there.
            </p>
          )}
          <p>
            The eldest child always receives the standard rate. If you have 3 or more
            children, the eldest gets {ccsPercentage.percent}% and every other child
            gets {higherRate.higherPercent}%.
          </p>
          {resolved.combinedAnnualIncome > 85279 && (
            <p className="flex items-start gap-1.5">
              <span className="flex-shrink-0">ⓘ</span>
              <span>
                As a family earning above $85,279 you are subject to an <strong>annual CCS cap of $11,003 per child</strong>.
                If your childcare usage is very high, you may hit this cap during the year and pay full fees from
                that point. Contact Services Australia if you are concerned this may apply.
              </span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Key Insights Accordion (Task 4.5) ───────────────────────────────────────
//
// Six expandable panels providing detailed, accurate explanations of the
// rules that affect a parent's CCS estimate. Content is tailored to the
// user's specific inputs wherever possible.
// ─────────────────────────────────────────────────────────────────────────────

function InsightItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-sm font-medium text-text-main hover:text-primary transition-colors focus:outline-none text-left gap-4"
      >
        <span>{title}</span>
        <svg
          className={['w-4 h-4 flex-shrink-0 transition-transform duration-150 text-muted', open ? 'rotate-90' : ''].join(' ')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="pb-5 space-y-3 text-sm text-muted leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

function KeyInsightsAccordion({ output }: { output: CalculationOutput }) {
  const { ccsPercentage, session, resolved } = output;
  const hasAnnualCap = resolved.combinedAnnualIncome > 85279;
  const annualCapAmount = 11003;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">

      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
          Key Insights
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Important rules that affect your CCS estimate
        </p>
      </div>

      <div className="px-6 divide-y divide-border">

        {/* ── 1. How your rate is calculated ─────────────────────────────── */}
        <InsightItem title="How your CCS rate is calculated">
          <p>
            Your CCS rate is based on your combined family income for the
            relevant financial year. The maximum rate is <strong>90%</strong>{' '}
            for families earning up to $85,279. For every $5,000 your income
            exceeds that threshold, the rate reduces by 1 percentage point —
            down to a minimum of 0%.
          </p>
          {ccsPercentage.incomeAboveThreshold > 0 ? (
            <p>
              Your combined income of {formatDollars(resolved.combinedAnnualIncome)}/year
              is {formatDollars(ccsPercentage.incomeAboveThreshold)} above the threshold —
              {' '}{ccsPercentage.bracketsAbove} brackets of $5,000. That reduces your
              rate by {ccsPercentage.percentReduction} percentage points, from 90% to{' '}
              <strong>{ccsPercentage.percent}%</strong>.
            </p>
          ) : (
            <p>
              Your combined income of {formatDollars(resolved.combinedAnnualIncome)}/year
              is at or below the $85,279 threshold — so you receive the{' '}
              <strong>maximum 90% rate</strong>.
            </p>
          )}
          <p>
            CCS drops to 0% when combined income reaches $535,279. The income
            figure used during the year is an estimate — it is reconciled against
            your actual ATO tax return at the end of each financial year and
            adjusted accordingly.
          </p>
        </InsightItem>

        {/* ── 2. Hourly rate cap ──────────────────────────────────────────── */}
        <InsightItem title="The hourly rate cap — and how it limits the subsidy">
          <p>
            The government doesn&apos;t pay a subsidy based on your full fee.
            It caps the fee it will subsidise per hour of care. Any fee above
            this cap is <strong>always 100% out-of-pocket</strong> — the CCS
            percentage doesn&apos;t help with the above-cap portion.
          </p>
          <p>
            For {resolved.careType.replace(/_/g, ' ')} with {resolved.ageGroup.replace(/_/g, ' ')} children,
            the rate cap is{' '}
            <strong>{formatDollarsAndCents(session.hourlyRateCap)}/hr</strong>.
          </p>
          {session.feeAboveCapPerHour > 0 ? (
            <p>
              Your fee of {formatDollars(session.dailyFeeUsed)}/day equates to{' '}
              {formatDollarsAndCents(session.hourlyFee)}/hr —{' '}
              <strong className="text-amber-700">
                {formatDollarsAndCents(session.feeAboveCapPerHour)}/hr above the cap
              </strong>.
              That above-cap portion ({formatDollars(session.feeAboveCapPerHour * resolved.hoursPerDay)}/day)
              is entirely out-of-pocket regardless of your CCS rate. Only the portion
              up to the cap attracts the subsidy.
            </p>
          ) : (
            <p>
              Your fee of {formatDollars(session.dailyFeeUsed)}/day equates to{' '}
              {formatDollarsAndCents(session.hourlyFee)}/hr — <strong>below the cap</strong>,
              so the full CCS percentage applies to your entire fee.
            </p>
          )}
          <p>
            Rate caps are indexed annually by the government and vary by care type
            and child age. Centre-based day care for pre-school children carries the
            highest cap ($14.63/hr), while family day care ($12.43/hr) and OSHC
            ($12.81/hr) are lower.
          </p>
        </InsightItem>

        {/* ── 3. 3-Day Guarantee ──────────────────────────────────────────── */}
        <InsightItem title="The 3-Day Guarantee (from 5 January 2026)">
          <p>
            From <strong>5 January 2026</strong>, the activity test rules changed
            significantly. All eligible families now automatically receive a minimum of{' '}
            <strong>72 subsidised hours per fortnight</strong> (the equivalent of
            3 full days at 12 hours each), regardless of their work, study, or
            training hours.
          </p>
          <p>
            Previously, families with low activity hours could be limited to as few
            as 24 subsidised hours per fortnight. The 3-Day Guarantee removes that
            floor — every eligible family gets 72 hours automatically.
          </p>
          <p>
            For <strong>days 4 and 5</strong> (hours 73–100 per fortnight), the
            standard activity test still applies. You need to demonstrate recognised
            activity — paid work, study, training, volunteering, or other approved
            activities — to access those additional subsidised hours.
          </p>
          <p>
            <strong>This calculator assumes you meet the activity requirements</strong>{' '}
            for the number of days you&apos;ve entered. If you use 4 or 5 days of care,
            check your activity hours with Services Australia or your childcare
            provider to confirm you qualify for the full subsidy.
          </p>
        </InsightItem>

        {/* ── 4. 5% withholding ───────────────────────────────────────────── */}
        <InsightItem title="The 5% withholding — why you pay more during the year">
          <p>
            Services Australia automatically withholds <strong>5% of your CCS
            entitlement</strong> each fortnight. This means your gap fee during the
            year is slightly higher than your true entitlement suggests.
          </p>
          <p>
            The withholding acts as a buffer against overpayment. Because your CCS
            rate is based on an estimated income, there&apos;s always a risk that
            your actual income turns out higher — meaning you received too much
            subsidy. The 5% buffer absorbs most small discrepancies automatically.
          </p>
          <p>
            At the end of the financial year, Services Australia reconciles your CCS
            against your ATO-confirmed income. If you received the right amount or
            less than entitled, the withheld 5% is returned — typically credited
            back through your childcare provider or paid directly. If you received
            too much, it becomes a debt to repay.
          </p>
          <p>
            <strong>Your true annual out-of-pocket cost is the gap fee, not the
            gap fee plus withholding.</strong> The withheld amount is held in trust
            and returned in most cases. This is why the results above show both
            &ldquo;what you pay&rdquo; (including withholding) and &ldquo;after
            reconciliation&rdquo; (your real cost).
          </p>
        </InsightItem>

        {/* ── 5. Government vs private ────────────────────────────────────── */}
        <InsightItem title="Not-for-profit vs private childcare — does it matter?">
          <p>
            Australian childcare providers are either not-for-profit (community,
            council, or church-run) or for-profit (private operators). Research from
            the ACCC&apos;s 2023 Childcare Inquiry found that not-for-profit
            providers charge approximately <strong>8% less on average</strong> than
            for-profit providers for the same type and hours of care.
          </p>
          <p>
            Quality also differs on average. According to the National Quality
            Standard, not-for-profit centres are more likely to be rated
            &ldquo;Exceeding&rdquo; — though excellent providers exist in both
            categories. You can check any centre&apos;s NQS rating at the
            ACECQA website (acecqa.gov.au).
          </p>
          <p>
            If your current fee is above the hourly rate cap
            ({formatDollarsAndCents(session.hourlyRateCap)}/hr for your care type),
            switching to a provider with a lower fee — even a for-profit one — could
            reduce your above-cap out-of-pocket costs. The cap limits what the
            government subsidises, but a lower fee removes the cap problem entirely
            if it falls below the cap.
          </p>
        </InsightItem>

        {/* ── 6. Tips to reduce costs ─────────────────────────────────────── */}
        <InsightItem title="Tips to reduce your childcare costs">
          <ul className="space-y-3 list-none">
            <li>
              <strong className="text-text-main block mb-0.5">
                Update your income estimate promptly
              </strong>
              If your income drops during the year — parental leave, redundancy,
              reduced hours — update your estimate with Services Australia
              immediately. Your CCS rate adjusts in real time, so you start saving
              straightaway rather than waiting for end-of-year reconciliation.
            </li>
            <li>
              <strong className="text-text-main block mb-0.5">
                Be aware of the annual CCS cap
              </strong>
              {hasAnnualCap ? (
                <>
                  At your income level, you are subject to an annual CCS cap of{' '}
                  <strong>${annualCapAmount.toLocaleString('en-AU')}/child</strong>.
                  If you use a high volume of care (especially full-time at above-average
                  fees), you may hit this cap during the year and pay full fees from
                  that point. If this is a risk, plan your childcare use accordingly
                  or contact Services Australia for personalised advice.
                </>
              ) : (
                <>
                  At your current income, there is <strong>no annual CCS cap</strong> —
                  you receive the full subsidy all year regardless of how many hours
                  of care you use. This is a significant benefit of being below the
                  $85,279 threshold.
                </>
              )}
            </li>
            <li>
              <strong className="text-text-main block mb-0.5">
                Compare providers and daily fees
              </strong>
              {session.feeAboveCapPerHour > 0 ? (
                <>
                  Your current fee exceeds the rate cap by{' '}
                  {formatDollarsAndCents(session.feeAboveCapPerHour)}/hr. Every dollar
                  above the cap comes entirely from your pocket. A provider charging
                  at or below the cap ({formatDollars(session.hourlyRateCap * resolved.hoursPerDay)}/day
                  at {resolved.hoursPerDay}h) would mean the full CCS percentage applies
                  to your whole fee.
                </>
              ) : (
                <>
                  Your fee is currently below the rate cap, which is ideal — the full
                  CCS percentage applies to your whole fee. If you&apos;re considering
                  a higher-fee provider, note that fees above{' '}
                  {formatDollarsAndCents(session.hourlyRateCap)}/hr would be fully
                  out-of-pocket.
                </>
              )}
            </li>
            <li>
              <strong className="text-text-main block mb-0.5">
                Make sure all children are enrolled correctly
              </strong>
              Ensure Services Australia has current records of all children in
              approved care. Missing a child means losing the higher CCS rate for
              younger siblings and forfeiting the subsidy on their care entirely.
              If you have a new child starting care, register them promptly.
            </li>
            <li>
              <strong className="text-text-main block mb-0.5">
                Check your activity hours for days 4 and 5
              </strong>
              The 3-Day Guarantee covers 72 hours/fortnight automatically. But to
              access days 4 and 5 (hours 73–100), you need to meet the activity
              test. Volunteering, part-time study, training programs, and paid work
              all count. Even informal job-seeking activities may qualify — check
              with Services Australia.
            </li>
          </ul>
        </InsightItem>

      </div>
    </div>
  );
}

// ─── "What This Actually Means" Interpretation Layer (Task 4.6) ──────────────
//
// Dynamic plain-language interpretation using the user's actual numbers.
// Provides the human-readable bridge between raw calculation output and
// practical understanding — the core differentiator from competitor tools.
//
// Covers: subsidy rate context, practical cost framing, fee-cap impact,
// income positioning, multi-child advantage, withholding reassurance,
// and risk/caveat disclosure.
// ─────────────────────────────────────────────────────────────────────────────

const INTERPRETATION_ICONS: Record<string, React.ReactNode> = {
  dollar: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  family: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  alert: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
};

function InterpretationItem({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5 text-primary">
        {INTERPRETATION_ICONS[icon] ?? INTERPRETATION_ICONS.info}
      </div>
      <div>
        <p className="text-xs font-semibold text-text-main uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className="text-sm text-muted leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

function WhatThisActuallyMeans({
  output,
  relationshipStatus,
}: {
  output: CalculationOutput;
  relationshipStatus: 'single' | 'partnered';
}) {
  const {
    resolved,
    ccsPercentage,
    session,
    annual,
    higherCCS,
    eldestChildAnnual,
    totalAnnualOutOfPocket,
    totalAnnualGovSubsidy,
    sensitivity,
  } = output;

  // Derived display values
  const totalAnnualGross = totalAnnualOutOfPocket + totalAnnualGovSubsidy;
  const govPayPercent = totalAnnualGross > 0
    ? Math.round((totalAnnualGovSubsidy / totalAnnualGross) * 100)
    : 0;
  const weeklyOutOfPocket = Math.round(totalAnnualOutOfPocket / 52);
  const monthlyOutOfPocket = Math.round(totalAnnualOutOfPocket / 12);

  const isMaxRate = ccsPercentage.percent === 90;
  const isBelowCap = session.feeAboveCapPerHour === 0;
  const zeroCCSGap = sensitivity.zeroCCSIncome - resolved.combinedAnnualIncome;

  // Above-cap annual cost for framing
  const aboveCapAnnual = session.feeAboveCapPerHour > 0
    ? Math.round(session.feeAboveCapPerHour * resolved.hoursPerDay * resolved.daysPerWeek * 52 * 100) / 100
    : 0;

  // For multi-child savings per younger child
  const savingPerYoungerChild = higherCCS && eldestChildAnnual
    ? (eldestChildAnnual.outOfPocketPerYear - annual.outOfPocketPerYear)
    : 0;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">

      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
          What This Actually Means
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Your results explained in plain language
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* ── Headline interpretation ──────────────────────────────────────── */}
        <p className="text-base text-text-main leading-relaxed">
          {isMaxRate ? (
            <>
              Your family qualifies for the{' '}
              <strong className="text-primary">maximum 90% CCS rate</strong>.
              The government covers {formatDollars(totalAnnualGovSubsidy)} of
              your annual childcare costs — leaving you with{' '}
              <strong>{formatDollars(totalAnnualOutOfPocket)}/year</strong>,
              or about <strong>{formatDollars(weeklyOutOfPocket)}/week</strong>.
            </>
          ) : ccsPercentage.percent >= 70 ? (
            <>
              At a CCS rate of{' '}
              <strong className="text-primary">{ccsPercentage.percent}%</strong>,
              the government covers the majority of your childcare costs —{' '}
              {formatDollars(totalAnnualGovSubsidy)}/year.
              You pay{' '}
              <strong>{formatDollars(totalAnnualOutOfPocket)}/year</strong> out
              of pocket, or about{' '}
              <strong>{formatDollars(weeklyOutOfPocket)}/week</strong>.
            </>
          ) : ccsPercentage.percent >= 30 ? (
            <>
              At a CCS rate of{' '}
              <strong className="text-primary">{ccsPercentage.percent}%</strong>,
              the government subsidises a significant portion of your childcare.
              Your out-of-pocket cost is{' '}
              <strong>{formatDollars(totalAnnualOutOfPocket)}/year</strong> —
              roughly{' '}
              <strong>{formatDollars(weeklyOutOfPocket)}/week</strong>.
            </>
          ) : ccsPercentage.percent > 0 ? (
            <>
              At a CCS rate of{' '}
              <strong className="text-primary">{ccsPercentage.percent}%</strong>,
              you receive a modest subsidy. Your out-of-pocket childcare cost
              is{' '}
              <strong>{formatDollars(totalAnnualOutOfPocket)}/year</strong> —
              about{' '}
              <strong>{formatDollars(weeklyOutOfPocket)}/week</strong>.
            </>
          ) : (
            <>
              At your income level, you{' '}
              <strong>do not receive a CCS subsidy</strong>. Your full childcare
              cost is{' '}
              <strong>{formatDollars(totalAnnualOutOfPocket)}/year</strong> —{' '}
              <strong>{formatDollars(weeklyOutOfPocket)}/week</strong> entirely
              out-of-pocket.
            </>
          )}
        </p>

        {/* ── Interpretation items ─────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* In practical terms */}
          <InterpretationItem icon="dollar" title="In practical terms">
            Your family pays approximately{' '}
            <strong>{formatDollars(monthlyOutOfPocket)}/month</strong> for
            childcare after the subsidy.
            {govPayPercent > 0 && (
              <> The government covers <strong>{govPayPercent}%</strong> of the
              gross fee; you cover the remaining {100 - govPayPercent}%.</>
            )}
            {resolved.numberOfChildren > 1 && (
              <> This is for all {resolved.numberOfChildren} children combined.</>
            )}
          </InterpretationItem>

          {/* Fee vs cap */}
          {isBelowCap ? (
            <InterpretationItem icon="check" title="Your fee is well-positioned">
              Your daily fee of {formatDollars(session.dailyFeeUsed)} works out
              to {formatDollarsAndCents(session.hourlyFee)}/hr — comfortably
              below the {formatDollarsAndCents(session.hourlyRateCap)}/hr rate
              cap. The full {ccsPercentage.percent}% subsidy applies to your
              entire fee. You could move to a provider charging up to{' '}
              {formatDollars(session.hourlyRateCap * resolved.hoursPerDay)}/day
              ({resolved.hoursPerDay}h) before hitting the cap.
            </InterpretationItem>
          ) : (
            <InterpretationItem icon="warning" title="Your fee exceeds the government cap">
              Your hourly fee of {formatDollarsAndCents(session.hourlyFee)} is{' '}
              {formatDollarsAndCents(session.feeAboveCapPerHour)}/hr above the
              rate cap. That above-cap amount adds{' '}
              <strong>{formatDollars(aboveCapAnnual)}/year</strong> to your
              costs that no subsidy rate can reduce. A provider charging at or
              below {formatDollars(session.hourlyRateCap * resolved.hoursPerDay)}/day
              ({resolved.hoursPerDay}h) would eliminate this entirely.
            </InterpretationItem>
          )}

          {/* Income positioning */}
          {isMaxRate ? (
            <InterpretationItem icon="info" title="You&apos;re in the maximum-rate zone">
              With {relationshipStatus === 'single' ? 'your' : 'combined'} income
              at or below $85,279, you receive the maximum 90% rate and have no
              annual CCS cap. If your income rises above that threshold, the rate
              starts to taper — each additional $5,000 reduces it by 1 percentage
              point, increasing your childcare cost by roughly{' '}
              {sensitivity.highestMarginalRange
                ? formatDollars(sensitivity.highestMarginalRange.costIncrease)
                : '$200–$600'}/year
              per bracket.
            </InterpretationItem>
          ) : ccsPercentage.percent > 0 && zeroCCSGap > 0 ? (
            <InterpretationItem icon="info" title="Where you sit on the income scale">
              Your CCS rate of {ccsPercentage.percent}% is{' '}
              {90 - ccsPercentage.percent} points below the 90% maximum.
              {zeroCCSGap > 100000
                ? ` CCS would not reach 0% until ${formatDollars(sensitivity.zeroCCSIncome)} — well above your current income, so there is significant room before you lose the subsidy entirely.`
                : ` CCS reaches 0% at ${formatDollars(sensitivity.zeroCCSIncome)}, which is ${formatDollars(zeroCCSGap)} above your current income.`
              }
            </InterpretationItem>
          ) : null}

          {/* Multi-child advantage */}
          {higherCCS && savingPerYoungerChild > 0 && (
            <InterpretationItem icon="family" title="Multi-child advantage">
              Because you have {resolved.numberOfChildren} children in care with
              the youngest under 6, your younger{' '}
              {resolved.numberOfChildren > 2 ? 'children receive' : 'child receives'}{' '}
              the higher {higherCCS.higherPercent}% rate instead of{' '}
              {ccsPercentage.percent}%. This saves your family{' '}
              <strong>{formatDollars(savingPerYoungerChild)}/year per younger
              child</strong> compared to the standard rate.
            </InterpretationItem>
          )}

          {/* Withholding reassurance */}
          <InterpretationItem icon="shield" title="About the 5% withholding">
            The &ldquo;what you pay&rdquo; figure in the Cost Summary includes
            a 5% buffer withheld by Services Australia. This is held in trust
            and returned at year-end in most cases. Your <strong>true annual
            cost after reconciliation is{' '}
            {formatDollars(totalAnnualOutOfPocket)}</strong> — the withholding
            is not money lost.
          </InterpretationItem>

          {/* Risk / caveat */}
          <InterpretationItem icon="alert" title="What could change these numbers">
            This estimate is based on a{' '}
            {relationshipStatus === 'single' ? '' : 'combined '}
            income of {formatDollars(resolved.combinedAnnualIncome)}.
            If your actual income for the financial year turns out higher or
            lower, your CCS rate will be adjusted at reconciliation — which
            could mean a debt to repay or a refund in your favour.
            {resolved.usingStateAverage && (
              <> The fee used here is the {resolved.state} state average for{' '}
              {resolved.careType.replace(/_/g, ' ')}. Your actual provider&apos;s
              fee may be different — use your real fee for a more accurate estimate.</>
            )}
          </InterpretationItem>
        </div>
      </div>
    </div>
  );
}

// ─── 4.8  Share Panel ───────────────────────────────────────────────────────
//
// Copy link (Clipboard API), email (mailto: pre-filled), print (window.print).
// Hidden when printing so only the results content is printed.
// ────────────────────────────────────────────────────────────────────────────

function SharePanel({ output }: { output: CalculationOutput }) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleEmail() {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const subject = encodeURIComponent('My childcare subsidy estimate');
    const body = encodeURIComponent(
      `Hi,\n\nI used the Childcare Cost Calculator to estimate my CCS. Here's a link to my results — you can adjust the inputs to see your own estimate:\n\n${url}\n\nKey details:\n• CCS rate: ${output.ccsPercentage.percent}%${output.higherCCS ? ` / ${output.higherCCS.higherPercent}% (younger child)` : ''}\n• Annual out-of-pocket: ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(output.totalAnnualOutOfPocket)}\n\nResults are based on FY ${output.ratesVersion} CCS rates.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  function handlePrint() {
    if (typeof window === 'undefined') return;
    window.print();
  }

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden print:hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-base font-bold text-text-main">Share your results</h3>
        <p className="text-xs text-muted mt-0.5">
          Save a link to come back later, or share with a partner or financial adviser
        </p>
      </div>
      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-3">

          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy link
              </>
            )}
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleEmail}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email to myself
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>

        {/* URL display */}
        <p className="mt-3 text-xs text-muted truncate">
          <span className="font-medium">Your results link:</span>{' '}
          <span className="font-mono text-[11px] opacity-70 select-all">
            {typeof window !== 'undefined' ? window.location.href : 'Loading…'}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── 4.7  Next Steps Panel ──────────────────────────────────────────────────
//
// Actionable checklist of what a parent should do now — myGov check, fee
// schedule collection, income estimate update, quality rating check, CCS
// application guidance. Must be accurate — parents will follow these steps.
// ────────────────────────────────────────────────────────────────────────────

/** One numbered action step with SVG icon, title, and contextual description. */
function StepCard({
  number,
  icon,
  title,
  children,
  linkHref,
  linkLabel,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex gap-4">
      {/* Step number + icon column */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
          {number}
        </div>
        {/* Connecting line */}
        <div className="w-px flex-1 bg-border mt-2" />
      </div>

      {/* Content column */}
      <div className="pb-6 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary">{icon}</span>
          <h4 className="text-sm font-semibold text-text-main">{title}</h4>
        </div>
        <div className="text-sm text-muted leading-relaxed space-y-2">
          {children}
        </div>
        {linkHref && linkLabel && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-primary hover:underline"
          >
            {linkLabel}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// SVG icons for each step
const STEP_ICONS = {
  myGov: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  fee: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  income: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  quality: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  apply: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  review: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
} as const;

function NextStepsPanel({ output }: { output: CalculationOutput }) {
  const { resolved, ccsPercentage, session } = output;
  const isAboveCap = session.feeAboveCapPerHour > 0;
  const isHighIncome = resolved.combinedAnnualIncome > 85279;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-base font-bold text-text-main">
          What to do next
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Practical steps to claim your subsidy and reduce your childcare costs
        </p>
      </div>

      <div className="px-5 py-5">
        {/* ── Step 1: myGov / Centrelink check ──────────────────────────── */}
        <StepCard
          number={1}
          icon={STEP_ICONS.myGov}
          title="Check your CCS status on myGov"
          linkHref="https://my.gov.au"
          linkLabel="Sign in to myGov"
        >
          <p>
            Log in to your <strong>myGov account</strong> and navigate to your
            linked Centrelink service. Under <em>Payments and Claims &gt;
            Manage my claim &gt; Child Care Subsidy</em>, check that:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Your CCS claim is <strong>active and current</strong></li>
            <li>
              Your activity test details are up to date
              {resolved.daysPerWeek >= 4 && (
                <> — you need sufficient recognised activity hours to access
                subsidised hours for {resolved.daysPerWeek} days/week</>
              )}
            </li>
            <li>
              Your estimated family income matches what this calculator used ({formatDollars(resolved.combinedAnnualIncome)})
            </li>
            <li>All children in care are listed on your claim</li>
          </ul>
          <p>
            If you haven&apos;t claimed CCS yet, you&apos;ll need to submit a
            claim through Centrelink — see Step 5 below.
          </p>
        </StepCard>

        {/* ── Step 2: Fee schedule collection ───────────────────────────── */}
        <StepCard
          number={2}
          icon={STEP_ICONS.fee}
          title="Get your provider's actual fee schedule"
          linkHref="https://www.startingblocks.gov.au"
          linkLabel="Search providers on Starting Blocks"
        >
          {resolved.usingStateAverage ? (
            <>
              <p>
                This estimate used the <strong>{resolved.state} state
                average fee</strong> for {resolved.careType.replace(/_/g, ' ')}.
                Your actual provider may charge more or less. Contact your
                childcare centre and ask for their current fee schedule including:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>The daily or hourly session fee</li>
                <li>Any additional charges (late pick-up fees, excursion levies, meal charges)</li>
                <li>Whether they offer a multi-day or sibling discount</li>
                <li>Their annual fee increase schedule (most centres increase in January or July)</li>
              </ul>
              <p>
                Once you have the actual fee, come back and{' '}
                <strong>re-run this calculator with your real fee</strong> for
                a more accurate estimate.
              </p>
            </>
          ) : (
            <>
              <p>
                You entered a daily fee of{' '}
                <strong>{formatDollars(resolved.dailyFee)}/day</strong>.
                Confirm this matches your provider&apos;s current fee schedule
                and ask about:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Any upcoming fee changes (most centres increase in January or July)</li>
                <li>Additional charges not included in the base fee (meals, nappies, excursions)</li>
                <li>Whether they offer multi-day or sibling discounts</li>
              </ul>
              {isAboveCap && (
                <p>
                  Your fee is <strong>above the government hourly rate cap</strong>{' '}
                  ({formatDollarsAndCents(session.hourlyRateCap)}/hr). The
                  above-cap portion is always out-of-pocket. You may want to
                  compare fees at other providers in your area — even a small
                  reduction could bring you under the cap and increase your
                  effective subsidy.
                </p>
              )}
            </>
          )}
        </StepCard>

        {/* ── Step 3: Income estimate update ──────────────────────────── */}
        <StepCard
          number={3}
          icon={STEP_ICONS.income}
          title="Update your family income estimate"
          linkHref="https://www.servicesaustralia.gov.au/income-estimate-for-child-care-subsidy"
          linkLabel="Income estimate guide — Services Australia"
        >
          <p>
            Your CCS rate is based on your <strong>combined family income
            estimate</strong> lodged with Centrelink. If this estimate is wrong,
            you could end up with a debt at reconciliation or miss out on a
            higher subsidy.
          </p>
          <p>Review your estimate and make sure it includes:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Taxable income</strong> — salary/wages, business income,
              investment income, rental income, capital gains
            </li>
            <li>
              <strong>Reportable fringe benefits</strong> — shown on your
              payment summary
            </li>
            <li>
              <strong>Tax-free pensions</strong> and any net investment losses
              added back
            </li>
            {resolved.includeBackToWork && (
              <li>
                <strong>Any changes if you return to work</strong> — your
                combined income will increase, which{' '}
                {ccsPercentage.percent >= 90
                  ? 'may reduce your CCS rate from the current maximum'
                  : 'will further reduce your CCS rate'}
              </li>
            )}
          </ul>
          <p>
            Update your estimate through myGov whenever your circumstances
            change — a mid-year pay rise, new job, or partner&apos;s income change
            all matter.
            {isHighIncome && (
              <> With a combined income above $85,279, you&apos;re also subject to
              the <strong>annual CCS cap of $11,003 per child</strong>. Monitor
              your subsidy usage through your Centrelink account to avoid
              unexpected cap effects.</>
            )}
          </p>
        </StepCard>

        {/* ── Step 4: Quality rating check ────────────────────────────── */}
        <StepCard
          number={4}
          icon={STEP_ICONS.quality}
          title="Check your provider's quality rating"
          linkHref="https://www.acecqa.gov.au/resources/national-registers"
          linkLabel="Search the National Register — ACECQA"
        >
          <p>
            Every approved childcare provider in Australia is assessed under the{' '}
            <strong>National Quality Standard (NQS)</strong> and given a rating.
            The ratings are:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Excellent</strong> — highest achievable rating</li>
            <li><strong>Exceeding NQS</strong> — above the national standard</li>
            <li><strong>Meeting NQS</strong> — meets the national standard</li>
            <li><strong>Working Towards NQS</strong> — does not yet meet the standard in all areas</li>
          </ul>
          <p>
            Search for your provider on the ACECQA National Register to see their
            current rating and which quality areas they excel in or need improvement.
            This is especially useful if you&apos;re comparing providers — a higher
            quality rating combined with a fee closer to the hourly rate cap
            ({formatDollarsAndCents(session.hourlyRateCap)}/hr for your care type)
            is the best value combination.
          </p>
        </StepCard>

        {/* ── Step 5: CCS application guidance ────────────────────────── */}
        <StepCard
          number={5}
          icon={STEP_ICONS.apply}
          title="Apply for CCS (if you haven't already)"
          linkHref="https://www.servicesaustralia.gov.au/how-to-claim-child-care-subsidy"
          linkLabel="How to claim CCS — Services Australia"
        >
          <p>
            If you&apos;re not yet receiving CCS, here&apos;s how to apply:
          </p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              <strong>Create or link your myGov account</strong> to Centrelink
              (if not already linked)
            </li>
            <li>
              <strong>Lodge a CCS claim</strong> through your Centrelink online
              account — you&apos;ll need your Tax File Number (TFN), your
              children&apos;s details, and your childcare provider&apos;s details
            </li>
            <li>
              <strong>Confirm your income estimate</strong> — Centrelink will
              ask for your estimated combined family income for the financial year
            </li>
            <li>
              <strong>Complete the activity test</strong> — provide details of
              your work, study, training, or other recognised activities
            </li>
            <li>
              <strong>Confirm your enrolment</strong> — your childcare provider
              will submit a Complying Written Arrangement (CWA) that you&apos;ll
              need to approve through myGov
            </li>
          </ol>
          <p>
            Processing usually takes <strong>1–2 weeks</strong> from the date
            you lodge. CCS is paid directly to your childcare provider, reducing
            your fee at the point of payment — you only pay the gap fee.
          </p>
        </StepCard>

        {/* ── Step 6: Annual review reminder ──────────────────────────── */}
        <StepCard
          number={6}
          icon={STEP_ICONS.review}
          title="Set a reminder to review annually"
        >
          <p>
            CCS rates and hourly rate caps change each financial year (1 July).
            Set a reminder to:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Update your income estimate</strong> in Centrelink before
              1 July each year — your CCS rate will be recalculated automatically
            </li>
            <li>
              <strong>Check for fee increases</strong> from your provider —
              centres typically increase fees in January or July
            </li>
            <li>
              <strong>Confirm your activity test hours</strong> — if your work
              situation changes, update Centrelink to avoid overpayment
            </li>
            <li>
              <strong>Re-run this calculator</strong> with updated figures to
              see your new estimated costs for the year ahead
            </li>
          </ul>
          <p>
            The FY 2025–26 rates used in this calculator apply from 1 July 2025
            to 30 June 2026. New rates and caps for FY 2026–27 will be announced
            by the government before 1 July 2026.
          </p>
        </StepCard>

        {/* Disclaimer */}
        <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> This calculator provides estimates only
            and should not be taken as financial advice. Your actual CCS
            entitlement is determined by Services Australia based on your
            confirmed income, activity, and childcare arrangements. Always verify
            information directly with{' '}
            <a
              href="https://www.servicesaustralia.gov.au/child-care-subsidy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              Services Australia
            </a>{' '}
            before making financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export default function ResultsClient({ output, relationshipStatus, restoreUrl }: ResultsClientProps) {
  const [period, setPeriod] = useState<Period>('weekly');
  const { resolved } = output;

  const incomeLabel = formatDollars(resolved.combinedAnnualIncome);

  return (
    <div className="space-y-5">

      {/* ── Input summary strip ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-white p-4 print:hidden">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Based on your inputs
          </p>
          <Link
            href={restoreUrl}
            className="text-xs text-primary hover:underline font-medium"
          >
            Edit answers →
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <span>
            <span className="font-medium text-text-main">Income:</span>{' '}
            {relationshipStatus === 'single' ? 'Your' : 'Combined'} {incomeLabel}/yr
          </span>
          <span>
            <span className="font-medium text-text-main">Care:</span>{' '}
            {resolved.careType.replace(/_/g, ' ')}
          </span>
          <span>
            <span className="font-medium text-text-main">Attendance:</span>{' '}
            {resolved.daysPerWeek}d/wk · {resolved.hoursPerDay}h/day
          </span>
          <span>
            <span className="font-medium text-text-main">Fee:</span>{' '}
            {resolved.usingStateAverage ? `${resolved.state} average` : `${formatDollars(resolved.dailyFee)}/day`}
          </span>
          <span>
            <span className="font-medium text-text-main">Children:</span>{' '}
            {resolved.numberOfChildren}
          </span>
        </div>
      </div>

      {/* ── Task 4.1 — Cost Summary Card ───────────────────────────────── */}
      <CostSummaryCard
        output={output}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* ── Task 4.6 — "What This Actually Means" ─────────────────────── */}
      <WhatThisActuallyMeans output={output} relationshipStatus={relationshipStatus} />

      {/* ── Task 4.2 — Back-to-Work Analysis Panel ──────────────────────── */}
      {output.backToWork && (
        <BackToWorkPanel output={output} />
      )}

      {/* ── Task 4.4 — Multiple Children Comparison ─────────────────────── */}
      {output.higherCCS && (
        <MultiChildComparisonPanel output={output} />
      )}

      {/* ── Task 4.3 — Income Sensitivity Panel ──────────────────────── */}
      <IncomeSensitivityPanel output={output} />

      {/* ── Task 4.5 — Key Insights Accordion ──────────────────────────── */}
      <KeyInsightsAccordion output={output} />

      {/* ── Task 4.7 — Next Steps Panel ──────────────────────────────── */}
      <NextStepsPanel output={output} />

      {/* ── Task 4.8 — Share Panel ───────────────────────────────────── */}
      <SharePanel output={output} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 pb-6 print:hidden">
        <Link
          href={restoreUrl}
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-text-main transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Edit answers
        </Link>
        <Link
          href="/childcare-subsidy-calculator"
          className="text-sm font-medium text-primary hover:underline"
        >
          Start a new calculation
        </Link>
      </div>
    </div>
  );
}
