
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StepContainer from '@/components/StepContainer';
import { Mic, MicOff, ArrowRight, Play } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface VoiceStepProps {
  onNext: (audioData: Blob) => void;
  onBack: () => void;
}

const VoiceStep = ({ onNext, onBack }: VoiceStepProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const RECORDING_LIMIT_SECONDS = 120; // 2 minutes

  useEffect(() => {
    return () => {
      // Clean up timer when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up audio URL when component unmounts
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      recorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev + 1 >= RECORDING_LIMIT_SECONDS) {
            stopRecording();
            return RECORDING_LIMIT_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleContinue = () => {
    if (audioBlob) {
      onNext(audioBlob);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (audioBlob && audioUrl) {
    return (
      <StepContainer 
        title="Review Your Voice Sample" 
        description="Listen to your recording before continuing."
      >
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex justify-center mb-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                  onClick={() => audioRef.current?.play()}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <audio ref={audioRef} src={audioUrl} controls className="w-full" />
              <p className="text-center text-sm text-muted-foreground mt-2">
                {formatTime(recordingTime)} recorded
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={resetRecording}>
              Record Again
            </Button>
            <Button className="btn-gradient" onClick={handleContinue}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </StepContainer>
    );
  }

  return (
    <StepContainer 
      title="Record Your Voice" 
      description="We'll use this sample to clone your voice for the presentation."
    >
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-lg">Please read a paragraph or speak naturally for 1-2 minutes.</p>
          <p className="text-muted-foreground mt-2">
            The longer and clearer your sample, the better your AI voice will sound.
          </p>
        </div>

        <div className="w-full max-w-md mb-8">
          <div className="border rounded-lg p-6 bg-muted/30 flex flex-col items-center">
            <Button 
              size="icon"
              className={`h-20 w-20 rounded-full mb-4 ${
                isRecording ? 'bg-destructive hover:bg-destructive/90' : 'btn-gradient'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
            
            <div className="w-full mb-2">
              <Progress value={(recordingTime / RECORDING_LIMIT_SECONDS) * 100} />
            </div>
            
            <div className="flex justify-between w-full text-sm">
              <span>{formatTime(recordingTime)}</span>
              <span>{formatTime(RECORDING_LIMIT_SECONDS)}</span>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isRecording ? "Recording... Click to stop" : "Click to start recording"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="btn-gradient" 
            disabled={!audioBlob || isRecording}
            onClick={handleContinue}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </StepContainer>
  );
};

export default VoiceStep;
