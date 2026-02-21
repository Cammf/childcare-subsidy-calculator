// =============================================================================
// HOMEPAGE — Child Care Subsidy Calculator
// =============================================================================
// Server component. Structure (adapted from aged-care-estimator homepage):
//   1. Hero — dual CTA (CCS calculator + Back-to-Work calculator)
//   2. Trust bar — 4 badges
//   3. Quick-answer stat cards — max rate %, avg daily fee, typical out-of-pocket
//   4. "What this site helps you understand" — 3 value-prop blocks
//   5. Popular guides — 4 article cards
//   6. Bottom CTA
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Child Care Subsidy Calculator Australia 2025–26 | ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Child Care Subsidy Calculator Australia 2025–26',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
};

// ─── Static data ─────────────────────────────────────────────────────────────

const stats = [
  {
    figure: 'Up to 90%',
    label: 'Maximum CCS rate',
    note: 'Families earning under $85,279/year qualify for the maximum subsidy — the government pays up to 90% of your childcare fee.',
    highlight: false,
  },
  {
    figure: '~$150/day',
    label: 'Average centre-based fee',
    note: 'National average before your CCS is applied. State averages range from ~$120/day (NT) to ~$175/day (ACT).',
    highlight: true,
  },
  {
    figure: '$3k–$12k/yr',
    label: 'Typical annual out-of-pocket',
    note: 'After CCS — varies widely by family income, care type, provider fee, and days per week in care.',
    highlight: false,
  },
];

const trustItems = [
  { icon: '✓', text: 'Free — no registration required' },
  { icon: '✓', text: 'Based on official government rates' },
  { icon: '✓', text: 'FY 2025–26 rates' },
  { icon: '✓', text: 'Takes about 2 minutes' },
];

const valueProps = [
  {
    title: 'Your exact CCS rate and what childcare will cost',
    body: 'The subsidy depends on your combined family income, care type, and provider fee. We calculate the precise rate that applies to you — not a range — and show your exact weekly and annual gap fee.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'How your income affects childcare costs — and when',
    body: 'Every $5,000 above $85,279 reduces your CCS by 1%. Our income sensitivity table shows exactly where you sit, what costs jump at key income levels, and how much a pay rise really costs after childcare.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Whether going back to work is financially worthwhile',
    body: 'Tax, reduced CCS, extra childcare days, and work costs all erode the value of a salary. Our Back-to-Work Calculator shows your real net benefit — for 1, 2, 3, 4, and 5 day scenarios — so you can find the sweet spot.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const popularGuides = [
  {
    href: '/guides/how-ccs-works',
    title: 'How the Child Care Subsidy Works',
    description:
      'A complete plain-language guide: income test, hourly rate caps, activity test, the 3-day guarantee, and 5% withholding — with worked examples.',
    tag: 'Most read',
  },
  {
    href: '/guides/back-to-work-childcare',
    title: 'Is Going Back to Work Worth It?',
    description:
      'The real calculation: income minus tax, CCS reduction, extra childcare days, and work costs. Three worked examples at low, mid, and high income levels.',
    tag: 'Popular',
  },
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'How the income taper works, which income sources count, worked examples at every key threshold, and how to estimate your family income correctly.',
    tag: 'Popular',
  },
  {
    href: '/guides/3-day-guarantee',
    title: 'The 3-Day Guarantee (From January 2026)',
    description:
      'What changed on 5 January 2026: 72 hours of guaranteed care per fortnight regardless of activity test — who benefits and what it means in practice.',
    tag: 'New',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="bg-primary" aria-labelledby="hero-heading">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-teal-200 text-sm font-medium mb-3 uppercase tracking-wide">
            FY 2025–26 rates · Free · No registration
          </p>
          <h1
            id="hero-heading"
            className="text-white font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}
          >
            What Will Childcare Actually Cost Your Family?
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Enter your family income, care type, and provider fee.
            Get your exact Child Care Subsidy rate and annual out-of-pocket
            cost in under 2 minutes — no login, no sales calls.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/childcare-subsidy-calculator"
              className="w-full sm:w-auto inline-block bg-white text-primary font-bold px-8 py-4 rounded-lg text-base hover:bg-teal-50 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40 min-h-[52px]"
            >
              Calculate my CCS →
            </Link>
            <Link
              href="/back-to-work-calculator"
              className="w-full sm:w-auto inline-block bg-teal-700 text-white font-semibold px-7 py-4 rounded-lg text-base hover:bg-teal-800 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30 border border-teal-600 min-h-[52px]"
            >
              Is returning to work worth it?
            </Link>
          </div>

          <p className="text-teal-300 text-xs mt-5">
            Based on official Services Australia and education.gov.au rates · Not financial advice
          </p>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-border" aria-label="Trust indicators">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {trustItems.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-sm text-muted">
                <span className="text-primary font-bold text-base">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── QUICK ANSWER STATS ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-14" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-h2 text-text-main text-center mb-2">
          What Does Childcare Cost in Australia?
        </h2>
        <p className="text-muted text-center mb-8 max-w-xl mx-auto">
          These figures are based on the current government rates. Your family&apos;s
          actual cost depends on your income, care type, and provider fee — use
          the calculator for your personalised figure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`card text-center ${stat.highlight ? 'border-primary border-2' : ''}`}
            >
              <p
                className="font-bold text-primary mb-1"
                style={{ fontSize: '28px', lineHeight: 1.2 }}
              >
                {stat.figure}
              </p>
              <p className="font-semibold text-text-main text-sm mb-2">{stat.label}</p>
              <p className="text-muted text-xs leading-relaxed">{stat.note}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 text-sm text-muted">
          Your exact out-of-pocket cost depends on your circumstances.{' '}
          <Link
            href="/childcare-subsidy-calculator"
            className="text-primary hover:underline font-medium"
          >
            Get your personalised estimate →
          </Link>
        </p>
      </section>

      {/* ── AD SLOT PLACEHOLDER ──────────────────────────────────────────────── */}
      <div className="ad-slot hidden" aria-hidden="true" />

      {/* ── VALUE PROPS ─────────────────────────────────────────────────────── */}
      <section
        className="bg-white border-y border-border"
        aria-labelledby="value-props-heading"
      >
        <div className="max-w-4xl mx-auto px-4 py-14">
          <h2 id="value-props-heading" className="text-h2 text-text-main text-center mb-2">
            What This Site Helps You Understand
          </h2>
          <p className="text-muted text-center mb-10 max-w-xl mx-auto">
            The three questions every parent asks — answered clearly, with your real numbers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-primary flex-shrink-0">
                  {prop.icon}
                </div>
                <h3 className="font-semibold text-text-main text-base leading-snug">
                  {prop.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{prop.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link href="/childcare-subsidy-calculator" className="btn-primary inline-block">
              Calculate my CCS →
            </Link>
            <Link
              href="/back-to-work-calculator"
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              Back-to-Work Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* ── POPULAR GUIDES ──────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-14" aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="text-h2 text-text-main mb-2">
          Popular Guides
        </h2>
        <p className="text-muted mb-8">
          Plain-language explainers on the childcare subsidy topics that matter most to Australian families.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="card block hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-primary bg-teal-50 px-2 py-0.5 rounded">
                  {guide.tag}
                </span>
              </div>
              <h3 className="font-semibold text-text-main group-hover:text-primary transition-colors mb-2 leading-snug">
                {guide.title} →
              </h3>
              <p className="text-sm text-muted leading-relaxed">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-primary" aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h2 id="cta-heading" className="text-white font-bold text-2xl mb-3">
            Ready to see your exact figure?
          </h2>
          <p className="text-teal-100 mb-6">
            Answer a few quick questions about your income, care type, and fee.
            Get your CCS rate, gap fee, and annual cost — free, in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/childcare-subsidy-calculator"
              className="w-full sm:w-auto inline-block bg-white text-primary font-bold px-8 py-4 rounded-lg text-base hover:bg-teal-50 transition-colors min-h-[52px]"
            >
              Start the CCS Calculator →
            </Link>
            <Link
              href="/back-to-work-calculator"
              className="w-full sm:w-auto inline-block bg-teal-700 text-white font-semibold px-7 py-4 rounded-lg text-base hover:bg-teal-800 transition-colors border border-teal-600 min-h-[52px]"
            >
              Back-to-Work Calculator →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
