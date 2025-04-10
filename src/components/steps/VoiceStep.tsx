
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StepContainer from '@/components/StepContainer';
import { Mic, MicOff, ArrowRight, Play, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if the file is an audio file
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an audio file (mp3, wav, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Create a blob from the file
      const blob = file.slice(0, file.size, file.type);
      setAudioBlob(blob);
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      toast({
        title: "Audio File Uploaded",
        description: "Your audio file has been successfully uploaded.",
      });
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
              {recordingTime > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {formatTime(recordingTime)} recorded
                </p>
              )}
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
      title="Add Your Voice" 
      description="We'll use this sample to clone your voice for the presentation."
    >
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-lg">Please provide a voice sample (1-2 minutes) for best results.</p>
          <p className="text-muted-foreground mt-2">
            The longer and clearer your sample, the better your AI voice will sound.
          </p>
        </div>

        <Tabs defaultValue="record" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="record">Record Voice</TabsTrigger>
            <TabsTrigger value="upload">Upload Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record">
            <div className="border rounded-lg p-6 bg-muted/30 flex flex-col items-center mb-8">
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
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="border rounded-lg p-6 bg-muted/30 flex flex-col items-center mb-8">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={handleFileUpload} 
              />
              
              <Button 
                onClick={triggerFileUpload}
                className="btn-gradient h-20 w-full flex flex-col items-center justify-center mb-4 gap-2"
              >
                <Upload className="h-8 w-8" />
                <span>Upload Audio File</span>
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                Supported formats: MP3, WAV, M4A, etc.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
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
