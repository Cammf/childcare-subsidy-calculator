'use client';

import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

interface Props {
  items: TocItem[];
}

/**
 * Sticky desktop table of contents.
 * Highlights the active section as the user scrolls using IntersectionObserver.
 * Hidden on mobile — mobile ToC is rendered inline at the top of the article.
 */
export default function GuideToc({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0,
      },
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="hidden lg:block">
      <div className="sticky top-24">
        {/* ToC card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-text-main mb-3">On this page</p>
          <ol className="space-y-1.5">
            {items.map((item) => (
              <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${item.id}`}
                  className={[
                    'block text-sm leading-snug transition-colors',
                    activeId === item.id
                      ? 'text-primary font-medium'
                      : 'text-muted hover:text-primary',
                  ].join(' ')}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sidebar rectangle ad slot */}
        <div className="mt-6">
          <div
            className="ad-slot print:hidden flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded text-xs text-gray-400 dark:text-slate-500 mx-auto"
            style={{ width: 300, height: 250 }}
            aria-hidden="true"
          >
            Advertisement (300×250)
          </div>
        </div>
      </div>
    </nav>
  );
}
