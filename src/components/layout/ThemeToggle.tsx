'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// ─── SVG icons ───────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 110 10A5 5 0 0112 7z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

// ─── Cycle order ─────────────────────────────────────────────────────────────

const THEMES = ['light', 'system', 'dark'] as const;

const THEME_LABELS: Record<string, string> = {
  light:  'Light mode',
  dark:   'Dark mode',
  system: 'System theme',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch: render nothing until client has mounted and
  // next-themes has read the stored preference / OS setting.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" aria-hidden="true" />;

  const currentTheme = theme ?? 'system';
  const currentIndex = THEMES.indexOf(currentTheme as typeof THEMES[number]);
  const nextTheme    = THEMES[(currentIndex + 1) % THEMES.length];

  function handleClick() {
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`Switch to ${THEME_LABELS[nextTheme]} (currently ${THEME_LABELS[currentTheme]})`}
      title={`Current: ${THEME_LABELS[currentTheme]} — click for ${THEME_LABELS[nextTheme]}`}
    >
      {currentTheme === 'dark'   && <MoonIcon />}
      {currentTheme === 'light'  && <SunIcon />}
      {currentTheme === 'system' && <SystemIcon />}
    </button>
  );
}
