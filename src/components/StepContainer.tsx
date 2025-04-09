
import React from 'react';
import { cn } from '@/lib/utils';

interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  description: string;
}

const StepContainer = ({ children, className, title, description }: StepContainerProps) => {
  return (
    <div className={cn("step-container", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-heading mb-3">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>
      <div className="step-card animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default StepContainer;
