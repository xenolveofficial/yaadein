"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { CreateEventFormData } from "@/lib/schemas/createEvent.schema";
import { FormField } from "@/components/molecules/FormField";
import { EventTypePicker } from "@/components/molecules/EventTypePicker";
import { Button } from "@/components/atoms/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Step0EventDetails() {
  const { control } = useFormContext<CreateEventFormData>();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormField
        name="name"
        control={control}
        label="Event Name"
        placeholder="e.g. Priya & Rahul's Wedding"
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">Event Type</label>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <EventTypePicker
                value={field.value ? field.value.charAt(0).toUpperCase() + field.value.slice(1) : undefined}
                onChange={(v) => field.onChange(v.toLowerCase())}
              />
              {fieldState.error && (
                <p className="text-sm text-error mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-surface-primary border border-border shadow-sm hover:bg-surface-secondary",
                      !field.value && "text-text-muted"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.error && (
                <p className="text-sm text-error mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <FormField
        name="city"
        control={control}
        label="City"
        placeholder="e.g. Mumbai"
      />
    </div>
  );
}
