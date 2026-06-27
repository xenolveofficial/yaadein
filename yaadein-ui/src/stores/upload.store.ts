import { create } from 'zustand';
import type { Media, MediaStatus } from '@/types/api/media.types';

export interface FileUploadState {
  file: File;
  eventId: string;
  progress: number;
  status: MediaStatus;
  error?: string;
  media?: Media;
}

interface UploadStore {
  uploads: Record<string, FileUploadState>;
  addFiles: (files: File[], eventId: string) => string[];
  updateProgress: (fileId: string, progress: number) => void;
  setStatus: (fileId: string, status: MediaStatus, media?: Media, error?: string) => void;
  reset: () => void;
}

// Stable ID generation without crypto (client-side keying by filename+size+timestamp)
function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: {},

  addFiles: (files, eventId) => {
    const ids: string[] = [];
    const newEntries: Record<string, FileUploadState> = {};

    for (const file of files) {
      const id = generateFileId(file);
      ids.push(id);
      newEntries[id] = {
        file,
        eventId,
        progress: 0,
        status: 'uploading',
      };
    }

    set((state) => ({
      uploads: { ...state.uploads, ...newEntries },
    }));

    return ids;
  },

  updateProgress: (fileId, progress) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [fileId]: {
          ...state.uploads[fileId],
          progress,
        },
      },
    })),

  setStatus: (fileId, status, media, error) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [fileId]: {
          ...state.uploads[fileId],
          status,
          ...(media !== undefined && { media }),
          ...(error !== undefined && { error }),
        },
      },
    })),

  reset: () => set({ uploads: {} }),
}));
