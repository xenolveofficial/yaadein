import { api } from './client';
import type { 
  Media, 
  PresignedUrlRequest, 
  PresignedUrlResponse, 
  ConfirmUploadPayload 
} from '@/types/api/media.types';
import type { GalleryResponse, Album } from '@/types/api/gallery.types';

export const mediaService = {
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
