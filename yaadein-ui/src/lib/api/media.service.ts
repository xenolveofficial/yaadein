import { api } from './client';
import type { 
  Media, 
  PresignedUrlRequest, 
  PresignedUrlResponse, 
  ConfirmUploadPayload 
} from '@/types/api/media.types';
import type { GalleryResponse } from '@/types/api/gallery.types';

export const mediaService = {
  requestPresignedUrls: (req: PresignedUrlRequest) => 
    api.post<PresignedUrlResponse>('/media/presigned-urls', req),
    
  confirmUpload: (payload: ConfirmUploadPayload) => 
    api.post<Media>('/media/confirm-upload', payload),
    
  getGallery: (eventId: string, params: { albumId?: string; cursor?: string; search?: string; limit: number }) => 
    api.get<GalleryResponse>(`/events/${eventId}/gallery`, { params }),
    
  deleteMedia: (mediaId: string) => 
    api.delete<void>(`/media/${mediaId}`),
};
