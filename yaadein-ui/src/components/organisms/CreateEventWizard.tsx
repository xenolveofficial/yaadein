"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StepIndicator } from "@/components/molecules/StepIndicator";
import { Button } from "@/components/atoms/Button";
import { eventsService } from "@/lib/api/events.service";
import { createEventSchema, type CreateEventFormData } from "@/lib/schemas/createEvent.schema";
import { createClient } from "@/lib/supabase/client";

// Import steps
import { Step0EventDetails } from "./create-event/Step0EventDetails";
import { Step1ChoosePlan } from "./create-event/Step1ChoosePlan";
import { Step2CustomizeGallery } from "./create-event/Step2CustomizeGallery";
import { Step3ShareQR } from "./create-event/Step3ShareQR";

const STEPS = ["Details", "Plan", "Customize", "Share"];

export function CreateEventWizard() {
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams.get('eventId');
  
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdEventId, setCreatedEventId] = React.useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = React.useState(false);

  const methods = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema as any),
    defaultValues: {
      name: "",
      city: "",
      plan: "starter",
      galleryTitle: "",
      colorTheme: "ivory",
      enableFaceSearch: false,
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, watch } = methods;
  const selectedPlan = watch("plan");

  // Get current user on mount
  React.useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Load existing event if eventId is in URL
  React.useEffect(() => {
    const loadExistingEvent = async () => {
      if (!eventIdFromUrl) return;
      
      setIsLoadingEvent(true);
      try {
        console.log('🔍 Loading event from URL:', eventIdFromUrl);
        const event = await eventsService.getEvent(eventIdFromUrl);
        
        console.log('📦 Event loaded:', event);
        
        // Only pre-fill if event status is "pending"
        if (event.status === 'pending') {
          console.log('✅ Event status is pending, pre-filling form');
          
          // Check if event date is in the past
          const eventDate = new Date(event.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const isPastDate = eventDate < today;
          
          // Pre-fill form with event data
          methods.reset({
            name: event.name,
            type: event.type,
            date: event.date,
            city: event.city,
            plan: event.plan,
            galleryTitle: methods.getValues('galleryTitle') || "",
            colorTheme: methods.getValues('colorTheme') || "ivory",
            enableFaceSearch: event.enableFaceSearch || false,
          });
          
          // Set event ID
          setCreatedEventId(event.id);
          
          if (isPastDate) {
            // Keep user on Step 0 if date is in the past
            setCurrentStep(0);
            toast.error('Event date is in the past. Please update the date to continue.');
            console.log('⚠️ Event date is in the past, staying on Step 0');
          } else {
            // Navigate to Step 1 if date is valid
            setCurrentStep(1);
            toast.success('Event loaded! Please complete payment to continue.');
          }
        } else {
          console.log('⚠️ Event status is not pending:', event.status);
          toast.info(`Event is already ${event.status}. Starting fresh.`);
        }
      } catch (error) {
        console.error('❌ Failed to load event:', error);
        toast.error('Failed to load event. Starting fresh.');
      } finally {
        setIsLoadingEvent(false);
      }
    };
    
    loadExistingEvent();
  }, [eventIdFromUrl, methods]);

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 0) {
      isValid = await trigger(["name", "date", "city"]);
      if (isValid) {
        // Only create event if it doesn't already exist
        if (!createdEventId) {
          await createEventBeforePayment();
        } else {
          // Event already exists, just move to next step
          console.log('✅ Event already exists, skipping creation');
          setCurrentStep(1);
        }
        return;
      }
    } else if (currentStep === 1) {
      isValid = await trigger(["plan"]);
      // Check if payment is completed before allowing to proceed
      if (isValid && !paymentCompleted) {
        toast.error("Please complete the payment to continue");
        return;
      }else if(isValid && paymentCompleted){
        setCurrentStep((prev) => prev + 1);
      }
      
    } else if (currentStep === 2) {
      isValid = await trigger(["galleryTitle", "colorTheme", "enableFaceSearch"]);
      if (isValid) {
        handleSubmit(onSubmit)();
      }
    }

  };

  const createEventBeforePayment = async () => {
    try {
      setIsSubmitting(true);
      const formData = methods.getValues();
      
      const payload = {
        name: formData.name,
        type: formData.type,
        date: formData.date,
        city: formData.city,
        plan: formData.plan,
      };

      const event = await eventsService.createEvent(payload);
      setCreatedEventId(event.id);
      toast.success("Event created! Please complete payment to continue.");
      setCurrentStep(1); // Move to plan selection
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to create event");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Update event status to active after successful payment
      if (createdEventId) {
        console.log('💳 Payment successful, updating event status to active');
        await eventsService.updateEvent(createdEventId, { status: 'active' });
        console.log('✅ Event status updated to active');
      }
      
      setPaymentCompleted(true);
      toast.success("Payment successful! You can now continue.");
    } catch (error) {
      console.error('❌ Failed to update event status:', error);
      // Still mark payment as completed even if status update fails
      setPaymentCompleted(true);
      toast.success("Payment successful! You can now continue.");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      setIsSubmitting(true);
      // Event already created, just move to share step
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to proceed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching event from URL
  if (isLoadingEvent) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-surface-primary rounded-xl border border-border shadow-card p-6 md:p-8">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-sm text-text-secondary">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {currentStep < 3 && (
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      )}

      <div className="bg-surface-primary rounded-xl border border-border shadow-card p-6 md:p-8">
        <FormProvider {...methods}>
          {currentStep === 0 && <Step0EventDetails />}
          {currentStep === 1 && createdEventId && userId && (
            <Step1ChoosePlan
              eventId={createdEventId}
              userId={userId}
              selectedPlan={selectedPlan}
              onPaymentSuccess={handlePaymentSuccess}
              paymentCompleted={paymentCompleted}
            />
          )}
          {currentStep === 2 && <Step2CustomizeGallery />}
          {currentStep === 3 && createdEventId && <Step3ShareQR eventId={createdEventId} />}
        </FormProvider>

        {currentStep < 3 && (
          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </Button>
            
            <Button
              variant="primary"
              onClick={handleNext}
              isLoading={isSubmitting}
              disabled={isSubmitting || (currentStep === 1 && !paymentCompleted)}
            >
              {currentStep === 2 ? "Finalize Event" : "Continue \u2192"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
