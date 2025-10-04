'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import { Button } from '@/components/ui/button';

export default function TestPreloaderPage() {
  const [isLoading, setIsLoading] = useState(false);

  const triggerPreloader = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Preloader isLoading={isLoading} duration={3000} />
      
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Preloader Test Page
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Click the button below to see the preloader animation
        </p>
        <Button 
          onClick={triggerPreloader}
          disabled={isLoading}
          className="px-8 py-3 text-lg"
        >
          {isLoading ? 'Loading...' : 'Trigger Preloader'}
        </Button>
      </div>
    </div>
  );
}