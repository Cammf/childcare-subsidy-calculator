'use client';
// =============================================================================
// WIZARD CONTAINER — Step Router & Shell Layout
// =============================================================================
// Renders the correct step component based on WizardContext.currentStep.
// Wraps every step in the shared progress bar header.
//
// Layout: full-width on mobile, two-column (content | aside) on md+
// The aside column is populated by each step via the StepAside component.
// =============================================================================

import dynamic from 'next/dynamic';
import WizardProgress from './WizardProgress';
import { useWizard } from '@/contexts/WizardContext';

// Lazy-load each step to keep the initial bundle small.
// Each step is a separate chunk loaded only when needed.
const Step1FamilySituation  = dynamic(() => import('./steps/Step1FamilySituation'));
const Step2Income           = dynamic(() => import('./steps/Step2Income'));
const Step3ChildcareDetails = dynamic(() => import('./steps/Step3ChildcareDetails'));
const Step4WorkSituation    = dynamic(() => import('./steps/Step4WorkSituation'));
const Step5Review           = dynamic(() => import('./steps/Step5Review'));

export default function WizardContainer() {
  const { state } = useWizard();
  const { currentStep } = state;

  function renderStep() {
    switch (currentStep) {
      case 1: return <Step1FamilySituation />;
      case 2: return <Step2Income />;
      case 3: return <Step3ChildcareDetails />;
      case 4: return <Step4WorkSituation />;
      case 5: return <Step5Review />;
      default: return <Step1FamilySituation />;
    }
  }

  return (
    <div className="w-full">
      {/* Progress bar — full width above the two-column layout */}
      <WizardProgress currentStep={currentStep} />

      {/* Step content */}
      {renderStep()}
    </div>
  );
}
