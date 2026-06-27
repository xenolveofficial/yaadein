import type { PlanTier } from './events.types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: PlanTier;
  eventsCreated: number;
}
