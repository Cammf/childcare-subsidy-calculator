// =============================================================================
// GUIDE: The 3-Day Guarantee Explained — From 5 January 2026
// =============================================================================
// Timely guide covering the new 72-hour minimum subsidised care guarantee.
// Targets "3 day guarantee childcare", "childcare subsidy activity test 2026",
// "72 hours per fortnight childcare" queries.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import GuideLayout from '@/components/guide/GuideLayout';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `The 3-Day Guarantee Explained — Childcare Subsidy 2026 | ${SITE_NAME}`,
  description:
    'What changed on 5 January 2026: every eligible family now receives a minimum of 72 subsidised childcare hours per fortnight — about 3 days per week — regardless of activity level. Plain-language guide with worked examples.',
  alternates: { canonical: `${SITE_URL}/guides/3-day-guarantee` },
  openGraph: {
    title: 'The 3-Day Guarantee Explained — Childcare Subsidy 2026',
    description:
      'From 5 January 2026, all eligible families get 72 subsidised hours per fortnight regardless of activity. Here\u2019s what it means for your family.',
    url: `${SITE_URL}/guides/3-day-guarantee`,
    type: 'article',
  },
};

// ─── Table of Contents ───────────────────────────────────────────────────────

const TOC = [
  { id: 'what-changed',           label: 'What changed on 5 January 2026' },
  { id: 'old-vs-new',             label: 'Old rules vs new rules' },
  { id: '72-hours-in-practice',   label: 'What 72 hours per fortnight means' },
  { id: 'who-benefits',           label: 'Who benefits most' },
  { id: 'still-need-activity',    label: 'When you still need the activity test' },
  { id: 'worked-example-1',       label: 'Example: stay-at-home parent' },
  { id: 'worked-example-2',       label: 'Example: returning to work part-time' },
  { id: 'income-test-unchanged',  label: 'The income test hasn\u2019t changed' },
  { id: 'how-to-access',          label: 'How to access the 3-day guarantee' },
  { id: 'common-questions',       label: 'Common questions' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    question: 'What is the 3-day guarantee for childcare?',
    answer:
      'The 3-day guarantee is an Australian Government policy effective from 5 January 2026 that provides all eligible families with a minimum of 72 subsidised childcare hours per fortnight \u2014 equivalent to about 3 days per week \u2014 regardless of the parents\u2019 activity level. Previously, families where neither parent met the activity test received very limited or no subsidised hours.',
  },
  {
    question: 'Do I need to do anything to get the 3-day guarantee?',
    answer:
      'If you already receive CCS, the 3-day guarantee is applied automatically \u2014 no application needed. If you don\u2019t currently receive CCS, you need to <a href="/guides/how-ccs-works#how-to-apply">apply through myGov/Centrelink</a> first. Standard CCS eligibility requirements still apply (residency, child age, approved provider).',
  },
  {
    question: 'Can I still get more than 3 days of subsidised care?',
    answer:
      'Yes. The 3-day guarantee is the <em>minimum</em>. If you meet the activity test at the higher threshold (48+ hours of recognised activity per fortnight), you can access up to 100 subsidised hours per fortnight \u2014 enough for about 5 days per week. The guarantee only sets the floor, not the ceiling.',
  },
  {
    question: 'Does the 3-day guarantee change how much subsidy I get per hour?',
    answer:
      'No. The guarantee only affects the <em>number of subsidised hours</em> you can access. Your CCS percentage (the share of the fee the government pays) is still determined entirely by your family income. A family earning $150,000 still gets 77% \u2014 but they\u2019re now guaranteed at least 72 hours of that 77% subsidy per fortnight.',
  },
  {
    question: 'What counts as 72 hours per fortnight in days?',
    answer:
      '72 hours per fortnight translates to about 36 hours per week. In practice, that\u2019s roughly 3 days of long day care (12-hour sessions) or 3.6 days of shorter sessions (10 hours). Most families use it as 3 full days per week per child.',
  },
  {
    question: 'Does the 3-day guarantee apply to all types of childcare?',
    answer:
      'Yes \u2014 it applies to all CCS-approved care types including centre-based day care, family day care, outside school hours care (OSHC), and in-home care. The same hourly rate caps apply as before.',
  },
  {
    question: 'What if I only want 2 days of childcare per week?',
    answer:
      'The guarantee gives you the <em>option</em> to use up to 3 days \u2014 it doesn\u2019t require you to. If you only need 2 days, you simply use fewer hours than your 72-hour entitlement. There\u2019s no penalty for using less.',
  },
  {
    question: 'Is the 3-day guarantee permanent?',
    answer:
      'The 3-day guarantee was legislated by the Australian Parliament and took effect on 5 January 2026. As legislated policy, it would require a further act of Parliament to remove. It is considered a permanent change to the CCS system.',
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
    href: '/guides/ccs-income-thresholds',
    title: 'CCS Income Test Explained',
    description:
      'The tapering formula, full CCS rate table, what counts as family income, and common income sources people miss.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ThreeDayGuaranteePage() {
  return (
    <GuideLayout
      title="The 3-Day Guarantee Explained"
      description="From 5 January 2026, every eligible family receives a minimum of 72 subsidised childcare hours per fortnight \u2014 about 3 days per week \u2014 regardless of activity level. Here\u2019s what changed, who benefits, and what it means in practice."
      lastUpdated="2026-02-22"
      readingTimeMinutes={5}
      breadcrumbs={[{ label: 'The 3-Day Guarantee' }]}
      tocItems={TOC}
      faqItems={FAQ}
      relatedGuides={RELATED}
      slug="/guides/3-day-guarantee"
    >
      {/* ================================================================== */}
      {/* WHAT CHANGED                                                       */}
      {/* ================================================================== */}
      <h2 id="what-changed">What changed on 5 January 2026</h2>

      <p>
        On <strong>5 January 2026</strong>, the Australian Government introduced the{' '}
        <strong>3-day guarantee</strong> &mdash; a new minimum entitlement that ensures every
        eligible family can access at least <strong>72 subsidised childcare hours per
        fortnight</strong>, regardless of how many hours of work, study, or other activity the
        parents do.
      </p>

      <p>
        Before this change, the number of subsidised hours your family could access was entirely
        determined by the <strong>activity test</strong> &mdash; a system that tied your subsidised
        hours to the hours of recognised activity performed by the parent who did the least. If
        neither parent worked, studied, or volunteered enough hours, your family could receive very
        few or even zero subsidised hours.
      </p>

      <p>
        The 3-day guarantee removed that floor. Now, every family that meets the basic CCS
        eligibility requirements receives at least 72 subsidised hours per fortnight as a baseline
        &mdash; with more hours available for families who meet the higher activity thresholds.
      </p>

      <div className="callout">
        <strong>Key point:</strong> The 3-day guarantee changes the <em>number of hours</em> you
        can access. It does <em>not</em> change your CCS percentage (that&apos;s still based on
        income) or the hourly rate caps (those are still set by care type).
      </div>

      {/* ================================================================== */}
      {/* OLD VS NEW RULES                                                   */}
      {/* ================================================================== */}
      <h2 id="old-vs-new">Old rules vs new rules</h2>

      <p>
        The table below shows how the subsidised hours entitlement has changed. The key difference
        is in the lowest activity band &mdash; families with less than 8 hours of activity per
        fortnight.
      </p>

      <table>
        <thead>
          <tr>
            <th>Activity hours (per fortnight)</th>
            <th>Before 5 Jan 2026</th>
            <th>From 5 Jan 2026</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0 hours (no activity)</td>
            <td>0 hours (no subsidy)</td>
            <td><strong>72 hours</strong></td>
          </tr>
          <tr>
            <td>1 to 7 hours</td>
            <td>24 hours</td>
            <td><strong>72 hours</strong></td>
          </tr>
          <tr>
            <td>8 to 16 hours</td>
            <td>72 hours</td>
            <td>72 hours (unchanged)</td>
          </tr>
          <tr>
            <td>17 to 48 hours</td>
            <td>72 hours</td>
            <td>72 hours (unchanged)</td>
          </tr>
          <tr>
            <td>More than 48 hours</td>
            <td>100 hours</td>
            <td>100 hours (unchanged)</td>
          </tr>
        </tbody>
      </table>

      <p>
        As you can see, the change specifically affects families at the <strong>lowest activity
        levels</strong>. Families in the 8+ hours bands already had access to 72 or 100 hours
        &mdash; nothing changed for them. The guarantee lifted the floor for everyone else.
      </p>

      {/* ================================================================== */}
      {/* 72 HOURS IN PRACTICE                                               */}
      {/* ================================================================== */}
      <h2 id="72-hours-in-practice">What 72 hours per fortnight means in practice</h2>

      <p>
        The number &ldquo;72 hours per fortnight&rdquo; can be confusing because childcare sessions
        vary in length. Here&apos;s how it translates to real-world care arrangements:
      </p>

      <table>
        <thead>
          <tr>
            <th>Session length</th>
            <th>Subsidised sessions per fortnight</th>
            <th>Equivalent days per week</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12 hours (standard long day care)</td>
            <td>6 sessions</td>
            <td><strong>3 days</strong></td>
          </tr>
          <tr>
            <td>10 hours</td>
            <td>7 sessions</td>
            <td>3.5 days</td>
          </tr>
          <tr>
            <td>8 hours</td>
            <td>9 sessions</td>
            <td>4.5 days</td>
          </tr>
          <tr>
            <td>6 hours (half-day / before-school)</td>
            <td>12 sessions</td>
            <td>6 sessions</td>
          </tr>
        </tbody>
      </table>

      <p>
        For most families using standard long day care (12-hour sessions), the guarantee works out
        to <strong>3 days per week</strong> &mdash; hence the name &ldquo;3-day guarantee&rdquo;.
      </p>

      <div className="callout-tip">
        <strong>Tip:</strong> If your provider offers shorter sessions (e.g. 10 hours), you
        effectively get <em>more</em> subsidised days from the same 72-hour allocation. Ask your
        provider about session lengths &mdash; shorter sessions can stretch your entitlement further.
      </div>

      <p>
        <strong>Per child, not per family:</strong> The 72-hour entitlement applies to each child
        individually. If you have two children in care, each child gets up to 72 subsidised hours
        per fortnight &mdash; you don&apos;t need to split the hours between them.
      </p>

      {/* ================================================================== */}
      {/* WHO BENEFITS                                                       */}
      {/* ================================================================== */}
      <h2 id="who-benefits">Who benefits most</h2>

      <p>
        The 3-day guarantee was designed to help families who were previously disadvantaged by the
        activity test. The biggest beneficiaries include:
      </p>

      <ul>
        <li>
          <strong>Stay-at-home parents</strong> &mdash; families where one or both parents are not
          in paid work, study, or formal volunteering. Previously, these families received little or
          no subsidised care. Now they can access up to 3 days per week.
        </li>
        <li>
          <strong>Parents between jobs</strong> &mdash; if you&apos;ve recently been made redundant,
          left a job, or are taking time out, you no longer lose your subsidised hours during the
          gap. The guarantee provides continuity of care for your child.
        </li>
        <li>
          <strong>Parents with health conditions or caring responsibilities</strong> &mdash;
          those who couldn&apos;t meet the activity test due to illness, disability, or caring
          for other family members now have guaranteed access.
        </li>
        <li>
          <strong>Parents considering returning to work</strong> &mdash; the guarantee provides
          subsidised care <em>before</em> you start a job, making it easier to attend interviews,
          complete training, or transition back to work without paying full unsubsidised fees
          during the process.
        </li>
        <li>
          <strong>Casual or seasonal workers</strong> &mdash; parents whose hours fluctuate
          significantly no longer risk losing subsidised care during quiet periods. The floor of
          72 hours provides stability.
        </li>
      </ul>

      <p>
        For families where both parents already work 24+ hours per week, the guarantee doesn&apos;t
        change anything &mdash; you were already well above the 72-hour floor.
      </p>

      {/* ================================================================== */}
      {/* ACTIVITY TEST STILL MATTERS                                        */}
      {/* ================================================================== */}
      <h2 id="still-need-activity">When you still need the activity test</h2>

      <p>
        The 3-day guarantee sets the <em>minimum</em> &mdash; but if you need <strong>more
        than 3 days per week</strong>, the activity test still matters. Here&apos;s when:
      </p>

      <table>
        <thead>
          <tr>
            <th>Days needed per week</th>
            <th>Hours needed per fortnight</th>
            <th>Activity requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Up to 3 days</td>
            <td>Up to 72 hours</td>
            <td><strong>None</strong> (3-day guarantee)</td>
          </tr>
          <tr>
            <td>4 to 5 days</td>
            <td>73 to 100 hours</td>
            <td>48+ hours of activity per fortnight (both parents)</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>The activity test applies to whichever parent does the least activity.</strong> If
        one parent works full-time but the other does zero hours, the activity test result is based
        on the parent with zero hours. Under the old rules, this meant the family might get very
        few subsidised hours. Under the new rules, they&apos;re guaranteed 72 hours regardless
        &mdash; but they still can&apos;t access 100 hours unless the lower-activity parent also
        meets the 48-hour threshold.
      </p>

      <div className="callout-warning">
        <strong>Planning for 4 or 5 days?</strong> If your child attends childcare more than 3
        days per week, make sure both parents meet the activity test (48+ hours per fortnight of
        work, study, training, or volunteering). Without it, only 72 hours are subsidised &mdash;
        the additional days would be at the full unsubsidised fee.
      </div>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 1 — STAY-AT-HOME PARENT                            */}
      {/* ================================================================== */}
      <h2 id="worked-example-1">Worked example: stay-at-home parent</h2>

      <div className="callout">
        <strong>The scenario:</strong> Rachel is a stay-at-home mum. Her partner Michael earns
        $95,000. Their combined family income is $95,000. They have a 2-year-old, Liam, and
        want to enrol him in centre-based day care 3 days per week at $140 per day. Neither
        Rachel nor Liam&apos;s dad are doing any formal work or study.
      </div>

      <p><strong>Before the 3-day guarantee:</strong></p>
      <p>
        With zero hours of activity for Rachel (the lower-activity parent), the family qualified
        for only 24 subsidised hours per fortnight under the old rules &mdash; about 1 day per
        week. The other 2 days would be entirely unsubsidised, costing an extra $280 per week
        at the full fee.
      </p>

      <p><strong>After the 3-day guarantee:</strong></p>
      <p>
        Rachel&apos;s family now receives 72 subsidised hours per fortnight regardless of her
        activity level. All 3 days per week are subsidised.
      </p>

      <p><strong>The financial impact:</strong></p>
      <p>
        Combined income of $95,000 puts them at an <strong>88% CCS rate</strong> (2 brackets above
        the $85,279 threshold).
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per day</th>
            <th>Per week (3 days)</th>
            <th>Per year (50 weeks)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Gross fee</td><td>$140.00</td><td>$420.00</td><td>$21,000</td></tr>
          <tr><td>CCS covers (88%)</td><td>$123.20</td><td>$369.60</td><td>$18,480</td></tr>
          <tr><td>Gap fee (what Rachel pays)</td><td>$16.80</td><td>$50.40</td><td><strong>$2,520</strong></td></tr>
        </tbody>
      </table>

      <p>
        <strong>The bottom line:</strong> Under the old rules, Rachel would have paid approximately
        $16,520 per year (1 subsidised day + 2 unsubsidised days). Under the 3-day guarantee,
        she pays just <strong>$2,520 per year</strong> &mdash; a saving of almost{' '}
        <strong>$14,000 per year</strong>.
      </p>

      {/* ================================================================== */}
      {/* WORKED EXAMPLE 2 — RETURNING TO WORK PART-TIME                    */}
      {/* ================================================================== */}
      <h2 id="worked-example-2">Worked example: returning to work part-time</h2>

      <div className="callout">
        <strong>The scenario:</strong> Aisha is considering going back to work 2 days per week,
        earning $45,000 FTE (proportional: $18,000 for 2 days). Her partner earns $80,000.
        Before Aisha returns to work, their combined income is $80,000 (below the $85,279
        threshold). Their 3-year-old daughter Zara currently attends care 2 days per week at
        $150 per day. Aisha wants to add a third day for Zara while she job-searches.
      </div>

      <p><strong>During the job-search phase (before Aisha starts working):</strong></p>
      <p>
        With Aisha doing zero hours of activity, the family&apos;s subsidised hours depend on the
        3-day guarantee. They receive 72 hours per fortnight &mdash; enough for 3 days of
        12-hour sessions. All 3 days are subsidised at the <strong>maximum 90% rate</strong> (income
        below $85,279).
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per week (3 days)</th>
            <th>Per year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Gross fee</td><td>$450</td><td>$22,500</td></tr>
          <tr><td>CCS covers (90%)</td><td>$405</td><td>$20,250</td></tr>
          <tr><td>Gap fee</td><td>$45</td><td><strong>$2,250</strong></td></tr>
        </tbody>
      </table>

      <p><strong>After Aisha starts working 2 days per week:</strong></p>
      <p>
        Combined income rises to approximately $98,000 ($80,000 + $18,000). CCS rate drops to{' '}
        <strong>87%</strong> (3 brackets above threshold). With 2 days of work (16 hours per
        fortnight), Aisha still falls in the 8&ndash;16 hour activity band &mdash; which also gives
        72 hours. All 3 days remain subsidised.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Per week (3 days)</th>
            <th>Per year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Gross fee</td><td>$450</td><td>$22,500</td></tr>
          <tr><td>CCS covers (87%)</td><td>$391.50</td><td>$19,575</td></tr>
          <tr><td>Gap fee</td><td>$58.50</td><td><strong>$2,925</strong></td></tr>
        </tbody>
      </table>

      <p>
        <strong>The key insight:</strong> The 3-day guarantee gave Aisha subsidised care
        while she was job-searching &mdash; before she had any activity hours at all. This
        made the transition to work financially feasible. The cost increased only marginally
        ($675/yr) when she started working, because the higher income slightly reduced the CCS
        rate. Use our{' '}
        <Link href="/back-to-work-calculator" className="text-primary underline">
          Back-to-Work Calculator
        </Link>{' '}
        to model this transition for your own situation.
      </p>

      {/* ================================================================== */}
      {/* INCOME TEST UNCHANGED                                              */}
      {/* ================================================================== */}
      <h2 id="income-test-unchanged">The income test hasn&apos;t changed</h2>

      <p>
        It&apos;s worth emphasising what the 3-day guarantee <em>doesn&apos;t</em> change:
      </p>

      <ul>
        <li>
          <strong>Your CCS percentage is still based on family income.</strong> A family earning
          $200,000 still gets 67% &mdash; the guarantee just ensures they can use that 67% for
          at least 72 hours per fortnight.
        </li>
        <li>
          <strong>Hourly rate caps are unchanged.</strong> The government still subsidises up to
          $14.63/hour for centre-based day care (below school age), $12.81 for school-age and
          OSHC, $12.43 for family day care, and $35.40 for in-home care.
        </li>
        <li>
          <strong>The 5% withholding still applies.</strong> Services Australia withholds 5% of
          your CCS each fortnight as a buffer, reconciled after the financial year.
        </li>
        <li>
          <strong>The annual cap still applies.</strong> Families earning above $85,279 have an
          annual CCS cap of $11,003 per child.
        </li>
        <li>
          <strong>You still need to meet basic eligibility.</strong> The child must be 13 or
          under, attend an approved provider, and the family must meet residency requirements.
        </li>
      </ul>

      <p>
        In short, the guarantee expanded <em>access</em> (who can use subsidised hours) without
        changing the <em>generosity</em> (how much subsidy you get per hour). For a full breakdown
        of how the income test works, see our{' '}
        <Link href="/guides/ccs-income-thresholds" className="text-primary underline">
          CCS Income Test Explained
        </Link>{' '}
        guide.
      </p>

      {/* ================================================================== */}
      {/* HOW TO ACCESS                                                      */}
      {/* ================================================================== */}
      <h2 id="how-to-access">How to access the 3-day guarantee</h2>

      <p>
        <strong>If you already receive CCS:</strong> The guarantee is applied automatically.
        You don&apos;t need to do anything &mdash; your subsidised hours entitlement was
        updated from 5 January 2026. Check your Centrelink account to confirm.
      </p>

      <p>
        <strong>If you don&apos;t currently receive CCS:</strong> You need to apply for CCS
        through myGov. The steps are:
      </p>

      <ol>
        <li>Create or log in to your <strong>myGov</strong> account and link it to Centrelink</li>
        <li>Submit a <strong>CCS claim</strong> through your Centrelink online account</li>
        <li>Provide your <strong>family income estimate</strong> for the current financial year</li>
        <li>Your childcare provider sends an <strong>enrolment notice</strong> &mdash; confirm it within 14 days</li>
      </ol>

      <p>
        Once approved, you&apos;ll automatically receive the 3-day guarantee &mdash; no separate
        application is needed. CCS claims are typically processed within 1 to 2 weeks.
      </p>

      <div className="callout-tip">
        <strong>Tip:</strong> You can apply for CCS and enrol your child <em>before</em> you
        start using care. This means you can have the subsidy ready to go from day one, rather
        than paying full fees while your claim is processed.
      </div>

      {/* ================================================================== */}
      {/* COMMON QUESTIONS                                                   */}
      {/* ================================================================== */}
      <h2 id="common-questions">Common questions</h2>

      <p>
        <strong>Can I split the 72 hours across different providers?</strong>
        <br />
        Yes. The 72-hour entitlement is per child, not per provider. If your child attends two
        different services (e.g. long day care 2 days + family day care 1 day), the combined
        hours are drawn from the same 72-hour allocation.
      </p>

      <p>
        <strong>What happens if my child uses fewer than 72 hours?</strong>
        <br />
        Nothing. Unused hours don&apos;t roll over or accumulate. The 72 hours reset each
        fortnight. There&apos;s no requirement to use the full entitlement.
      </p>

      <p>
        <strong>Does the guarantee apply during school holidays (vacation care)?</strong>
        <br />
        Yes. The 72-hour entitlement applies to all approved care types, including vacation
        care during school holidays. The hourly rate cap for OSHC/vacation care is $12.81.
      </p>

      <p>
        <strong>What if both parents work but one does fewer than 48 hours per fortnight?</strong>
        <br />
        You still get the 72-hour guarantee. The higher 100-hour entitlement only kicks in when
        the lower-activity parent reaches 48+ hours per fortnight. For example, if one parent
        works full-time (80 hours/fortnight) and the other works 2 days (16 hours/fortnight),
        the family gets 72 subsidised hours &mdash; not 100.
      </p>

      <p>
        Want to see exactly how the 3-day guarantee affects your family&apos;s childcare costs?
        Use our free{' '}
        <Link href="/childcare-subsidy-calculator" className="text-primary underline">
          CCS calculator
        </Link>{' '}
        for a personalised estimate.
      </p>
    </GuideLayout>
  );
}
