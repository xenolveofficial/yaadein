"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { CreateEventFormData } from "@/lib/schemas/createEvent.schema";
import { FormField } from "@/components/molecules/FormField";
import { UploadDropzone } from "@/components/molecules/UploadDropzone";
import { Switch } from "@/components/ui/switch";
import { ConsentBanner } from "@/components/molecules/ConsentBanner";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: 'ivory', color: '#FDFCFA' },
  { id: 'rose', color: '#FDF7F7' },
  { id: 'sage', color: '#F5F8F6' },
  { id: 'midnight', color: '#1A1A2E' },
  { id: 'white', color: '#FFFFFF' },
] as const;

export function Step2CustomizeGallery() {
  const { control, watch } = useFormContext<CreateEventFormData>();
  const eventName = watch('name') || 'Your Event';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">Cover Photo (Optional)</label>
        <Controller
          name="coverPhoto"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <UploadDropzone
                maxFiles={1}
                accept="image/jpeg, image/png, image/webp"
                onFilesSelected={(files) => field.onChange(files[0])}
              />
              {field.value && (
                <p className="text-sm text-text-muted mt-2">
                  Selected: {field.value.name}
                </p>
              )}
              {fieldState.error && (
                <p className="text-sm text-error mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <FormField
        name="galleryTitle"
        control={control}
        label="Gallery Title"
        placeholder="e.g. Priya & Rahul's Wedding Gallery"
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">Color Theme</label>
        <Controller
          name="colorTheme"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => field.onChange(theme.id)}
                  className={cn(
                    "w-10 h-10 rounded-full border border-border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                    field.value === theme.id ? "ring-2 ring-brand-primary ring-offset-2" : "hover:scale-110"
                  )}
                  style={{ backgroundColor: theme.color }}
                  aria-label={`Select ${theme.id} theme`}
                />
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-surface-secondary/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-4">
            <label className="text-sm font-medium text-text-primary">Enable Face Search</label>
            <p className="text-sm text-text-muted">
              Allow guests to find their photos instantly using facial recognition.
            </p>
          </div>
          <Controller
            name="enableFaceSearch"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        
        <Controller
          name="enableFaceSearch"
          control={control}
          render={({ field }) => (
            field.value ? (
              <ConsentBanner
                eventName={eventName}
                onConsent={() => {}} // Not strictly needed here, just for preview
              />
            ) : <></>
          )}
        />
      </div>
    </div>
  );
}
