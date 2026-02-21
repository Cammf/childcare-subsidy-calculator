// =============================================================================
// GLOBAL OG IMAGE — Next.js 14 App Router ImageResponse
// =============================================================================
// Generates a branded 1200×630 Open Graph image for all pages that don't
// define their own. Next.js automatically uses this as the og:image and
// twitter:image for every route unless overridden at a lower route level.
// =============================================================================

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'Child Care Subsidy Calculator — Free CCS & Back-to-Work Calculator for Australian Families';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0E7490',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Domain */}
        <div
          style={{
            fontSize: 22,
            color: '#99F6E4',
            marginBottom: 28,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          childcaresubsidycalculator.com.au
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          Child Care Subsidy Calculator Australia
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: 26,
            color: '#CFFAFE',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: 820,
            marginBottom: 48,
          }}
        >
          Calculate your exact CCS rate and out-of-pocket costs — free, FY 2025–26 rates
        </div>

        {/* Badge row */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['Up to 90% Subsidy', 'Back-to-Work Calculator', 'Free & Instant'].map((badge) => (
            <div
              key={badge}
              style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: '12px 24px',
                fontSize: 20,
                fontWeight: 600,
                color: '#0E7490',
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
