
import { useEffect } from 'react';

interface DocumentMetaProps {
  title?: string;
  description?: string;
}

const DocumentMeta = ({ title = "Presentify.AI", description = "Create AI-powered presentations with your face and voice" }: DocumentMetaProps) => {
  useEffect(() => {
    document.title = title;
    
    // Update meta description if it exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update OpenGraph tags if they exist
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default DocumentMeta;
