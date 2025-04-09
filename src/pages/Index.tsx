
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingHero from '@/components/LandingHero';
import StepIndicator from '@/components/StepIndicator';
import PhotoStep from '@/components/steps/PhotoStep';
import VoiceStep from '@/components/steps/VoiceStep';
import ContentStep from '@/components/steps/ContentStep';
import ProcessingStep from '@/components/steps/ProcessingStep';
import ResultStep from '@/components/steps/ResultStep';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [contentData, setContentData] = useState<{ topic: string; description: string } | null>(null);

  const startWizard = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setPhotoData(null);
    setAudioData(null);
    setContentData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoNext = (photo: string) => {
    setPhotoData(photo);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVoiceNext = (audio: Blob) => {
    setAudioData(audio);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVoiceBack = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContentNext = (content: { topic: string; description: string }) => {
    setContentData(content);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContentBack = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessingNext = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentStep = () => {
    // If we're on the landing page
    if (currentStep === 0) {
      return <LandingHero onStart={startWizard} />;
    }

    // For all wizard steps, show the step indicator
    return (
      <div className="container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} totalSteps={5} />
        
        {currentStep === 1 && (
          <PhotoStep onNext={handlePhotoNext} />
        )}
        
        {currentStep === 2 && (
          <VoiceStep onNext={handleVoiceNext} onBack={handleVoiceBack} />
        )}
        
        {currentStep === 3 && (
          <ContentStep onNext={handleContentNext} onBack={handleContentBack} />
        )}
        
        {currentStep === 4 && photoData && contentData && (
          <ProcessingStep
            onNext={handleProcessingNext}
            processingData={{
              photo: photoData,
              topic: contentData.topic
            }}
          />
        )}
        
        {currentStep === 5 && photoData && contentData && (
          <ResultStep
            onReset={resetWizard}
            processingData={{
              photo: photoData,
              topic: contentData.topic
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header className={currentStep === 0 ? "absolute top-0 left-0 right-0 z-10" : ""} />
      
      <main className="flex-grow">
        {renderCurrentStep()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
