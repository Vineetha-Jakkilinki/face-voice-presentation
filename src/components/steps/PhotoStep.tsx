
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StepContainer from '@/components/StepContainer';
import { Camera, Upload, ArrowRight, Image } from 'lucide-react';

interface PhotoStepProps {
  onNext: (photoData: string) => void;
}

const PhotoStep = ({ onNext }: PhotoStepProps) => {
  const [photoMode, setPhotoMode] = useState<'upload' | 'camera' | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle camera setup
  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (photoMode === 'camera') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          alert('Unable to access your camera. Please check permissions or try uploading a photo instead.');
          setPhotoMode(null);
        }
      } else if (stream) {
        // Stop the camera stream if photo mode changes
        stream.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    };

    setupCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [photoMode]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const photo = canvas.toDataURL('image/png');
        setPhotoData(photo);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setIsCameraActive(false);
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          setPhotoData(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (photoData) {
      onNext(photoData);
    }
  };

  const resetPhoto = () => {
    setPhotoData(null);
    if (photoMode === 'camera') {
      setPhotoMode(null);
      setTimeout(() => setPhotoMode('camera'), 100);
    }
  };

  if (photoData) {
    return (
      <StepContainer 
        title="Review Your Photo" 
        description="Make sure your face is clearly visible and well-lit."
      >
        <div className="flex flex-col items-center">
          <div className="mb-6 border rounded-lg overflow-hidden w-64 h-64">
            <img 
              src={photoData} 
              alt="Your photo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={resetPhoto}>
              Try Again
            </Button>
            <Button className="btn-gradient" onClick={handleContinue}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </StepContainer>
    );
  }

  if (photoMode === 'camera') {
    return (
      <StepContainer 
        title="Take Your Photo" 
        description="Position your face in the center of the frame."
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-6 border rounded-lg overflow-hidden w-full max-w-md">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setPhotoMode(null)}>
              Back
            </Button>
            <Button 
              className="btn-gradient" 
              onClick={takePhoto}
              disabled={!isCameraActive}
            >
              {isCameraActive ? (
                <>Capture Photo <Camera className="ml-2 h-4 w-4" /></>
              ) : (
                "Loading Camera..."
              )}
            </Button>
          </div>
        </div>
      </StepContainer>
    );
  }

  if (photoMode === 'upload') {
    return (
      <StepContainer 
        title="Upload Your Photo" 
        description="Choose a clear image of your face."
      >
        <div className="flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-64 w-64 border-dashed border-2 flex flex-col items-center justify-center gap-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground" />
            <span className="text-muted-foreground">Click to browse files</span>
          </Button>
          
          <div className="mt-6">
            <Button variant="outline" onClick={() => setPhotoMode(null)}>
              Back
            </Button>
          </div>
        </div>
      </StepContainer>
    );
  }

  // Initial choice screen
  return (
    <StepContainer 
      title="Add Your Photo" 
      description="We'll use this to create your digital presenter."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center text-center hover:border-brand-purple cursor-pointer transition-colors" onClick={() => setPhotoMode('upload')}>
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Image className="h-8 w-8 text-brand-purple" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload a Photo</h3>
          <p className="text-muted-foreground">Select an existing photo from your device</p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center text-center hover:border-brand-purple cursor-pointer transition-colors" onClick={() => setPhotoMode('camera')}>
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-brand-purple" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Take a Photo</h3>
          <p className="text-muted-foreground">Use your camera to take a new photo</p>
        </Card>
      </div>
    </StepContainer>
  );
};

export default PhotoStep;
