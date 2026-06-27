import { api } from './client';
import type { Event, CreateEventPayload } from '@/types/api/events.types';

export const eventsService = {
  createEvent: (payload: CreateEventPayload) => 
    api.post<Event>('/events', payload),
    
  getEvent: (idOrSlug: string) => 
    api.get<Event>(`/events/${idOrSlug}`),
    
  listEvents: () => 
    api.get<Event[]>('/events'),
    
  getEventQR: (eventId: string) => 
    api.get<{ qrUrl: string; shareUrl: string; whatsappUrl: string }>(`/events/${eventId}/qr`),
};
