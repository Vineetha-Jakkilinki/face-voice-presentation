
import React from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LipSyncCanvas from './LipSyncCanvas';

interface VideoDisplayProps {
  isGenerating: boolean;
  videoUrl: string | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  topic: string;
}

const VideoDisplay = ({ 
  isGenerating, 
  videoUrl, 
  isPlaying, 
  onPlay, 
  onPause, 
  topic 
}: VideoDisplayProps) => {
  return (
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
                {isPlaying ? (
                  <LipSyncCanvas videoUrl={videoUrl} isPlaying={isPlaying} />
                ) : (
                  <img 
                    src={videoUrl} 
                    alt="Video preview" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 mt-2">{topic}</h3>
            <p className="text-sm opacity-80 mb-4">AI-Generated Lip-Sync Presentation</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
              onClick={isPlaying ? onPause : onPlay}
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
          <Button onClick={() => {}} className="mt-4">
            Retry Generation
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VideoDisplay;
