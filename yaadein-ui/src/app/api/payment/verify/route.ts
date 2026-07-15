import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/payment/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id, event_id, plan, amount } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Save payment to database if additional details provided
    if (user_id && event_id && plan && amount) {
      const supabase = await createClient();
      
      const { error: dbError } = await supabase
        .from('payments')
        .insert({
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount: amount,
          status: 'success',
          plan: plan,
          user_id: user_id,
          event_id: event_id,
          razorpay_payment_id: razorpay_payment_id,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the request if DB save fails, payment is already verified
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        verified: true,
      },
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed', message: error.message },
      { status: 500 }
    );
  }
}
