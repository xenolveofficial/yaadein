import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payment/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, receipt, notes } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          amountInINR: Number(order.amount) / 100,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          createdAt: order.created_at,
        },
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Order creation failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
