import type { PlanTier } from '@/types/api/events.types';
import type { PlanData } from '@/components/molecules/PlanCard';

export interface PlanContent extends PlanData {
  id: string;
  price: number;
  infraCost: number;
  storageGB: number;
  tag: string | null;
}

export const HOST_PLANS: PlanContent[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceUnit: '',
    photos: '500',
    videos: '0',
    retentionDays: '90 Days',
    features: ['QR Code Sharing', 'Basic Gallery', 'Standard Downloads'],
    infraCost: 0,
    color: '#1A1A2E',
    storageGB: 5,
    tag: null,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 2499,
    priceUnit: '/event',
    photos: '2,000',
    videos: '50',
    retentionDays: '180 Days',
    features: ['QR Code Sharing', 'Face Search', 'High-Res Downloads', '3 Months Extra Archive'],
    infraCost: 160,
    color: '#C4622D',
    storageGB: 20,
    tag: null,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4999,
    priceUnit: '/event',
    photos: 'Unlimited',
    videos: 'Unlimited',
    retentionDays: '365 Days',
    features: ['Custom branding', 'Face Search', 'Original quality', 'Priority support', 'Forever Archive Eligible'],
    infraCost: 400,
    isRecommended: true,
    color: '#D4A853',
    storageGB: 100,
    tag: 'Most Popular',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 9999,
    priceUnit: '/event',
    photos: 'Unlimited',
    videos: 'Unlimited (4K)',
    retentionDays: 'Lifetime',
    features: ['All Premium features', 'AI Video Highlights', 'Dedicated manager', 'Forever Archive Included'],
    infraCost: 1200,
    color: '#2D7A5F',
    storageGB: 500,
    tag: 'Best Value',
  },
];

export const PHOTOGRAPHER_PLANS: PlanContent[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceUnit: '/month',
    photos: '2,000',
    videos: '50',
    retentionDays: '30 Days',
    features: ['1 Active Event', 'Basic Portfolio Page', 'Self-Managed Uploads'],
    infraCost: 100,
    color: '#6B6567',
    storageGB: 20,
    tag: 'Free Trial',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2999,
    priceUnit: '/month',
    photos: 'Unlimited',
    videos: 'Unlimited',
    retentionDays: '365 Days',
    features: ['10 Active Events', 'Custom Subdomain', 'Face Search Integration', 'Client Delivery Portal'],
    infraCost: 800,
    isRecommended: true,
    color: '#C4622D',
    storageGB: 250,
    tag: 'Recommended',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 7999,
    priceUnit: '/month',
    photos: 'Unlimited',
    videos: 'Unlimited (4K)',
    retentionDays: 'Forever',
    features: ['Unlimited Events', 'Full White-labeling', 'Dedicated Subdomain', '1-click Client Delivery', 'Priority Support'],
    infraCost: 2400,
    color: '#D4A853',
    storageGB: 1000,
    tag: 'Ultimate',
  },
];

// Point plansContent to HOST_PLANS for backward compatibility with Create Event Wizard
export const plansContent = HOST_PLANS;
