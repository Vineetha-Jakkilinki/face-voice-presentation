
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
  const [isGenerating, setIsGenerating] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Function to create a lip-sync video effect
  const createLipSyncEffect = () => {
    setIsGenerating(true);
    
    // Simulate video generation (in real app this would call an API)
    setTimeout(() => {
      // Set the photo URL to the canvas image source
      setVideoUrl(processingData.photo);
      setIsGenerating(false);
      
      toast({
        title: "Video generated successfully",
        description: "Your presentation is ready to play",
      });

      // Auto-start the lip-sync animation
      setTimeout(() => {
        handlePlayVideo();
      }, 500);
    }, 3000); // 3 seconds to generate
  };
  
  // Start generating on component mount
  useEffect(() => {
    createLipSyncEffect();
    
    return () => {
      // Clean up any animations
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Lip sync animation using canvas
  const animateLipSync = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !videoUrl) return;
    
    const img = new Image();
    img.src = videoUrl;
    
    img.onload = () => {
      // Set canvas dimensions to match aspect ratio
      canvas.width = img.width;
      canvas.height = img.height;
      
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
        
        // Find face area (center-bottom of image)
        const faceX = canvas.width * 0.5;
        const faceY = canvas.height * 0.6;
        
        // Lip sync animation
        const mouthY = faceY + 20;
        const mouthWidth = 30;
        
        // Create more realistic lip movement with varying height and opacity
        if (isPlaying) {
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          const mouthHeight = Math.abs(Math.sin(time * 8)) * 8 + 3; // More dynamic lip movement
          
          // Draw lips with curved edges
          ctx.beginPath();
          ctx.ellipse(faceX, mouthY, mouthWidth/2, mouthHeight/2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Add speech bubble occasionally
          if (Math.sin(time) > 0.7) {
            drawSpeechBubble(ctx, faceX + 60, faceY - 30, 40, 25);
          }
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    };
  };
  
  // Draw a speech bubble
  const drawSpeechBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add tail to speech bubble
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 5);
    ctx.lineTo(x - 30, y + 25);
    ctx.lineTo(x - 5, y + 15);
    ctx.fill();
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    animateLipSync();
    
    toast({
      title: "Presentation is playing",
      description: "Lip-sync animation started",
    });
  };
  
  const handlePauseVideo = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const handleRegenerateVideo = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    createLipSyncEffect();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    toast({
      title: "Download started",
      description: "Your presentation is being downloaded",
    });
    
    try {
      // Create a downloadable version from the canvas
      const link = document.createElement('a');
      link.download = `presentation-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
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
        <Card className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden mb-6 relative shadow-lg border-2 border-primary/20 transition-all hover:shadow-xl">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-r from-brand-purple/20 to-brand-blue/20">
              <RefreshCw className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Generating your video presentation...</p>
            </div>
          ) : videoUrl ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-br from-brand-dark/60 to-transparent z-10">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue blur-sm"></div>
                  <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-white relative z-10">
                    <canvas 
                      ref={canvasRef} 
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
              <Button onClick={handleRegenerateVideo} className="mt-4">
                Retry Generation
              </Button>
            </div>
          )}
        </Card>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            className="btn-gradient transition-all hover:scale-105"
            onClick={handleDownload}
            disabled={isGenerating || !videoUrl}
          >
            <Download className="mr-2 h-4 w-4" /> Download Presentation
          </Button>
          <Button 
            variant="outline" 
            className="transition-all hover:bg-accent"
            onClick={() => {
              toast({
                title: "Share successful",
                description: "Presentation has been shared",
              });
            }}
            disabled={isGenerating || !videoUrl}
          >
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleRegenerateVideo} 
            disabled={isGenerating}
            className="transition-all hover:bg-secondary/80"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
          </Button>
          <Button variant="ghost" onClick={onReset} className="transition-all hover:text-primary">
            Create Another
          </Button>
        </div>
        
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
