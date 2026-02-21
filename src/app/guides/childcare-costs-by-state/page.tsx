// =============================================================================
// GUIDE: Childcare Costs by State — Australia 2025–26
// =============================================================================
// Compares average daily childcare fees across all 8 states and territories.
// Targets "childcare costs NSW", "childcare fees Victoria", "how much is
// childcare in Australia" and related state-specific queries.
// =============================================================================

import type { Metadata } from 'next';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Childcare Costs by State 2025–26 — Average Daily Fees | ${SITE_NAME}`,
  description:
    'Average childcare fees by state and territory for FY 2025–26. Centre-based day care, family day care, and OSHC costs for NSW, VIC, QLD, WA, SA, TAS, ACT, and NT — plus why costs vary and how to reduce them.',
  alternates: { canonical: `${SITE_URL}/guides/childcare-costs-by-state` },
  openGraph: {
    title: 'Childcare Costs by State 2025\u201326 \u2014 Average Daily Fees Australia',
    description:
      'Compare average childcare fees across all Australian states and territories. Includes centre-based day care, family day care, and OSHC.',
    url: `${SITE_URL}/guides/childcare-costs-by-state`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'national-overview',      label: 'National cost overview' },
  { id: 'state-comparison-table', label: 'State-by-state comparison' },
  { id: 'most-expensive-states',  label: 'Most expensive states' },
  { id: 'most-affordable-states', label: 'Most affordable states' },
  { id: 'metro-vs-regional',      label: 'Metro vs regional costs' },
  { id: 'why-costs-vary',         label: 'Why childcare costs vary' },
  { id: 'family-day-care',        label: 'Family day care vs centre-based' },
  { id: 'oshc-costs',             label: 'Outside school hours care costs' },
  { id: 'reduce-costs',           label: 'How to reduce your childcare costs' },
  { id: 'common-questions',       label: 'Common questions' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'What is the average daily childcare fee in Australia?',
    answer:
      'The national average daily fee for centre-based day care in 2025\u201326 is approximately $140 per day, but this varies significantly by state \u2014 from around $110/day in the Northern Territory to $175/day in the ACT. Family day care averages around $118/day nationally, and outside school hours care averages around $45/day.',
  },
  {
    question: 'Which state has the most expensive childcare?',
    answer:
      'The Australian Capital Territory (ACT) consistently has the highest average childcare fees, at around $175/day for centre-based day care. New South Wales is the second most expensive at approximately $158/day. High land costs, high staff wages, and strong demand in Canberra drive ACT fees well above the national average.',
  },
  {
    question: 'Which state has the cheapest childcare?',
    answer:
      'The Northern Territory has the lowest average fees at approximately $110/day for centre-based day care, followed by Tasmania at $122/day. Lower costs reflect lower land prices, lower average wages, and smaller provider operating costs in these states. Note that fewer providers and greater distances can offset the lower fees for some families.',
  },
  {
    question: 'Does the Child Care Subsidy cover the full daily fee?',
    answer:
      'No. The CCS subsidises a percentage of the fee up to an hourly rate cap \u2014 for centre-based day care with a child under school age, the cap is $14.63/hour ($146.30 for a 10-hour day). If your provider charges above the cap, you pay the difference out of pocket regardless of your CCS percentage. At the $140/day national average, most families are close to or under the cap.',
  },
  {
    question: 'Are childcare costs tax-deductible in Australia?',
    answer:
      'No. Childcare costs are not tax-deductible in Australia. The government assists through the Child Care Subsidy (CCS) rather than a tax deduction. However, the CCS is effectively a subsidy applied directly to your fees, which is more valuable for most families than a deduction would be.',
  },
  {
    question: 'Why is childcare so expensive in Australia?',
    answer:
      'Australian childcare costs are driven by regulatory staff-to-child ratios (1:4 for under-2s, 1:5 for 2\u20133 year olds), mandatory staff qualifications, high land and property costs (especially in metro areas), high wages relative to many other countries, and CPI-linked fee increases. The CCS system also creates less price pressure because many families pay only their gap fee, not the full daily fee.',
  },
  {
    question: 'Is family day care cheaper than centre-based care?',
    answer:
      'Generally yes. Family day care averages $118/day nationally compared to $140/day for centre-based care \u2014 about 16% cheaper. The lower cost reflects smaller premises, lower overhead, and the educator working from home. However, family day care has the same hourly rate cap ($12.43/hour) which is actually lower than the centre-based cap ($14.63/hour for under school age), so the CCS subsidy may cover a smaller proportion.',
  },
  {
    question: 'How much do fees increase each year?',
    answer:
      'Childcare fees typically increase 4\u20137% per year, faster than general CPI inflation. The ACCC reported average fee increases of around 6% in 2023\u201324. The hourly rate caps are adjusted periodically (usually in July) but have not always kept pace with fee increases, meaning more families find their provider charging above the cap over time.',
  },
];

// ─── Related guides ──────────────────────────────────────────────────────────

const RELATED = [
  {
    href: '/guides/how-ccs-works',
    title: 'How the CCS Works',
    description:
      'How the income test, hourly rate caps, and activity test determine your subsidy percentage.',
  },
  {
    href: '/guides/government-vs-private-childcare',
    title: 'Government vs Private Childcare',
    description:
      'What the ACCC found: not-for-profit centres cost ~8% less on average, with comparable quality ratings.',
  },
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'How your family income determines your subsidy percentage, with the full income-rate table.',
  },
];

// ─── State fee data (from state-averages.json) ────────────────────────────────

const STATE_FEES = [
  { state: 'ACT', name: 'Australian Capital Territory', cbdc: 175, fdc: 140, oshc: 55 },
  { state: 'NSW', name: 'New South Wales',               cbdc: 158, fdc: 128, oshc: 50 },
  { state: 'VIC', name: 'Victoria',                      cbdc: 148, fdc: 122, oshc: 48 },
  { state: 'QLD', name: 'Queensland',                    cbdc: 142, fdc: 118, oshc: 45 },
  { state: 'WA',  name: 'Western Australia',             cbdc: 135, fdc: 115, oshc: 44 },
  { state: 'SA',  name: 'South Australia',               cbdc: 130, fdc: 112, oshc: 43 },
  { state: 'TAS', name: 'Tasmania',                      cbdc: 122, fdc: 108, oshc: 40 },
  { state: 'NT',  name: 'Northern Territory',            cbdc: 110, fdc: 100, oshc: 38 },
];

// Hourly rate cap for CBDC under school age = $14.63/hour × 10 hours = $146.30/day
const RATE_CAP_CBDC = 146.30;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ChildcareCostsByStatePage() {
  const nationalAvgCbdc = Math.round(
    STATE_FEES.reduce((sum, s) => sum + s.cbdc, 0) / STATE_FEES.length
  );
  const nationalAvgFdc = Math.round(
    STATE_FEES.reduce((sum, s) => sum + s.fdc, 0) / STATE_FEES.length
  );
  const nationalAvgOshc = Math.round(
    STATE_FEES.reduce((sum, s) => sum + s.oshc, 0) / STATE_FEES.length
  );

  return (
    <GuideLayout
      title="Childcare Costs by State 2025–26"
      description="Average daily childcare fees vary by up to $65/day depending on which state you live in. Here's how NSW, VIC, QLD, WA, SA, TAS, ACT, and NT compare — plus why costs differ and how to reduce them."
      lastUpdated="2026-02-22"
      readingTimeMinutes={6}
      breadcrumbs={[{ label: 'Childcare Costs by State' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/childcare-costs-by-state"
    >

      {/* ================================================================== */}
      {/* NATIONAL OVERVIEW                                                  */}
      {/* ================================================================== */}
      <h2 id="national-overview">National cost overview</h2>

      <p>
        Australian childcare costs vary significantly depending on where you live, the type of care
        you choose, and your child&apos;s age. Understanding the average daily fee in your state
        is important because it determines your out-of-pocket costs even after the{' '}
        <strong>Child Care Subsidy (CCS)</strong> is applied.
      </p>

      <p>
        Here are the national average daily fees for FY 2025&ndash;26:
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">Care type</th>
              <th className="text-right px-4 py-3 font-semibold">National avg / day</th>
              <th className="text-right px-4 py-3 font-semibold">National avg / week (5 days)</th>
              <th className="text-right px-4 py-3 font-semibold">National avg / year (5 days)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main">Centre-based day care</td>
              <td className="px-4 py-3 text-right text-text-main">${nationalAvgCbdc}</td>
              <td className="px-4 py-3 text-right text-text-main">${(nationalAvgCbdc * 5).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-text-main">${(nationalAvgCbdc * 5 * 48).toLocaleString()}</td>
            </tr>
            <tr className="border-b border-border bg-background">
              <td className="px-4 py-3 font-medium text-text-main">Family day care</td>
              <td className="px-4 py-3 text-right text-text-main">${nationalAvgFdc}</td>
              <td className="px-4 py-3 text-right text-text-main">${(nationalAvgFdc * 5).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-text-main">${(nationalAvgFdc * 5 * 48).toLocaleString()}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-text-main">Outside school hours care (OSHC)</td>
              <td className="px-4 py-3 text-right text-text-main">${nationalAvgOshc}</td>
              <td className="px-4 py-3 text-right text-text-main">${(nationalAvgOshc * 5).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-text-main">${(nationalAvgOshc * 5 * 48).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-muted mt-2">
          Source: ABS/ACCC childcare enquiry data 2024&ndash;25. Annual cost calculated over 48 weeks.
        </p>
      </div>

      <div className="callout">
        <strong>Remember the CCS:</strong> Most families don&apos;t pay these full amounts.
        The Child Care Subsidy covers between 0% and 90% of the fee (up to the hourly rate cap).
        Use the <a href="/childcare-subsidy-calculator">CCS Calculator</a> to see your actual
        out-of-pocket cost.
      </div>

      {/* ================================================================== */}
      {/* STATE COMPARISON TABLE                                             */}
      {/* ================================================================== */}
      <h2 id="state-comparison-table">State-by-state comparison</h2>

      <p>
        The table below shows average daily fees by state for each main care type. Fees are
        sorted from most expensive to most affordable. The CCS hourly rate cap for centre-based
        day care (children under school age) is <strong>$14.63/hour</strong>, equivalent to{' '}
        <strong>$146.30 for a 10-hour day</strong> &mdash; fees above this cap are paid 100%
        out of pocket.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">State / Territory</th>
              <th className="text-right px-4 py-3 font-semibold">Centre-based<br/>day care / day</th>
              <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">vs rate cap</th>
              <th className="text-right px-4 py-3 font-semibold">Family<br/>day care / day</th>
              <th className="text-right px-4 py-3 font-semibold">OSHC<br/>/ session</th>
            </tr>
          </thead>
          <tbody>
            {STATE_FEES.map((s, i) => {
              const aboveCap = s.cbdc > RATE_CAP_CBDC;
              return (
                <tr key={s.state} className={`border-b border-border ${i % 2 === 1 ? 'bg-background' : ''}`}>
                  <td className="px-4 py-3 font-medium text-text-main">
                    <span className="font-bold">{s.state}</span>
                    <span className="hidden sm:inline text-muted font-normal ml-1">— {s.name}</span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${aboveCap ? 'text-amber-600 dark:text-amber-400' : 'text-text-main'}`}>
                    ${s.cbdc}
                    {aboveCap && <span className="text-xs ml-1">↑</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-sm hidden sm:table-cell">
                    {aboveCap ? (
                      <span className="text-amber-600 dark:text-amber-400">
                        +${(s.cbdc - RATE_CAP_CBDC).toFixed(0)} above cap
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">
                        ${(RATE_CAP_CBDC - s.cbdc).toFixed(0)} under cap
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-text-main">${s.fdc}</td>
                  <td className="px-4 py-3 text-right text-text-main">${s.oshc}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-teal-50 dark:bg-teal-900/20 font-semibold">
              <td className="px-4 py-3 text-text-main">National average</td>
              <td className="px-4 py-3 text-right text-text-main">${nationalAvgCbdc}</td>
              <td className="px-4 py-3 text-right hidden sm:table-cell text-muted text-sm">
                ${(RATE_CAP_CBDC - nationalAvgCbdc).toFixed(0)} under cap
              </td>
              <td className="px-4 py-3 text-right text-text-main">${nationalAvgFdc}</td>
              <td className="px-4 py-3 text-right text-text-main">${nationalAvgOshc}</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-xs text-muted mt-2">
          ↑ Amber = fee exceeds the CCS hourly rate cap for centre-based day care (under school age).
          Families pay the above-cap amount 100% out of pocket.
        </p>
      </div>

      {/* ================================================================== */}
      {/* MOST EXPENSIVE STATES                                              */}
      {/* ================================================================== */}
      <h2 id="most-expensive-states">Most expensive states: ACT and NSW</h2>

      <h3>Australian Capital Territory (ACT) — $175/day</h3>
      <p>
        Canberra consistently tops the nation for childcare fees. At <strong>$175/day</strong> for
        centre-based day care, ACT fees are $28.70 above the hourly rate cap &mdash; meaning
        Canberra families pay that gap entirely out of pocket, on top of their normal gap fee.
        For a family on 5 days per week, that&apos;s an extra $143.50/week or around $6,900/year
        compared to a family whose fee sits under the cap.
      </p>
      <p>
        The high costs reflect Canberra&apos;s high median wages (which drive staff costs), high
        land prices, and strong demand from a population with above-average household incomes.
      </p>

      <h3>New South Wales (NSW) — $158/day</h3>
      <p>
        NSW is the second most expensive state, averaging <strong>$158/day</strong> for
        centre-based day care &mdash; $11.70 above the rate cap. Metro Sydney drives most of this:
        inner-city and North Shore providers routinely charge $170&ndash;$200/day, while western
        Sydney and regional NSW are closer to $130&ndash;$145/day.
      </p>

      {/* ================================================================== */}
      {/* MOST AFFORDABLE STATES                                             */}
      {/* ================================================================== */}
      <h2 id="most-affordable-states">Most affordable states: NT and TAS</h2>

      <h3>Northern Territory (NT) — $110/day</h3>
      <p>
        The NT has the lowest average fees nationally at <strong>$110/day</strong>, well below the
        $146.30 hourly rate cap. Families in the NT benefit from fees that are fully within the
        cap, meaning the CCS covers the full subsidised percentage without any above-cap top-up.
        However, the NT has a limited number of approved providers and many families in remote
        areas have little choice of provider.
      </p>

      <h3>Tasmania (TAS) — $122/day</h3>
      <p>
        Tasmania averages <strong>$122/day</strong>, also well under the rate cap. Lower operating
        costs (land, labour) drive the difference. Hobart has slightly higher fees than regional
        Tasmania, but even the state&apos;s most expensive providers tend to stay under the cap.
      </p>

      {/* ================================================================== */}
      {/* METRO VS REGIONAL                                                  */}
      {/* ================================================================== */}
      <h2 id="metro-vs-regional">Metro vs regional costs</h2>

      <p>
        The state averages in the table above mask significant variation <em>within</em> each
        state. In general:
      </p>

      <ul>
        <li>
          <strong>Inner-city metro areas</strong> (Sydney CBD, Melbourne inner suburbs, Canberra)
          charge the most &mdash; often 20&ndash;30% above the state average. High land costs,
          high staff wages, and strong demand from high-income households all contribute.
        </li>
        <li>
          <strong>Outer metro and suburban areas</strong> typically sit near the state average.
          Competition between providers is higher, and land costs are more moderate.
        </li>
        <li>
          <strong>Regional cities</strong> (Geelong, Townsville, Toowoomba) are often 5&ndash;15%
          below the state average, reflecting lower operating costs.
        </li>
        <li>
          <strong>Remote and very remote areas</strong> vary widely. Some remote areas have
          very low fees due to government-subsidised provision; others have limited choices and
          higher fees to cover the cost of providing care in isolated communities.
        </li>
      </ul>

      <div className="callout">
        <strong>Practical tip:</strong> When comparing providers, check whether their fee is
        above or below the CCS hourly rate cap. A provider charging $180/day isn&apos;t
        necessarily bad value &mdash; but you&apos;ll need to factor in the $33.70 above-cap gap
        that CCS doesn&apos;t cover at all.
      </div>

      {/* ================================================================== */}
      {/* WHY COSTS VARY                                                     */}
      {/* ================================================================== */}
      <h2 id="why-costs-vary">Why childcare costs vary so much</h2>

      <p>
        Several structural factors drive the difference in fees between states and between
        providers within the same suburb:
      </p>

      <h3>1. Staff-to-child ratios and wage costs</h3>
      <p>
        Staff wages typically account for 65&ndash;75% of a centre&apos;s operating costs.
        In states with higher median wages (ACT, NSW), staff costs are higher. Mandatory
        staff-to-child ratios set a floor on staffing: 1 educator per 4 children under 2,
        1 per 5 children aged 2&ndash;3, and 1 per 11 for preschool-age children. Centres
        cannot reduce staff below these ratios to cut costs.
      </p>

      <h3>2. Land and premises costs</h3>
      <p>
        Centre premises are either rented or owned. In inner-city Sydney and Melbourne, commercial
        rent can be $150,000&ndash;$400,000/year for a centre with 60&ndash;80 places &mdash; a
        cost that feeds directly into daily fees. Regional and outer-suburban centres face much
        lower land costs.
      </p>

      <h3>3. Provider type (not-for-profit vs private)</h3>
      <p>
        The ACCC&apos;s 2023 childcare inquiry found that not-for-profit centres charge, on
        average, <strong>about 8% less</strong> than for-profit (private) centres.
        Not-for-profits don&apos;t pay dividends to shareholders, so more revenue goes
        into operating costs and lower fees. See our guide on{' '}
        <a href="/guides/government-vs-private-childcare">government vs private childcare</a> for
        more detail.
      </p>

      <h3>4. Quality and NQS rating</h3>
      <p>
        Centres rated <em>Exceeding the National Quality Standard</em> or{' '}
        <em>Outstanding</em> often charge more, reflecting higher investment in staff
        qualifications and programming. However, the correlation is imperfect &mdash; many
        <em>Meeting NQS</em> centres provide comparable quality at lower fees.
      </p>

      <h3>5. Market competition</h3>
      <p>
        Areas with many competing providers tend to have lower fees. Areas with a shortage of
        childcare places &mdash; particularly long day care for under-2s &mdash; have less
        competitive pressure, allowing providers to charge premium fees.
      </p>

      {/* ================================================================== */}
      {/* FAMILY DAY CARE                                                    */}
      {/* ================================================================== */}
      <h2 id="family-day-care">Family day care vs centre-based care</h2>

      <p>
        Family day care (FDC) is consistently cheaper than centre-based day care in every state.
        The national average gap is about <strong>$22/day</strong> (${nationalAvgCbdc} centre vs
        ${nationalAvgFdc} FDC). Over a year on 3 days per week, that&apos;s roughly{' '}
        <strong>${((nationalAvgCbdc - nationalAvgFdc) * 3 * 48).toLocaleString()}</strong> cheaper.
      </p>

      <p>
        However, the <strong>CCS hourly rate cap for family day care is $12.43/hour</strong>{' '}
        compared to $14.63/hour for centre-based care (children under school age). This lower cap
        means the CCS covers a slightly smaller share of the fee, partially offsetting the lower
        headline price. For a 9-hour family day care day, the cap is $111.87 &mdash; meaning most
        state-average FDC fees are above the cap.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 font-semibold">State</th>
              <th className="text-right px-4 py-3 font-semibold">FDC avg fee<br/>(9-hr day)</th>
              <th className="text-right px-4 py-3 font-semibold">FDC rate cap<br/>(9 hrs × $12.43)</th>
              <th className="text-right px-4 py-3 font-semibold">Above-cap amount</th>
            </tr>
          </thead>
          <tbody>
            {STATE_FEES.map((s, i) => {
              const fdcCap = 9 * 12.43; // $111.87
              const aboveFdcCap = Math.max(0, s.fdc - fdcCap);
              return (
                <tr key={s.state} className={`border-b border-border ${i % 2 === 1 ? 'bg-background' : ''}`}>
                  <td className="px-4 py-3 font-medium text-text-main">{s.state}</td>
                  <td className="px-4 py-3 text-right text-text-main">${s.fdc}</td>
                  <td className="px-4 py-3 text-right text-muted">$111.87</td>
                  <td className={`px-4 py-3 text-right font-semibold ${aboveFdcCap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                    {aboveFdcCap > 0 ? `+$${aboveFdcCap.toFixed(2)}` : 'Under cap'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-muted mt-2">
          FDC rate cap: $12.43/hour (all ages). Assumes 9-hour care day.
        </p>
      </div>

      {/* ================================================================== */}
      {/* OSHC COSTS                                                         */}
      {/* ================================================================== */}
      <h2 id="oshc-costs">Outside school hours care (OSHC) costs</h2>

      <p>
        Outside school hours care &mdash; before school, after school, and vacation care &mdash;
        is significantly cheaper than long day care. National average fees range from{' '}
        <strong>$38/session in the NT</strong> to <strong>$55/session in the ACT</strong> for a
        combined before-and-after school day.
      </p>

      <p>
        The CCS hourly rate cap for OSHC is <strong>$12.81/hour</strong> &mdash; the same as
        centre-based day care for school-age children. A 4-hour OSHC session (2 hrs before +
        2 hrs after) has a cap of $51.24. At the national average of ${nationalAvgOshc}/session,
        most states are close to the cap or slightly above.
      </p>

      <p>
        For school-age children, OSHC is often the main childcare expense. A family using 5 days
        per week at the national average spends around{' '}
        <strong>${(nationalAvgOshc * 5 * 40).toLocaleString()}/year</strong> (over 40 school weeks)
        before CCS &mdash; substantially less than long day care.
      </p>

      {/* ================================================================== */}
      {/* REDUCE COSTS                                                       */}
      {/* ================================================================== */}
      <h2 id="reduce-costs">How to reduce your childcare costs</h2>

      <h3>1. Check whether your provider is above the CCS rate cap</h3>
      <p>
        If your provider charges above the CCS hourly rate cap, you pay the above-cap amount
        regardless of your CCS percentage. Switching to a provider at or below the cap &mdash;
        even if their headline fee is similar &mdash; can save hundreds or thousands of dollars
        per year.
      </p>

      <h3>2. Consider family day care</h3>
      <p>
        Family day care is 15&ndash;20% cheaper than centre-based care on average. While the
        CCS cap is lower, families who value smaller group sizes and a home environment can save
        significantly. Compare your actual out-of-pocket cost (not just the daily fee) using the
        calculator.
      </p>

      <h3>3. Check whether you qualify for the higher CCS rate</h3>
      <p>
        Families with two or more children in approved care, where the youngest is under 6,
        receive a higher CCS rate on younger children &mdash; up to 95% subsidy. This can reduce
        the gap fee on a younger sibling&apos;s care by thousands of dollars per year.
      </p>

      <h3>4. Update your income estimate promptly</h3>
      <p>
        If your family income drops (job loss, parental leave, reduced hours), update your income
        estimate with Centrelink immediately. Your CCS percentage will increase from the next
        fortnight, reducing your gap fee right away rather than waiting for end-of-year
        reconciliation.
      </p>

      <h3>5. Compare not-for-profit providers in your area</h3>
      <p>
        Not-for-profit centres average 8% lower fees than private centres. Search the{' '}
        <a href="https://www.acecqa.gov.au/resources/national-registers" target="_blank" rel="noopener noreferrer">
          ACECQA National Register
        </a>{' '}
        to check provider type and quality ratings in your area.
      </p>

      <h3>6. Use the 3-day guarantee if you&apos;re not working</h3>
      <p>
        Since 5 January 2026, all eligible families receive at least 72 subsidised hours per
        fortnight (about 3 days/week) regardless of activity level. If you were previously
        receiving fewer subsidised hours, check whether your entitlement has increased. See our{' '}
        <a href="/guides/3-day-guarantee">3-Day Guarantee guide</a> for details.
      </p>

    </GuideLayout>
  );
}
