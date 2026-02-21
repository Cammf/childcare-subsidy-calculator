// =============================================================================
// GUIDE: CCS Income Test Explained — FY 2025–26
// =============================================================================
// Deep-dive into the income thresholds, tapering formula, comprehensive CCS%
// table at every key income level, three worked examples, what counts as family
// income, common mistakes. Targets "childcare subsidy income test" queries.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `CCS Income Test Explained — Thresholds & Tapering (2025–26) | ${SITE_NAME}`,
  description:
    'Detailed walkthrough of the Child Care Subsidy income test for FY 2025–26. Understand thresholds, the tapering formula, CCS rates at every income level, the annual cap, and what counts as family income.',
  alternates: { canonical: `${SITE_URL}/guides/ccs-income-thresholds` },
  openGraph: {
    title: 'CCS Income Test Explained — Thresholds & Tapering (2025–26)',
    description:
      'How the CCS income test determines your subsidy rate — thresholds, tapering formula, comprehensive rate table, worked examples, and common income sources families miss.',
    url: `${SITE_URL}/guides/ccs-income-thresholds`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',            label: 'How the income test works' },
  { id: 'tapering-formula',    label: 'The tapering formula' },
  { id: 'full-rate-table',     label: 'Full CCS rate table' },
  { id: 'what-counts',         label: 'What counts as family income?' },
  { id: 'common-mistakes',     label: 'Income sources people forget' },
  { id: 'annual-cap',          label: 'The annual subsidy cap' },
  { id: 'worked-example-1',    label: 'Example: $95,000 income' },
  { id: 'worked-example-2',    label: 'Example: $180,000 income' },
  { id: 'worked-example-3',    label: 'Example: $350,000 income' },
  { id: 'updating-estimate',   label: 'Updating your income estimate' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'What income is used to calculate Child Care Subsidy?',
    answer:
      'CCS is based on your <em>combined family adjusted taxable income (ATI)</em>. This includes both partners\' taxable income, reportable fringe benefits, total net investment losses, reportable superannuation contributions, and certain tax-exempt foreign income. For single parents, only your individual ATI is used.',
  },
  {
    question: 'What is the maximum income to get CCS?',
    answer:
      'In FY 2025\u201326, the CCS standard rate reaches 0% at approximately $535,279 in combined family income. Above that amount, no subsidy is payable. However, families with multiple children in care may still receive the higher CCS rate for younger children at incomes well above this threshold.',
  },
  {
    question: 'How much does CCS decrease as income goes up?',
    answer:
      'For every $5,000 of combined family income above $85,279, your CCS rate drops by 1 percentage point. For example, earning $100,000 puts you about $14,721 above the threshold \u2014 that rounds up to 3 brackets, giving you a CCS rate of 87% (90% minus 3%).',
  },
  {
    question: 'Does rental income affect childcare subsidy?',
    answer:
      'Yes. Rental profits increase your adjusted taxable income directly. Net rental losses also count \u2014 they are <em>added back</em> to your ATI (via total net investment losses). This means negative gearing doesn\u2019t reduce your family income for CCS purposes.',
  },
  {
    question: 'Does salary sacrifice reduce my income for CCS?',
    answer:
      'Not significantly. Reportable fringe benefits (which include most salary sacrifice arrangements) are added to your ATI. So while salary sacrifice reduces your taxable income, the fringe benefits amount is added back in, largely cancelling the effect for CCS calculations.',
  },
  {
    question: 'What happens if I underestimate my income for CCS?',
    answer:
      'After the financial year ends, Services Australia reconciles your CCS based on your actual income from your tax return. If your actual income was higher than estimated, you may have received too much CCS and will need to repay the difference. The 5% withholding helps buffer against small overestimates.',
  },
  {
    question: 'Is the $85,279 threshold indexed each year?',
    answer:
      'Yes. The CCS income thresholds are indexed annually in line with CPI. The $85,279 figure applies to FY 2025\u201326. Previous years had lower thresholds \u2014 for example, FY 2024\u201325 used $83,280. Always check the current year\u2019s figures.',
  },
  {
    question: 'Can I get CCS if my partner earns a lot but I earn nothing?',
    answer:
      'Yes, as long as your <em>combined</em> family income is below approximately $535,279. The activity test (not the income test) determines whether you can access subsidised hours. Even if one partner doesn\u2019t work, the 3-day guarantee provides 72 subsidised hours per fortnight from January 2026.',
  },
];

// ─── Related guides ──────────────────────────────────────────────────────────

const RELATED = [
  {
    href: '/guides/how-ccs-works',
    title: 'How the CCS Works',
    description:
      'The complete overview \u2014 income test, hourly caps, activity test, withholding, and how to apply.',
  },
  {
    href: '/guides/back-to-work-childcare',
    title: 'Is Going Back to Work Worth It?',
    description:
      'How returning to work changes your family income, CCS rate, and out-of-pocket childcare costs.',
  },
  {
    href: '/guides/childcare-subsidy-multiple-children',
    title: 'CCS for Multiple Children',
    description:
      'How the higher rate works for second and subsequent children \u2014 including the income thresholds that matter most.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CCSIncomeThresholdsPage() {
  return (
    <GuideLayout
      title="CCS Income Test Explained"
      description="A detailed walkthrough of the Child Care Subsidy income thresholds and tapering formula for FY 2025\u201326. See exactly how much CCS you\u2019ll get at every income level, what counts as family income, and the common sources people forget."
      lastUpdated="2026-02-22"
      readingTimeMinutes={7}
      breadcrumbs={[{ label: 'CCS Income Thresholds' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/ccs-income-thresholds"
    >
      {/* ================================================================== */}
      {/* OVERVIEW                                                           */}
      {/* ================================================================== */}
      <h2 id="overview">How the income test works</h2>

      <p>
        The Child Care Subsidy income test is the main factor that determines your{' '}
        <strong>CCS percentage</strong> &mdash; the share of the hourly fee (up to the rate cap)
        that the government pays on your behalf. The higher your combined family income, the lower
        your subsidy rate.
      </p>

      <p>
        For FY 2025&ndash;26, the system works on a <strong>single continuous taper</strong>:
      </p>

      <ul>
        <li>Families earning <strong>$85,279 or less</strong> receive the maximum <strong>90%</strong> subsidy</li>
        <li>For every <strong>$5,000</strong> above that threshold, the rate drops by <strong>1 percentage point</strong></li>
        <li>The subsidy reaches <strong>0%</strong> at approximately <strong>$535,279</strong></li>
      </ul>

      <p>
        This means the income test is <em>not</em> a cliff. You don&apos;t suddenly lose CCS when
        you cross a threshold &mdash; it tapers gradually. An extra $10,000 in income only reduces
        your CCS rate by 2 percentage points.
      </p>

      <div className="callout">
        <strong>Key point:</strong> The income test uses <strong>combined family adjusted taxable
        income (ATI)</strong> &mdash; both partners&apos; income added together. For single parents,
        it&apos;s your individual ATI. This is not the same as your gross salary &mdash; see
        the <a href="#what-counts">&ldquo;What counts as family income?&rdquo;</a> section below.
      </div>

      {/* ================================================================== */}
      {/* TAPERING FORMULA                                                   */}
      {/* ================================================================== */}
      <h2 id="tapering-formula">The tapering formula</h2>

      <p>
        The exact formula used by Services Australia to calculate your standard CCS rate is:
      </p>

      <div className="bg-teal-50 border border-primary/20 rounded-lg p-4 my-4 text-center">
        <p className="font-mono text-sm text-text-main mb-1">
          CCS% = max(0, 90 &minus; &lceil;(income &minus; 85,279) &divide; 5,000&rceil;)
        </p>
        <p className="text-xs text-muted">
          Where &lceil;&nbsp;&rceil; means &ldquo;round up to the next whole number&rdquo;
        </p>
      </div>

      <p>Let&apos;s break that down step by step:</p>

      <ol>
        <li>
          <strong>Subtract the threshold:</strong> Take your combined family income and subtract
          $85,279. If the result is zero or negative, your CCS rate is 90% (the maximum).
        </li>
        <li>
          <strong>Divide by $5,000:</strong> This tells you how many &ldquo;brackets&rdquo; above
          the threshold you sit.
        </li>
        <li>
          <strong>Round up:</strong> Even if you&apos;re $1 into the next bracket, the full bracket
          counts. For example, $90,280 is exactly $1 into the second bracket above the threshold,
          so it rounds up to 2 brackets.
        </li>
        <li>
          <strong>Subtract from 90%:</strong> Each bracket costs you 1 percentage point.
        </li>
      </ol>

      <p>
        The &ldquo;round up&rdquo; step is important &mdash; it means even a small income increase
        that pushes you into the next $5,000 bracket will cost you a full percentage point of CCS.
        However, in dollar terms, 1 percentage point is relatively minor (about $2&ndash;$4 per day
        per child depending on your fee).
      </p>

      {/* ================================================================== */}
      {/* FULL RATE TABLE                                                    */}
      {/* ================================================================== */}
      <h2 id="full-rate-table">Full CCS rate table (FY 2025&ndash;26)</h2>

      <p>
        The table below shows the standard CCS rate at key income levels. Use it to quickly look up
        your approximate subsidy, or use our{' '}
        <Link href="/childcare-subsidy-calculator" className="text-primary underline">
          CCS calculator
        </Link>{' '}
        for a precise figure based on your exact income.
      </p>

      <table>
        <thead>
          <tr>
            <th>Combined family income</th>
            <th>Standard CCS %</th>
            <th>Brackets above threshold</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$60,000</td><td>90%</td><td>0 (below threshold)</td></tr>
          <tr><td>$85,279 or below</td><td>90%</td><td>0 (maximum)</td></tr>
          <tr><td>$90,000</td><td>89%</td><td>1</td></tr>
          <tr><td>$95,000</td><td>88%</td><td>2</td></tr>
          <tr><td>$100,000</td><td>87%</td><td>3</td></tr>
          <tr><td>$110,000</td><td>85%</td><td>5</td></tr>
          <tr><td>$120,000</td><td>83%</td><td>7</td></tr>
          <tr><td>$130,000</td><td>81%</td><td>9</td></tr>
          <tr><td>$140,000</td><td>79%</td><td>11</td></tr>
          <tr><td>$150,000</td><td>77%</td><td>13</td></tr>
          <tr><td>$160,000</td><td>75%</td><td>15</td></tr>
          <tr><td>$170,000</td><td>73%</td><td>17</td></tr>
          <tr><td>$180,000</td><td>71%</td><td>19</td></tr>
          <tr><td>$200,000</td><td>67%</td><td>23</td></tr>
          <tr><td>$220,000</td><td>63%</td><td>27</td></tr>
          <tr><td>$250,000</td><td>57%</td><td>33</td></tr>
          <tr><td>$300,000</td><td>47%</td><td>43</td></tr>
          <tr><td>$350,000</td><td>37%</td><td>53</td></tr>
          <tr><td>$400,000</td><td>27%</td><td>63</td></tr>
          <tr><td>$450,000</td><td>17%</td><td>73</td></tr>
          <tr><td>$500,000</td><td>7%</td><td>83</td></tr>
          <tr><td>$535,279+</td><td>0%</td><td>90 (no subsidy)</td></tr>
        </tbody>
      </table>

      <div className="callout-tip">
        <strong>Tip:</strong> If you have <strong>more than one child in care</strong>, the younger
        children receive the <em>higher CCS rate</em> &mdash; your standard rate plus 30 percentage
        points, capped at 95%. So even at $200,000 income (67% standard rate), younger children get
        min(67% + 30%, 95%) = <strong>95%</strong>. See our{' '}
        <Link href="/guides/childcare-subsidy-multiple-children" className="text-primary underline">
          multiple children guide
        </Link>{' '}
        for details.
      </div>

      {/* ================================================================== */}
      {/* WHAT COUNTS AS FAMILY INCOME                                       */}
      {/* ================================================================== */}
      <h2 id="what-counts">What counts as family income?</h2>

      <p>
        CCS uses <strong>adjusted taxable income (ATI)</strong>, which is broader than your gross
        salary. For a couple, both partners&apos; ATI is added together. ATI includes:
      </p>

      <ol>
        <li>
          <strong>Taxable income</strong> &mdash; your salary/wages, business income, and other
          assessable income minus allowable deductions
        </li>
        <li>
          <strong>Reportable fringe benefits</strong> &mdash; shown on your payment summary.
          Includes salary sacrifice to super, novated car leases, and other fringe benefits
        </li>
        <li>
          <strong>Total net investment losses</strong> &mdash; negative gearing on rental
          properties or investment losses are <em>added back</em> to your ATI. This means you
          cannot use investment losses to reduce your CCS income
        </li>
        <li>
          <strong>Reportable superannuation contributions</strong> &mdash; voluntary super
          contributions you make (salary sacrifice or personal deductible contributions)
        </li>
        <li>
          <strong>Tax-exempt foreign employment income</strong> &mdash; income earned overseas
          that is exempt from Australian tax
        </li>
        <li>
          <strong>Certain tax-free government payments</strong> &mdash; some government pensions
          and benefits (but not all)
        </li>
      </ol>

      <div className="callout-warning">
        <strong>Important:</strong> ATI is specifically designed to capture income that might
        otherwise be &ldquo;hidden&rdquo; from a simple taxable income test. Strategies like salary
        sacrifice, negative gearing, or voluntary super contributions will <em>not</em> meaningfully
        reduce your family income for CCS purposes.
      </div>

      {/* ================================================================== */}
      {/* COMMON MISTAKES                                                    */}
      {/* ================================================================== */}
      <h2 id="common-mistakes">Income sources people forget</h2>

      <p>
        When estimating family income for CCS, these are the items most commonly overlooked &mdash;
        leading to an unpleasant surprise at reconciliation:
      </p>

      <ul>
        <li>
          <strong>Capital gains</strong> &mdash; if you sell shares, crypto, or an investment
          property during the year, the capital gain increases your taxable income (and therefore
          your ATI). Even a one-off sale can temporarily push your CCS rate down for that year.
        </li>
        <li>
          <strong>Rental property profits</strong> &mdash; especially if a previously
          negatively-geared property turns profitable due to rent increases or reduced interest rates.
        </li>
        <li>
          <strong>Net investment losses being added back</strong> &mdash; many families assume that
          a rental loss or share trading loss reduces their income for CCS. It doesn&apos;t &mdash;
          net investment losses are added back to ATI.
        </li>
        <li>
          <strong>Employer super contributions above the standard rate</strong> &mdash; if your
          employer contributes more than the mandatory 11.5%, the excess may count as reportable
          fringe benefits.
        </li>
        <li>
          <strong>Bonuses and overtime</strong> &mdash; a one-off bonus or period of heavy overtime
          increases your actual income above your estimate.
        </li>
        <li>
          <strong>Partner&apos;s income changes</strong> &mdash; one partner getting a pay rise, new
          job, or side income that wasn&apos;t included in the original estimate.
        </li>
        <li>
          <strong>Government payments</strong> &mdash; some payments (like Parental Leave Pay) count
          as taxable income. Check with Services Australia which payments are included.
        </li>
      </ul>

      <div className="callout-tip">
        <strong>Tip:</strong> When estimating your income, it&apos;s better to <em>slightly
        overestimate</em> than underestimate. If you overestimate, you&apos;ll receive a larger
        refund from the 5% withholding at reconciliation. If you underestimate, you could face a
        debt. A 5&ndash;10% buffer above your best guess is a reasonable approach.
      </div>

      {/* ================================================================== */}
      {/* ANNUAL CAP                                                         */}
      {/* ================================================================== */}
      <h2 id="annual-cap">The annual subsidy cap</h2>

      <p>
        In addition to the percentage-based taper, there is an <strong>annual CCS cap of $11,003 per
        child</strong> for families earning above $85,279.
      </p>

      <ul>
        <li>
          Families earning <strong>$85,279 or below</strong> have <strong>no annual cap</strong> &mdash;
          they receive subsidised care without limit
        </li>
        <li>
          Families earning <strong>above $85,279</strong> are subject to a cap of $11,003 per child
          per financial year
        </li>
      </ul>

      <p>
        <strong>Will the cap affect your family?</strong> For most families, no. The cap is generous
        enough that you would need to use more than about 4 days per week of expensive care at a
        moderate-to-low CCS rate for an entire year to reach it. Here&apos;s a quick check:
      </p>

      <table>
        <thead>
          <tr>
            <th>Days per week</th>
            <th>Daily fee</th>
            <th>CCS rate</th>
            <th>Annual CCS paid</th>
            <th>Hits cap?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>3 days</td><td>$150</td><td>77%</td><td>$17,325</td><td>Yes &mdash; hits cap at ~week 32</td></tr>
          <tr><td>3 days</td><td>$130</td><td>87%</td><td>$16,965</td><td>Yes &mdash; hits cap at ~week 33</td></tr>
          <tr><td>2 days</td><td>$150</td><td>77%</td><td>$11,550</td><td>Barely &mdash; hits cap near year end</td></tr>
          <tr><td>3 days</td><td>$120</td><td>67%</td><td>$12,060</td><td>Barely &mdash; hits cap near year end</td></tr>
          <tr><td>2 days</td><td>$130</td><td>87%</td><td>$11,310</td><td>Barely</td></tr>
          <tr><td>2 days</td><td>$120</td><td>67%</td><td>$8,040</td><td>No</td></tr>
        </tbody>
      </table>

      <p>
        If you&apos;re concerned about hitting the cap, our{' '}
        <Link href="/childcare-subsidy-calculator" className="text-primary underline">
          CCS calculator
        </Link>{' '}
        factors in the annual cap and shows whether it applies to your family.
      </p>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 1 — $95k                                            */}
      {/* ================================================================== */}
      <h2 id="worked-example-1">Worked example: $95,000 combined income</h2>

      <div className="callout">
        <strong>The scenario:</strong> Lisa and David have a combined family income of $95,000.
        Their 2-year-old son Noah attends centre-based day care 3 days per week at $140 per day
        (12-hour sessions, so $11.67 per hour).
      </div>

      <p><strong>Step 1 &mdash; Calculate the CCS rate:</strong></p>
      <p>
        Income $95,000 &minus; threshold $85,279 = $9,721 above the threshold.
        <br />
        $9,721 &divide; $5,000 = 1.944, rounded up = <strong>2 brackets</strong>.
        <br />
        CCS rate = 90% &minus; 2% = <strong>88%</strong>.
      </p>

      <p><strong>Step 2 &mdash; Check the hourly rate cap:</strong></p>
      <p>
        Noah&apos;s hourly fee is $11.67. The cap for centre-based care (below school age) is
        $14.63. Since $11.67 &lt; $14.63, the full fee is within the cap &mdash; no above-cap gap.
      </p>

      <p><strong>Step 3 &mdash; Calculate daily subsidy and gap:</strong></p>
      <p>
        CCS per day = $140.00 &times; 88% = <strong>$123.20</strong>
        <br />
        Gap fee per day = $140.00 &minus; $123.20 = <strong>$16.80</strong>
      </p>

      <p><strong>Step 4 &mdash; Annual cost (3 days &times; 50 weeks):</strong></p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per day</th>
            <th>Per week</th>
            <th>Per year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Gross fee</td><td>$140.00</td><td>$420.00</td><td>$21,000</td></tr>
          <tr><td>CCS covers</td><td>$123.20</td><td>$369.60</td><td>$18,480</td></tr>
          <tr><td>You pay (after reconciliation)</td><td>$16.80</td><td>$50.40</td><td><strong>$2,520</strong></td></tr>
        </tbody>
      </table>

      <p>
        <strong>The bottom line:</strong> At $95,000, Lisa and David pay about <strong>$50 per week</strong>{' '}
        out of pocket for Noah&apos;s childcare. That&apos;s 12% of the total fee &mdash; the government
        covers the other 88%.
      </p>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 2 — $180k                                           */}
      {/* ================================================================== */}
      <h2 id="worked-example-2">Worked example: $180,000 combined income</h2>

      <div className="callout">
        <strong>The scenario:</strong> Meera and Chris have a combined family income of $180,000.
        Their 3-year-old daughter Ava attends centre-based day care 4 days per week at $160 per day
        (12-hour sessions, so $13.33 per hour).
      </div>

      <p><strong>Step 1 &mdash; Calculate the CCS rate:</strong></p>
      <p>
        Income $180,000 &minus; threshold $85,279 = $94,721 above the threshold.
        <br />
        $94,721 &divide; $5,000 = 18.944, rounded up = <strong>19 brackets</strong>.
        <br />
        CCS rate = 90% &minus; 19% = <strong>71%</strong>.
      </p>

      <p><strong>Step 2 &mdash; Check the hourly rate cap:</strong></p>
      <p>
        Ava&apos;s hourly fee is $13.33. The cap is $14.63. Since $13.33 &lt; $14.63, the full
        fee is within the cap.
      </p>

      <p><strong>Step 3 &mdash; Calculate daily subsidy and gap:</strong></p>
      <p>
        CCS per day = $160.00 &times; 71% = <strong>$113.60</strong>
        <br />
        Gap fee per day = $160.00 &minus; $113.60 = <strong>$46.40</strong>
      </p>

      <p><strong>Step 4 &mdash; Annual cost (4 days &times; 50 weeks):</strong></p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per day</th>
            <th>Per week</th>
            <th>Per year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Gross fee</td><td>$160.00</td><td>$640.00</td><td>$32,000</td></tr>
          <tr><td>CCS covers</td><td>$113.60</td><td>$454.40</td><td>$22,720</td></tr>
          <tr><td>You pay (after reconciliation)</td><td>$46.40</td><td>$185.60</td><td><strong>$9,280</strong></td></tr>
        </tbody>
      </table>

      <p>
        <strong>Important &mdash; annual cap check:</strong> Meera and Chris earn above $85,279, so
        the $11,003 annual cap applies. Their annual CCS of $22,720 exceeds the cap. This means CCS
        payments will stop once the cap is reached (around week 24), and they&apos;ll pay the full
        $160/day fee for the remaining weeks. Their actual annual out-of-pocket will be higher than
        $9,280 &mdash; approximately <strong>$20,997</strong> ($32,000 gross minus $11,003 cap).
      </p>

      <div className="callout-warning">
        <strong>This is a common trap</strong> for middle-to-high income families using 4+ days per
        week. The annual CCS cap can significantly increase your costs in the second half of the
        year. If you&apos;re close to the cap, consider whether shifting one day to grandparent
        or informal care could keep you under the limit.
      </div>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 3 — $350k                                           */}
      {/* ================================================================== */}
      <h2 id="worked-example-3">Worked example: $350,000 combined income</h2>

      <div className="callout">
        <strong>The scenario:</strong> Kate and Matt have a combined family income of $350,000.
        Their 4-year-old daughter Isla attends centre-based day care 3 days per week at $170 per
        day (12-hour sessions, so $14.17 per hour).
      </div>

      <p><strong>Step 1 &mdash; Calculate the CCS rate:</strong></p>
      <p>
        Income $350,000 &minus; threshold $85,279 = $264,721 above the threshold.
        <br />
        $264,721 &divide; $5,000 = 52.944, rounded up = <strong>53 brackets</strong>.
        <br />
        CCS rate = 90% &minus; 53% = <strong>37%</strong>.
      </p>

      <p><strong>Step 2 &mdash; Check the hourly rate cap:</strong></p>
      <p>
        Isla&apos;s hourly fee is $14.17. The cap is $14.63. The full fee is within the cap.
      </p>

      <p><strong>Step 3 &mdash; Calculate daily subsidy and gap:</strong></p>
      <p>
        CCS per day = $170.00 &times; 37% = <strong>$62.90</strong>
        <br />
        Gap fee per day = $170.00 &minus; $62.90 = <strong>$107.10</strong>
      </p>

      <p><strong>Step 4 &mdash; Annual cost (3 days &times; 50 weeks):</strong></p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per day</th>
            <th>Per week</th>
            <th>Per year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Gross fee</td><td>$170.00</td><td>$510.00</td><td>$25,500</td></tr>
          <tr><td>CCS covers</td><td>$62.90</td><td>$188.70</td><td>$9,435</td></tr>
          <tr><td>You pay (after reconciliation)</td><td>$107.10</td><td>$321.30</td><td><strong>$16,065</strong></td></tr>
        </tbody>
      </table>

      <p>
        <strong>Annual cap check:</strong> The annual CCS of $9,435 is below the $11,003 cap, so
        Kate and Matt do not hit the cap despite their high income. This is because their CCS rate
        is already low (37%), and they only use 3 days per week.
      </p>

      <p>
        <strong>The bottom line:</strong> Even at $350,000 combined income, the government still
        contributes $9,435 per year toward Isla&apos;s childcare &mdash; a 37% subsidy. Kate and
        Matt pay about <strong>$321 per week</strong> out of pocket, compared to the $510 they would
        pay without any subsidy.
      </p>

      {/* ================================================================== */}
      {/* UPDATING YOUR ESTIMATE                                             */}
      {/* ================================================================== */}
      <h2 id="updating-estimate">Updating your income estimate</h2>

      <p>
        Your CCS rate during the year is based on the <strong>family income estimate</strong> you
        provide to Services Australia through your myGov/Centrelink account. It&apos;s not
        automatically calculated from tax data in real time &mdash; you need to keep it up to date.
      </p>

      <p>You should update your estimate whenever:</p>

      <ul>
        <li>Either partner starts a new job, gets a pay rise, or reduces hours</li>
        <li>You receive a significant bonus, commission, or overtime income</li>
        <li>You sell an investment (shares, property, crypto) that triggers a capital gain</li>
        <li>Your rental property switches from a loss to a profit (or vice versa)</li>
        <li>Either partner starts or stops receiving government payments</li>
        <li>Your family structure changes (separation, new partner)</li>
      </ul>

      <p>
        To update your estimate, log in to <strong>myGov</strong>, go to your Centrelink account,
        and navigate to the CCS section. The change usually takes effect within one to two fortnights.
      </p>

      <div className="callout-tip">
        <strong>End-of-year reconciliation:</strong> After you lodge your tax return, Services
        Australia compares your actual income against the estimate you provided during the year. If
        you received too much CCS (because your actual income was higher than estimated), you&apos;ll
        need to repay the difference. The 5% withholding helps buffer against this, but a large
        discrepancy can still result in a debt. See our{' '}
        <Link href="/guides/how-ccs-works#withholding" className="text-primary underline">
          withholding explainer
        </Link>{' '}
        for more details.
      </div>

      <p>
        Want to see exactly how your income affects your CCS rate and out-of-pocket costs? Use our
        free{' '}
        <Link href="/childcare-subsidy-calculator" className="text-primary underline">
          CCS calculator
        </Link>{' '}
        &mdash; it applies the exact tapering formula above to give you a personalised estimate in
        about 2 minutes.
      </p>
    </GuideLayout>
  );
}
