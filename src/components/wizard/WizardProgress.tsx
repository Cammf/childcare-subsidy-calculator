'use client';

import type { WizardStep } from '@/lib/types';

interface WizardProgressProps {
  currentStep: WizardStep;
  totalSteps?: number;
}

const STEP_LABELS: Record<WizardStep, string> = {
  1: 'Family Situation',
  2: 'Income',
  3: 'Childcare Details',
  4: 'Work Situation',
  5: 'Review',
};

export default function WizardProgress({
  currentStep,
  totalSteps = 5,
}: WizardProgressProps) {
  return (
    <div className="mb-8">
      {/* Step label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted">
          Step {currentStep} of {totalSteps} —{' '}
          <span className="text-text-main">{STEP_LABELS[currentStep]}</span>
        </span>
        <span className="text-sm text-muted">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
      </div>

      {/* Dot + bar progress indicator */}
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep} of ${totalSteps}`}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = (i + 1) as WizardStep;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div key={step} className="flex items-center flex-1">
              {/* Dot */}
              <div
                className={[
                  'w-3 h-3 rounded-full flex-shrink-0 transition-colors duration-200',
                  isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary ring-2 ring-primary ring-offset-2' : 'bg-border',
                ].join(' ')}
                aria-hidden="true"
              />
              {/* Connecting bar (not after last dot) */}
              {step < totalSteps && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-1 transition-colors duration-200',
                    isCompleted ? 'bg-primary' : 'bg-border',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
