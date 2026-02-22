// =============================================================================
// GUIDE: CCS for Multiple Children — The Higher Rate Explained
// =============================================================================
// Covers the higher CCS rate for younger children in multi-child families.
// Targets "childcare subsidy multiple children", "higher CCS rate second child",
// "childcare subsidy younger child" queries.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `CCS for Multiple Children — Higher Rate Explained 2025–26 | ${SITE_NAME}`,
  description:
    'How the higher Child Care Subsidy rate works for families with 2+ children in care. The second child gets standard rate + 30 percentage points (capped at 95%). Worked examples for 2 and 3 children.',
  alternates: { canonical: `${SITE_URL}/guides/childcare-subsidy-multiple-children` },
  openGraph: {
    title: 'CCS for Multiple Children \u2014 Higher Rate Explained 2025\u201326',
    description:
      'Second and subsequent children in care get a higher CCS rate \u2014 up to 95%. See how much your family can save with worked examples.',
    url: `${SITE_URL}/guides/childcare-subsidy-multiple-children`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'how-the-higher-rate-works',  label: 'How the higher rate works' },
  { id: 'eligibility',                label: 'Who qualifies' },
  { id: 'which-child-gets-which',     label: 'Which child gets which rate' },
  { id: 'higher-rate-table',          label: 'Higher rate at every income level' },
  { id: 'worked-example-2-children',  label: 'Worked example: 2 children' },
  { id: 'worked-example-3-children',  label: 'Worked example: 3 children' },
  { id: 'age-out-rules',             label: 'When the higher rate stops' },
  { id: 'annual-cap',                label: 'Annual subsidy cap for multiple children' },
  { id: 'how-to-claim',              label: 'How to claim the higher rate' },
  { id: 'common-questions',          label: 'Common questions' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'How much extra CCS do you get for a second child?',
    answer:
      "The second child (and any subsequent children) in approved care receives an additional 30 percentage points on top of the standard CCS rate, capped at 95%. For example, if your standard rate is 77%, the younger child's rate is min(77% + 30%, 95%) = 95%. If your standard rate is 70%, the younger child gets min(70% + 30%, 95%) = 95%. If your standard rate is 50%, the younger child gets 80%.",
  },
  {
    question: 'Does the higher rate apply to the older or younger child?',
    answer:
      "The <strong>eldest child</strong> currently in approved care always receives the standard CCS rate. All <strong>younger children</strong> in approved care receive the higher rate. If you have 3 children in care, the eldest gets the standard rate and the other two get the higher rate.",
  },
  {
    question: 'Does the higher rate apply if my second child is over 5?',
    answer:
      "No. The higher rate only applies to children aged 5 or under (not yet at school). Once a child turns 6 or starts school, they move to the standard rate. The higher rate is specifically designed for the early childhood years when childcare costs are highest.",
  },
  {
    question: 'When did the higher CCS rate start?',
    answer:
      "The higher CCS rate for multiple children took effect on <strong>10 July 2023</strong>. It was introduced as part of the government's Cheaper Child Care reforms alongside the increase in the maximum CCS rate from 85% to 90%.",
  },
  {
    question: 'Do I need to apply separately for the higher rate?',
    answer:
      "No. If you already receive CCS for multiple children, the higher rate is applied automatically by Services Australia. You don't need to submit a separate application. Just ensure all your children are listed on your CCS claim and their enrolments with approved providers are confirmed.",
  },
  {
    question: 'What if only one of my children is in childcare?',
    answer:
      "You need at least two children currently enrolled in approved childcare for the higher rate to apply. If only one child is in care (even if you have other children at home or school), that child receives the standard CCS rate.",
  },
  {
    question: 'Does the higher rate affect the annual subsidy cap?',
    answer:
      "No. The annual subsidy cap of $11,003 per child (for families earning above $85,279) applies independently to each child. The higher rate increases the per-session subsidy, which means a child on the higher rate will reach their annual cap sooner if the family's income is above $85,279.",
  },
  {
    question: 'Can the higher rate exceed 95%?',
    answer:
      "No. The higher rate is capped at 95% regardless of the calculation. Even if a family's standard rate is 90% and you add 30 percentage points, the result is capped at 95%, not 120%. The maximum CCS percentage for any child is 95%.",
  },
];

// ─── Related guides ──────────────────────────────────────────────────────────

const RELATED = [
  {
    href: '/guides/how-ccs-works',
    title: 'How the CCS Works',
    description:
      'The complete guide to the income test, hourly rate caps, activity test, withholding, and how to apply.',
  },
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'How the tapering formula determines your standard CCS rate at every income level.',
  },
  {
    href: '/guides/3-day-guarantee',
    title: 'The 3-Day Guarantee Explained',
    description:
      'From 5 January 2026, every family gets at least 72 subsidised hours per fortnight per child.',
  },
];

// ─── Higher rate data for the income table ────────────────────────────────────

const INCOME_RATE_TABLE = [
  { income: '$60,000',   standard: 90, higher: 95, note: 'Max standard rate' },
  { income: '$85,279',   standard: 90, higher: 95, note: 'CCS floor (no taper below)' },
  { income: '$100,000',  standard: 87, higher: 95, note: '' },
  { income: '$120,000',  standard: 83, higher: 95, note: '' },
  { income: '$150,000',  standard: 77, higher: 95, note: '' },
  { income: '$180,000',  standard: 71, higher: 95, note: '' },
  { income: '$200,000',  standard: 67, higher: 95, note: 'Higher rate still maxed at 95%' },
  { income: '$250,000',  standard: 57, higher: 87, note: '' },
  { income: '$300,000',  standard: 47, higher: 77, note: '' },
  { income: '$350,000',  standard: 37, higher: 67, note: '' },
  { income: '$400,000',  standard: 27, higher: 57, note: '' },
  { income: '$450,000',  standard: 17, higher: 47, note: '' },
  { income: '$500,000',  standard: 7,  higher: 37, note: '' },
  { income: '$535,279+', standard: 0,  higher: 30, note: 'Standard rate = 0, higher still 30%' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MultipleChildrenGuidePage() {
  return (
    <GuideLayout
      title="CCS for Multiple Children"
      description="Families with two or more children in approved childcare receive a higher CCS rate on younger children &mdash; up to 95% subsidy. Here&rsquo;s how the higher rate works, who qualifies, when it stops, and how much your family can save."
      lastUpdated="2026-02-22"
      readingTimeMinutes={6}
      breadcrumbs={[{ label: 'CCS for Multiple Children' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/childcare-subsidy-multiple-children"
    >

      {/* ================================================================== */}
      {/* HOW THE HIGHER RATE WORKS                                          */}
      {/* ================================================================== */}
      <h2 id="how-the-higher-rate-works">How the higher rate works</h2>

      <p>
        Since <strong>10 July 2023</strong>, families with two or more children in approved
        childcare receive a <strong>higher CCS rate</strong> on their younger children. The
        formula is straightforward:
      </p>

      <div className="not-prose my-6 rounded-xl bg-primary/5 border border-primary/20 px-5 py-5">
        <p className="text-base font-bold text-primary mb-2">
          Higher CCS rate formula
        </p>
        <p className="text-lg font-mono text-text-main">
          Higher rate = min(standard rate + 30pp, 95%)
        </p>
        <p className="text-sm text-muted mt-2">
          Where &ldquo;standard rate&rdquo; is the CCS percentage based on your family income
          (the same rate the eldest child receives), and 30pp means 30 percentage points.
        </p>
      </div>

      <p>
        The 30-percentage-point boost means most families with combined income under about
        $200,000 will see their younger children receive the <strong>maximum 95% CCS rate</strong>.
        Even families earning $535,279+ (where the standard rate drops to 0%) still receive
        a 30% CCS rate on younger children.
      </p>

      {/* ================================================================== */}
      {/* ELIGIBILITY                                                        */}
      {/* ================================================================== */}
      <h2 id="eligibility">Who qualifies</h2>

      <p>
        The higher rate applies when <strong>all three</strong> of these conditions are met:
      </p>

      <ol>
        <li>
          <strong>Two or more children in approved care:</strong> At least two of your children
          must be currently enrolled and attending approved childcare (any type &mdash;
          centre-based, family day care, OSHC, or in-home care).
        </li>
        <li>
          <strong>Younger child is aged 5 or under:</strong> The child receiving the higher
          rate must not yet have started school. Once they turn 6 or begin school, they revert
          to the standard rate.
        </li>
        <li>
          <strong>Standard CCS eligibility:</strong> The family must meet the normal CCS
          requirements (Australian residency, child immunised, using an approved provider).
        </li>
      </ol>

      <div className="callout">
        <strong>Key point:</strong> The children don&apos;t need to attend the same provider
        or even the same type of care. One child in centre-based day care and another in
        family day care still qualifies the younger child for the higher rate.
      </div>

      {/* ================================================================== */}
      {/* WHICH CHILD GETS WHICH                                             */}
      {/* ================================================================== */}
      <h2 id="which-child-gets-which">Which child gets which rate</h2>

      <p>
        The rule is simple and based on birth order among children currently in approved care:
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">Child</th>
              <th className="text-left px-4 py-3 font-semibold">Rate applied</th>
              <th className="text-left px-4 py-3 font-semibold">Condition</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main">Eldest in care</td>
              <td className="px-4 py-3 text-text-main">Standard rate</td>
              <td className="px-4 py-3 text-muted">Always the standard income-based rate</td>
            </tr>
            <tr className="border-b border-border bg-emerald-50/50 dark:bg-emerald-900/10">
              <td className="px-4 py-3 font-medium text-text-main">2nd child in care</td>
              <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                Higher rate (up to 95%)
              </td>
              <td className="px-4 py-3 text-muted">Must be aged 5 or under</td>
            </tr>
            <tr className="border-b border-border bg-emerald-50/50 dark:bg-emerald-900/10">
              <td className="px-4 py-3 font-medium text-text-main">3rd child in care</td>
              <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                Higher rate (up to 95%)
              </td>
              <td className="px-4 py-3 text-muted">Must be aged 5 or under</td>
            </tr>
            <tr className="border-b border-border bg-emerald-50/50 dark:bg-emerald-900/10">
              <td className="px-4 py-3 font-medium text-text-main">4th+ child in care</td>
              <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                Higher rate (up to 95%)
              </td>
              <td className="px-4 py-3 text-muted">Must be aged 5 or under</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <strong>Example:</strong> If you have 3 children in care (ages 7, 4, and 2), the
        7-year-old is the eldest and gets the standard rate. The 4-year-old and 2-year-old
        both get the higher rate because they&apos;re aged 5 or under.
      </p>

      {/* ================================================================== */}
      {/* HIGHER RATE TABLE                                                  */}
      {/* ================================================================== */}
      <h2 id="higher-rate-table">Higher rate at every income level</h2>

      <p>
        The table below shows the standard rate (eldest child) and higher rate (younger children)
        at key income levels. The higher rate is simply the standard rate + 30 percentage points,
        capped at 95%.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">Family income</th>
              <th className="text-right px-4 py-3 font-semibold">Standard rate<br/>(eldest)</th>
              <th className="text-right px-4 py-3 font-semibold">Higher rate<br/>(younger)</th>
              <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Boost</th>
            </tr>
          </thead>
          <tbody>
            {INCOME_RATE_TABLE.map((row, i) => (
              <tr key={row.income} className={`border-b border-border ${i % 2 === 1 ? 'bg-background' : ''}`}>
                <td className="px-4 py-2.5 font-medium text-text-main">
                  {row.income}
                  {row.note && <span className="block text-xs text-muted font-normal">{row.note}</span>}
                </td>
                <td className="px-4 py-2.5 text-right text-text-main tabular-nums">{row.standard}%</td>
                <td className="px-4 py-2.5 text-right text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                  {row.higher}%
                </td>
                <td className="px-4 py-2.5 text-right text-muted tabular-nums hidden sm:table-cell">
                  +{row.higher - row.standard}pp
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted mt-2">
          pp = percentage points. Higher rate capped at 95%. Below $85,279, standard rate is 90%
          (the maximum), so higher rate is 95%.
        </p>
      </div>

      <div className="callout">
        <strong>Notice:</strong> For incomes below ~$200,000, the higher rate is capped at 95%
        regardless. The 30pp boost only produces a rate <em>below</em> 95% once the standard
        rate drops below 65% (around $210,000 income).
      </div>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE: 2 CHILDREN                                         */}
      {/* ================================================================== */}
      <h2 id="worked-example-2-children">Worked example: 2 children</h2>

      <p>
        <strong>The Patel family</strong> earns $150,000/year combined. They have two children
        in centre-based day care &mdash; Anika (4) and Ravi (2). Both attend 3 days/week at
        $150/day (10-hour sessions).
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold"></th>
              <th className="text-right px-4 py-3 font-semibold">Anika (4)<br/>Eldest &mdash; standard</th>
              <th className="text-right px-4 py-3 font-semibold">Ravi (2)<br/>Younger &mdash; higher</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">CCS rate</td>
              <td className="px-4 py-3 text-right text-text-main">77%</td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-semibold">95%</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">Daily fee</td>
              <td className="px-4 py-3 text-right text-text-main">$150.00</td>
              <td className="px-4 py-3 text-right text-text-main">$150.00</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">Rate cap (10 hrs &times; $14.63)</td>
              <td className="px-4 py-3 text-right text-muted">$146.30</td>
              <td className="px-4 py-3 text-right text-muted">$146.30</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">CCS subsidy / day</td>
              <td className="px-4 py-3 text-right text-text-main">$112.65</td>
              <td className="px-4 py-3 text-right text-text-main">$138.99</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">Above-cap amount / day</td>
              <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">$3.70</td>
              <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">$3.70</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">Gap fee / day</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$37.35</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$11.01</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold text-text-main">Annual gap fee (3d/wk, 48 wks)</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$5,378</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$1,585</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-background">
              <td colSpan={2} className="px-4 py-3 text-right font-semibold text-text-main">
                Combined family annual gap fee
              </td>
              <td className="px-4 py-3 text-right font-bold text-text-main text-lg">
                $6,963
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p>
        <strong>What if both children were on the standard 77% rate?</strong> Ravi&apos;s gap
        fee would be $37.35/day instead of $11.01/day. That&apos;s an extra $26.34/day, or{' '}
        <strong>$3,793 more per year</strong>.
      </p>

      <div className="not-prose my-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4">
        <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">
          Higher rate saving: $3,793/year
        </p>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          The Patel family saves $3,793/year on Ravi&apos;s care thanks to the higher CCS rate.
          That&apos;s $73/week less out of pocket.
        </p>
      </div>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE: 3 CHILDREN                                         */}
      {/* ================================================================== */}
      <h2 id="worked-example-3-children">Worked example: 3 children</h2>

      <p>
        <strong>The Williams family</strong> earns $120,000/year combined. They have three
        children in care &mdash; Lily (6, OSHC), Jack (4, centre-based), and Mia (2,
        centre-based). Lily attends OSHC 5 days/week at $48/session. Jack and Mia each attend
        centre-based care 3 days/week at $140/day.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold"></th>
              <th className="text-right px-4 py-3 font-semibold">Lily (6)<br/>Eldest &mdash; standard</th>
              <th className="text-right px-4 py-3 font-semibold">Jack (4)<br/>Higher rate</th>
              <th className="text-right px-4 py-3 font-semibold">Mia (2)<br/>Higher rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">CCS rate</td>
              <td className="px-4 py-3 text-right text-text-main">83%</td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-semibold">95%</td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-semibold">95%</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">Care type</td>
              <td className="px-4 py-3 text-right text-text-main">OSHC</td>
              <td className="px-4 py-3 text-right text-text-main">CBDC</td>
              <td className="px-4 py-3 text-right text-text-main">CBDC</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">Daily fee</td>
              <td className="px-4 py-3 text-right text-text-main">$48.00</td>
              <td className="px-4 py-3 text-right text-text-main">$140.00</td>
              <td className="px-4 py-3 text-right text-text-main">$140.00</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">Gap fee / day</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$8.16</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$7.00</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$7.00</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">Days per week</td>
              <td className="px-4 py-3 text-right text-text-main">5</td>
              <td className="px-4 py-3 text-right text-text-main">3</td>
              <td className="px-4 py-3 text-right text-text-main">3</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 font-semibold text-text-main">Annual gap fee (48 wks)</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$1,958</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$1,008</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$1,008</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-background">
              <td colSpan={3} className="px-4 py-3 text-right font-semibold text-text-main">
                Total family annual gap fee
              </td>
              <td className="px-4 py-3 text-right font-bold text-text-main text-lg">
                $3,974
              </td>
            </tr>
          </tfoot>
        </table>
        <p className="text-xs text-muted mt-2">
          Lily&apos;s gap = $48 &times; 17% = $8.16. Jack/Mia gap = $140 &times; 5% = $7.00
          (fee is below rate cap, so no above-cap amount).
        </p>
      </div>

      <p>
        Without the higher rate, Jack and Mia would each pay $140 &times; 17% = $23.80/day
        gap fee, for $3,427 each per year. The higher rate saves the Williams family:
      </p>

      <div className="not-prose my-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4">
        <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">
          Higher rate saving: $4,838/year
        </p>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          ($2,419 saved on Jack + $2,419 saved on Mia). That&apos;s $93/week less out of pocket
          across both younger children.
        </p>
      </div>

      {/* ================================================================== */}
      {/* AGE-OUT RULES                                                      */}
      {/* ================================================================== */}
      <h2 id="age-out-rules">When the higher rate stops</h2>

      <p>
        The higher rate stops for a child when any of the following happens:
      </p>

      <ul>
        <li>
          <strong>The child turns 6 or starts school</strong> &mdash; whichever comes first.
          Once the child is school-age, they receive the standard rate.
        </li>
        <li>
          <strong>The eldest child leaves approved care</strong> &mdash; if the eldest child
          stops attending (e.g. starts school with no OSHC), the next oldest becomes the
          &ldquo;eldest in care&rdquo; and drops to the standard rate.
        </li>
        <li>
          <strong>Only one child remains in care</strong> &mdash; the higher rate requires
          at least two children currently in approved care.
        </li>
      </ul>

      <div className="callout">
        <strong>Planning tip:</strong> If your eldest child is about to start school, consider
        whether OSHC enrolment would keep them &ldquo;in approved care&rdquo; and maintain the
        higher rate for younger siblings. Even 1&ndash;2 days of OSHC per week is enough to
        qualify. The OSHC gap fee may be far less than the saving on the younger child&apos;s
        higher rate.
      </div>

      {/* ================================================================== */}
      {/* ANNUAL CAP                                                         */}
      {/* ================================================================== */}
      <h2 id="annual-cap">Annual subsidy cap for multiple children</h2>

      <p>
        Families earning <strong>above $85,279</strong> are subject to an annual CCS cap of{' '}
        <strong>$11,003 per child</strong>. This cap applies independently to each child &mdash;
        it is <em>not</em> a family-wide cap.
      </p>

      <p>
        Children on the higher rate receive more subsidy per session, which means they may
        reach their $11,003 annual cap earlier in the financial year. If a child hits their cap
        before the end of the year, CCS stops for that child until the new financial year begins.
      </p>

      <p>
        For the Patel family example above (2 children, $150,000 income):
      </p>

      <ul>
        <li>
          <strong>Anika (77% rate):</strong> Annual CCS = $112.65/day &times; 3 days
          &times; 48 weeks = $16,222. This exceeds the $11,003 cap, so Anika&apos;s CCS
          would be limited.
        </li>
        <li>
          <strong>Ravi (95% rate):</strong> Annual CCS = $138.99/day &times; 3 days
          &times; 48 weeks = $20,015. This also exceeds the cap, and Ravi&apos;s CCS hits
          the ceiling even earlier due to the higher rate.
        </li>
      </ul>

      <p>
        Families earning <strong>$85,279 or below</strong> have <strong>no annual cap</strong>,
        so the higher rate applies fully all year.
      </p>

      {/* ================================================================== */}
      {/* HOW TO CLAIM                                                       */}
      {/* ================================================================== */}
      <h2 id="how-to-claim">How to claim the higher rate</h2>

      <p>
        The higher rate is applied <strong>automatically</strong> by Services Australia. There
        is no separate application or form. To ensure it&apos;s applied correctly:
      </p>

      <ol>
        <li>
          <strong>All children must be on your CCS claim:</strong> Log in to{' '}
          <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer">myGov</a>{' '}
          and check that all children in care are listed.
        </li>
        <li>
          <strong>Enrolments must be confirmed:</strong> Each child&apos;s provider must have
          confirmed their enrolment. Check your CCS balance statement for each child.
        </li>
        <li>
          <strong>Income estimate must be current:</strong> The higher rate is based on your
          standard rate, which is based on your income estimate. An outdated estimate can
          lead to overpayment and a debt at reconciliation.
        </li>
      </ol>

      <p>
        Use the <Link href="/childcare-subsidy-calculator">CCS Calculator</Link> with
        &ldquo;2 children&rdquo; or &ldquo;3+ children&rdquo; selected to see the higher rate
        applied automatically to your younger child&apos;s costs.
      </p>

    </GuideLayout>
  );
}
