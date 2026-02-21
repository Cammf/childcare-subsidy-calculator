'use client';
// =============================================================================
// THEME TOGGLE — 3-segment pill control (Light | Dark | Auto)
// =============================================================================
// Shows all three theme options simultaneously as a segmented pill control.
// Active segment: white bg (light mode) or slate-600 bg (dark mode) + shadow.
// Uses mounted guard to prevent SSR hydration mismatch with next-themes.
// =============================================================================

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// ─── SVG icons (14 × 14 px) ──────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 110 10A5 5 0 0112 7z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

// ─── Segment definitions ──────────────────────────────────────────────────────

const SEGMENTS = [
  { id: 'light',  label: 'Light', Icon: SunIcon   },
  { id: 'dark',   label: 'Dark',  Icon: MoonIcon  },
  { id: 'system', label: 'Auto',  Icon: SystemIcon },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch: next-themes reads localStorage on the client only.
  // Render a same-sized invisible placeholder until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-44" aria-hidden="true" />;

  const currentTheme = theme ?? 'system';

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl"
    >
      {SEGMENTS.map(({ id, label, Icon }) => {
        const active = currentTheme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            aria-pressed={active}
            aria-label={`${label} theme`}
            className={[
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
              active
                ? 'bg-white dark:bg-slate-600 text-text-main shadow-sm'
                : 'text-muted hover:text-text-main',
            ].join(' ')}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </div>
  );
}
