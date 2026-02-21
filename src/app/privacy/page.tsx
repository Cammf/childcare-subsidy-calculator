// =============================================================================
// PRIVACY POLICY — Child Care Subsidy Calculator
// =============================================================================

import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: 'Privacy policy for the Child Care Subsidy Calculator — what data we collect, how it is used, and your rights.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const sections = [
  {
    heading: 'Overview',
    body: [
      'This Privacy Policy explains how the Child Care Subsidy Calculator (\"this site\", \"we\") handles information when you use our calculators, guides, and other site features.',
      'We are committed to protecting your privacy. This site is designed to work without collecting personally identifiable information. All calculator inputs are processed in your browser and are not transmitted to or stored on our servers.',
    ],
  },
  {
    heading: 'Information We Collect',
    body: [
      'We do not collect, store, or process personal information such as your name, email address, or financial details.',
      'When you use our calculators, the values you enter (income, childcare fees, care type, etc.) are encoded into URL parameters for shareability. These parameters remain on your device and in your browser history. They are not sent to or stored on our servers.',
      'We use Google Analytics 4 (GA4) to collect anonymous usage data, including: pages visited, time spent on pages, general geographic region (country/state level), device type and browser, and how visitors arrive at the site (search, direct, referral). This data does not identify you personally and is used solely to understand how the site is used and to improve it.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'Google Analytics uses cookies to distinguish unique visitors and sessions. These are first-party cookies set by Google (e.g., _ga, _ga_XXXX). They do not contain personally identifiable information.',
      'By using this site, you consent to these analytics cookies being set. You can opt out of Google Analytics tracking at any time by installing the Google Analytics Opt-out Browser Add-on (tools.google.com/dlpage/gaoptout) or by adjusting your browser\'s cookie settings.',
      'We do not use advertising cookies, tracking pixels, or any cookies for retargeting or personalised advertising.',
    ],
  },
  {
    heading: 'Advertising',
    body: [
      'This site may display advertisements served by Google AdSense or similar ad networks. These networks may use cookies to show relevant ads based on your prior visits to this and other websites.',
      'Google\'s advertising practices are governed by the Google Privacy Policy (policies.google.com/privacy). You can opt out of personalised advertising via Google\'s Ad Settings (adssettings.google.com).',
      'We do not sell or share your personal information with advertisers.',
    ],
  },
  {
    heading: 'Third-Party Links',
    body: [
      'Our guides and pages contain links to external websites, including government resources (servicesaustralia.gov.au, education.gov.au, ato.gov.au, acecqa.gov.au). These sites have their own privacy policies, which we encourage you to review.',
      'We are not responsible for the privacy practices or content of external sites.',
    ],
  },
  {
    heading: 'Data Retention',
    body: [
      'We do not retain personal data. Google Analytics data is retained for 26 months in accordance with Google\'s default data retention settings, after which it is automatically deleted.',
      'You can request deletion of any GA data associated with your device by opting out of analytics (see Cookies section above).',
    ],
  },
  {
    heading: 'Children\'s Privacy',
    body: [
      'This site is intended for use by adults. We do not knowingly collect information from children under 13 years of age.',
    ],
  },
  {
    heading: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Material changes will be reflected with an updated effective date below. Continued use of the site after any changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'If you have questions about this Privacy Policy or our privacy practices, you can contact us via the feedback link in the site footer.',
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-text-main sm:text-3xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">
            Effective date: 1 February 2026 · Last updated: February 2026
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {sections.map((section) => (
            <section key={section.heading} className="px-6 py-5">
              <h2 className="text-base font-bold text-text-main mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-sm text-muted leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted text-center">
          Child Care Subsidy Calculator · Australia · childcaresubsidycalculator.com.au
        </p>
      </div>
    </main>
  );
}
