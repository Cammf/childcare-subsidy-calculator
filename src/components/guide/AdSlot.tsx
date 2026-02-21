'use client';

/**
 * Placeholder ad slot component.
 *
 * Renders a labelled grey box at the correct IAB dimensions.
 * Hidden on print. Replace with live AdSense units once approved (Phase 11).
 *
 * Sizes:
 *   leaderboard  — 728×90   (top / bottom of page, desktop only)
 *   rectangle    — 300×250  (sidebar / mid-content)
 *   banner       — 320×50   (mobile banner)
 */

type AdSize = 'leaderboard' | 'rectangle' | 'banner';

interface Props {
  size: AdSize;
  className?: string;
}

const SIZE_CONFIG: Record<AdSize, { width: number; height: number; label: string; responsiveClass: string }> = {
  leaderboard: { width: 728, height: 90,  label: 'Advertisement (728×90)',  responsiveClass: 'hidden lg:flex' },
  rectangle:   { width: 300, height: 250, label: 'Advertisement (300×250)', responsiveClass: 'flex' },
  banner:      { width: 320, height: 50,  label: 'Advertisement (320×50)',  responsiveClass: 'flex lg:hidden' },
};

export default function AdSlot({ size, className = '' }: Props) {
  const { width, height, label, responsiveClass } = SIZE_CONFIG[size];

  return (
    <div
      className={[
        'ad-slot print:hidden',
        responsiveClass,
        'items-center justify-center bg-gray-100 dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded text-xs text-gray-400 dark:text-slate-500 mx-auto',
        className,
      ].join(' ')}
      style={{ width, height, maxWidth: '100%' }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
