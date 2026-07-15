import type { Event, CreateEventPayload } from '@/types/api/events.types';

// Mock data generator
function generateMockEvent(payload: CreateEventPayload): Event {
  const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const slug = `${payload.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  
  return {
    id,
    slug,
    name: payload.name,
    type: payload.type,
    date: payload.date,
    city: payload.city,
    coverPhotoUrl: payload.coverPhotoUrl,
    status: 'active',
    plan: payload.plan,
    photoCount: 0,
    videoCount: 0,
    guestCount: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdAt: new Date().toISOString(),
    enableFaceSearch: false,
    shareUrl: `${window.location.origin}/e/${slug}`,
  };
}

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockEventsService = {
  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    console.log('🔧 MOCK: Creating event with payload:', payload);
    await delay(800);
    const event = generateMockEvent(payload);
    console.log('✅ MOCK: Event created:', event);
    return event;
  },
  
  getEvent: async (idOrSlug: string): Promise<Event> => {
    console.log('🔧 MOCK: Fetching event:', idOrSlug);
    await delay(500);
    
    // Return mock event data
    const mockEvent: Event = {
      id: idOrSlug.startsWith('evt_') ? idOrSlug : `evt_${Date.now()}`,
      slug: idOrSlug.startsWith('evt_') ? `event-${Date.now()}` : idOrSlug,
      name: 'Sample Wedding Event',
      type: 'wedding',
      date: new Date().toISOString(),
      city: 'Mumbai',
      status: 'active',
      plan: 'premium',
      photoCount: 42,
      videoCount: 5,
      guestCount: 150,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      enableFaceSearch: true,
      shareUrl: `${window.location.origin}/e/${idOrSlug}`,
    };
    
    console.log('✅ MOCK: Event fetched:', mockEvent);
    return mockEvent;
  },
  
  listEvents: async (): Promise<Event[]> => {
    console.log('🔧 MOCK: Listing events');
    await delay(600);
    
    const mockEvents: Event[] = [
      {
        id: 'evt_001',
        slug: 'wedding-ceremony-2024',
        name: 'Wedding Ceremony 2024',
        type: 'wedding',
        date: new Date('2024-12-15').toISOString(),
        city: 'Mumbai',
        status: 'active',
        plan: 'premium',
        photoCount: 156,
        videoCount: 12,
        guestCount: 200,
        expiresAt: new Date('2025-03-15').toISOString(),
        createdAt: new Date('2024-11-01').toISOString(),
        enableFaceSearch: true,
        shareUrl: `${window.location.origin}/e/wedding-ceremony-2024`,
      },
      {
        id: 'evt_002',
        slug: 'birthday-bash-2024',
        name: 'Birthday Bash 2024',
        type: 'birthday',
        date: new Date('2024-11-20').toISOString(),
        city: 'Delhi',
        status: 'active',
        plan: 'basic',
        photoCount: 89,
        videoCount: 5,
        guestCount: 75,
        expiresAt: new Date('2025-02-20').toISOString(),
        createdAt: new Date('2024-10-15').toISOString(),
        enableFaceSearch: false,
        shareUrl: `${window.location.origin}/e/birthday-bash-2024`,
      },
    ];
    
    console.log('✅ MOCK: Events listed:', mockEvents.length);
    return mockEvents;
  },
  
  getEventQR: async (eventId: string): Promise<{ qrUrl: string; shareUrl: string; whatsappUrl: string }> => {
    console.log('🔧 MOCK: Generating QR for event:', eventId);
    await delay(400);
    
    const shareUrl = `${window.location.origin}/e/${eventId}`;
    const mockQR = {
      qrUrl: `https://dev.yaadein.online/`,
      shareUrl,
      whatsappUrl: `https://wa.me/?text=${encodeURIComponent(`Check out my event: ${shareUrl}`)}`,
    };
    
    console.log('✅ MOCK: QR generated');
    return mockQR;
  },
};

// Made with Bob
