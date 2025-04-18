import { useState, useEffect } from 'react';

export default function LoadingSpinner() {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* Spinner */}
        <div className="spinner"></div>
        
        {/* Loading text with animated dots */}
        <p className="loading-text">
          Loading{dots}
        </p>
      </div>
    </div>
  );
}


