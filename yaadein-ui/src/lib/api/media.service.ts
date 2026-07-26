import { api } from './client';
import { mockMediaService } from './media.service.mock';
import type {
  Media,
  PresignedUrlRequest,
  PresignedUrlResponse,
  ConfirmUploadPayload
} from '@/types/api/media.types';
import type { GalleryResponse, Album } from '@/types/api/gallery.types';

// Toggle between real API and mock API
// Set NEXT_PUBLIC_USE_MOCK_API=true in .env.local to use mock data
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Real API service
const realMediaService = {
  requestPresignedUrls: (req: PresignedUrlRequest) =>
    api.post<PresignedUrlResponse>('/media/presigned-urls', req),
    
  confirmUpload: (payload: ConfirmUploadPayload) =>
    api.post<Media>('/media/confirm-upload', payload),
    
  getGallery: (eventId: string, params: { albumId?: string; cursor?: string; search?: string; limit: number }) =>
    api.get<GalleryResponse>(`/events/${eventId}/gallery`, { params }),

  getAlbums: (eventId: string) =>
    api.get<Album[]>(`/events/${eventId}/albums`),

  faceSearch: (eventId: string, imageFile: File) => {
    const form = new FormData();
    form.append('image', imageFile);
    return api.post<{ mediaIds: string[] }>(`/events/${eventId}/face-search`, form, {
      headers: {} as HeadersInit, // Let fetch set multipart boundary
    });
  },
    
  deleteMedia: (mediaId: string) =>
    api.delete<void>(`/media/${mediaId}`),
};

// Export the appropriate service based on environment
export const mediaService = USE_MOCK_API ? mockMediaService : realMediaService;

// Log which service is being used
if (typeof window !== 'undefined') {
  console.log(`🔧 Media Service: Using ${USE_MOCK_API ? 'MOCK' : 'REAL'} API`);
}
