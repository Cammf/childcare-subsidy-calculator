'use client';

interface RadioCardProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  badge?: string;  // e.g. "Most common"
}

/**
 * A large, tappable radio button styled as a card.
 * Meets 48px minimum touch target requirement.
 */
export default function RadioCard({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  badge,
}: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className={[
        'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-150',
        'min-h-[48px]',
        checked
          ? 'border-primary bg-teal-50'
          : 'border-border bg-card hover:border-primary/40 hover:bg-gray-50',
      ].join(' ')}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-0.5 w-4 h-4 text-primary border-gray-300 focus:ring-primary flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={['font-medium', checked ? 'text-primary' : 'text-text-main'].join(' ')}>
            {label}
          </span>
          {badge && (
            <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted mt-0.5 leading-snug">{description}</p>
        )}
      </div>
    </label>
  );
}
