import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export function getRazorpayInstance(): Razorpay {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Create Razorpay order
export interface CreateOrderParams {
  amount: number; // Amount in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  const razorpay = getRazorpayInstance();
  
  // Convert to paise (1 INR = 100 paise)
  const amountInPaise = Math.round(params.amount * 100);

  const orderOptions = {
    amount: amountInPaise,
    currency: params.currency || 'INR',
    receipt: params.receipt || `receipt_${Date.now()}`,
    notes: params.notes || {},
  };

  const order = await razorpay.orders.create(orderOptions);
  return order;
}

// Verify payment signature
export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  const text = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generated_signature = crypto
    .createHmac('sha256', keySecret)
    .update(text)
    .digest('hex');

  return generated_signature === razorpay_signature;
}

// Verify webhook signature
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}
