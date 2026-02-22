// =============================================================================
// GUIDE: Government vs Private Childcare — Not-for-Profit vs For-Profit
// =============================================================================
// Nuanced interpretation of ACCC childcare inquiry data on cost and quality
// differences between not-for-profit and for-profit providers.
// Targets "not for profit childcare", "government vs private childcare",
// "childcare quality ratings NQS" queries.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Government vs Private Childcare — Not-for-Profit vs For-Profit | ${SITE_NAME}`,
  description:
    'ACCC data shows not-for-profit childcare centres charge ~8% less than private providers. Compare quality ratings, fee differences, and what it means for your CCS and out-of-pocket costs.',
  alternates: { canonical: `${SITE_URL}/guides/government-vs-private-childcare` },
  openGraph: {
    title: 'Government vs Private Childcare \u2014 Not-for-Profit vs For-Profit',
    description:
      'Not-for-profit centres cost ~8% less on average. How to compare quality ratings and whether provider type affects your CCS.',
    url: `${SITE_URL}/guides/government-vs-private-childcare`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'what-the-terms-mean',     label: 'What the terms actually mean' },
  { id: 'cost-differences',        label: 'Cost differences: the ACCC findings' },
  { id: 'quality-differences',     label: 'Quality ratings: NQS comparison' },
  { id: 'what-drives-costs',       label: 'What drives the fee difference' },
  { id: 'ccs-impact',              label: 'How provider type affects your CCS' },
  { id: 'rate-cap-strategy',       label: 'The rate cap strategy' },
  { id: 'how-to-check',            label: 'How to check a provider\u2019s type and rating' },
  { id: 'worked-example',          label: 'Worked example: same suburb, different providers' },
  { id: 'what-matters-most',       label: 'What actually matters when choosing' },
  { id: 'common-questions',        label: 'Common questions' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'Are not-for-profit childcare centres cheaper?',
    answer:
      "On average, yes. The ACCC's 2023 childcare inquiry found that not-for-profit centres charge approximately 8% less than for-profit (private) providers. For a centre charging $150/day, that's roughly $12/day or $2,880/year less on 5 days per week.",
  },
  {
    question: 'Is not-for-profit childcare better quality?',
    answer:
      "Not-for-profit centres are statistically more likely to have higher National Quality Standard (NQS) ratings. Around 28% of not-for-profit centres are rated 'Exceeding NQS' compared to about 13% of for-profit centres. However, many for-profit centres also achieve 'Exceeding' or 'Meeting NQS' ratings, so the correlation is not absolute.",
  },
  {
    question: 'What is the difference between government and private childcare?',
    answer:
      "In Australia, 'government childcare' usually refers to council-run or community-managed centres, which are not-for-profit. 'Private childcare' refers to for-profit providers, including large chains. Both are CCS-approved and regulated under the same National Quality Framework. The key differences are in fee levels (not-for-profit averages ~8% less) and how surplus revenue is used (reinvested vs distributed to shareholders).",
  },
  {
    question: 'Does the type of childcare centre affect my CCS?',
    answer:
      "No. Your CCS percentage is determined entirely by your family income. The provider type does not affect your subsidy rate. However, the provider's daily fee relative to the CCS hourly rate cap affects your out-of-pocket cost. If a not-for-profit charges below the cap while a for-profit charges above it, your gap fee will be significantly lower at the not-for-profit.",
  },
  {
    question: 'How do I know if a childcare centre is not-for-profit?',
    answer:
      "Check the ACECQA National Register at <a href=\"https://www.acecqa.gov.au/resources/national-registers\" target=\"_blank\" rel=\"noopener noreferrer\">acecqa.gov.au</a>. Search by suburb and the listing will show the provider's approved status, management type, and current NQS rating. You can also ask the centre directly \u2014 they're required to display their rating.",
  },
  {
    question: 'Are childcare chains worse than independent centres?',
    answer:
      "Not necessarily. Large for-profit chains vary widely in quality. Some chains consistently achieve 'Exceeding NQS' ratings across their centres, while others have mixed results. The ACCC found that large chains tend to charge higher fees on average, but this correlates more with location (they tend to operate in higher-fee metro areas) than with chain status alone. Always check the specific centre's NQS rating rather than assuming based on the brand.",
  },
  {
    question: 'What does the NQS rating actually measure?',
    answer:
      "The National Quality Standard assesses seven quality areas: educational program and practice, children's health and safety, physical environment, staffing arrangements, relationships with children, partnerships with families and communities, and governance and leadership. Centres are rated as: Working Towards NQS, Meeting NQS, Exceeding NQS, or Excellent (rare). The assessment is conducted by state/territory regulatory authorities, not by the centres themselves.",
  },
  {
    question: 'Should I choose the cheapest childcare centre?',
    answer:
      "Price alone is not a reliable guide. A centre charging $10/day more but rated 'Exceeding NQS' may offer substantially better outcomes for your child. The most cost-effective approach is to find a provider that: (1) charges at or below the CCS hourly rate cap, (2) is rated 'Meeting NQS' or above, and (3) offers the program and environment that suits your family. Use the <a href=\"/childcare-subsidy-calculator\">CCS Calculator</a> to compare your actual out-of-pocket cost at different fee levels.",
  },
];

// ─── Related guides ──────────────────────────────────────────────────────────

const RELATED = [
  {
    href: '/guides/childcare-costs-by-state',
    title: 'Childcare Costs by State',
    description:
      'Average daily fees across all 8 states and territories, with metro vs regional and rate cap comparisons.',
  },
  {
    href: '/guides/how-ccs-works',
    title: 'How the CCS Works',
    description:
      'The complete guide to the income test, hourly rate caps, activity test, and how to apply.',
  },
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'How the tapering formula determines your CCS percentage at every income level.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GovernmentVsPrivateChildcarePage() {
  return (
    <GuideLayout
      title="Government vs Private Childcare"
      description="Not-for-profit childcare centres charge about 8% less than for-profit providers and are more likely to have higher quality ratings. Here&rsquo;s what the ACCC data shows, what it means for your costs, and how to compare providers in your area."
      lastUpdated="2026-02-22"
      readingTimeMinutes={7}
      breadcrumbs={[{ label: 'Government vs Private Childcare' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/government-vs-private-childcare"
    >

      {/* ================================================================== */}
      {/* WHAT THE TERMS MEAN                                                */}
      {/* ================================================================== */}
      <h2 id="what-the-terms-mean">What the terms actually mean</h2>

      <p>
        When parents talk about &ldquo;government&rdquo; vs &ldquo;private&rdquo; childcare in
        Australia, they&apos;re usually referring to the difference between{' '}
        <strong>not-for-profit</strong> and <strong>for-profit</strong> providers. The distinction
        matters because it affects fees, how surplus revenue is used, and &mdash; statistically
        &mdash; quality ratings.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold w-1/3">Provider type</th>
              <th className="text-left px-4 py-3 font-semibold">What it means</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main align-top">
                Not-for-profit<br/>
                <span className="text-xs text-muted font-normal">(community, council, church, university)</span>
              </td>
              <td className="px-4 py-3 text-text-main">
                Operated by a community organisation, local council, church, or other entity
                that reinvests all surplus revenue back into the service. No shareholders or
                dividends. Includes council-run, church-run, university-affiliated, and
                parent-managed centres.
              </td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 font-medium text-text-main align-top">
                For-profit (private)<br/>
                <span className="text-xs text-muted font-normal">(independent, chain, listed company)</span>
              </td>
              <td className="px-4 py-3 text-text-main">
                Operated by a business (sole trader, partnership, or company) that can distribute
                profit to owners or shareholders. Includes single-centre independents, small
                groups (2&ndash;10 centres), and large ASX-listed chains.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout">
        <strong>Important:</strong> Both types are CCS-approved, regulated under the same{' '}
        <em>National Quality Framework</em>, assessed against the same{' '}
        <em>National Quality Standard</em>, and must meet the same staff-to-child ratios and
        educator qualifications. The distinction is about ownership and how revenue is used,
        not about government regulation.
      </div>

      {/* ================================================================== */}
      {/* COST DIFFERENCES                                                   */}
      {/* ================================================================== */}
      <h2 id="cost-differences">Cost differences: the ACCC findings</h2>

      <p>
        The ACCC&apos;s 2023 <em>Childcare Inquiry</em> provided the most comprehensive analysis
        of fee differences between provider types. The headline finding:
      </p>

      <div className="not-prose my-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4">
        <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">
          Not-for-profit centres charge approximately 8% less
        </p>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          on average than for-profit centres for centre-based day care, after controlling
          for location and service type.
        </p>
      </div>

      <p>
        In practical terms, if the average for-profit centre charges <strong>$150/day</strong>,
        a comparable not-for-profit in the same area averages around <strong>$138/day</strong>.
        Over a year on 3 days per week (48 weeks), that&apos;s roughly:
      </p>

      <ul>
        <li>$12/day &times; 3 days &times; 48 weeks = <strong>$1,728/year cheaper</strong> (before CCS)</li>
        <li>At 77% CCS, the gap fee saving is about <strong>$397/year</strong></li>
        <li>At 90% CCS, the gap fee saving is about <strong>$173/year</strong></li>
      </ul>

      <p>
        The savings are larger for families with lower CCS rates (higher incomes) because they
        pay a greater share of the fee out of pocket. For families earning above the CCS
        threshold ($535,279+), the full $1,728/year difference is out-of-pocket.
      </p>

      {/* ================================================================== */}
      {/* QUALITY DIFFERENCES                                                */}
      {/* ================================================================== */}
      <h2 id="quality-differences">Quality ratings: NQS comparison</h2>

      <p>
        Australia&apos;s <strong>National Quality Standard (NQS)</strong> rates every approved
        childcare service on a four-tier scale. The ACCC inquiry and ACECQA data show a
        noticeable pattern:
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">NQS Rating</th>
              <th className="text-right px-4 py-3 font-semibold">Not-for-profit</th>
              <th className="text-right px-4 py-3 font-semibold">For-profit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main">Exceeding NQS</td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-semibold">~28%</td>
              <td className="px-4 py-3 text-right text-text-main">~13%</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 font-medium text-text-main">Meeting NQS</td>
              <td className="px-4 py-3 text-right text-text-main">~58%</td>
              <td className="px-4 py-3 text-right text-text-main">~64%</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main">Working Towards NQS</td>
              <td className="px-4 py-3 text-right text-text-main">~14%</td>
              <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-semibold">~23%</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-muted mt-2">
          Source: ACECQA NQS data and ACCC Childcare Inquiry 2023. Percentages are approximate
          and vary by state. &ldquo;Excellent&rdquo; rating (&lt;1% of all centres) is excluded.
        </p>
      </div>

      <p>
        Not-for-profit centres are <strong>more than twice as likely</strong> to be rated
        &ldquo;Exceeding NQS&rdquo; compared to for-profit centres. However, the majority of
        both types achieve &ldquo;Meeting NQS&rdquo; &mdash; the standard the government
        considers adequate for children&apos;s development and safety.
      </p>

      <div className="callout">
        <strong>Nuance matters:</strong> These are averages across thousands of centres. Many
        for-profit centres achieve &ldquo;Exceeding NQS,&rdquo; and some not-for-profit centres
        are &ldquo;Working Towards.&rdquo; Always check the{' '}
        <strong>specific centre&apos;s rating</strong> rather than assuming based on provider type.
      </div>

      {/* ================================================================== */}
      {/* WHAT DRIVES COSTS                                                  */}
      {/* ================================================================== */}
      <h2 id="what-drives-costs">What drives the fee difference</h2>

      <p>
        The 8% gap isn&apos;t simply &ldquo;profit margin removed.&rdquo; Several factors
        contribute:
      </p>

      <h3>1. No shareholder returns</h3>
      <p>
        Not-for-profit centres reinvest all surplus revenue into the service &mdash; staff
        training, equipment, reduced fees, or building maintenance. For-profit centres must
        generate a return for owners or shareholders, which adds to the fee structure.
      </p>

      <h3>2. Access to grants and subsidies</h3>
      <p>
        Community-based and council-run centres may access local government grants, discounted
        premises (council-owned buildings), or state-specific operational funding that reduces
        their cost base. These benefits are generally not available to for-profit providers.
      </p>

      <h3>3. Location bias</h3>
      <p>
        For-profit chains disproportionately operate in higher-fee metro areas where demand
        (and land costs) are greatest. Not-for-profit centres are more evenly distributed,
        including in lower-cost suburban and regional areas. The ACCC controlled for location
        in its analysis, but residual location effects may remain.
      </p>

      <h3>4. Fee-setting philosophy</h3>
      <p>
        Not-for-profit boards often set fees with affordability as a primary objective.
        For-profit operators set fees based on market conditions, cost recovery, and target
        margins. Neither approach is inherently wrong &mdash; they reflect different
        organisational purposes.
      </p>

      {/* ================================================================== */}
      {/* CCS IMPACT                                                         */}
      {/* ================================================================== */}
      <h2 id="ccs-impact">How provider type affects your CCS</h2>

      <p>
        Your <strong>CCS percentage</strong> is determined entirely by your family income.
        It does not change based on provider type, centre location, or fee level.
      </p>

      <p>
        What <em>does</em> change is your <strong>out-of-pocket cost</strong>, because the CCS
        is calculated on the lower of:
      </p>

      <ol>
        <li>The actual hourly fee your provider charges, or</li>
        <li>The CCS hourly rate cap ($14.63/hour for centre-based day care, under school age)</li>
      </ol>

      <p>
        If your provider charges <em>above</em> the rate cap, you pay 100% of the above-cap
        amount yourself &mdash; regardless of your CCS rate. This is where provider choice has
        the biggest financial impact.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">Scenario</th>
              <th className="text-right px-4 py-3 font-semibold">Fee / day</th>
              <th className="text-right px-4 py-3 font-semibold">Rate cap (10hrs)</th>
              <th className="text-right px-4 py-3 font-semibold">Above cap</th>
              <th className="text-right px-4 py-3 font-semibold">Gap fee at 77% CCS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border bg-emerald-50/50 dark:bg-emerald-900/10">
              <td className="px-4 py-3 font-medium text-text-main">Not-for-profit (under cap)</td>
              <td className="px-4 py-3 text-right text-text-main">$138</td>
              <td className="px-4 py-3 text-right text-muted">$146.30</td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">$0</td>
              <td className="px-4 py-3 text-right text-text-main font-semibold">$31.74</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main">For-profit (above cap)</td>
              <td className="px-4 py-3 text-right text-text-main">$165</td>
              <td className="px-4 py-3 text-right text-muted">$146.30</td>
              <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-medium">$18.70</td>
              <td className="px-4 py-3 text-right text-text-main font-semibold">$52.35</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-background">
              <td colSpan={4} className="px-4 py-2.5 text-right font-semibold text-sm text-text-main">
                Daily saving
              </td>
              <td className="px-4 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                $20.61
              </td>
            </tr>
            <tr className="bg-background">
              <td colSpan={4} className="px-4 py-2.5 text-right font-semibold text-sm text-text-main">
                Annual saving (3 days/wk, 48 wks)
              </td>
              <td className="px-4 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                $2,968
              </td>
            </tr>
          </tfoot>
        </table>
        <p className="text-xs text-muted mt-2">
          Gap fee = (min(fee, cap) &times; (1 &minus; CCS%)) + above-cap amount.
          At 77% CCS: ($138 &times; 0.23) = $31.74 vs ($146.30 &times; 0.23) + $18.70 = $52.35.
        </p>
      </div>

      {/* ================================================================== */}
      {/* RATE CAP STRATEGY                                                  */}
      {/* ================================================================== */}
      <h2 id="rate-cap-strategy">The rate cap strategy</h2>

      <p>
        One of the most effective ways to reduce your childcare costs is to choose a provider
        whose daily fee sits <strong>at or below the CCS hourly rate cap</strong>. The rate caps
        for FY 2025&ndash;26 are:
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">Care type</th>
              <th className="text-right px-4 py-3 font-semibold">Hourly cap</th>
              <th className="text-right px-4 py-3 font-semibold">Daily cap (10 hrs)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text-main">Centre-based day care (under school age)</td>
              <td className="px-4 py-3 text-right text-text-main">$14.63</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$146.30</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-text-main">Centre-based day care (school age)</td>
              <td className="px-4 py-3 text-right text-text-main">$12.81</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$128.10</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text-main">Family day care (all ages)</td>
              <td className="px-4 py-3 text-right text-text-main">$12.43</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$124.30</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Providers charging above these caps are more common in the for-profit sector,
        particularly in metro areas. Not-for-profit centres &mdash; especially
        community-managed and council-run services &mdash; are more likely to charge
        at or below the cap.
      </p>

      {/* ================================================================== */}
      {/* HOW TO CHECK                                                       */}
      {/* ================================================================== */}
      <h2 id="how-to-check">How to check a provider&apos;s type and rating</h2>

      <ol>
        <li>
          <strong>Visit the ACECQA National Register:</strong>{' '}
          <a
            href="https://www.acecqa.gov.au/resources/national-registers"
            target="_blank"
            rel="noopener noreferrer"
          >
            acecqa.gov.au/resources/national-registers
          </a>
        </li>
        <li>
          <strong>Search by suburb or postcode</strong> to find centres near you.
        </li>
        <li>
          Each listing shows the <strong>provider management type</strong> (community-managed,
          private for-profit, etc.) and the <strong>current NQS rating</strong>.
        </li>
        <li>
          <strong>Compare the fee</strong> by calling or visiting the centre. Ask for their
          daily fee schedule for your child&apos;s age group.
        </li>
        <li>
          <strong>Calculate your gap fee</strong> using the{' '}
          <Link href="/childcare-subsidy-calculator">CCS Calculator</Link> with each
          provider&apos;s actual fee to see the real out-of-pocket difference.
        </li>
      </ol>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE                                                     */}
      {/* ================================================================== */}
      <h2 id="worked-example">Worked example: same suburb, different providers</h2>

      <p>
        The Chen family earns a combined $150,000/year, giving them a{' '}
        <strong>77% CCS rate</strong>. They have one child (age 3) attending 3 days/week and
        are comparing two centres in their suburb:
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold"></th>
              <th className="text-right px-4 py-3 font-semibold">Sunshine Community<br/>(not-for-profit)</th>
              <th className="text-right px-4 py-3 font-semibold">Bright Stars<br/>(for-profit)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">NQS rating</td>
              <td className="px-4 py-3 text-right text-text-main">Meeting NQS</td>
              <td className="px-4 py-3 text-right text-text-main">Exceeding NQS</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">Daily fee (10 hrs)</td>
              <td className="px-4 py-3 text-right text-text-main">$140</td>
              <td className="px-4 py-3 text-right text-text-main">$168</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">Above rate cap ($146.30)</td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400">$0</td>
              <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">$21.70</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 text-muted">CCS subsidy / day (77%)</td>
              <td className="px-4 py-3 text-right text-text-main">$107.80</td>
              <td className="px-4 py-3 text-right text-text-main">$112.65</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted">Gap fee / day</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$32.20</td>
              <td className="px-4 py-3 text-right font-semibold text-text-main">$55.35</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 font-semibold text-text-main">Annual gap fee (3d/wk, 48 wks)</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$4,637</td>
              <td className="px-4 py-3 text-right font-bold text-text-main">$7,970</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-emerald-50 dark:bg-emerald-900/20">
              <td colSpan={2} className="px-4 py-3 text-right font-semibold text-emerald-800 dark:text-emerald-300">
                Annual saving at Sunshine Community
              </td>
              <td className="px-4 py-3 text-right font-bold text-emerald-800 dark:text-emerald-300 text-lg">
                $3,333
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p>
        The <strong>$3,333/year saving</strong> comes almost entirely from the rate cap
        difference. Sunshine Community&apos;s fee is below the cap, so the CCS covers the
        full 77% of the fee. Bright Stars&apos; fee exceeds the cap by $21.70/day, which
        the Chen family pays entirely out of pocket.
      </p>

      <p>
        However, Bright Stars has a higher NQS rating. The Chens need to decide whether
        the &ldquo;Exceeding NQS&rdquo; rating is worth $3,333/year more &mdash; or whether
        &ldquo;Meeting NQS&rdquo; at a lower cost better suits their family&apos;s needs.
      </p>

      {/* ================================================================== */}
      {/* WHAT MATTERS MOST                                                  */}
      {/* ================================================================== */}
      <h2 id="what-matters-most">What actually matters when choosing</h2>

      <p>
        Provider type is one factor among many. Here&apos;s what to consider:
      </p>

      <ol>
        <li>
          <strong>NQS rating:</strong> Check the specific centre&apos;s rating, not the
          sector average. A for-profit centre rated &ldquo;Exceeding&rdquo; is a strong choice.
        </li>
        <li>
          <strong>Fee relative to the rate cap:</strong> The biggest cost driver is whether
          the fee is above or below the CCS hourly rate cap. This matters more than the
          8% average fee difference.
        </li>
        <li>
          <strong>Location and convenience:</strong> A centre close to home or work reduces
          commute time and work-related costs &mdash; these matter for back-to-work
          calculations.
        </li>
        <li>
          <strong>Program and philosophy:</strong> Play-based, Montessori, Reggio Emilia,
          or Steiner &mdash; different approaches suit different children. Visit the centre
          and observe the educators.
        </li>
        <li>
          <strong>Availability:</strong> Waitlists can be 6&ndash;18 months for popular
          centres. Don&apos;t limit your search to one provider type if spots are scarce.
        </li>
      </ol>

    </GuideLayout>
  );
}
