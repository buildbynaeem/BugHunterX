'use client';

import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  isLoading?: boolean;
  duration?: number;
  className?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ 
  isLoading = true, 
  duration = 2000,
  className = ""
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading, duration]);

  if (!showLoader) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white ${className}`}>
      <div className="flex items-center justify-center">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Preloader;