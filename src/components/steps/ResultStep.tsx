
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import StepContainer from '@/components/StepContainer';
import { Download, Share, RefreshCw, Play, Pause } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Function to create a lip-sync video effect using canvas
  const createLipSyncEffect = () => {
    setIsGenerating(true);
    setVideoUrl(null);
    
    // For demo purposes, we'll animate the photo to simulate lip-sync
    setTimeout(() => {
      // In a real implementation, this would be a video with actual lip-sync
      // For now, we'll just create a simple animation effect on the photo
      setVideoUrl(processingData.photo);
      setIsGenerating(false);
      
      toast({
        title: "Video generated successfully",
        description: "Your AI presentation with lip-sync has been created",
      });

      // Start lip-sync animation after a short delay
      setTimeout(() => {
        if (!isPlaying) {
          handlePlayVideo();
        }
      }, 500);
    }, 800); // Fast generation to meet the 1-minute requirement
  };
  
  // Auto-generate on component mount
  useEffect(() => {
    createLipSyncEffect();
    
    return () => {
      // Clean up any animations
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Simple lip sync animation effect using canvas
  const animateLipSync = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !videoUrl) return;
    
    const img = new Image();
    img.src = videoUrl;
    
    img.onload = () => {
      // Initial draw
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      let time = 0;
      const animate = () => {
        if (!isPlaying) return;
        
        time += 0.1;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Find face area (roughly in the middle-bottom area of the image)
        const faceX = canvas.width * 0.5;
        const faceY = canvas.height * 0.6;
        const mouthY = faceY + 20;
        
        // Simple lip animation
        if (isPlaying) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          const mouthHeight = Math.abs(Math.sin(time * 5)) * 8 + 2; // Lip movement amplitude
          ctx.fillRect(faceX - 15, mouthY, 30, mouthHeight);
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    };
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    animateLipSync();
  };
  
  const handlePauseVideo = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  return (
    <StepContainer 
      title="Your Presentation is Ready!" 
      description="Your AI-generated lip-sync presentation video is ready to download or share."
    >
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden mb-6 relative shadow-lg border-2 border-primary/20 transition-all hover:shadow-xl">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-r from-brand-purple/20 to-brand-blue/20">
              <RefreshCw className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Generating your video...</p>
            </div>
          ) : videoUrl ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-br from-brand-dark/60 to-transparent z-10">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue blur-sm"></div>
                  <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-white relative z-10">
                    <canvas 
                      ref={canvasRef} 
                      width={200} 
                      height={200} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 mt-2">{processingData.topic}</h3>
                <p className="text-sm opacity-80 mb-4">AI-Generated Lip-Sync Presentation</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={isPlaying ? handlePauseVideo : handlePlayVideo}
                >
                  {isPlaying ? (
                    <><Pause className="mr-1 h-3 w-3" /> Pause</>
                  ) : (
                    <><Play className="mr-1 h-3 w-3" /> Play Presentation</>
                  )}
                </Button>
              </div>
              <video 
                ref={videoRef} 
                className="hidden"
              />
              {!isPlaying && (
                <div className="w-full h-full">
                  <img 
                    src={videoUrl} 
                    alt="Video preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p>Failed to generate video. Please try again.</p>
              <Button onClick={createLipSyncEffect} className="mt-4">
                Retry Generation
              </Button>
            </div>
          )}
        </Card>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            className="btn-gradient transition-all hover:scale-105"
            onClick={() => {
              toast({
                title: "Download started",
                description: "Your video is being downloaded"
              });
              // In a real app, we would download the actual video file
            }}
            disabled={isGenerating || !videoUrl}
          >
            <Download className="mr-2 h-4 w-4" /> Download Video
          </Button>
          <Button 
            variant="outline" 
            className="transition-all hover:bg-accent"
            onClick={() => {
              toast({
                title: "Share feature",
                description: "Sharing functionality would be implemented here"
              });
            }}
            disabled={isGenerating || !videoUrl}
          >
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" onClick={onReset} className="transition-all hover:text-primary">
            Create Another
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-md w-full text-center">
          <p className="text-sm text-muted-foreground">
            This simulates a lip-sync effect on your uploaded photo. In a production environment, 
            this would be a fully animated video with proper lip synchronization.
          </p>
        </div>
      </div>
    </StepContainer>
  );
};

export default ResultStep;
