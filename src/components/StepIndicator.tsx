
import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between items-center w-full">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index < currentStep
                    ? "bg-brand-purple text-white"
                    : index === currentStep
                    ? "bg-brand-purple text-white animate-pulse-purple"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">
                {index === 0
                  ? "Photo"
                  : index === 1
                  ? "Voice"
                  : index === 2
                  ? "Content"
                  : index === 3
                  ? "Processing"
                  : "Result"}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "h-0.5 w-full max-w-12 flex-grow",
                  index < currentStep ? "bg-brand-purple" : "bg-secondary"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
