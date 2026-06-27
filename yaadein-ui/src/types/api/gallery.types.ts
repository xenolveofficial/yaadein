import type { Media } from './media.types';

export interface Album {
  id: string;
  name: string;
  emoji: string;
  mediaCount: number;
}

export interface GalleryResponse {
  media: Media[];
  albums: Album[];
  totalCount: number;
  nextCursor?: string;
}
