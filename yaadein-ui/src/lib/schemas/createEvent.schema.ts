import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters").max(100),
  type: z.enum(['wedding', 'birthday', 'graduation', 'corporate', 'engagement', 'other']).optional(),
  date: z.string().datetime({ message: "Invalid date format" }).refine(
    (dateStr) => {
      const selectedDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return selectedDate >= today;
    },
    { message: "Event date cannot be in the past" }
  ),
  city: z.string().min(2, "City name is required"),
});

export const step2Schema = z.object({
  plan: z.enum(['starter', 'basic', 'premium', 'elite']),
});

export const step3Schema = z.object({
  coverPhoto: z.instanceof(File).optional(),
  galleryTitle: z.string().min(3, "Gallery title must be at least 3 characters"),
  colorTheme: z.enum(['ivory', 'rose', 'sage', 'midnight', 'white']),
  enableFaceSearch: z.boolean(),
  guestPin: z.string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only numbers"),
});

export const createEventSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type CreateEventFormData = z.infer<typeof createEventSchema>;
