
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import StepContainer from '@/components/StepContainer';
import { Download, Share, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface ResultStepProps {
  onReset: () => void;
  processingData: {
    photo: string;
    topic: string;
  };
}

const ResultStep = ({ onReset, processingData }: ResultStepProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const simulateVideoGeneration = () => {
    setIsGenerating(true);
    
    // In a real implementation, this would call an actual API
    setTimeout(() => {
      // For demo purposes, we're just showing the user's image as a placeholder
      setVideoUrl(processingData.photo);
      setIsGenerating(false);
      
      toast({
        title: "Video generated successfully",
        description: "Your AI presentation has been created",
      });
    }, 3000);
  };
  
  // Auto-generate on component mount
  useEffect(() => {
    simulateVideoGeneration();
  }, []);

  return (
    <StepContainer 
      title="Your Presentation is Ready!" 
      description="Download or share your AI-generated presentation video."
    >
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden mb-6 relative shadow-lg border-2 border-primary/20 transition-all hover:shadow-xl">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-r from-brand-purple/20 to-brand-blue/20">
              <RefreshCw className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Generating your video...</p>
            </div>
          ) : videoUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-br from-brand-dark/60 to-transparent">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue blur-sm"></div>
                <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-white relative z-10">
                  <img 
                    src={processingData.photo} 
                    alt="Presenter" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 mt-2">{processingData.topic}</h3>
              <p className="text-sm opacity-80 mb-4">AI-Generated Presentation</p>
              <video 
                className="absolute inset-0 w-full h-full object-cover -z-10"
                poster={processingData.photo}
                autoPlay
                muted
                loop
              >
                {/* In a real implementation, this would be the actual video URL */}
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p>Failed to generate video. Please try again.</p>
              <Button onClick={simulateVideoGeneration} className="mt-4">
                Retry Generation
              </Button>
            </div>
          )}
        </Card>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="btn-gradient transition-all hover:scale-105">
            <Download className="mr-2 h-4 w-4" /> Download Video
          </Button>
          <Button variant="outline" className="transition-all hover:bg-accent">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" onClick={onReset} className="transition-all hover:text-primary">
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
