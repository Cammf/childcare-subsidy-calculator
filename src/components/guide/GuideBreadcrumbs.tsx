import Link from 'next/link';
import { SITE_URL } from '@/lib/siteConfig';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

/**
 * Breadcrumb trail with JSON-LD BreadcrumbList schema.
 * Final crumb (current page) has no href and is aria-current="page".
 */
export default function GuideBreadcrumbs({ crumbs }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {crumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true" className="text-border">›</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-primary hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-text-main font-medium">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
