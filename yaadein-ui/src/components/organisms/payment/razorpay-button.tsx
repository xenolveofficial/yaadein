'use client';

import { useState } from 'react';
import Script from 'next/script';

interface RazorpayButtonProps {
  amount: number;
  bookingDetails: {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  onSuccess?: (paymentId: string, orderId: string, signature: string) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
  className?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayButton({
  amount,
  bookingDetails,
  onSuccess,
  onError,
  disabled = false,
  className = '',
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handlePayment = async () => {
    if (!scriptLoaded) return;
    setLoading(true);

    try {
      // Step 1: Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `booking_${bookingDetails.id}`,
          notes: {
            bookingId: bookingDetails.id,
            customerEmail: bookingDetails.customerEmail,
          },
        }),
      });

      const { data } = await response.json();

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: 'Your Company Name',
        description: 'Payment Description',
        order_id: data.orderId,
        handler: async (response: any) => {
          // Step 3: Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          const result = await verifyResponse.json();
          
          if (result.success && onSuccess) {
            onSuccess(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          }
        },
        prefill: {
          name: bookingDetails.customerName,
          email: bookingDetails.customerEmail,
          contact: bookingDetails.customerPhone,
        },
        theme: { color: '#10b981' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      if (onError) onError(error);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={disabled || loading || !scriptLoaded}
        className={className}
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
    </>
  );
}
