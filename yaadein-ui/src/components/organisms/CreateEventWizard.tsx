"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StepIndicator } from "@/components/molecules/StepIndicator";
import { Button } from "@/components/atoms/Button";
import { eventsService } from "@/lib/api/events.service";
import { createEventSchema, type CreateEventFormData } from "@/lib/schemas/createEvent.schema";

// Import steps
import { Step0EventDetails } from "./create-event/Step0EventDetails";
import { Step1ChoosePlan } from "./create-event/Step1ChoosePlan";
import { Step2CustomizeGallery } from "./create-event/Step2CustomizeGallery";
import { Step3ShareQR } from "./create-event/Step3ShareQR";

const STEPS = ["Details", "Plan", "Customize", "Share"];

export function CreateEventWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdEventId, setCreatedEventId] = React.useState<string | null>(null);

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

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 0) {
      isValid = await trigger(["name", "type", "date", "city"]);
    } else if (currentStep === 1) {
      isValid = await trigger(["plan"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["galleryTitle", "colorTheme", "enableFaceSearch"]);
    }

    if (isValid) {
      if (currentStep === 2) {
        // Submit on step 2
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        name: data.name,
        type: data.type,
        date: data.date,
        city: data.city,
        plan: data.plan,
      };

      const event = await eventsService.createEvent(payload);
      
      setCreatedEventId(event.id);
      setCurrentStep(3); // Go to share step
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {currentStep === 1 && <Step1ChoosePlan />}
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
              disabled={isSubmitting}
            >
              {currentStep === 2 ? "Create Event" : "Continue \u2192"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
