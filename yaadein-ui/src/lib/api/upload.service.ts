import { mediaService } from './media.service';
import type { Media, PresignedUrlRequest } from '@/types/api/media.types';
import { ApiError } from './client';

const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_CONCURRENT_UPLOADS = 4;
const MAX_CHUNK_RETRIES = 5;

interface UploadFilesParams {
  eventId: string;
  files: File[];
  faceConsent: boolean;
  onProgress: (fileIndex: number, progress: number) => void;
  onFileComplete: (fileIndex: number, media: Media) => void;
  onError: (fileIndex: number, error: Error) => void;
}

// --- Idempotency Key (Web Crypto API) ---
async function generateIdempotencyKey(
  filename: string,
  eventId: string,
  size: number,
  lastModified: number
): Promise<string> {
  const raw = `${filename}:${eventId}:${size}:${lastModified}`;
  const encoded = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// --- Exponential backoff retry for a single chunk PUT ---
async function uploadChunkWithRetry(
  partUrl: string,
  chunk: Blob,
  attempt = 0
): Promise<string> {
  try {
    const response = await fetch(partUrl, {
      method: 'PUT',
      body: chunk,
      headers: { 'Content-Type': 'application/octet-stream' },
    });

    if (!response.ok) {
      throw new ApiError(`Chunk upload failed with status ${response.status}`, response.status);
    }

    // S3 returns the ETag in the response header
    const etag = response.headers.get('ETag');
    if (!etag) throw new ApiError('Missing ETag in chunk upload response', 0);
    return etag.replace(/"/g, ''); // Strip surrounding quotes
  } catch (error) {
    if (attempt >= MAX_CHUNK_RETRIES - 1) {
      throw error instanceof Error ? error : new Error(String(error));
    }
    const delayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s, 16s
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return uploadChunkWithRetry(partUrl, chunk, attempt + 1);
  }
}

// --- Upload a single file using S3 Multipart (chunked) ---
async function uploadSingleFile(
  file: File,
  fileIndex: number,
  uploadMeta: {
    fileId: string;
    uploadId: string;
    partUrls: string[];
    confirmUrl: string;
    chunkSize: number;
  },
  faceConsent: boolean,
  onProgress: (fileIndex: number, progress: number) => void
): Promise<Media> {
  const { fileId, uploadId, partUrls, chunkSize } = uploadMeta;
  const effectiveChunkSize = chunkSize || CHUNK_SIZE;
  const totalChunks = partUrls.length;
  const etags: string[] = new Array(totalChunks);
  let completedChunks = 0;

  // Upload each chunk; allow independent retries per chunk
  for (let partIndex = 0; partIndex < totalChunks; partIndex++) {
    const start = partIndex * effectiveChunkSize;
    const end = Math.min(start + effectiveChunkSize, file.size);
    const chunk = file.slice(start, end);

    etags[partIndex] = await uploadChunkWithRetry(partUrls[partIndex], chunk);

    completedChunks++;
    onProgress(fileIndex, Math.round((completedChunks / totalChunks) * 100));
  }

  const idempotencyKey = await generateIdempotencyKey(
    file.name,
    uploadMeta.fileId, // use fileId as the eventId proxy inside this context
    file.size,
    file.lastModified
  );

  return mediaService.confirmUpload({
    fileId,
    uploadId,
    etags,
    idempotencyKey,
    faceConsent,
  });
}

// --- Semaphore for concurrency control ---
function createSemaphore(limit: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const acquire = (): Promise<void> =>
    new Promise((resolve) => {
      if (active < limit) {
        active++;
        resolve();
      } else {
        queue.push(() => {
          active++;
          resolve();
        });
      }
    });

  const release = () => {
    active--;
    const next = queue.shift();
    if (next) next();
  };

  return { acquire, release };
}

// --- Main orchestrator ---
export async function uploadFiles(params: UploadFilesParams): Promise<void> {
  const { eventId, files, faceConsent, onProgress, onFileComplete, onError } = params;

  // Step 1: Request presigned URLs for ALL files in one batch call
  const request: PresignedUrlRequest = {
    eventId,
    files: files.map((f) => ({
      filename: f.name,
      mimeType: f.type,
      sizeBytes: f.size,
    })),
  };

  const { uploads } = await mediaService.requestPresignedUrls(request);

  // Step 2: Upload files with a max concurrency of 4
  const semaphore = createSemaphore(MAX_CONCURRENT_UPLOADS);

  const uploadTasks = files.map((file, fileIndex) => async () => {
    await semaphore.acquire();
    try {
      onProgress(fileIndex, 0);
      const media = await uploadSingleFile(
        file,
        fileIndex,
        uploads[fileIndex],
        faceConsent,
        onProgress
      );
      onFileComplete(fileIndex, media);
    } catch (error) {
      onError(fileIndex, error instanceof Error ? error : new Error(String(error)));
    } finally {
      semaphore.release();
    }
  });

  await Promise.all(uploadTasks.map((task) => task()));
}
