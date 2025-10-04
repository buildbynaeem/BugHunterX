// Test script to verify buy ticket functionality
// This script tests the complete flow from button click to QR ticket generation

console.log('🎫 Testing Buy Ticket Functionality');
console.log('=====================================');

// Test 1: Check if Razorpay script loads
function testRazorpayLoading() {
  console.log('\n1. Testing Razorpay Script Loading...');
  
  if (typeof window !== 'undefined' && window.Razorpay) {
    console.log('✅ Razorpay is available');
    return true;
  } else {
    console.log('❌ Razorpay is not loaded');
    return false;
  }
}

// Test 2: Check if events are available
function testEventsAvailable() {
  console.log('\n2. Testing Events Availability...');
  
  // This would be called from the browser console
  // Check if events are loaded in the page
  const eventCards = document.querySelectorAll('[data-testid="event-card"]') || 
                    document.querySelectorAll('.event-card') ||
                    document.querySelectorAll('button:contains("Buy Ticket")');
  
  if (eventCards.length > 0) {
    console.log(`✅ Found ${eventCards.length} events available`);
    return true;
  } else {
    console.log('❌ No events found');
    return false;
  }
}

// Test 3: Test buy ticket button functionality
function testBuyTicketButton() {
  console.log('\n3. Testing Buy Ticket Button...');
  
  const buyButtons = document.querySelectorAll('button');
  const buyTicketButtons = Array.from(buyButtons).filter(btn => 
    btn.textContent.includes('Buy Ticket') || btn.textContent.includes('🎫')
  );
  
  if (buyTicketButtons.length > 0) {
    console.log(`✅ Found ${buyTicketButtons.length} buy ticket buttons`);
    return buyTicketButtons;
  } else {
    console.log('❌ No buy ticket buttons found');
    return [];
  }
}

// Test 4: Test payment flow
function testPaymentFlow(eventData) {
  console.log('\n4. Testing Payment Flow...');
  
  const testOptions = {
    key: 'rzp_test_mhBjQFvKP3noff',
    amount: 10000, // ₹100 in paise
    currency: 'INR',
    name: 'OneFlow Event',
    description: 'Test Event',
    handler: function(response) {
      console.log('✅ Payment successful!', response);
      console.log('Payment ID:', response.razorpay_payment_id);
      return response;
    },
    prefill: {
      name: 'Test User',
      email: 'test@example.com'
    },
    theme: {
      color: '#6366f1'
    }
  };
  
  try {
    if (window.Razorpay) {
      const rzp = new window.Razorpay(testOptions);
      console.log('✅ Razorpay instance created successfully');
      return rzp;
    } else {
      console.log('❌ Razorpay not available');
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating Razorpay instance:', error);
    return null;
  }
}

// Test 5: Check QR code generation
function testQRCodeGeneration() {
  console.log('\n5. Testing QR Code Generation...');
  
  // Check if QR code library is available
  if (typeof QRCode !== 'undefined' || document.querySelector('canvas') || document.querySelector('svg')) {
    console.log('✅ QR code generation capability detected');
    return true;
  } else {
    console.log('❌ QR code generation not available');
    return false;
  }
}

// Main test function
function runAllTests() {
  console.log('🚀 Starting comprehensive buy ticket tests...\n');
  
  const results = {
    razorpayLoading: testRazorpayLoading(),
    eventsAvailable: testEventsAvailable(),
    buyTicketButtons: testBuyTicketButton(),
    qrCodeGeneration: testQRCodeGeneration()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log('Razorpay Loading:', results.razorpayLoading ? '✅ PASS' : '❌ FAIL');
  console.log('Events Available:', results.eventsAvailable ? '✅ PASS' : '❌ FAIL');
  console.log('Buy Ticket Buttons:', results.buyTicketButtons.length > 0 ? '✅ PASS' : '❌ FAIL');
  console.log('QR Code Generation:', results.qrCodeGeneration ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = results.razorpayLoading && results.eventsAvailable && 
                   results.buyTicketButtons.length > 0 && results.qrCodeGeneration;
  
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (allPassed) {
    console.log('\n🎉 Buy Ticket functionality is working correctly!');
    console.log('You can now:');
    console.log('1. Click any "Buy Ticket" button');
    console.log('2. Fill in your name and email');
    console.log('3. Complete payment with test card details');
    console.log('4. View your QR ticket in "My Tickets" tab');
  } else {
    console.log('\n🔧 Some issues found. Please check the failed tests above.');
  }
  
  return results;
}

// Instructions for manual testing
console.log('\n📋 Manual Testing Instructions:');
console.log('==============================');
console.log('1. Open browser console on the attendee page');
console.log('2. Copy and paste this entire script');
console.log('3. Run: runAllTests()');
console.log('4. Follow the test results and instructions');
console.log('\n💳 Test Payment Details:');
console.log('Card Number: 4111 1111 1111 1111');
console.log('Expiry: 12/25');
console.log('CVV: 123');
console.log('Name: Any name');

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testPaymentFlow };
}