export type EventType = 'wedding' | 'birthday' | 'graduation' | 'corporate' | 'engagement' | 'other';
export type EventStatus = 'active' | 'expired' | 'archived';
export type PlanTier = 'starter' | 'basic' | 'premium' | 'elite';

export interface Event {
  id: string;
  slug: string;
  name: string;
  type: EventType;
  date: string; // ISO string
  city: string;
  coverPhotoUrl?: string;
  status: EventStatus;
  plan: PlanTier;
  photoCount: number;
  videoCount: number;
  guestCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface CreateEventPayload {
  name: string;
  type: EventType;
  date: string;
  city: string;
  coverPhotoUrl?: string;
  plan: PlanTier;
}
