'use client';
// =============================================================================
// BTW RESULTS CLIENT — Back-to-Work Calculator Results Page
// =============================================================================
// Receives BackToWorkResult from the server component and renders the full
// results display: verdict banner, scenario table, interpretation, and actions.
//
// Task 5.2 features:
//   • Input summary strip (condensed, collapsible)
//   • Full-width verdict banner (positive/negative)
//   • Part-time comparison table — all 5 day scenarios vs current situation
//   • Effective marginal rate column (net benefit per hour worked)
//   • "What This Means" interpretation (contextual prose)
//   • Non-financial caveat
//   • Share (copy link) + Edit answers + CTA to main CCS calculator
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import type { BackToWorkResult, BackToWorkScenario, CurrentSituation } from '@/lib/backToWorkCalculations';
import { formatDollars, formatDollarsAndCents } from '@/lib/format';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BTWResultsClientProps {
  result: BackToWorkResult;
  // Display context (decoded from URL by server page)
  fteIncome: number;
  combinedAnnualIncome: number;
  currentIndividualIncome: number;
  workCostsPerWeek: number;
  careTypeLabel: string;
  daysPerWeek: number;
  dailyFee: number;
  usingStateAverage: boolean;
  stateName: string;
  relationshipStatus: 'single' | 'partnered';
  ratesVersion: string;
  /** URL to go back to wizard with answers pre-filled. */
  restoreUrl: string;
}

// ─── Table sub-components (reproduced from BackToWorkPanel pattern) ────────────

function TableSection({ label }: { label: string }) {
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

function TableRow({
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
      <td
        className={[
          'py-1.5 pr-3 text-left whitespace-nowrap sticky left-0 z-10',
          highlight ? 'bg-gray-50' : 'bg-white',
          bold ? 'font-semibold text-text-main' : muted ? 'text-muted' : 'text-text-main',
        ].join(' ')}
      >
        {label}
      </td>
      <td
        className={[
          'py-1.5 px-2 text-right tabular-nums whitespace-nowrap',
          highlight ? 'bg-gray-50' : '',
          'text-muted',
        ].join(' ')}
      >
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

// ─── "What This Means" — Positive outcome ─────────────────────────────────────

function InterpretationPositive({
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
  const extraChildcareCost =
    best.annualChildcare.outOfPocketPerYear - current.annualChildcareCost;
  const negativeScenarios = scenarios.filter((s) => !s.isWorthIt);

  return (
    <div className="space-y-3 text-sm text-text-main leading-relaxed">
      <p>
        {isCurrentlyWorking ? 'Increasing your hours to' : 'Working'}{' '}
        <strong>
          {best.daysWorking} day{best.daysWorking === 1 ? '' : 's'} per week
        </strong>{' '}
        at {formatDollars(fteIncome)} FTE ({formatDollars(best.grossIncome)} proportional) would put{' '}
        <strong className="text-emerald-700">{formatDollars(best.netBenefit)}</strong> more
        into your family&apos;s pocket each year.
      </p>

      {/* Breakdown ledger */}
      <div className="text-xs text-muted space-y-1 pl-3 border-l-2 border-border">
        <p>
          <span className="text-green-700 font-medium">
            +{formatDollars(additionalNetIncome)}
          </span>{' '}
          additional income after tax
        </p>
        {extraChildcareCost > 0 && (
          <p>
            <span className="text-red-600 font-medium">
              −{formatDollars(extraChildcareCost)}
            </span>{' '}
            extra childcare cost (CCS drops from {current.ccsPercent}% to {best.ccsPercent}%)
          </p>
        )}
        {extraChildcareCost <= 0 && (
          <p>
            <span className="text-green-700 font-medium">
              −{formatDollars(Math.abs(extraChildcareCost))}
            </span>{' '}
            childcare savings (CCS improves from {current.ccsPercent}% to {best.ccsPercent}%)
          </p>
        )}
        {best.annualWorkCosts > 0 && (
          <p>
            <span className="text-red-600 font-medium">
              −{formatDollars(best.annualWorkCosts)}
            </span>{' '}
            work costs ({best.daysWorking}d × {formatDollars(Math.round(best.annualWorkCosts / best.daysWorking / 52))}/day × 52 wks)
          </p>
        )}
        <p className="font-medium text-text-main pt-1 border-t border-border">
          = {formatDollars(best.netBenefit)} net benefit per year
        </p>
      </div>

      {/* Effective hourly rate */}
      {best.effectiveHourlyRate !== null && (
        <p className="text-xs text-muted">
          Your <strong>effective hourly rate</strong> — what you actually keep per
          hour worked after all costs — is{' '}
          <strong className="text-emerald-700">
            {formatDollarsAndCents(best.effectiveHourlyRate)}/hr
          </strong>.
          {best.effectiveHourlyRate < 15 && (
            <> This is below minimum wage in real terms, even though the salary is
            higher — the hidden costs of working are significant at this income level.</>
          )}
        </p>
      )}

      {/* Note about negative scenarios */}
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
          /week would cost your family money.
          The sweet spot is{' '}
          {best.daysWorking} day{best.daysWorking === 1 ? '' : 's'} for maximum financial benefit.
        </p>
      )}
    </div>
  );
}

// ─── "What This Means" — Negative outcome ─────────────────────────────────────

function InterpretationNegative({
  current,
  scenarios,
  fteIncome,
}: {
  current: CurrentSituation;
  scenarios: BackToWorkScenario[];
  fteIncome: number;
}) {
  const leastBad = scenarios.reduce((best, s) =>
    s.netBenefit > best.netBenefit ? s : best
  );
  const lowestCCS = Math.min(...scenarios.map((s) => s.ccsPercent));

  return (
    <div className="space-y-3 text-sm text-text-main leading-relaxed">
      <p>
        At the proposed salary of {formatDollars(fteIncome)} FTE, returning to
        work would cost your family money in every scenario. After tax,
        reduced CCS (dropping as low as {lowestCCS}%), additional childcare
        days, and work costs, the numbers don&apos;t add up — yet.
      </p>

      <p>
        The closest-to-break-even scenario is{' '}
        <strong>
          {leastBad.daysWorking} day{leastBad.daysWorking === 1 ? '' : 's'} per week
        </strong>{' '}
        (net:{' '}
        <span className="text-red-600 font-semibold">
          {formatDollars(leastBad.netBenefit)}/year
        </span>
        ).
      </p>

      <div className="text-xs text-muted space-y-1 pl-3 border-l-2 border-border">
        <p>To reach break-even, consider:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>A higher salary — the break-even point depends on your combined income and childcare cost</li>
          <li>A lower childcare fee (if your provider charges above the government hourly rate cap)</li>
          <li>Negotiating fewer working days to reduce extra childcare time needed</li>
          <li>
            Employer benefits that reduce work costs (salary-packaged parking, meals, etc.)
          </li>
        </ul>
      </div>

      <p className="text-xs text-muted">
        Current CCS rate: {current.ccsPercent}%. At {formatDollars(fteIncome)} FTE (5 days),
        your combined income would reach{' '}
        {formatDollars(scenarios[4]?.combinedFamilyIncome ?? 0)}, dropping your
        CCS to {scenarios[4]?.ccsPercent ?? 0}%.
      </p>
    </div>
  );
}

// ─── Main results component ───────────────────────────────────────────────────

export default function BTWResultsClient({
  result,
  fteIncome,
  combinedAnnualIncome,
  currentIndividualIncome,
  workCostsPerWeek,
  careTypeLabel,
  daysPerWeek,
  dailyFee,
  usingStateAverage,
  stateName,
  relationshipStatus,
  ratesVersion,
  restoreUrl,
}: BTWResultsClientProps) {
  const [copied, setCopied] = useState(false);
  const { current, scenarios, bestScenario } = result;
  const isCurrentlyWorking = current.grossIncome > 0;
  const hasNegative = scenarios.some((s) => !s.isWorthIt);

  function handleCopy() {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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
            <span className="font-medium text-text-main">
              {relationshipStatus === 'single' ? 'Your' : 'Combined'} income:
            </span>{' '}
            {formatDollars(combinedAnnualIncome)}/yr
          </span>
          {isCurrentlyWorking && (
            <span>
              <span className="font-medium text-text-main">Current income:</span>{' '}
              {formatDollars(currentIndividualIncome)}/yr
            </span>
          )}
          <span>
            <span className="font-medium text-text-main">FTE salary:</span>{' '}
            {formatDollars(fteIncome)}/yr
          </span>
          <span>
            <span className="font-medium text-text-main">Care:</span>{' '}
            {careTypeLabel} · {daysPerWeek}d/wk
          </span>
          <span>
            <span className="font-medium text-text-main">Fee:</span>{' '}
            {usingStateAverage ? `${stateName} average` : `${formatDollars(dailyFee)}/day`}
          </span>
          {workCostsPerWeek > 0 && (
            <span>
              <span className="font-medium text-text-main">Work costs:</span>{' '}
              {formatDollars(workCostsPerWeek)}/wk
            </span>
          )}
        </div>
      </div>

      {/* ── Verdict banner ──────────────────────────────────────────────── */}
      {bestScenario ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
              <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-800">
                Yes — working{' '}
                {bestScenario.daysWorking} day{bestScenario.daysWorking === 1 ? '' : 's'}/week
                is financially positive
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">
                    Best scenario
                  </p>
                  <p className="text-2xl font-bold text-emerald-700 leading-tight">
                    {formatDollars(bestScenario.netBenefit)}/yr
                  </p>
                  <p className="text-xs text-emerald-600">net benefit after all costs</p>
                </div>
                {bestScenario.effectiveHourlyRate !== null && (
                  <div>
                    <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">
                      Effective hourly rate
                    </p>
                    <p className="text-2xl font-bold text-emerald-700 leading-tight">
                      {formatDollarsAndCents(bestScenario.effectiveHourlyRate)}/hr
                    </p>
                    <p className="text-xs text-emerald-600">what you actually keep per hour</p>
                  </div>
                )}
              </div>
              {hasNegative && bestScenario.daysWorking < 5 && (
                <p className="text-xs text-emerald-600 mt-2.5">
                  {bestScenario.daysWorking} days offers the best return.
                  Working more days reduces your effective hourly rate. See the
                  table below for all scenarios.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
              <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-800">
                At {formatDollars(fteIncome)} FTE, the numbers don&apos;t add up — yet
              </p>
              <p className="text-sm text-amber-700 mt-1.5 leading-relaxed">
                Tax, reduced CCS, and work costs outweigh the extra income in all
                five scenarios. A higher salary, lower childcare fee, or fewer
                required care days would change this. See the table and
                interpretation below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Scenario comparison table ────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-text-main">
            Full scenario comparison
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Annual figures · Proposed FTE: {formatDollars(fteIncome)}/yr ·
            FY {ratesVersion} rates
          </p>
        </div>
        <div className="px-5 py-5">
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted py-2 pr-3 sticky left-0 bg-white z-10 min-w-[140px]" />
                  <th className="text-right text-xs font-medium py-2 px-2 min-w-[90px]">
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
                {/* Income section */}
                <TableSection label="Income" />
                <TableRow
                  label="Your income"
                  currentValue={formatDollars(current.grossIncome)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.grossIncome)}
                />
                <TableRow
                  label="Income tax"
                  currentValue={
                    current.tax.totalTax > 0
                      ? `−${formatDollars(current.tax.totalTax)}`
                      : '$0'
                  }
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) =>
                    s.tax.totalTax > 0 ? `−${formatDollars(s.tax.totalTax)}` : '$0'
                  }
                  muted
                />
                <TableRow
                  label="Net income"
                  currentValue={formatDollars(current.netIncome)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.netIncome)}
                  bold
                />

                {/* CCS & childcare section */}
                <TableSection label="CCS & Childcare Impact" />
                <TableRow
                  label="Combined family income"
                  currentValue={formatDollars(current.combinedFamilyIncome)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.combinedFamilyIncome)}
                  muted
                />
                <TableRow
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
                <TableRow
                  label="Childcare days/wk"
                  currentValue={`${daysPerWeek}d`}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => {
                    const childcareDays = Math.max(daysPerWeek, s.daysWorking);
                    const extra = childcareDays - daysPerWeek;
                    return (
                      <span>
                        {childcareDays}d
                        {extra > 0 && (
                          <span className="text-amber-600"> (+{extra})</span>
                        )}
                      </span>
                    );
                  }}
                  muted
                />
                <TableRow
                  label="Annual childcare cost"
                  currentValue={formatDollars(current.annualChildcareCost)}
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => formatDollars(s.annualChildcare.outOfPocketPerYear)}
                />
                <TableRow
                  label="Extra childcare cost"
                  currentValue="—"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => {
                    const extra =
                      s.annualChildcare.outOfPocketPerYear - current.annualChildcareCost;
                    if (extra <= 0)
                      return (
                        <span className="text-green-700">
                          −{formatDollars(Math.abs(extra))}
                        </span>
                      );
                    return <span className="text-red-600">+{formatDollars(extra)}</span>;
                  }}
                  muted
                />

                {/* Work costs section */}
                <TableSection label="Work Costs" />
                <TableRow
                  label="Work-related costs"
                  currentValue="—"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) =>
                    s.annualWorkCosts > 0 ? `−${formatDollars(s.annualWorkCosts)}` : '$0'
                  }
                  muted
                />

                {/* Result section */}
                <TableSection label="Result" />
                <TableRow
                  label="NET BENEFIT"
                  currentValue="Baseline"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) => (
                    <span
                      className={[
                        'font-bold',
                        s.netBenefit > 0
                          ? 'text-emerald-700'
                          : s.netBenefit < 0
                            ? 'text-red-600'
                            : 'text-muted',
                      ].join(' ')}
                    >
                      {s.netBenefit > 0 ? '+' : ''}
                      {formatDollars(s.netBenefit)}
                    </span>
                  )}
                  bold
                  highlight
                />
                <TableRow
                  label="Effective $/hr"
                  currentValue="—"
                  scenarios={scenarios}
                  bestDay={bestScenario?.daysWorking}
                  renderCell={(s) =>
                    s.effectiveHourlyRate !== null ? (
                      <span
                        className={
                          s.effectiveHourlyRate > 0 ? 'text-emerald-700' : 'text-red-600'
                        }
                      >
                        {formatDollarsAndCents(s.effectiveHourlyRate)}
                      </span>
                    ) : (
                      '—'
                    )
                  }
                />
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            * Childcare days: you need max(current days, working days) of care each week.
            Work costs are proportional to days worked.
          </p>
        </div>
      </div>

      {/* ── "What This Means" interpretation ────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-text-main">
            What this means for your family
          </h2>
        </div>
        <div className="px-5 py-5">
          {bestScenario ? (
            <InterpretationPositive
              current={current}
              best={bestScenario}
              scenarios={scenarios}
              fteIncome={fteIncome}
              isCurrentlyWorking={isCurrentlyWorking}
            />
          ) : (
            <InterpretationNegative
              current={current}
              scenarios={scenarios}
              fteIncome={fteIncome}
            />
          )}
        </div>
      </div>

      {/* ── Non-financial caveat ─────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-1 py-2">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-muted leading-relaxed">
          This analysis covers <strong>short-term financial impact only</strong>.
          Career progression, superannuation contributions, social connection,
          professional development, and personal fulfilment are all real and
          valuable — and are not captured by these numbers. Many parents find
          returning to work worthwhile for reasons that go well beyond the
          immediate financial equation.
        </p>
      </div>

      {/* ── Share + Edit + CTA ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden print:hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-bold text-text-main">Save or share your results</h3>
        </div>
        <div className="px-5 py-4 flex flex-wrap gap-3">
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
                Copy link to results
              </>
            )}
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
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
        <div className="flex items-center gap-4">
          <Link
            href="/back-to-work-calculator"
            className="text-sm font-medium text-muted hover:text-text-main transition-colors"
          >
            New calculation
          </Link>
          <Link
            href="/childcare-subsidy-calculator"
            className="text-sm font-medium text-primary hover:underline"
          >
            Full CCS calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}
