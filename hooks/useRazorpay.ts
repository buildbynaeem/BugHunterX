import { useState, useEffect } from 'react';

export const useRazorpay = () => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const loadRazorpay = () => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      console.log('✅ Razorpay already loaded');
      setRazorpayLoaded(true);
      setLoading(false);
      return;
    }

    // Remove any existing script
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      setRazorpayLoaded(true);
      setLoading(false);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      setLoading(false);
      
      // Retry up to 3 times
      if (retryCount < 3) {
        console.log(`🔄 Retrying... (${retryCount + 1}/3)`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          setLoading(true);
          loadRazorpay();
        }, 2000);
      }
    };

    // Add script to head
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadRazorpay();
  }, [retryCount]);

  return { razorpayLoaded, loading };
};
