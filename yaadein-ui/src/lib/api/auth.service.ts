import { api } from './client';
import type { UserProfile } from '@/types/api/auth.types';

export const authService = {
  getUserProfile: () => 
    api.get<UserProfile>('/auth/profile'),
    
  updateProfile: (data: Partial<UserProfile>) => 
    api.patch<UserProfile>('/auth/profile', data),
};
