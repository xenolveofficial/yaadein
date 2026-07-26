import type { Event, CreateEventPayload } from '@/types/api/events.types';

// Helper to get base URL (server-safe)
const getBaseUrl = () => {
  // Server-side: use environment variable or default
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
  // Client-side: use window.location
  return window.location.origin;
};

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generator
function generateMockEvent(payload: CreateEventPayload): Event {
  const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const slug = `${payload.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  
  return {
    id,
    slug,
    name: payload.name,
    type: payload.type || 'other', // Default to 'other' if not provided
    date: payload.date,
    city: payload.city,
    coverPhotoUrl: payload.coverPhotoUrl,
    status: 'pending',
    plan: payload.plan,
    photoCount: 0,
    videoCount: 0,
    guestCount: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdAt: new Date().toISOString(),
    enableFaceSearch: false,
    shareUrl: `${getBaseUrl()}/e/${slug}`,
  };
}

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
    
    // Return pending event with PAST date for evt_003 (for testing past date validation)
    if (idOrSlug === 'evt_003') {
      const pendingEvent: Event = {
        id: 'evt_003',
        slug: 'pending-event-2024',
        name: 'Pending Event 2024',
        type: 'birthday',
        date: new Date('2024-01-15').toISOString(), // Past date for testing
        city: 'Bangalore',
        status: 'pending',
        plan: 'basic',
        photoCount: 0,
        videoCount: 0,
        guestCount: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        enableFaceSearch: false,
        shareUrl: `${getBaseUrl()}/e/pending-event-2024`,
      };
      console.log('✅ MOCK: Pending event with past date fetched:', pendingEvent);
      return pendingEvent;
    }
    
    // Return pending event with FUTURE date for evt_004 (for testing valid date)
    if (idOrSlug === 'evt_004') {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days from now
      
      const pendingEvent: Event = {
        id: 'evt_004',
        slug: 'future-pending-event-2024',
        name: 'Future Pending Event 2024',
        type: 'wedding',
        date: futureDate.toISOString(),
        city: 'Mumbai',
        status: 'pending',
        plan: 'premium',
        photoCount: 0,
        videoCount: 0,
        guestCount: 0,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        enableFaceSearch: false,
        shareUrl: `${getBaseUrl()}/e/future-pending-event-2024`,
      };
      console.log('✅ MOCK: Pending event with future date fetched:', pendingEvent);
      return pendingEvent;
    }
    
    // Return active event for other IDs
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
      shareUrl: `${getBaseUrl()}/e/${idOrSlug}`,
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
        shareUrl: `${getBaseUrl()}/e/wedding-ceremony-2024`,
      },
      {
        id: 'evt_002',
        slug: 'birthday-bash-2024',
        name: 'Birthday Bash 2024',
        type: 'birthday',
        date: new Date('2024-11-20').toISOString(),
        city: 'Delhi',
        status: 'expired',
        plan: 'basic',
        photoCount: 89,
        videoCount: 5,
        guestCount: 75,
        expiresAt: new Date('2025-02-20').toISOString(),
        createdAt: new Date('2024-10-15').toISOString(),
        enableFaceSearch: false,
        shareUrl: `${getBaseUrl()}/e/birthday-bash-2024`,
      },
      {
        id: 'evt_003',
        slug: 'birthday-bash-2024',
        name: 'Birthday Bash 2024',
        type: 'birthday',
        date: new Date('2024-11-20').toISOString(),
        city: 'Delhi',
        status: 'pending',
        plan: 'basic',
        photoCount: 89,
        videoCount: 5,
        guestCount: 75,
        expiresAt: new Date('2025-02-20').toISOString(),
        createdAt: new Date('2024-10-15').toISOString(),
        enableFaceSearch: false,
        shareUrl: `${getBaseUrl()}/e/birthday-bash-2024`,
      },
    ];
    
    console.log('✅ MOCK: Events listed:', mockEvents.length, mockEvents);
    return mockEvents;
  },
  
  updateEvent: async (eventId: string, payload: Partial<Event>): Promise<Event> => {
    console.log('🔧 MOCK: Updating event:', eventId, 'with payload:', payload);
    await delay(500);
    
    // Simulate updating the event
    const updatedEvent: Event = {
      id: eventId,
      slug: 'updated-event-slug',
      name: payload.name || 'Updated Event',
      type: payload.type || 'wedding',
      date: payload.date || new Date().toISOString(),
      city: payload.city || 'Mumbai',
      status: payload.status || 'active',
      plan: payload.plan || 'premium',
      photoCount: payload.photoCount || 0,
      videoCount: payload.videoCount || 0,
      guestCount: payload.guestCount || 0,
      expiresAt: payload.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: payload.createdAt || new Date().toISOString(),
      enableFaceSearch: payload.enableFaceSearch || false,
      shareUrl: `${getBaseUrl()}/e/${eventId}`,
    };
    
    console.log('✅ MOCK: Event updated:', updatedEvent);
    return updatedEvent;
  },
  
  getEventQR: async (eventId: string): Promise<{ qrUrl: string; shareUrl: string; whatsappUrl: string }> => {
    console.log('🔧 MOCK: Generating QR for event:', eventId);
    await delay(400);
    
    const shareUrl = `${getBaseUrl()}/e/${eventId}`;
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
