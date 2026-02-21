// =============================================================================
// ROBOTS — Next.js 14 App Router Metadata API
// =============================================================================
// Disallows crawling of results pages (params-based, not useful to search engines).
// =============================================================================

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/childcare-subsidy-calculator/results',
          '/back-to-work-calculator/results',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
