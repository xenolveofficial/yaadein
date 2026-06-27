export type MediaStatus = 'uploading' | 'processing' | 'ready' | 'rejected' | 'error';
export type MediaType = 'photo' | 'video';

export interface Media {
  id: string;
  eventId: string;
  uploadedBy: string;
  url: string;
  thumbnailUrl: string;
  type: MediaType;
  status: MediaStatus;
  sizeBytes: number;
  width?: number;
  height?: number;
  duration?: number;
  albumIds: string[];
  faceEmbeddingId?: string;
  createdAt: string;
}

export interface PresignedUrlRequest {
  eventId: string;
  files: Array<{
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }>;
}

export interface PresignedUrlResponse {
  uploads: Array<{
    fileId: string;
    uploadId: string;
    partUrls: string[];
    confirmUrl: string;
    chunkSize: number;
  }>;
}

export interface ConfirmUploadPayload {
  fileId: string;
  uploadId: string;
  etags: string[];
  idempotencyKey: string;
  faceConsent: boolean;
}
