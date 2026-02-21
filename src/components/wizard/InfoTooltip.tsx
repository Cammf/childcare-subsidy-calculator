'use client';

import { useState } from 'react';

interface InfoTooltipProps {
  trigger: string;       // e.g. "What counts as an activity?"
  children: React.ReactNode;
}

/**
 * An expandable inline info panel — labelled as a question, expands on click.
 * Used throughout the wizard to explain jargon without cluttering the UI.
 */
export default function InfoTooltip({ trigger, children }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline focus:outline-none focus:underline"
        aria-expanded={isOpen}
      >
        <svg
          className={['w-4 h-4 flex-shrink-0 transition-transform duration-150', isOpen ? 'rotate-90' : ''].join(' ')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {trigger}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-teal-50 border border-primary/20 rounded-lg text-sm text-text-main leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
