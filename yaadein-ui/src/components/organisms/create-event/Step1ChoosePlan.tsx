"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { CreateEventFormData } from "@/lib/schemas/createEvent.schema";
import { PlanCard } from "@/components/molecules/PlanCard";
import { plansContent } from "@/content/plans.content";
import { Button } from "@/components/atoms/Button";

interface Step1ChoosePlanProps {
  eventId: string;
  userId: string;
  selectedPlan: string;
  onPaymentSuccess: () => void;
  paymentCompleted: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Step1ChoosePlan({
  eventId,
  userId,
  selectedPlan,
  onPaymentSuccess,
  paymentCompleted
}: Step1ChoosePlanProps) {
  const { control } = useFormContext<CreateEventFormData>();
  const [loading, setLoading] = React.useState(false);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const [scriptError, setScriptError] = React.useState(false);

  const selectedPlanData = plansContent.find(p => p.id === selectedPlan);
  const amount = selectedPlanData?.price || 0;

  // Load Razorpay script dynamically in useEffect
  React.useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      // Script exists but might not be loaded yet
      existingScript.addEventListener('load', () => {
        setScriptLoaded(true);
      });
      existingScript.addEventListener('error', () => {
        setScriptError(true);
        toast.error("Failed to load payment system");
      });
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      setScriptLoaded(true);
      console.log('✅ Razorpay script loaded successfully');
    };
    
    script.onerror = () => {
      setScriptError(true);
      toast.error("Failed to load payment system");
      console.error('❌ Failed to load Razorpay script');
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove script on unmount to allow reuse
      // script.remove();
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error("Payment system is loading, please wait...");
      return;
    }
    
    setLoading(true);

    try {
      // Step 1: Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `event_${eventId}`,
          notes: {
            eventId,
            userId,
            plan: selectedPlan,
          },
        }),
      });

      const { data } = await response.json();

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: 'Yaadein',
        description: `${selectedPlanData?.name} Plan - Event Payment`,
        order_id: data.orderId,
        handler: async (razorpayResponse: any) => {
          // Step 3: Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              user_id: userId,
              event_id: eventId,
              plan: selectedPlan,
              amount: amount,
            }),
          });

          const result = await verifyResponse.json();
          
          if (result.success) {
            onPaymentSuccess();
            setLoading(false);
          } else {
            toast.error("Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#C4622D'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <h2 className="text-xl font-display font-semibold text-text-primary">Choose a Plan</h2>
          <p className="text-sm text-text-secondary mt-1">
            Select the storage and features that fit your event.
          </p>
        </div>

        <Controller
          name="plan"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plansContent.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isSelected={field.value === plan.id}
                    onSelect={() => field.onChange(plan.id)}
                  />
                ))}
              </div>
              {fieldState.error && (
                <p className="text-sm text-error mt-2">{fieldState.error.message}</p>
              )}
            </>
          )}
        />

        {/* Payment Section */}
        <div className="mt-8 pt-6 border-t border-border">
          {paymentCompleted ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Payment completed successfully! You can now continue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {selectedPlanData?.name} Plan
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Complete payment to proceed
                  </p>
                </div>
                <p className="text-2xl font-display font-semibold text-text-primary">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
              
              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={loading || !scriptLoaded}
                isLoading={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
              </Button>
              
              <p className="text-xs text-text-secondary text-center">
                Secure payment powered by Razorpay
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
