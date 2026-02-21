import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-16 print:hidden">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top: columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="font-semibold text-primary text-base leading-tight block mb-2">
              Child Care Subsidy Calculator
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Free, personalised CCS estimates based on official Australian
              Government rates and income thresholds.
            </p>
            <p className="text-xs text-muted mt-3">
              Updated January 2026 · Not financial advice
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wide mb-3">
              Calculators
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/childcare-subsidy-calculator', label: 'CCS Calculator' },
                { href: '/back-to-work-calculator', label: 'Back to Work Calculator' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wide mb-3">
              Guides
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/guides/how-ccs-works', label: 'How the CCS Works' },
                { href: '/guides/activity-test-explained', label: 'Activity Test' },
                { href: '/guides/ccs-income-thresholds', label: 'Income Thresholds' },
                { href: '/guides/back-to-work-childcare', label: 'Going Back to Work' },
                { href: '/guides/childcare-types-compared', label: 'Types of Childcare' },
                { href: '/guides/3-day-guarantee', label: '3-Day Guarantee' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site links */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wide mb-3">
              Site
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About This Site' },
                { href: '/privacy', label: 'Privacy Policy' },
                {
                  href: 'https://www.servicesaustralia.gov.au/child-care-subsidy',
                  label: 'Services Australia',
                  external: true,
                },
                {
                  href: 'https://www.education.gov.au/early-childhood/child-care-subsidy',
                  label: 'education.gov.au',
                  external: true,
                },
              ].map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted leading-relaxed max-w-3xl mb-3">
            <strong className="text-text-main">Disclaimer:</strong> This site
            provides general information and estimates only. It is not financial
            advice. Rates are updated from official Australian Government sources
            including{' '}
            <a
              href="https://www.servicesaustralia.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              Services Australia
            </a>{' '}
            and{' '}
            <a
              href="https://www.education.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              education.gov.au
            </a>
            . Always verify figures with Services Australia before making
            financial decisions.
          </p>
          <p className="text-xs text-muted">
            © {currentYear} Child Care Subsidy Calculator · Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
