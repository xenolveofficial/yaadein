import { createClient } from '@/lib/supabase/client';

export interface PaymentRecord {
  id?: string;
  payment_id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  plan: string;
  user_id: string;
  event_id: string;
  razorpay_payment_id?: string;
  created_at?: string;
}

export const paymentService = {
  /**
   * Save payment record to Supabase
   */
  async savePayment(payment: Omit<PaymentRecord, 'id' | 'created_at'>) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        payment_id: payment.payment_id,
        order_id: payment.order_id,
        amount: payment.amount,
        status: payment.status,
        plan: payment.plan,
        user_id: payment.user_id,
        event_id: payment.event_id,
        razorpay_payment_id: payment.razorpay_payment_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving payment:', error);
      throw new Error(error.message);
    }

    return data as PaymentRecord;
  },

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    orderId: string,
    status: 'success' | 'failed',
    razorpayPaymentId?: string
  ) {
    const supabase = createClient();
    
    const updateData: any = { status };
    if (razorpayPaymentId) {
      updateData.razorpay_payment_id = razorpayPaymentId;
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('order_id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      throw new Error(error.message);
    }

    return data as PaymentRecord;
  },

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      throw new Error(error.message);
    }

    return data as PaymentRecord;
  },

  /**
   * Get payment by event ID
   */
  async getPaymentByEventId(eventId: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No payment found
        return null;
      }
      console.error('Error fetching payment:', error);
      throw new Error(error.message);
    }

    return data as PaymentRecord;
  },
};

// Made with Bob
