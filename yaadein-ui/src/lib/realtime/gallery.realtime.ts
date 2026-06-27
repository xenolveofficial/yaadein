import { createBrowserClient } from '@supabase/ssr';
import type { Media } from '@/types/api/media.types';

export function subscribeToGallery(eventId: string, onNewMedia: (media: Media) => void): () => void {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const channel = supabase
    .channel(`gallery-${eventId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'media',
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        onNewMedia(payload.new as Media);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
