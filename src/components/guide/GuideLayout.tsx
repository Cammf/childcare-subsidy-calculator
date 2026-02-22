// =============================================================================
// GUIDE LAYOUT — shared template for all guide / article pages
// =============================================================================
// Layout (desktop):
//   Leaderboard ad strip (728×90, desktop only)
//   Breadcrumbs
//   h1 + meta row (last updated, reading time, verified-figures badge)
//   Mobile: inline Table of Contents
//   66/33 grid:
//     Left  (main):  prose content → mid-content ad → FAQ → dual CTA → disclaimer
//     Right (aside): sticky ToC + sidebar ad (300×250)
//   Related guides grid
// =============================================================================

import type { ReactNode } from 'react';
import Link from 'next/link';
import GuideBreadcrumbs from './GuideBreadcrumbs';
import GuideToc from './GuideToc';
import GuideFaq from './GuideFaq';
import AdSlot from './AdSlot';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import type { TocItem } from './GuideToc';
import type { FaqItem } from './GuideFaq';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelatedGuide {
  href: string;
  title: string;
  description: string;
}

export interface GuideLayoutProps {
  /** Page title — displayed as <h1> */
  title: string;
  /** Short deck / subtitle displayed below the h1 */
  description: string;
  /** ISO 8601 date string e.g. "2026-02-01" */
  lastUpdated: string;
  /** Approximate reading time in minutes */
  readingTimeMinutes: number;
  /** Breadcrumb trail. Home and Guides are prepended automatically. */
  breadcrumbs: { label: string; href?: string }[];
  /** Table of contents items. Sticky sidebar on desktop, inline on mobile. */
  tocItems: TocItem[];
  /** FAQ items rendered at the bottom with FAQPage JSON-LD schema. */
  faqItems?: FaqItem[];
  /** Related guide cards rendered below the article. */
  relatedGuides?: RelatedGuide[];
  /** Canonical path for this guide, e.g. "/guides/how-child-care-subsidy-works" */
  slug?: string;
  /** Main article content */
  children: ReactNode;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GuideLayout({
  title,
  description,
  lastUpdated,
  readingTimeMinutes,
  breadcrumbs,
  tocItems,
  faqItems = [],
  relatedGuides = [],
  slug,
  children,
}: GuideLayoutProps) {
  // Prepend Home + Guides to breadcrumb trail
  const allCrumbs = [
    { label: 'Home',   href: '/' },
    { label: 'Guides', href: '/guides' },
    ...breadcrumbs,
  ];

  // ── Article JSON-LD ───────────────────────────────────────────────────────
  const articleJsonLd = slug
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        datePublished: lastUpdated,
        dateModified: lastUpdated,
        url: `${SITE_URL}${slug}`,
        author: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}${slug}`,
        },
        inLanguage: 'en-AU',
      }
    : null;

  // ── FAQPage JSON-LD (server-rendered for crawler visibility) ──────────────
  const faqJsonLd =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="bg-background min-h-screen">
      {/* ── Structured data ──────────────────────────────────────────────── */}
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── Top leaderboard ad (desktop only) ────────────────────────────── */}
      <div className="bg-card border-b border-border py-3">
        <div className="max-w-6xl mx-auto px-4">
          <AdSlot size="leaderboard" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
        <GuideBreadcrumbs crumbs={allCrumbs} />

        {/* ── Article header ───────────────────────────────────────────────── */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-text-main leading-tight mb-3">{title}</h1>
          <p className="text-lg text-muted leading-relaxed mb-4">{description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted border-t border-border pt-4">
            {/* Last updated */}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Updated {formatDate(lastUpdated)}
            </span>
            {/* Reading time */}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTimeMinutes} min read
            </span>
            {/* Government-verified badge */}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              FY 2025–26 rates
            </span>
          </div>
        </header>

        {/* ── Mobile-only inline Table of Contents ─────────────────────────── */}
        {tocItems.length > 0 && (
          <nav
            aria-label="Table of contents"
            className="lg:hidden bg-teal-50 border border-primary/20 rounded-xl p-4 mb-6"
          >
            <p className="text-sm font-semibold text-primary mb-2">On this page</p>
            <ol className="space-y-1.5">
              {tocItems.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                  <a href={`#${item.id}`} className="text-sm text-primary hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ── Main 66/33 layout ────────────────────────────────────────────── */}
        {/* items-start removed so right column stretches full height — required for sticky ToC */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">

          {/* Left column: article prose */}
          <main className="self-start">
            <article className="prose-guide">
              {children}
            </article>

            {/* Mid-content rectangle ad */}
            <div className="my-8 flex justify-center">
              <AdSlot size="rectangle" />
            </div>

            {/* FAQ section — JSON-LD schema is server-rendered above */}
            {faqItems.length > 0 && (
              <GuideFaq items={faqItems} withSchema={false} />
            )}

            {/* ── Dual CTA ─────────────────────────────────────────────────── */}
            <div className="mt-10 rounded-xl bg-primary p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Ready to calculate your costs?</h3>
              <p className="text-sm text-teal-100 mb-5">
                Use our free calculators to get a personalised estimate based on your family&apos;s
                actual income, care type, and location.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/childcare-subsidy-calculator"
                  className="inline-block bg-white dark:bg-slate-100 text-primary font-semibold px-5 py-3 rounded-lg text-sm hover:bg-teal-50 transition-colors text-center"
                >
                  Calculate my CCS →
                </Link>
                <Link
                  href="/back-to-work-calculator"
                  className="inline-block border border-white/60 text-white font-semibold px-5 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors text-center"
                >
                  Is returning to work worth it? →
                </Link>
              </div>
            </div>

            {/* Bottom leaderboard ad */}
            <div className="mt-8 flex justify-center">
              <AdSlot size="leaderboard" />
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-background border border-border rounded-lg text-xs text-muted leading-relaxed">
              <strong className="text-text-main">Disclaimer:</strong> This guide is for general
              information only and does not constitute financial or legal advice. Government rates
              and thresholds change each financial year — always verify current figures with{' '}
              <a
                href="https://www.servicesaustralia.gov.au/child-care-subsidy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Services Australia
              </a>{' '}
              before making decisions. Last verified: {formatDate(lastUpdated)}.
            </div>
          </main>

          {/* Right column: sticky ToC + sidebar ad */}
          <GuideToc items={tocItems} />
        </div>

        {/* ── Related guides ───────────────────────────────────────────────── */}
        {relatedGuides.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-2xl font-semibold text-text-main mb-5"
            >
              Related Guides
            </h2>
            <div
              className={[
                'grid gap-4',
                relatedGuides.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
              ].join(' ')}
            >
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="block p-5 bg-card border border-border rounded-xl hover:border-primary hover:shadow-sm transition-all group"
                >
                  <h3 className="font-semibold text-text-main group-hover:text-primary mb-2 text-base leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{guide.description}</p>
                  <span className="mt-3 inline-block text-sm text-primary font-medium">
                    Read guide →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
