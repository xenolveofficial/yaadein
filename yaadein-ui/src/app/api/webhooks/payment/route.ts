import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payment/razorpay';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    const body = await request.text();

    if (!signature || !verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const { event, payload: eventPayload } = payload;

    // Handle different events
    switch (event) {
      case 'payment.captured':
        // Update your database
        console.log('Payment captured:', eventPayload.payment.entity.id);
        break;
      case 'payment.failed':
        console.log('Payment failed:', eventPayload.payment.entity.id);
        break;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
