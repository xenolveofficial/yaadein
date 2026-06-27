import { api, type RequestOptions } from './client';
import type { Event, CreateEventPayload } from '@/types/api/events.types';

export const eventsService = {
  createEvent: (payload: CreateEventPayload, options?: RequestOptions) => 
    api.post<Event>('/events', payload, options),
    
  getEvent: (idOrSlug: string, options?: RequestOptions) => 
    api.get<Event>(`/events/${idOrSlug}`, options),
    
  listEvents: (options?: RequestOptions) => 
    api.get<Event[]>('/events', options),
    
  getEventQR: (eventId: string, options?: RequestOptions) => 
    api.get<{ qrUrl: string; shareUrl: string; whatsappUrl: string }>(`/events/${eventId}/qr`, options),
};
