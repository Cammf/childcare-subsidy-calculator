// =============================================================================
// GUIDE: How the Child Care Subsidy Works in Australia (FY 2025–26)
// =============================================================================
// Flagship guide — 2,000+ word authoritative explainer with two fully worked
// numerical examples. Targets "how does childcare subsidy work" queries.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `How the Child Care Subsidy Works in Australia (2025–26 Guide) | ${SITE_NAME}`,
  description:
    'A complete plain-language guide to the Child Care Subsidy (CCS) for FY 2025–26 — the income test, hourly rate caps, activity test, 3-day guarantee, 5% withholding, and how to apply. Includes worked examples.',
  alternates: { canonical: `${SITE_URL}/guides/how-ccs-works` },
  openGraph: {
    title: 'How the Child Care Subsidy Works in Australia (2025–26)',
    description:
      'Everything Australian families need to know about CCS — income thresholds, hourly caps, the activity test, and two real worked examples.',
    url: `${SITE_URL}/guides/how-ccs-works`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'what-is-ccs',       label: 'What is the Child Care Subsidy?' },
  { id: 'income-test',       label: 'The income test' },
  { id: 'hourly-rate-caps',  label: 'Hourly rate caps' },
  { id: 'activity-test',     label: 'The activity test' },
  { id: '3-day-guarantee',   label: 'The 3-day guarantee (2026)' },
  { id: 'higher-rate',       label: 'Higher rate for younger children' },
  { id: 'withholding',       label: '5% withholding explained' },
  { id: 'worked-example-1',  label: 'Worked example: one child' },
  { id: 'worked-example-2',  label: 'Worked example: two children' },
  { id: 'how-to-apply',      label: 'How to apply for CCS' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'How much childcare subsidy will I get?',
    answer:
      'Your subsidy is a percentage of the hourly fee (up to a cap) based on your combined family income. Families earning under $85,279 receive the maximum 90%. The rate decreases by 1% for every $5,000 above that threshold, reaching 0% at around $535,000. Use our <a href="/childcare-subsidy-calculator">CCS calculator</a> for a personalised estimate.',
  },
  {
    question: 'What income is too high for the Child Care Subsidy?',
    answer:
      'CCS reaches 0% at a combined family income of approximately $535,279 in FY 2025–26. Above that amount, no subsidy is paid. Note that this is <em>combined</em> family income — both partners\' adjusted taxable income is counted.',
  },
  {
    question: 'How is the childcare subsidy calculated?',
    answer:
      'CCS is calculated per session as: the lower of (your actual hourly fee) or (the hourly rate cap) × your CCS percentage × the hours of care. The CCS percentage depends on your family income, and the hourly rate cap depends on your care type and child\'s age.',
  },
  {
    question: "Does my partner's income affect the childcare subsidy?",
    answer:
      'Yes. CCS is based on combined family income — both partners\' adjusted taxable income is added together. This includes salary/wages, investment income, rental income, reportable fringe benefits, and some government payments.',
  },
  {
    question: 'How many hours of subsidised childcare can I get?',
    answer:
      'Since 5 January 2026, all eligible families receive a minimum of 72 subsidised hours per fortnight (equivalent to 3 days per week) regardless of activity level. Families where both parents work, study, or volunteer 8+ hours per fortnight can access up to 100 hours per fortnight.',
  },
  {
    question: 'What happens to CCS when my child starts school?',
    answer:
      'CCS continues for approved care types including outside school hours care (OSHC). The hourly rate cap changes to $12.81 per hour for school-age children (compared to $14.63 for below-school-age in centre-based care). The income test and activity test remain the same.',
  },
  {
    question: 'Can I get CCS for a nanny or au pair?',
    answer:
      'Only if the nanny is employed through a registered in-home care provider approved by the government. Casual private arrangements with nannies or au pairs are not eligible for CCS. In-home care has a higher hourly rate cap ($35.40) but is charged per family, not per child.',
  },
  {
    question: 'When does the childcare subsidy get paid?',
    answer:
      'CCS is paid directly to your childcare provider each fortnight, reducing the amount you pay out of pocket. Services Australia withholds 5% of your CCS as a buffer against overpayments — this is reconciled after the end of the financial year.',
  },
];

// ─── Related guides ──────────────────────────────────────────────────────────

const RELATED = [
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'Detailed walkthrough of the income thresholds and tapering formula with worked examples at every key income level.',
  },
  {
    href: '/guides/3-day-guarantee',
    title: 'The 3-Day Guarantee (2026)',
    description:
      'What changed on 5 January 2026, who benefits, and what 72 hours per fortnight means in practice.',
  },
  {
    href: '/guides/back-to-work-childcare',
    title: 'Is Going Back to Work Worth It?',
    description:
      'The real calculation — income vs tax, reduced CCS, extra childcare days, and hidden costs of working.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HowCCSWorksPage() {
  return (
    <GuideLayout
      title="How the Child Care Subsidy Works in Australia"
      description="A complete plain-language guide to the Child Care Subsidy (CCS) for FY 2025–26 — the income test, hourly rate caps, activity test, 3-day guarantee, and how to apply. Includes real worked examples."
      lastUpdated="2026-02-22"
      readingTimeMinutes={10}
      breadcrumbs={[{ label: 'How the CCS Works' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/how-ccs-works"
    >
      {/* ================================================================== */}
      {/* WHAT IS CCS                                                        */}
      {/* ================================================================== */}
      <h2 id="what-is-ccs">What is the Child Care Subsidy?</h2>

      <p>
        The <strong>Child Care Subsidy (CCS)</strong> is the Australian Government&apos;s main
        payment to help families with the cost of childcare. It replaced the older Child Care
        Benefit and Child Care Rebate in July 2018.
      </p>

      <p>
        CCS is paid directly to your childcare provider, reducing the amount you pay out of
        pocket. The subsidy covers a <strong>percentage of the hourly fee</strong> (up to a
        government-set cap), with the exact percentage determined by your combined family income.
      </p>

      <p>Three factors determine how much CCS you receive:</p>
      <ol>
        <li><strong>Your combined family income</strong> — determines the subsidy percentage (up to 90%)</li>
        <li><strong>The hourly rate cap</strong> — the maximum hourly fee the government will subsidise</li>
        <li><strong>The activity test</strong> — determines how many subsidised hours you can access per fortnight</li>
      </ol>

      <div className="callout">
        <strong>Who is eligible?</strong> You can receive CCS if you (or your partner) care for a
        child aged 13 or under who attends an approved childcare service, you meet residency
        requirements, and you (or your partner) meet the activity test or qualify for an exemption.
      </div>

      {/* ================================================================== */}
      {/* INCOME TEST                                                        */}
      {/* ================================================================== */}
      <h2 id="income-test">The income test</h2>

      <p>
        Your CCS percentage is based on your <strong>combined family income</strong> — both
        partners&apos; adjusted taxable income added together. For single parents, it&apos;s
        just your individual income.
      </p>

      <p>The formula for FY 2025–26 is straightforward:</p>

      <ul>
        <li>Family income <strong>up to $85,279</strong> → maximum <strong>90% subsidy</strong></li>
        <li>For every <strong>$5,000 above $85,279</strong>, the subsidy drops by <strong>1 percentage point</strong></li>
        <li>The subsidy reaches <strong>0%</strong> at approximately <strong>$535,279</strong></li>
      </ul>

      <p>
        For example, a family earning $95,000 is $9,721 above the $85,279 threshold. Dividing
        by $5,000 and rounding up gives 2 brackets, so their CCS rate is 90% − 2% = <strong>88%</strong>.
      </p>

      <table>
        <thead>
          <tr>
            <th>Combined family income</th>
            <th>CCS percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to $85,279</td><td>90% (maximum)</td></tr>
          <tr><td>$90,000</td><td>89%</td></tr>
          <tr><td>$100,000</td><td>87%</td></tr>
          <tr><td>$120,000</td><td>83%</td></tr>
          <tr><td>$150,000</td><td>77%</td></tr>
          <tr><td>$200,000</td><td>67%</td></tr>
          <tr><td>$300,000</td><td>47%</td></tr>
          <tr><td>$400,000</td><td>27%</td></tr>
          <tr><td>$535,279+</td><td>0%</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <strong>What counts as &ldquo;family income&rdquo;?</strong> It includes taxable income,
        reportable fringe benefits, total net investment losses, tax-free pensions or benefits,
        reportable superannuation contributions, and certain tax-exempt foreign income. Check
        with Services Australia if you&apos;re unsure what to include.
      </div>

      <p>
        <strong>Annual subsidy cap:</strong> Families earning above $85,279 have an annual CCS
        cap of <strong>$11,003 per child</strong>. Families below that threshold have no cap.
        The cap is unlikely to affect most families — you would need to use more than about 4
        days per week of expensive care at a lower CCS rate to reach it.
      </p>

      {/* ================================================================== */}
      {/* HOURLY RATE CAPS                                                   */}
      {/* ================================================================== */}
      <h2 id="hourly-rate-caps">Hourly rate caps</h2>

      <p>
        The government doesn&apos;t subsidise unlimited fees. There is a <strong>maximum hourly
        rate</strong> (called the &ldquo;hourly rate cap&rdquo;) that CCS will cover. If your
        provider charges more than the cap, you pay the difference entirely out of pocket.
      </p>

      <table>
        <thead>
          <tr>
            <th>Care type</th>
            <th>Age group</th>
            <th>Hourly cap (FY 2025–26)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Centre-based day care</td><td>Below school age</td><td>$14.63</td></tr>
          <tr><td>Centre-based day care</td><td>School age</td><td>$12.81</td></tr>
          <tr><td>Family day care</td><td>All ages</td><td>$12.43</td></tr>
          <tr><td>Outside school hours care</td><td>School age</td><td>$12.81</td></tr>
          <tr><td>In-home care</td><td>All ages (per family)</td><td>$35.40</td></tr>
        </tbody>
      </table>

      <p>
        <strong>How the cap works in practice:</strong> Suppose your child is in centre-based
        day care at $15.00 per hour. The cap is $14.63, so CCS is calculated on $14.63 — the
        remaining $0.37 per hour is an above-cap gap you pay in full. Over a 12-hour session,
        that&apos;s an extra $4.44 per day above what CCS covers.
      </p>

      <div className="callout-tip">
        <strong>Tip:</strong> If your provider&apos;s hourly fee is close to or below the rate
        cap, you are getting the full benefit of CCS. If it&apos;s significantly above the cap,
        consider comparing providers — a fee at or below the cap means the government covers
        a larger share of the total cost.
      </div>

      {/* ================================================================== */}
      {/* ACTIVITY TEST                                                      */}
      {/* ================================================================== */}
      <h2 id="activity-test">The activity test</h2>

      <p>
        The activity test determines how many <strong>subsidised hours per fortnight</strong> your
        family can access. &ldquo;Activity&rdquo; includes paid work, self-employment, study,
        training, volunteering, or looking for work.
      </p>

      <p>
        The test is based on whichever parent or carer does the <strong>fewest hours of
        activity</strong> per fortnight. For single parents, it&apos;s based on your hours alone.
      </p>

      <table>
        <thead>
          <tr>
            <th>Activity hours (per fortnight)</th>
            <th>Subsidised hours</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0 to 7 hours</td><td>72 hours (3-day guarantee)</td></tr>
          <tr><td>8 to 16 hours</td><td>72 hours</td></tr>
          <tr><td>17 to 48 hours</td><td>72 hours</td></tr>
          <tr><td>More than 48 hours</td><td>100 hours</td></tr>
        </tbody>
      </table>

      <p>
        In practice, most working families meet the threshold for the full 100 hours (48+ hours
        per fortnight equals roughly 3 days of work per week). Families where one parent is not
        working or works very few hours still receive the guaranteed 72 hours.
      </p>

      {/* ================================================================== */}
      {/* 3-DAY GUARANTEE                                                    */}
      {/* ================================================================== */}
      <h2 id="3-day-guarantee">The 3-day guarantee (from 5 January 2026)</h2>

      <p>
        Since <strong>5 January 2026</strong>, every eligible family receives a minimum of{' '}
        <strong>72 subsidised hours per fortnight</strong> — equivalent to about 3 days of
        care per week — regardless of activity level. This is commonly called the
        &ldquo;3-day guarantee&rdquo;.
      </p>

      <p>
        Before this change, families where neither parent met the activity test received either
        no subsidised hours or a very limited amount. The 3-day guarantee means:
      </p>

      <ul>
        <li>Stay-at-home parents can access subsidised care for up to 3 days per week</li>
        <li>Families between jobs or reducing hours are not suddenly cut off</li>
        <li>Children maintain continuity of care even when family circumstances change</li>
      </ul>

      <div className="callout">
        <strong>Important:</strong> The 3-day guarantee covers the first 72 hours per fortnight.
        To access <strong>more than 72 hours</strong> (4 to 5 days per week), at least one
        parent still needs to meet the activity test at the higher threshold (48+ hours of
        recognised activity per fortnight).
      </div>

      {/* ================================================================== */}
      {/* HIGHER RATE                                                        */}
      {/* ================================================================== */}
      <h2 id="higher-rate">Higher rate for younger children</h2>

      <p>
        Families with <strong>more than one child aged 5 or under</strong> in approved care
        benefit from the higher CCS rate. Introduced on 10 July 2023, this policy increases
        the subsidy for every child except the eldest.
      </p>

      <p>The higher rate is calculated as:</p>

      <ul>
        <li>Take the <strong>eldest child&apos;s standard CCS rate</strong></li>
        <li>Add <strong>30 percentage points</strong></li>
        <li>Cap the result at a <strong>maximum of 95%</strong></li>
      </ul>

      <p>
        For example, if your eldest child&apos;s standard rate is 77% (at $150,000 combined
        income), your younger children would receive 77% + 30% = 107%, capped at{' '}
        <strong>95%</strong>. That means the government covers 95 cents of every dollar of fee
        (up to the cap) for each younger child — a significant saving.
      </p>

      <div className="callout-tip">
        <strong>Tip:</strong> The higher rate applies <em>per family</em>, not per provider. If
        your two children attend different centres, the younger child still receives the higher
        rate. The eldest child always receives the standard rate based on your income.
      </div>

      {/* ================================================================== */}
      {/* 5% WITHHOLDING                                                     */}
      {/* ================================================================== */}
      <h2 id="withholding">5% withholding explained</h2>

      <p>
        Services Australia withholds <strong>5% of your CCS entitlement</strong> each fortnight
        as a buffer. This is not a fee or a tax — it&apos;s held back to protect against
        overpayments that can occur if your actual income differs from the estimate you provided.
      </p>

      <p>
        After the end of the financial year, the government compares your CCS entitlement
        (based on your actual income from your tax return) against what was paid during the year.
        The withheld 5% is then either:
      </p>

      <ul>
        <li><strong>Refunded to you</strong> — if your actual income matches or is below your estimate</li>
        <li><strong>Used to offset a debt</strong> — if your actual income was higher than estimated (meaning you received too much CCS)</li>
      </ul>

      <p>
        In our calculator, we show both figures: the <strong>gap fee during the year</strong>{' '}
        (which includes the 5% withholding effect) and the <strong>true gap fee after
        reconciliation</strong> (assuming your income estimate was accurate).
      </p>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 1                                                   */}
      {/* ================================================================== */}
      <h2 id="worked-example-1">Worked example: one child, $90,000 income</h2>

      <div className="callout">
        <strong>The scenario:</strong> Sarah and Tom have a combined income of $90,000.
        Their 3-year-old daughter Mia attends centre-based day care 3 days per week at
        $150 per day (12-hour sessions).
      </div>

      <p><strong>Step 1 — Determine the CCS rate:</strong></p>
      <p>
        Income of $90,000 is $4,721 above the $85,279 threshold. Dividing by $5,000 and
        rounding up: ⌈4,721 ÷ 5,000⌉ = 1 bracket. CCS rate = 90% − 1% = <strong>89%</strong>.
      </p>

      <p><strong>Step 2 — Check the hourly rate cap:</strong></p>
      <p>
        Mia&apos;s daily fee is $150 for a 12-hour session = $12.50 per hour. The hourly rate
        cap for centre-based day care (below school age) is $14.63. Since $12.50 is below the
        cap, the full fee is subsidised — no above-cap gap.
      </p>

      <p><strong>Step 3 — Calculate the daily subsidy:</strong></p>
      <p>
        CCS per day = $150.00 × 89% = <strong>$133.50</strong>
        <br />
        Gap fee per day = $150.00 − $133.50 = <strong>$16.50</strong>
      </p>

      <p><strong>Step 4 — Add the 5% withholding:</strong></p>
      <p>
        Withholding per day = $133.50 × 5% = $6.68
        <br />
        Gap fee during the year = $16.50 + $6.68 = <strong>$23.18 per day</strong>
        <br />
        True gap fee (after reconciliation) = <strong>$16.50 per day</strong>
      </p>

      <p><strong>Step 5 — Annualise (3 days × 50 weeks):</strong></p>

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
          <tr><td>Gross fee</td><td>$150.00</td><td>$450.00</td><td>$22,500</td></tr>
          <tr><td>Government pays (CCS)</td><td>$133.50</td><td>$400.50</td><td>$20,025</td></tr>
          <tr><td>You pay (during year)</td><td>$23.18</td><td>$69.54</td><td>$3,477</td></tr>
          <tr><td>You pay (after reconciliation)</td><td>$16.50</td><td>$49.50</td><td><strong>$2,475</strong></td></tr>
        </tbody>
      </table>

      <p>
        <strong>The bottom line:</strong> The government covers $20,025 of Mia&apos;s $22,500
        annual childcare cost. Sarah and Tom pay <strong>$2,475 per year</strong> out of pocket
        (after reconciliation) — about <strong>$49.50 per week</strong>.
      </p>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 2                                                   */}
      {/* ================================================================== */}
      <h2 id="worked-example-2">Worked example: two children, $150,000 income</h2>

      <div className="callout">
        <strong>The scenario:</strong> Priya and James have a combined income of $150,000.
        They have two children: Aiden (3, eldest) and Zara (1, youngest). Both attend
        centre-based day care 3 days per week at $150 per day.
      </div>

      <p><strong>Step 1 — Determine the CCS rates:</strong></p>
      <p>
        Income of $150,000 is $64,721 above the threshold. ⌈64,721 ÷ 5,000⌉ = 13 brackets.
        Standard CCS rate = 90% − 13% = <strong>77%</strong>.
      </p>
      <p>
        Aiden (eldest child) gets the standard <strong>77%</strong>.
        <br />
        Zara (younger child) gets the higher rate: 77% + 30% = 107%, capped at{' '}
        <strong>95%</strong>.
      </p>

      <p><strong>Step 2 — Calculate daily subsidies:</strong></p>
      <p>
        Both children&apos;s fees ($12.50/hr) are below the $14.63 hourly cap — no above-cap gap.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Aiden (77%)</th>
            <th>Zara (95%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Daily fee</td><td>$150.00</td><td>$150.00</td></tr>
          <tr><td>CCS per day</td><td>$115.50</td><td>$142.50</td></tr>
          <tr><td>Gap per day</td><td>$34.50</td><td>$7.50</td></tr>
        </tbody>
      </table>

      <p><strong>Step 3 — Combined family costs (3 days × 50 weeks):</strong></p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per week</th>
            <th>Per year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Total gross fees (2 children × 3 days)</td><td>$900</td><td>$45,000</td></tr>
          <tr><td>Government pays (CCS)</td><td>$774</td><td>$38,700</td></tr>
          <tr><td>You pay (after reconciliation)</td><td>$126</td><td><strong>$6,300</strong></td></tr>
        </tbody>
      </table>

      <p><strong>How much does the higher rate save this family?</strong></p>
      <p>
        If both children were at the standard 77% rate, Zara&apos;s gap fee would be $34.50
        per day instead of $7.50 — an extra $27.00 per day. Over 3 days and 50 weeks, the
        higher rate saves Priya and James <strong>$4,050 per year</strong>.
      </p>

      {/* ================================================================== */}
      {/* HOW TO APPLY                                                       */}
      {/* ================================================================== */}
      <h2 id="how-to-apply">How to apply for CCS</h2>

      <p>Applying for CCS involves five steps:</p>

      <ol>
        <li>
          <strong>Create a myGov account</strong> and link it to Centrelink (if you haven&apos;t
          already). You&apos;ll need to verify your identity.
        </li>
        <li>
          <strong>Submit a CCS claim</strong> through your Centrelink online account. You can
          do this before your child starts care.
        </li>
        <li>
          <strong>Provide your family income estimate</strong> for the current financial year.
          Be as accurate as possible — this determines your CCS rate and affects the 5%
          withholding reconciliation.
        </li>
        <li>
          <strong>Complete the activity test</strong> — declare the hours of recognised
          activity (work, study, volunteering) for both parents each fortnight.
        </li>
        <li>
          <strong>Confirm your enrolment</strong> — your childcare provider will send an
          enrolment notice through the system. You need to confirm it within 14 days.
        </li>
      </ol>

      <p>
        CCS claims are usually processed within <strong>1 to 2 weeks</strong>. Once approved,
        the subsidy is paid directly to your provider each fortnight.
      </p>

      <div className="callout-warning">
        <strong>Keep your income estimate up to date.</strong> If your family income changes
        significantly during the year (e.g. one partner starts or stops working), update your
        estimate through myGov immediately. An inaccurate estimate can lead to a debt at
        reconciliation time — or you could be paying more out of pocket than necessary.
      </div>

      <p>
        Ready to see what CCS will cost your family? Use our free{' '}
        <Link href="/childcare-subsidy-calculator" className="text-primary underline">
          CCS calculator
        </Link>{' '}
        for a personalised estimate — it takes about 2 minutes.
      </p>
    </GuideLayout>
  );
}
