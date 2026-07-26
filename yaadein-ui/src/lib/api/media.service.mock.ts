import type {
  Media,
  PresignedUrlRequest,
  PresignedUrlResponse,
  ConfirmUploadPayload
} from '@/types/api/media.types';
import type { GalleryResponse, Album } from '@/types/api/gallery.types';

// Mock media data with Unsplash images
// Each event gallery is one big album, so albumIds array is empty
const mockMediaItems: Media[] = [
  {
    id: 'media-1',
    eventId: 'event-1',
    uploadedBy: 'John Doe',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2456789,
    width: 4000,
    height: 3000,
    albumIds: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'media-2',
    eventId: 'event-1',
    uploadedBy: 'Jane Smith',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 3123456,
    width: 3840,
    height: 2560,
    albumIds: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'media-3',
    eventId: 'event-1',
    uploadedBy: 'Mike Johnson',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2789012,
    width: 4032,
    height: 3024,
    albumIds: [],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'media-4',
    eventId: 'event-1',
    uploadedBy: 'Sarah Williams',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2934567,
    width: 3600,
    height: 2400,
    albumIds: [],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'media-5',
    eventId: 'event-1',
    uploadedBy: 'David Brown',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 3456789,
    width: 4288,
    height: 2848,
    albumIds: [],
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'media-6',
    eventId: 'event-1',
    uploadedBy: 'Emily Davis',
    url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2678901,
    width: 3840,
    height: 2160,
    albumIds: [],
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'media-7',
    eventId: 'event-1',
    uploadedBy: 'Chris Wilson',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 3234567,
    width: 4000,
    height: 2667,
    albumIds: [],
    createdAt: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: 'media-8',
    eventId: 'event-1',
    uploadedBy: 'Lisa Anderson',
    url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2890123,
    width: 3456,
    height: 2304,
    albumIds: [],
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: 'media-9',
    eventId: 'event-1',
    uploadedBy: 'Tom Martinez',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 3123456,
    width: 4032,
    height: 3024,
    albumIds: [],
    createdAt: new Date(Date.now() - 32400000).toISOString(),
  },
  {
    id: 'media-10',
    eventId: 'event-1',
    uploadedBy: 'Rachel Taylor',
    url: 'https://images.unsplash.com/photo-1525258437537-f9a5a0f1a4e7?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1525258437537-f9a5a0f1a4e7?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2567890,
    width: 3840,
    height: 2560,
    albumIds: [],
    createdAt: new Date(Date.now() - 36000000).toISOString(),
  },
  {
    id: 'media-11',
    eventId: 'event-1',
    uploadedBy: 'Kevin Lee',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 2901234,
    width: 4000,
    height: 3000,
    albumIds: [],
    createdAt: new Date(Date.now() - 39600000).toISOString(),
  },
  {
    id: 'media-12',
    eventId: 'event-1',
    uploadedBy: 'Amanda White',
    url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=80',
    type: 'photo',
    status: 'ready',
    sizeBytes: 3345678,
    width: 4288,
    height: 2848,
    albumIds: [],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export const mockMediaService = {
  requestPresignedUrls: async (req: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      uploads: req.files.map((file, index) => ({
        fileId: `file-${Date.now()}-${index}`,
        uploadId: `upload-${Date.now()}-${index}`,
        partUrls: [`https://mock-upload-url.com/part-${index}`],
        confirmUrl: `https://mock-confirm-url.com/confirm-${index}`,
        chunkSize: 5242880, // 5MB
      })),
    };
  },
  
  confirmUpload: async (payload: ConfirmUploadPayload): Promise<Media> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: `media-${Date.now()}`,
      eventId: 'event-1',
      uploadedBy: 'Guest User',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
      type: 'photo',
      status: 'ready',
      sizeBytes: 2456789,
      width: 4000,
      height: 3000,
      albumIds: [],
      createdAt: new Date().toISOString(),
    };
  },
  
  getGallery: async (
    eventId: string,
    params: { albumId?: string; cursor?: string; search?: string; limit: number }
  ): Promise<GalleryResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const filteredMedia = [...mockMediaItems];
    
    // Simple pagination simulation
    const startIndex = params.cursor ? parseInt(params.cursor) : 0;
    const endIndex = startIndex + params.limit;
    const paginatedMedia = filteredMedia.slice(startIndex, endIndex);
    
    return {
      media: paginatedMedia,
      albums: [], // No albums feature - each event gallery is one big album
      totalCount: filteredMedia.length,
      nextCursor: endIndex < filteredMedia.length ? endIndex.toString() : undefined,
    };
  },

  getAlbums: async (eventId: string): Promise<Album[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return []; // No albums feature - each event gallery is one big album
  },

  faceSearch: async (eventId: string, imageFile: File): Promise<{ mediaIds: string[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return random subset of media IDs
    const randomCount = Math.floor(Math.random() * 5) + 3;
    const shuffled = [...mockMediaItems].sort(() => 0.5 - Math.random());
    return {
      mediaIds: shuffled.slice(0, randomCount).map(m => m.id),
    };
  },
  
  deleteMedia: async (mediaId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Mock: Deleted media ${mediaId}`);
  },
};

// Made with Bob
