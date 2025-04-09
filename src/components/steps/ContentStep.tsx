import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import StepContainer from '@/components/StepContainer';
import { ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContentStepProps {
  onNext: (content: { topic: string; description: string }) => void;
  onBack: () => void;
}

const ContentStep = ({ onNext, onBack }: ContentStepProps) => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a presentation topic.",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide details for your presentation content.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms of use to continue.",
        variant: "destructive",
      });
      return;
    }

    onNext({ topic, description });
  };

  return (
    <StepContainer 
      title="Create Your Presentation" 
      description="Tell us what you'd like to present about."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Presentation Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., Introduction to Artificial Intelligence"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Content Details</Label>
          <Textarea
            id="description"
            placeholder="Describe what you want your presentation to cover. The more details you provide, the better the results will be."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms} 
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I consent to the use of my photo and voice for creating this presentation video
          </Label>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="btn-gradient">
            Create Presentation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </StepContainer>
  );
};

export default ContentStep;
