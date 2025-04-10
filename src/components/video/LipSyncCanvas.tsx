
import React, { useRef, useEffect } from 'react';

interface LipSyncCanvasProps {
  videoUrl: string;
  isPlaying: boolean;
}

const LipSyncCanvas = ({ videoUrl, isPlaying }: LipSyncCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (isPlaying) {
      animateLipSync();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    return () => {
      // Clean up any animations
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, videoUrl]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-cover"
    />
  );
};

export default LipSyncCanvas;
