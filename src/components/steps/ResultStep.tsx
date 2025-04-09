
import React from 'react';
import { Button } from '@/components/ui/button';
import StepContainer from '@/components/StepContainer';
import { Download, Share } from 'lucide-react';

interface ResultStepProps {
  onReset: () => void;
  processingData: {
    photo: string;
    topic: string;
  };
}

const ResultStep = ({ onReset, processingData }: ResultStepProps) => {
  return (
    <StepContainer 
      title="Your Presentation is Ready!" 
      description="Download or share your AI-generated presentation video."
    >
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden mb-6 relative">
          {/* This would be a video player in a real implementation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-white">
              <img 
                src={processingData.photo} 
                alt="Presenter" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{processingData.topic}</h3>
            <p className="text-sm opacity-80">Demo Presentation Video</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="btn-gradient">
            <Download className="mr-2 h-4 w-4" /> Download Video
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Create Another
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-md w-full text-center">
          <p className="text-sm text-muted-foreground">
            In a complete implementation, this would display the actual generated video
            with your animated face and cloned voice presenting the content.
          </p>
        </div>
      </div>
    </StepContainer>
  );
};

export default ResultStep;
