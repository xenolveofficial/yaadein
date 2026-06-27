"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { CreateEventFormData } from "@/lib/schemas/createEvent.schema";
import { PlanCard } from "@/components/molecules/PlanCard";
import { plansContent } from "@/content/plans.content";

export function Step1ChoosePlan() {
  const { control } = useFormContext<CreateEventFormData>();

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
    </div>
  );
}
