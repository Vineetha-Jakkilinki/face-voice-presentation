
import React, { useEffect, useState } from 'react';
import StepContainer from '@/components/StepContainer';
import { useToast } from '@/hooks/use-toast';
import VideoDisplay from '@/components/video/VideoDisplay';
import VideoControls from '@/components/video/VideoControls';
import { useVideoGenerator } from '@/services/VideoGenerator';

interface ResultStepProps {
  onReset: () => void;
  processingData: {
    photo: string;
    topic: string;
  };
}

const ResultStep = ({ onReset, processingData }: ResultStepProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { createLipSyncEffect } = useVideoGenerator();

  // Start generating on component mount
  useEffect(() => {
    handleRegenerateVideo();
  }, []);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    
    toast({
      title: "Presentation is playing",
      description: "Lip-sync animation started",
    });
  };
  
  const handlePauseVideo = () => {
    setIsPlaying(false);
  };
  
  const handleRegenerateVideo = () => {
    setIsPlaying(false);
    createLipSyncEffect(
      processingData.photo,
      (url) => {
        setVideoUrl(url);
        // Auto-start the lip-sync animation
        setTimeout(() => {
          handlePlayVideo();
        }, 500);
      },
      setIsGenerating
    );
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    
    toast({
      title: "Download started",
      description: "Your presentation is being downloaded",
    });
    
    try {
      // Create a downloadable version
      const link = document.createElement('a');
      link.download = `presentation-${Date.now()}.png`;
      link.href = videoUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <StepContainer 
      title="Your Presentation is Ready!" 
      description="Your AI-generated lip-sync presentation video is ready to play, download or share."
    >
      <div className="flex flex-col items-center">
        <VideoDisplay 
          isGenerating={isGenerating}
          videoUrl={videoUrl}
          isPlaying={isPlaying}
          onPlay={handlePlayVideo}
          onPause={handlePauseVideo}
          topic={processingData.topic}
        />

        <VideoControls 
          isGenerating={isGenerating}
          videoUrl={videoUrl}
          isPlaying={isPlaying}
          onPlay={handlePlayVideo}
          onPause={handlePauseVideo}
          onRegenerate={handleRegenerateVideo}
          onDownload={handleDownload}
          onReset={onReset}
        />
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-md w-full">
          <p className="text-sm text-muted-foreground text-center">
            Your presentation is created with AI lip-sync technology. 
            You can download, share, or create a new presentation at any time.
          </p>
        </div>
      </div>
    </StepContainer>
  );
};

export default ResultStep;
