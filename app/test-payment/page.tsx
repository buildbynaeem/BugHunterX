'use client';

import React from 'react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { RAZORPAY_CONFIG } from '@/lib/config';

export default function TestPaymentPage() {
  const { razorpayLoaded, loading } = useRazorpay();

  const testPayment = () => {
    if (!razorpayLoaded) {
      alert('Razorpay not loaded yet');
      return;
    }

    const options = {
      key: RAZORPAY_CONFIG.KEY_ID,
      amount: 10000, // ₹100 in paise
      currency: "INR",
      name: "OneFlow Test",
      description: "Test Payment",
      handler: function(response: any) {
        alert('Payment successful! ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com"
      },
      theme: {
        color: "#6366f1"
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Razorpay Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Status</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                razorpayLoaded ? 'bg-green-500' : 
                loading ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>
                {razorpayLoaded ? '✅ Razorpay Ready' : 
                 loading ? '⏳ Loading...' : '❌ Failed to Load'}
              </span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Key ID: {RAZORPAY_CONFIG.KEY_ID}
            </p>
          </div>

          <button
            onClick={testPayment}
            disabled={!razorpayLoaded}
            className={`w-full py-2 px-4 rounded-lg font-medium ${
              razorpayLoaded 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {razorpayLoaded ? 'Test Payment (₹100)' : 'Loading...'}
          </button>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
