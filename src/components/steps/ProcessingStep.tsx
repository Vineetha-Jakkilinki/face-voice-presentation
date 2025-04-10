
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import StepContainer from '@/components/StepContainer';
import { Sparkles } from 'lucide-react';

interface ProcessingStepProps {
  onNext: () => void;
  processingData: {
    photo: string;
    topic: string;
  };
}

const ProcessingStep = ({ onNext, processingData }: ProcessingStepProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Generating script');
  const stages = [
    'Generating script',
    'Cloning voice',
    'Creating audio narration',
    'Analyzing facial features',
    'Rendering lip-sync animation',
  ];

  // Simulate processing stages - reduced to 15 seconds total
  useEffect(() => {
    const totalTime = 15000; // 15 seconds
    const interval = totalTime / 100; // 100 steps
    
    let currentProgress = 0;
    let currentStageIndex = 0;
    
    const timer = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      
      // Update stage text
      if (currentProgress % 20 === 0 && currentStageIndex < stages.length - 1) {
        currentStageIndex += 1;
        setCurrentStage(stages[currentStageIndex]);
      }
      
      // Complete processing
      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => onNext(), 500); // Small delay for transition
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [onNext, stages]);

  return (
    <StepContainer 
      title="Creating Your Presentation" 
      description="Please wait while we generate your lip-synced video presentation."
    >
      <div className="flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-purple to-brand-blue rounded-full blur-md animate-pulse-subtle"></div>
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-lg relative z-10">
            <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-brand-purple animate-spin"></div>
            </div>
            <img 
              src={processingData.photo} 
              alt="Your photo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-4">
          {processingData.topic}
        </h3>
        
        <div className="w-full max-w-md mb-3">
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-4 w-4 text-brand-purple animate-pulse" />
          <p className="text-muted-foreground font-medium">{currentStage}...</p>
        </div>
        
        <div className="mt-4 p-5 bg-muted/30 rounded-lg max-w-md w-full border border-border">
          <p className="text-sm text-muted-foreground">
            Creating a lip-synced video presentation with your uploaded photo and voice.
            Ready in less than a minute!
          </p>
        </div>
      </div>
    </StepContainer>
  );
};

export default ProcessingStep;
