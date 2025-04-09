
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

const LandingHero = ({ onStart }: LandingHeroProps) => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="gradient-heading">Presentify.AI</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground">
            Your Face. Your Voice. Your Presentation.
          </p>
        </div>

        <div className="max-w-3xl mb-12">
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            Create stunning AI-powered presentation videos featuring your own face and voice.
            Just upload a photo, record your voice, and describe your topic.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 border rounded-lg bg-card">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
                <span className="font-bold text-brand-purple">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-sm text-muted-foreground">
                Provide a clear image of your face to create your digital presenter.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-card">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
                <span className="font-bold text-brand-purple">2</span>
              </div>
              <h3 className="font-semibold mb-2">Record Your Voice</h3>
              <p className="text-sm text-muted-foreground">
                A short voice sample lets us clone your speech patterns and tone.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-card">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
                <span className="font-bold text-brand-purple">3</span>
              </div>
              <h3 className="font-semibold mb-2">Describe Your Topic</h3>
              <p className="text-sm text-muted-foreground">
                Tell us what you want to present and we'll generate the content.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onStart} 
          size="lg" 
          className="btn-gradient text-lg px-8 py-6 h-auto"
        >
          Create Your Presentation <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LandingHero;
