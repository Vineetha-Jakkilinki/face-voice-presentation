
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, RefreshCw, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoControlsProps {
  isGenerating: boolean;
  videoUrl: string | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onReset: () => void;
}

const VideoControls = ({
  isGenerating,
  videoUrl,
  isPlaying,
  onPlay,
  onPause,
  onRegenerate,
  onDownload,
  onReset
}: VideoControlsProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    toast({
      title: "Share successful",
      description: "Presentation has been shared",
    });
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button 
        className="btn-gradient transition-all hover:scale-105"
        onClick={onDownload}
        disabled={isGenerating || !videoUrl}
      >
        <Download className="mr-2 h-4 w-4" /> Download Presentation
      </Button>
      <Button 
        variant="outline" 
        className="transition-all hover:bg-accent"
        onClick={handleShare}
        disabled={isGenerating || !videoUrl}
      >
        <Share className="mr-2 h-4 w-4" /> Share
      </Button>
      <Button 
        variant="secondary" 
        onClick={onRegenerate} 
        disabled={isGenerating}
        className="transition-all hover:bg-secondary/80"
      >
        <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
      </Button>
      <Button variant="ghost" onClick={onReset} className="transition-all hover:text-primary">
        Create Another
      </Button>
    </div>
  );
};

export default VideoControls;
