// =============================================================================
// SITEMAP — Auto-generated via Next.js 14 App Router Metadata API
// =============================================================================
// Results pages are excluded (noindex, params-based, not useful to crawlers).
// New guides are added here when they go live.
// =============================================================================

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    // ── Core pages ───────────────────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/childcare-subsidy-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/back-to-work-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Guide index ──────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // ── Live guide pages ─────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/guides/how-ccs-works`,
      lastModified: '2026-02-22',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides/ccs-income-thresholds`,
      lastModified: '2026-02-22',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides/back-to-work-childcare`,
      lastModified: '2026-02-22',
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Site pages ───────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // NOTE: Results pages (/childcare-subsidy-calculator/results,
    // /back-to-work-calculator/results) are intentionally excluded —
    // they use robots: { index: false } and are params-based.
  ];
}
