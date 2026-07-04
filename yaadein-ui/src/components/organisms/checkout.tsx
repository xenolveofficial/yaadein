'use client';

import { RazorpayButton } from './payment/razorpay-button';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  const bookingDetails = {
    id: 'booking_123',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+919876543210',
  };

  const handleSuccess = (paymentId: string, orderId: string) => {
    console.log('Payment successful!', { paymentId, orderId });
    router.push(`/success?payment_id=${paymentId}`);
  };

  return (
    <div className="p-6">
      <h1>Complete Payment</h1>
      <RazorpayButton
        amount={3999.00}
        bookingDetails={bookingDetails}
        onSuccess={handleSuccess}
        className="w-full bg-blue-600 text-white py-3 rounded"
      />
    </div>
  );
}
