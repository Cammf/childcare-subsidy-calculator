'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

// ──────────────────────────────────────────────────────────────────────────────
// Nav link data
// ──────────────────────────────────────────────────────────────────────────────

const calculatorLinks = [
  {
    href: '/childcare-subsidy-calculator',
    label: 'CCS Calculator',
    description: 'Calculate your subsidy and weekly out-of-pocket childcare costs',
  },
  {
    href: '/back-to-work-calculator',
    label: 'Back to Work Calculator',
    description: 'Is returning to work financially worth it?',
  },
];

const guideLinks = [
  { href: '/guides/how-ccs-works', label: 'How the CCS Works' },
  { href: '/guides/activity-test-explained', label: 'Activity Test Explained' },
  { href: '/guides/ccs-income-thresholds', label: 'CCS Income Thresholds' },
  { href: '/guides/back-to-work-childcare', label: 'Going Back to Work' },
  { href: '/guides/childcare-types-compared', label: 'Types of Childcare Compared' },
  { href: '/guides/3-day-guarantee', label: 'The 3-Day Guarantee (2026)' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Dropdown
// ──────────────────────────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

function Dropdown({ label, isOpen, onToggle, onClose, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        onBlur={(e) => {
          // Close if focus leaves the entire dropdown
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
            onClose();
          }
        }}
        className="flex items-center gap-1 text-sm font-medium text-text-main hover:text-primary transition-colors min-h-[48px] px-2 focus:outline-none focus:text-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[260px] py-1"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SiteNav
// ──────────────────────────────────────────────────────────────────────────────

export default function SiteNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<'calc' | 'guides' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggle = (menu: 'calc' | 'guides') =>
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  const close = () => setOpenDropdown(null);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 print:hidden">
      <nav
        className="max-w-6xl mx-auto px-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 py-3 min-h-[48px] font-semibold text-primary text-base hover:text-primary/80 transition-colors"
          onClick={close}
        >
          {/* Childcare / building blocks icon */}
          <svg
            className="w-6 h-6 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="leading-tight">
            CCS Calculator<br />
            <span className="text-xs font-normal text-muted">Child Care Subsidy</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Dropdown
            label="Calculators"
            isOpen={openDropdown === 'calc'}
            onToggle={() => toggle('calc')}
            onClose={close}
          >
            {calculatorLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={close}
                className={`block px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors ${
                  pathname === link.href ? 'text-primary font-medium' : 'text-text-main'
                }`}
              >
                <span className="block text-sm font-medium">{link.label}</span>
                <span className="block text-xs text-muted mt-0.5">{link.description}</span>
              </Link>
            ))}
          </Dropdown>

          <Dropdown
            label="Guides"
            isOpen={openDropdown === 'guides'}
            onToggle={() => toggle('guides')}
            onClose={close}
          >
            {guideLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={close}
                className={`block px-4 py-2.5 text-sm hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors ${
                  pathname === link.href ? 'text-primary font-medium' : 'text-text-main'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </Dropdown>

          <Link
            href="/about"
            onClick={close}
            className={`text-sm font-medium px-2 min-h-[48px] flex items-center hover:text-primary transition-colors ${
              pathname === '/about' ? 'text-primary' : 'text-text-main'
            }`}
          >
            About
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Primary CTA */}
          <Link
            href="/childcare-subsidy-calculator"
            onClick={close}
            className="ml-2 btn-primary text-sm !py-2 !px-4 !min-h-[40px]"
          >
            Calculate my subsidy →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-[48px] h-[48px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary rounded"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 mt-1">Calculators</p>
            {calculatorLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-text-main hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 mt-4">Guides</p>
            {guideLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-text-main hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-border mt-3">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-text-main hover:text-primary"
              >
                About
              </Link>
              <div className="flex items-center justify-between mt-3">
                <Link
                  href="/childcare-subsidy-calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 btn-primary text-center text-sm"
                >
                  Calculate my subsidy →
                </Link>
                <div className="ml-2 flex-shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
