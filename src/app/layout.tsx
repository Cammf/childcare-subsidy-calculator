import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Child Care Subsidy Calculator Australia | Free CCS Calculator 2026",
    template: "%s | Child Care Subsidy Calculator",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "child care subsidy calculator",
    "CCS calculator",
    "childcare subsidy australia",
    "childcare out of pocket costs",
    "childcare activity test",
    "childcare costs australia 2026",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  // Google Search Console verification — set NEXT_PUBLIC_GSC_VERIFICATION in Vercel env vars
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
        },
      }
    : {}),
};

/** Sitewide WebSite + Organization JSON-LD — rendered on every page. */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-AU",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Free Child Care Subsidy calculator and guides for Australian families.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets class="dark" server-side
    // but can only know the correct theme client-side (localStorage/OS pref).
    // This suppresses the React mismatch warning on the html element only.
    <html lang="en-AU" className={inter.className} suppressHydrationWarning>
      <body className="antialiased bg-background text-text-main flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleAnalytics />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
          />
          <SiteNav />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
