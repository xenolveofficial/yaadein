import { api, type RequestOptions } from './client';
import { mockEventsService } from './events.service.mock';
import type { Event, CreateEventPayload } from '@/types/api/events.types';

// Toggle between real API and mock API
// Set NEXT_PUBLIC_USE_MOCK_API=true in .env.local to use mock data
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Real API service
const realEventsService = {
  createEvent: (payload: CreateEventPayload, options?: RequestOptions) =>
    api.post<Event>('/events', payload, options),
    
  getEvent: (idOrSlug: string, options?: RequestOptions) =>
    api.get<Event>(`/events/${idOrSlug}`, options),
    
  listEvents: (options?: RequestOptions) =>
    api.get<Event[]>('/events', options),
    
  updateEvent: (eventId: string, payload: Partial<Event>, options?: RequestOptions) =>
    api.patch<Event>(`/events/${eventId}`, payload, options),
    
  getEventQR: (eventId: string, options?: RequestOptions) =>
    api.get<{ qrUrl: string; shareUrl: string; whatsappUrl: string }>(`/events/${eventId}/qr`, options),
};

// Export the appropriate service based on environment
export const eventsService = USE_MOCK_API ? mockEventsService : realEventsService;

// Log which service is being used
if (typeof window !== 'undefined') {
  console.log(`🔧 Events Service: Using ${USE_MOCK_API ? 'MOCK' : 'REAL'} API`);
}
