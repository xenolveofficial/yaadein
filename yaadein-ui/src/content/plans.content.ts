import type { PlanTier } from '@/types/api/events.types';
import type { PlanData } from '@/components/molecules/PlanCard';

export interface PlanContent extends PlanData {
  id: PlanTier;
}

export const plansContent: PlanContent[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    priceUnit: '',
    photos: '500',
    videos: '0',
    retentionDays: '90 Days',
    features: ['QR Code Sharing', 'Basic Gallery'],
    infraCost: '0',
    color: 'var(--color-text-primary)',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '₹2,499',
    priceUnit: '/event',
    photos: '2000',
    videos: '50',
    retentionDays: '180 Days',
    features: ['QR Code Sharing', 'Face Search', 'High-Res Downloads'],
    infraCost: '160',
    color: 'var(--color-brand-primary)',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹4,999',
    priceUnit: '/event',
    photos: '∞',
    videos: '∞',
    retentionDays: '365 Days',
    features: ['Custom branding', 'Face Search', 'Original quality', 'Priority support'],
    infraCost: '400',
    isRecommended: true,
    color: 'var(--color-accent-gold)',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '₹9,999',
    priceUnit: '/event',
    photos: '∞',
    videos: '∞ (4K)',
    retentionDays: 'Lifetime',
    features: ['All Premium features', 'AI Video Highlights', 'Dedicated manager'],
    infraCost: '1200',
    color: 'var(--color-success)',
  },
];
