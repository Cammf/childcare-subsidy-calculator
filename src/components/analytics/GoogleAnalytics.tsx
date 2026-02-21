import Script from 'next/script';

/**
 * Google Analytics 4 integration.
 *
 * Set the NEXT_PUBLIC_GA4_ID environment variable in Vercel to enable.
 * Example: NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
 *
 * When the env var is not set, this component renders nothing —
 * no scripts are loaded and no data is collected.
 *
 * Events tracked automatically by GA4:
 *   - page_view (every navigation)
 *   - scroll (90% scroll depth)
 *   - click (outbound links)
 *   - session_start, first_visit, user_engagement
 *
 * Custom events can be sent from any client component:
 *   window.gtag?.('event', 'calculator_complete', { step: 5 });
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
