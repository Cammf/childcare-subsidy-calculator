// =============================================================================
// ABOUT PAGE — Child Care Subsidy Calculator
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `About This Site | ${SITE_NAME}`,
  description:
    'About the Child Care Subsidy Calculator — how it works, where the data comes from, and how to use it to understand your family\'s childcare costs.',
  alternates: { canonical: `${SITE_URL}/about` },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const dataSources = [
  {
    name: 'Services Australia — Child Care Subsidy',
    url: 'https://www.servicesaustralia.gov.au/child-care-subsidy',
    description:
      'Official CCS income thresholds, subsidy percentages, withholding rules, and eligibility criteria.',
  },
  {
    name: 'Department of Education — Childcare',
    url: 'https://www.education.gov.au/early-childhood/child-care-subsidy',
    description:
      'Hourly rate caps by care type and age group; 3-Day Guarantee rules effective January 2026.',
  },
  {
    name: 'Australian Bureau of Statistics',
    url: 'https://www.abs.gov.au',
    description:
      'State-level average childcare fees (centre-based day care, family day care, OSHC).',
  },
  {
    name: 'ACCC — Childcare Enquiry',
    url: 'https://www.accc.gov.au/consumers/industries/childcare',
    description:
      'Fee benchmarks and cost trends used to inform state average fee figures.',
  },
  {
    name: 'Australian Taxation Office',
    url: 'https://www.ato.gov.au',
    description:
      'FY 2025–26 income tax brackets, Medicare levy rates, and Low Income Tax Offset — used in the Back-to-Work Calculator.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-text-main sm:text-3xl">About This Site</h1>
          <p className="mt-2 text-base text-muted">
            What we do, where the data comes from, and what this site is (and isn&apos;t).
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        {/* Purpose */}
        <section aria-labelledby="purpose-heading">
          <h2 id="purpose-heading" className="text-lg font-bold text-text-main mb-3">
            What This Site Does
          </h2>
          <div className="rounded-2xl border border-border bg-white p-6 space-y-3 text-sm text-text-main leading-relaxed">
            <p>
              The Child Care Subsidy Calculator helps Australian families understand
              exactly how the Child Care Subsidy (CCS) applies to their situation —
              without needing to log into myGov or wade through government documentation.
            </p>
            <p>
              Enter your family income, care type, and provider fee to instantly see:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted">
              <li>Your exact CCS percentage (standard or higher rate for multiple children)</li>
              <li>Your weekly and annual out-of-pocket cost after subsidy</li>
              <li>How your costs change at different income levels (income sensitivity table)</li>
              <li>Whether returning to work is financially worthwhile, net of tax, reduced CCS, and work costs</li>
            </ul>
            <p>
              All calculations run in your browser. We do not store any personal
              information you enter.
            </p>
          </div>
        </section>

        {/* What it isn't */}
        <section aria-labelledby="disclaimer-heading">
          <h2 id="disclaimer-heading" className="text-lg font-bold text-text-main mb-3">
            What This Site Is Not
          </h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-3 text-sm leading-relaxed">
            <p className="font-medium text-amber-900">
              This site provides estimates and general information only — not financial advice.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li>
                We are not affiliated with Services Australia, the Department of Education,
                or any government body.
              </li>
              <li>
                Results are estimates based on published rate data. Your actual CCS may
                differ depending on activity test outcomes, withholding reconciliation,
                and provider-specific fee arrangements.
              </li>
              <li>
                The Back-to-Work analysis covers financial impact only. Career development,
                superannuation, mental health, and personal fulfilment are real considerations
                not captured by these numbers.
              </li>
              <li>
                Always verify your entitlements directly with{' '}
                <a
                  href="https://www.servicesaustralia.gov.au/child-care-subsidy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-900"
                >
                  Services Australia
                </a>{' '}
                before making financial decisions.
              </li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="methodology-heading">
          <h2 id="methodology-heading" className="text-lg font-bold text-text-main mb-3">
            How the Calculations Work
          </h2>
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4 text-sm text-text-main leading-relaxed">
            <div>
              <h3 className="font-semibold mb-1">CCS percentage</h3>
              <p className="text-muted">
                For families earning at or below $85,279, the maximum 90% rate applies.
                Above this threshold, the rate reduces by 1 percentage point for every
                $5,000 of additional income, reaching 0% at $535,279. This matches the
                published Services Australia formula exactly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Higher rate (multiple children)</h3>
              <p className="text-muted">
                Families with two or more children under 6 in approved care receive the
                higher rate for younger children: the eldest child&apos;s standard rate plus
                30 percentage points, capped at 95%. This rule applies from 10 July 2023.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Hourly rate cap</h3>
              <p className="text-muted">
                CCS is calculated on the lesser of the actual fee charged or the
                government&apos;s hourly rate cap for the care type and child age. If your
                provider charges above the cap, you pay the full above-cap amount in
                addition to your gap fee.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">5% withholding</h3>
              <p className="text-muted">
                Services Australia withholds 5% of each CCS payment during the year
                as a buffer against overpayment. This is reconciled after your tax
                return. Our results show both the in-year gap fee (with withholding)
                and the true annual cost (after reconciliation).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Back-to-Work analysis</h3>
              <p className="text-muted">
                For each 1–5 day working scenario, we calculate proportional gross income,
                individual income tax (FY 2025–26 brackets with Medicare levy and LITO),
                new combined family income, resulting CCS rate, annual childcare cost at
                max(current days, working days) care per week, and proportional work costs.
                Net benefit = additional net income − extra childcare cost − work costs.
              </p>
            </div>
          </div>
        </section>

        {/* Data sources */}
        <section aria-labelledby="data-heading">
          <h2 id="data-heading" className="text-lg font-bold text-text-main mb-3">
            Data Sources
          </h2>
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <ul className="divide-y divide-border">
              {dataSources.map((source) => (
                <li key={source.url} className="px-6 py-4">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {source.name} ↗
                  </a>
                  <p className="text-sm text-muted mt-0.5 leading-relaxed">
                    {source.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-xs text-muted px-1">
            All rate data is verified against official government sources and updated
            at the start of each financial year (1 July). Current rates are effective
            from 1 July 2025.
          </p>
        </section>

        {/* When rates update */}
        <section aria-labelledby="updates-heading">
          <h2 id="updates-heading" className="text-lg font-bold text-text-main mb-3">
            When Rates Are Updated
          </h2>
          <div className="rounded-2xl border border-border bg-white p-6 text-sm text-text-main leading-relaxed space-y-2">
            <p>
              CCS income thresholds and hourly rate caps are updated by the government
              on <strong>1 July each year</strong> for the new financial year.
              We update this site&apos;s data files and verify all calculations in
              early July when the new rates are confirmed.
            </p>
            <p className="text-muted">
              This site currently uses <strong>FY 2025–26 rates</strong>, effective
              from 1 July 2025. Income tax brackets reflect the FY 2025–26 Schedule 1
              rates published by the ATO, including the revised Stage 3 rate adjustments.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-2 pb-6">
          <Link href="/childcare-subsidy-calculator" className="btn-primary inline-block">
            Use the CCS Calculator →
          </Link>
        </div>

      </div>
    </main>
  );
}
