// =============================================================================
// GUIDES INDEX — /guides
// =============================================================================
// Lists all guide pages. Guides without a live route show a "Coming soon" badge.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `Childcare Subsidy Guides | ${SITE_NAME}`,
  description:
    'Plain-language guides to the Child Care Subsidy (CCS) — how it works, the income test, the 3-day guarantee, and whether returning to work is worth it financially.',
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    title: 'Childcare Subsidy Guides',
    description:
      'Plain-language guides to help Australian families understand the Child Care Subsidy, childcare costs, and the back-to-work decision.',
    url: `${SITE_URL}/guides`,
    type: 'website',
  },
};

// ─── Guide catalogue ─────────────────────────────────────────────────────────

interface Guide {
  href: string;
  title: string;
  description: string;
  readingTime: number;
  category: 'subsidy' | 'costs' | 'planning';
  live: boolean;
}

const CATEGORIES: Record<Guide['category'], { label: string; colour: string }> = {
  subsidy:  { label: 'CCS Explained',  colour: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  costs:    { label: 'Childcare Costs', colour: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  planning: { label: 'Back to Work',    colour: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
};

const GUIDES: Guide[] = [
  {
    href: '/guides/how-ccs-works',
    title: 'How the Child Care Subsidy Works',
    description:
      'A complete plain-language explainer — income test, hourly rate caps, activity test, 5% withholding, and how to apply. Includes worked examples.',
    readingTime: 10,
    category: 'subsidy',
    live: true,
  },
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'How the income thresholds and tapering formula work. Worked examples at key income levels plus common income sources people forget to include.',
    readingTime: 7,
    category: 'subsidy',
    live: true,
  },
  {
    href: '/guides/3-day-guarantee',
    title: 'The 3-Day Guarantee Explained',
    description:
      'What changed on 5 January 2026, who benefits, and what the 72-hours-per-fortnight rule means for your family in practice.',
    readingTime: 5,
    category: 'subsidy',
    live: true,
  },
  {
    href: '/guides/activity-test-explained',
    title: 'Activity Test Explained',
    description:
      'How the CCS activity test determines how many subsidised hours you can access — and what counts as recognised activity.',
    readingTime: 5,
    category: 'subsidy',
    live: false,
  },
  {
    href: '/guides/childcare-subsidy-multiple-children',
    title: 'CCS for Multiple Children',
    description:
      'How the higher rate works for second and subsequent children aged 5 or under — and how much your family can save.',
    readingTime: 6,
    category: 'subsidy',
    live: false,
  },
  {
    href: '/guides/back-to-work-childcare',
    title: 'Is It Worth Going Back to Work?',
    description:
      'The real financial calculation: income versus tax, reduced CCS, extra childcare days, and work costs. Three detailed worked examples.',
    readingTime: 12,
    category: 'planning',
    live: true,
  },
  {
    href: '/guides/childcare-types-compared',
    title: 'Types of Childcare Compared',
    description:
      'Centre-based day care vs family day care vs OSHC vs in-home care — costs, pros and cons, and how CCS differs for each.',
    readingTime: 7,
    category: 'costs',
    live: false,
  },
  {
    href: '/guides/childcare-costs-by-state',
    title: 'Childcare Costs by State',
    description:
      'Average daily fees by state and territory for centre-based day care, family day care, and OSHC — plus why costs vary by location.',
    readingTime: 6,
    category: 'costs',
    live: false,
  },
  {
    href: '/guides/government-vs-private-childcare',
    title: 'Government vs Private Childcare',
    description:
      "What the ACCC found: not-for-profit centres cost ~8% less. How to compare quality ratings (NQS) and whether fee levels affect CCS.",
    readingTime: 7,
    category: 'costs',
    live: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidesIndexPage() {
  const liveGuides  = GUIDES.filter((g) => g.live);
  const soonGuides  = GUIDES.filter((g) => !g.live);

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-teal-200">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true" className="text-teal-300">›</li>
              <li className="text-white font-medium" aria-current="page">Guides</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white mb-3">
            Childcare Subsidy Guides
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-2xl">
            Plain-language guides to help Australian families understand the Child Care Subsidy,
            compare childcare costs, and make confident decisions about returning to work.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Calculator CTA strip */}
        <div className="mb-10 flex flex-col sm:flex-row gap-3 p-5 bg-card border border-border rounded-xl items-start sm:items-center justify-between">
          <div>
            <p className="font-semibold text-text-main text-sm">Ready to calculate your costs?</p>
            <p className="text-sm text-muted mt-0.5">Get a personalised estimate in about 2 minutes.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Link
              href="/childcare-subsidy-calculator"
              className="inline-block bg-primary text-white font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-cyan-800 transition-colors text-center"
            >
              CCS Calculator →
            </Link>
            <Link
              href="/back-to-work-calculator"
              className="inline-block border border-primary text-primary font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-teal-50 transition-colors text-center"
            >
              Back-to-Work Calculator →
            </Link>
          </div>
        </div>

        {/* Live guides (shown first if any exist) */}
        {liveGuides.length > 0 && (
          <section className="mb-10" aria-labelledby="live-heading">
            <h2 id="live-heading" className="text-xl font-semibold text-text-main mb-4">
              Guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {liveGuides.map((guide) => (
                <GuideCard key={guide.href} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {/* Coming soon guides */}
        {soonGuides.length > 0 && (
          <section aria-labelledby="soon-heading">
            <h2 id="soon-heading" className="text-xl font-semibold text-text-main mb-1">
              {liveGuides.length > 0 ? 'Coming Soon' : 'Guides'}
            </h2>
            {liveGuides.length === 0 && (
              <p className="text-sm text-muted mb-4">
                Our guides are being written now — check back shortly.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              {soonGuides.map((guide) => (
                <GuideCard key={guide.href} guide={guide} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ─── Guide card ───────────────────────────────────────────────────────────────

function GuideCard({ guide }: { guide: Guide }) {
  const cat = CATEGORIES[guide.category];

  const inner = (
    <div
      className={[
        'h-full p-5 bg-card border border-border rounded-xl transition-all',
        guide.live ? 'hover:border-primary hover:shadow-sm cursor-pointer group' : 'opacity-75',
      ].join(' ')}
    >
      {/* Category + coming-soon badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.colour}`}>
          {cat.label}
        </span>
        {!guide.live && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-muted">
            Coming soon
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className={[
          'font-semibold text-base leading-snug mb-2',
          guide.live ? 'text-text-main group-hover:text-primary' : 'text-text-main',
        ].join(' ')}
      >
        {guide.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed">{guide.description}</p>

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {guide.readingTime} min read
        </span>
        {guide.live && (
          <span className="text-sm text-primary font-medium">Read guide →</span>
        )}
      </div>
    </div>
  );

  // Wrap in Link only if the guide is live
  return guide.live ? (
    <Link href={guide.href} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full">{inner}</div>
  );
}
