'use client';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

/**
 * Desktop-only contextual info panel rendered in the right column of the
 * wizard layout. Hidden on mobile — steps keep their inline InfoTooltip there.
 */
export default function StepAside({ title, children }: Props) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 bg-teal-50 border border-primary/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h3>
        <div className="text-sm text-text-main space-y-2 leading-relaxed">
          {children}
        </div>
      </div>
    </aside>
  );
}
