import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters").max(100),
  type: z.enum(['wedding', 'birthday', 'graduation', 'corporate', 'engagement', 'other']),
  date: z.string().datetime({ message: "Invalid date format" }),
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
});

export const createEventSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type CreateEventFormData = z.infer<typeof createEventSchema>;
