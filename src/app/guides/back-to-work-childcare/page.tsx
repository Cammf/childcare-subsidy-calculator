// =============================================================================
// GUIDE: Is It Worth Going Back to Work? (FY 2025–26)
// =============================================================================
// The unique content piece competitors don't have. 2,500+ word deep dive into
// the real financial impact of returning to work — with three detailed worked
// examples at low, middle, and high income levels.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Is It Worth Going Back to Work? (2025–26 Guide) | ${SITE_NAME}`,
  description:
    'The real financial calculation for Australian parents returning to work — income vs tax, reduced CCS, extra childcare costs, and work expenses. Three detailed worked examples at low, middle, and high income.',
  alternates: { canonical: `${SITE_URL}/guides/back-to-work-childcare` },
  openGraph: {
    title: 'Is It Worth Going Back to Work? — A Financial Deep Dive',
    description:
      'See the true take-home benefit of returning to work after factoring in tax, CCS reduction, childcare costs, and work expenses.',
    url: `${SITE_URL}/guides/back-to-work-childcare`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'the-real-question',    label: 'The real question' },
  { id: 'five-costs',           label: 'The five costs of returning to work' },
  { id: 'ccs-cascade',          label: 'How returning to work reduces your CCS' },
  { id: 'example-low',          label: 'Example 1: Low income ($70k family)' },
  { id: 'example-middle',       label: 'Example 2: Middle income ($138k family)' },
  { id: 'example-high',         label: 'Example 3: High income ($222k family)' },
  { id: 'part-time-comparison', label: 'Part-time vs full-time' },
  { id: 'hidden-costs',         label: 'Hidden costs people forget' },
  { id: 'hidden-benefits',      label: 'The benefits beyond money' },
  { id: 'how-to-decide',        label: 'How to decide' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'Is it financially worth going back to work with childcare costs?',
    answer:
      'In most cases, yes — even after accounting for tax, reduced CCS, and work expenses, returning to work produces a positive net benefit. However, the effective hourly rate can be significantly lower than your headline salary. Use our <a href="/back-to-work-calculator">back-to-work calculator</a> to see your personal numbers.',
  },
  {
    question: 'How much does returning to work reduce my childcare subsidy?',
    answer:
      'The CCS reduction depends on how much your combined family income increases. For every $5,000 your combined income rises above $85,279, CCS drops by 1 percentage point. A parent earning $50,000 who returns 3 days a week adds $30,000 to the family income, potentially dropping CCS by up to 6 percentage points.',
  },
  {
    question: 'Is it better to work 3 days or 5 days a week?',
    answer:
      'The first 2–3 days typically produce the highest net return per hour, because you face the same fixed costs regardless. Days 4 and 5 face diminishing returns as marginal tax rates are higher and no new tax-free threshold applies. Many families find 3–4 days is the financial sweet spot.',
  },
  {
    question: 'What is my effective hourly rate after childcare?',
    answer:
      'Your effective hourly rate is your total net benefit from working (income minus tax, minus extra childcare costs, minus work costs) divided by total hours worked. It is almost always lower than your pre-tax hourly rate — sometimes significantly. Our calculator shows this figure for every scenario from 1 to 5 days.',
  },
  {
    question: 'Should I count superannuation as a benefit of working?',
    answer:
      'Yes. Employer super contributions (11.5% in FY 2025–26) are a real financial benefit that doesn\'t appear in your take-home pay but builds your retirement savings. Three days a week at $80,000 FTE earns roughly $5,520 per year in super that you would not receive as a stay-at-home parent.',
  },
  {
    question: 'What if my childcare costs more than I earn?',
    answer:
      'In rare cases — typically very high childcare fees combined with low earning potential and multiple children — the net financial benefit of working can be negative. If this is your situation, consider the long-term career and superannuation implications before deciding. A year or two of short-term cost can protect decades of earning potential.',
  },
];

// ─── Related guides ──────────────────────────────────────────────────────────

const RELATED = [
  {
    href: '/guides/how-ccs-works',
    title: 'How the Child Care Subsidy Works',
    description:
      'The complete CCS explainer — income test, rate caps, activity test, and two worked examples.',
  },
  {
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'Full income threshold table and tapering formula with worked examples at every key income level.',
  },
  {
    href: '/guides/3-day-guarantee',
    title: 'The 3-Day Guarantee (2026)',
    description:
      'How the new 72-hour minimum guarantee affects families returning to work.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BackToWorkGuidePage() {
  return (
    <GuideLayout
      title="Is It Worth Going Back to Work?"
      description="The real financial calculation for Australian parents — income vs tax, reduced CCS, extra childcare costs, and work expenses. Three worked examples show exactly what returning to work is worth at different income levels."
      lastUpdated="2026-02-22"
      readingTimeMinutes={12}
      breadcrumbs={[{ label: 'Going Back to Work' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/back-to-work-childcare"
    >
      {/* ================================================================== */}
      {/* THE REAL QUESTION                                                  */}
      {/* ================================================================== */}
      <h2 id="the-real-question">The real question</h2>

      <p>
        &ldquo;Is it worth going back to work?&rdquo; is one of the most common questions
        Australian parents ask — and one of the most misunderstood.
      </p>

      <p>
        The simple version — <em>I&apos;ll earn $X and childcare costs $Y, so I&apos;m ahead
        by $X&nbsp;−&nbsp;$Y</em> — misses several major factors. When you return to work,
        your family&apos;s combined income rises, which means:
      </p>

      <ul>
        <li>You pay <strong>income tax</strong> on your new earnings</li>
        <li>Your higher combined income can <strong>reduce your CCS rate</strong></li>
        <li>You face <strong>new childcare costs</strong> that didn&apos;t exist before</li>
        <li>You incur <strong>work-related costs</strong> — commuting, lunches, clothing</li>
      </ul>

      <p>
        The question isn&apos;t &ldquo;how much will I earn?&rdquo; — it&apos;s
        &ldquo;<strong>how much will my family be better off?</strong>&rdquo; after
        accounting for every cost that comes with working.
      </p>

      {/* ================================================================== */}
      {/* THE FIVE COSTS                                                     */}
      {/* ================================================================== */}
      <h2 id="five-costs">The five costs of returning to work</h2>

      <p>When a parent returns to work, the family faces five financial impacts:</p>

      <ol>
        <li>
          <strong>Income tax</strong> — Your new income is taxed at your marginal rate. A
          parent earning $48,000 (3 days at $80k FTE) pays roughly $5,900 in tax and Medicare.
        </li>
        <li>
          <strong>Reduced CCS</strong> — If your new combined family income pushes you above
          $85,279, your CCS percentage drops. Every $5,000 increase costs 1 percentage point.
        </li>
        <li>
          <strong>New childcare fees</strong> — You now need to pay for care that didn&apos;t
          exist when you were home. Even with CCS, the out-of-pocket gap adds up.
        </li>
        <li>
          <strong>Work-related costs</strong> — Commuting, parking, professional clothing,
          bought lunches, and other expenses that don&apos;t exist when you&apos;re at home.
        </li>
        <li>
          <strong>Lost benefits</strong> — Some family payments (like Family Tax Benefit Part B)
          may reduce as your income rises.
        </li>
      </ol>

      <div className="callout-warning">
        <strong>The good news:</strong> For the vast majority of families, returning to work is
        still financially positive — even after all five costs. The question is usually about
        <em> how much</em> you&apos;re ahead, not whether you&apos;re ahead at all.
      </div>

      {/* ================================================================== */}
      {/* CCS CASCADE                                                        */}
      {/* ================================================================== */}
      <h2 id="ccs-cascade">How returning to work reduces your CCS</h2>

      <p>
        This is the part that surprises most parents. The Child Care Subsidy is based on your
        <strong> combined family income</strong>, not just the working parent&apos;s income.
        When you go back to work, your combined income rises — and your CCS rate falls.
      </p>

      <p>Here&apos;s how the cascade works:</p>

      <ol>
        <li>You return to work and earn additional income</li>
        <li>Your combined family income increases</li>
        <li>The higher income pushes you into a lower CCS bracket</li>
        <li>Your childcare subsidy percentage drops</li>
        <li>You pay a larger gap fee per day of childcare</li>
        <li>The extra childcare cost eats into your income gain</li>
      </ol>

      <p>
        The size of this effect depends on where your family sits on the income scale. If
        your combined income is well below $85,279 even after returning to work, you keep
        the full 90% CCS — no cascade at all. But if returning to work pushes your combined
        income from $90,000 to $140,000, you could lose 10 percentage points of CCS.
      </p>

      <div className="callout">
        <strong>Key insight:</strong> The CCS reduction is a <em>percentage of the fee</em>,
        not a fixed dollar amount. If your childcare fee is $150/day and CCS drops from 85%
        to 75%, that&apos;s an extra $15/day (10% × $150) — or $2,250/year at 3 days per
        week. That reduces your effective hourly rate, but rarely wipes out the benefit of
        working entirely.
      </div>

      {/* ================================================================== */}
      {/* EXAMPLE 1: LOW INCOME                                              */}
      {/* ================================================================== */}
      <h2 id="example-low">Example 1: Low income — Jenny returns 3 days/week</h2>

      <div className="callout">
        <strong>The scenario:</strong> Jenny&apos;s partner earns $40,000. Jenny is returning
        to work at a $50,000 FTE salary, working 3 days per week (proportional income: $30,000).
        Their 2-year-old will attend centre-based day care at $130 per day.
      </div>

      <table>
        <thead>
          <tr><th></th><th>Before</th><th>After</th></tr>
        </thead>
        <tbody>
          <tr><td>Combined family income</td><td>$40,000</td><td>$70,000</td></tr>
          <tr><td>CCS rate</td><td>90%</td><td>90%</td></tr>
        </tbody>
      </table>

      <p>
        Jenny&apos;s combined income stays below $85,279, so <strong>CCS stays at the maximum
        90%</strong> — no cascade effect at all.
      </p>

      <p><strong>The financial breakdown:</strong></p>

      <table>
        <thead>
          <tr><th>Item</th><th>Annual</th></tr>
        </thead>
        <tbody>
          <tr><td>Jenny&apos;s gross income (3 days at $50k FTE)</td><td>+$30,000</td></tr>
          <tr><td>Income tax + Medicare (less LITO)</td><td>−$1,788</td></tr>
          <tr><td>Net take-home income</td><td><strong>+$28,212</strong></td></tr>
          <tr><td>Childcare fees (3 days × $130 × 50 weeks)</td><td>−$19,500</td></tr>
          <tr><td>Government pays (CCS at 90%)</td><td>+$17,550</td></tr>
          <tr><td>Childcare out-of-pocket</td><td>−$1,950</td></tr>
          <tr><td>Work costs ($40/week)</td><td>−$2,000</td></tr>
          <tr><td className="font-bold">Net benefit of working</td><td className="font-bold text-green-700 dark:text-green-400">+$24,262/year</td></tr>
          <tr><td>Effective hourly rate</td><td>$21.28/hr</td></tr>
        </tbody>
      </table>

      <p>
        <strong>The verdict:</strong> Jenny&apos;s family is <strong>$24,262 per year better
        off</strong>. Her effective hourly rate is $21.28 — lower than her headline $24.04/hr
        (at $50k FTE), but a strong net positive. Because their combined income stays under the
        $85,279 threshold, CCS didn&apos;t reduce at all.
      </p>

      {/* ================================================================== */}
      {/* EXAMPLE 2: MIDDLE INCOME                                           */}
      {/* ================================================================== */}
      <h2 id="example-middle">Example 2: Middle income — Priya returns 3 days/week</h2>

      <div className="callout">
        <strong>The scenario:</strong> Priya&apos;s partner earns $90,000. Priya is returning
        at an $80,000 FTE salary, working 3 days per week (proportional income: $48,000). Their
        3-year-old will attend centre-based day care at $150 per day.
      </div>

      <table>
        <thead>
          <tr><th></th><th>Before</th><th>After</th></tr>
        </thead>
        <tbody>
          <tr><td>Combined family income</td><td>$90,000</td><td>$138,000</td></tr>
          <tr><td>CCS rate</td><td>89%</td><td>79%</td></tr>
          <tr><td>CCS rate change</td><td colSpan={2}>−10 percentage points</td></tr>
        </tbody>
      </table>

      <p>
        Here the CCS cascade is visible: Priya&apos;s income pushes the family from $90,000
        to $138,000, and <strong>CCS drops from 89% to 79%</strong>. That 10-point drop means
        the government covers 10% less of the childcare fee.
      </p>

      <p><strong>The financial breakdown:</strong></p>

      <table>
        <thead>
          <tr><th>Item</th><th>Annual</th></tr>
        </thead>
        <tbody>
          <tr><td>Priya&apos;s gross income (3 days at $80k FTE)</td><td>+$48,000</td></tr>
          <tr><td>Income tax + Medicare (less LITO)</td><td>−$5,868</td></tr>
          <tr><td>Net take-home income</td><td><strong>+$42,132</strong></td></tr>
          <tr><td>Childcare fees (3 days × $150 × 50 weeks)</td><td>−$22,500</td></tr>
          <tr><td>Government pays (CCS at 79%)</td><td>+$17,775</td></tr>
          <tr><td>Childcare out-of-pocket</td><td>−$4,725</td></tr>
          <tr><td>Work costs ($60/week)</td><td>−$3,000</td></tr>
          <tr><td className="font-bold">Net benefit of working</td><td className="font-bold text-green-700 dark:text-green-400">+$34,407/year</td></tr>
          <tr><td>Effective hourly rate</td><td>$30.18/hr</td></tr>
        </tbody>
      </table>

      <p>
        <strong>The CCS cascade cost Priya $2,250/year</strong> — that&apos;s the difference
        between paying 11% of the fee (if CCS had stayed at 89%) and paying 21% (at 79%).
        But her net benefit of $34,407/year means the cascade is a footnote, not a deal-breaker.
      </p>

      {/* ================================================================== */}
      {/* EXAMPLE 3: HIGH INCOME                                             */}
      {/* ================================================================== */}
      <h2 id="example-high">Example 3: High income — Sarah returns 3 days/week</h2>

      <div className="callout">
        <strong>The scenario:</strong> Sarah&apos;s partner earns $150,000. Sarah is returning
        at a $120,000 FTE salary, working 3 days per week (proportional income: $72,000). Their
        4-year-old will attend centre-based day care at $160 per day.
      </div>

      <table>
        <thead>
          <tr><th></th><th>Before</th><th>After</th></tr>
        </thead>
        <tbody>
          <tr><td>Combined family income</td><td>$150,000</td><td>$222,000</td></tr>
          <tr><td>CCS rate</td><td>77%</td><td>62%</td></tr>
          <tr><td>CCS rate change</td><td colSpan={2}>−15 percentage points</td></tr>
        </tbody>
      </table>

      <p>
        The CCS cascade is more pronounced at higher incomes. Sarah&apos;s return drops CCS
        by 15 points — from 77% to 62%. But her higher income also means more tax.
      </p>

      <p><strong>The financial breakdown:</strong></p>

      <table>
        <thead>
          <tr><th>Item</th><th>Annual</th></tr>
        </thead>
        <tbody>
          <tr><td>Sarah&apos;s gross income (3 days at $120k FTE)</td><td>+$72,000</td></tr>
          <tr><td>Income tax + Medicare</td><td>−$13,828</td></tr>
          <tr><td>Net take-home income</td><td><strong>+$58,172</strong></td></tr>
          <tr><td>Childcare fees (3 days × $160 × 50 weeks)</td><td>−$24,000</td></tr>
          <tr><td>Government pays (CCS at 62%)</td><td>+$14,880</td></tr>
          <tr><td>Childcare out-of-pocket</td><td>−$9,120</td></tr>
          <tr><td>Work costs ($100/week)</td><td>−$5,000</td></tr>
          <tr><td className="font-bold">Net benefit of working</td><td className="font-bold text-green-700 dark:text-green-400">+$44,052/year</td></tr>
          <tr><td>Effective hourly rate</td><td>$38.64/hr</td></tr>
        </tbody>
      </table>

      <p>
        Despite losing 15 percentage points of CCS, Sarah&apos;s family is <strong>$44,052
        per year better off</strong>. Her effective hourly rate of $38.64 is well below her
        headline $57.69/hr (at $120k FTE), but the absolute dollar benefit is the highest of
        our three examples — because higher income simply generates more after-tax dollars.
      </p>

      <div className="callout-tip">
        <strong>The pattern across all three examples:</strong> Returning to work is
        financially positive at every income level. The CCS cascade reduces the effective
        hourly rate, but it never comes close to wiping out the net benefit. The real question
        is whether the effective hourly rate feels &ldquo;worth it&rdquo; for the hours and
        effort involved.
      </div>

      {/* ================================================================== */}
      {/* PART-TIME VS FULL-TIME                                             */}
      {/* ================================================================== */}
      <h2 id="part-time-comparison">Part-time vs full-time</h2>

      <p>
        A question many parents face is whether to return 3 days or push to 5. The financial
        return per additional day is <strong>not equal</strong> — each extra day faces
        diminishing returns:
      </p>

      <ul>
        <li>
          <strong>Days 1–3</strong> produce the highest per-hour return. Your tax-free threshold
          and lower tax brackets absorb the first portion of income, and CCS may not yet be
          affected if you stay under $85,279 combined.
        </li>
        <li>
          <strong>Days 4–5</strong> produce lower per-hour returns. Your marginal tax rate is
          higher (every extra dollar is taxed at 30% or more), and the additional income pushes
          CCS down further. You also face the same fixed work costs over more days.
        </li>
      </ul>

      <p>
        Our{' '}
        <Link href="/back-to-work-calculator" className="text-primary underline">
          back-to-work calculator
        </Link>{' '}
        shows the net benefit for every scenario from 1 to 5 days, making it easy to compare
        the financial return at each level and find your family&apos;s optimal point.
      </p>

      {/* ================================================================== */}
      {/* HIDDEN COSTS                                                       */}
      {/* ================================================================== */}
      <h2 id="hidden-costs">Hidden costs people forget</h2>

      <p>Beyond the five main costs, parents often overlook:</p>

      <ul>
        <li>
          <strong>Sick days and closures</strong> — When your child is sick or the centre
          is closed, you may need to take unpaid leave or pay for backup care. Many centres
          still charge fees for absent days.
        </li>
        <li>
          <strong>School holiday care</strong> — If your child is school-age, you&apos;ll
          need (and pay for) vacation care during the 12 weeks of school holidays.
        </li>
        <li>
          <strong>The income estimate trap</strong> — If you underestimate your family income
          when setting up CCS, you may receive too much subsidy during the year and face a debt
          at reconciliation. Always update your income estimate when returning to work.
        </li>
        <li>
          <strong>Reduced Family Tax Benefit</strong> — Higher combined income can reduce
          Family Tax Benefit Part A and eliminate Part B entirely. Factor these in if they are a
          significant part of your current household income.
        </li>
      </ul>

      {/* ================================================================== */}
      {/* HIDDEN BENEFITS                                                    */}
      {/* ================================================================== */}
      <h2 id="hidden-benefits">The benefits beyond money</h2>

      <p>
        The financial calculation is important, but it&apos;s not the whole picture. Returning
        to work has significant <strong>long-term and non-financial benefits</strong> that
        don&apos;t appear in any spreadsheet:
      </p>

      <ul>
        <li>
          <strong>Superannuation</strong> — Employer super contributions (11.5% in FY 2025–26)
          compound over decades. Three days a week at $80,000 FTE earns roughly $5,520/year in
          super — money your future self will thank you for.
        </li>
        <li>
          <strong>Career continuity</strong> — Extended breaks from the workforce can
          make it harder to return at the same level later. Staying connected to your
          profession — even part-time — protects your long-term earning potential.
        </li>
        <li>
          <strong>Salary progression</strong> — Working now leads to pay rises, promotions,
          and experience that increase your earning capacity in future years when childcare
          costs end.
        </li>
        <li>
          <strong>Professional identity and wellbeing</strong> — Many parents report that
          working provides a sense of purpose, adult connection, and personal fulfilment that
          improves their overall wellbeing.
        </li>
        <li>
          <strong>Child development</strong> — Quality childcare is associated with positive
          social, emotional, and cognitive development. Your child benefits from the care
          environment, not just the time there.
        </li>
      </ul>

      <div className="callout">
        <strong>The bottom line:</strong> Even in the rare cases where the short-term financial
        return is marginal, the long-term career and superannuation implications usually make
        returning to work worthwhile. A year of breaking even financially can protect decades
        of earning potential.
      </div>

      {/* ================================================================== */}
      {/* HOW TO DECIDE                                                      */}
      {/* ================================================================== */}
      <h2 id="how-to-decide">How to decide</h2>

      <p>Here&apos;s a practical framework for making the decision:</p>

      <ol>
        <li>
          <strong>Run the numbers</strong> — Use our{' '}
          <Link href="/back-to-work-calculator" className="text-primary underline">
            back-to-work calculator
          </Link>{' '}
          to see your net benefit across 1–5 day scenarios. Look at the effective hourly
          rate, not just the total.
        </li>
        <li>
          <strong>Factor in super</strong> — Add roughly 11.5% of your proportional gross
          income as a hidden benefit that doesn&apos;t show in take-home pay.
        </li>
        <li>
          <strong>Consider the trajectory</strong> — Childcare costs are temporary (they end
          when children start school), but career breaks can have permanent effects on
          earning potential.
        </li>
        <li>
          <strong>Include the personal</strong> — Professional fulfilment, adult connection,
          and your child&apos;s benefit from quality care are real factors even if they
          can&apos;t be measured in dollars.
        </li>
        <li>
          <strong>Start with fewer days</strong> — If the numbers are tight, returning 2–3
          days per week gives you the highest per-hour return and lets you test the arrangement
          before committing to more.
        </li>
      </ol>

      <p>
        The decision is deeply personal, and there is no universally right answer. But with
        accurate numbers, you can make the choice that&apos;s right for your family with
        confidence rather than guesswork.
      </p>
    </GuideLayout>
  );
}
