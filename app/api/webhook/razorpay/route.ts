import { NextRequest, NextResponse } from 'next/server';
import { updateAttendee } from '@/lib/database';
import crypto from 'crypto';

const RAZORPAY_WEBHOOK_SECRET = 'BQeampTmQOwRTXkZwXZrN6Ze'; // This should be from env in production

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment success
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      
      // Find attendee by payment ID (you might need to store this mapping)
      // For now, we'll log the payment details
      console.log('Payment captured:', {
        payment_id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status
      });

      // In a real app, you'd update the attendee status here
      // For now, we'll just return success
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
