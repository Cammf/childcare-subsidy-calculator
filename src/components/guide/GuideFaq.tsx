'use client';

import { useState } from 'react';

export interface FaqItem {
  question: string;
  /** Plain text or simple HTML string */
  answer: string;
}

interface Props {
  items: FaqItem[];
  /** If true, renders JSON-LD FAQPage schema (default: true) */
  withSchema?: boolean;
}

/**
 * FAQ accordion with JSON-LD FAQPage schema markup.
 * Each item expands / collapses individually.
 * Schema is server-rendered by GuideLayout — withSchema defaults to false here
 * to avoid duplicate JSON-LD blocks on the same page.
 */
export default function GuideFaq({ items, withSchema = false }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold text-text-main mb-5">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="font-medium text-text-main text-base">{item.question}</span>
                  <svg
                    className={[
                      'w-5 h-5 text-muted flex-shrink-0 transition-transform',
                      isOpen ? 'rotate-180' : '',
                    ].join(' ')}
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
                  <div className="px-5 py-4 bg-card border-t border-border">
                    <p
                      className="text-text-main leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
