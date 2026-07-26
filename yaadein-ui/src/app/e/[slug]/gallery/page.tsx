"use client";

import * as React from "react";
import { eventsService } from "@/lib/api/events.service";
import { mediaService } from "@/lib/api/media.service";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/atoms/Spinner";

const GalleryScreen = dynamic(() => import("@/components/organisms/GalleryScreen").then((mod) => mod.GalleryScreen), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface-secondary gap-4">
      <Spinner size="lg" />
      <p className="text-text-secondary text-sm">Loading gallery...</p>
    </main>
  ),
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GalleryPage({ params }: PageProps) {
  const [event, setEvent] = React.useState<any>(null);
  const [initialGallery, setInitialGallery] = React.useState<any>(null);
  const [initialAlbums, setInitialAlbums] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const resolvedParams = await params;
        const { slug } = resolvedParams;

        // Fetch event + initial gallery + albums in parallel
        const [fetchedEvent, fetchedGallery, fetchedAlbums] = await Promise.all([
          eventsService.getEvent(slug),
          mediaService.getGallery(slug, { limit: 30 }),
          mediaService.getAlbums(slug).catch(() => []),
        ]);

        if (!isMounted) return;

        setEvent(fetchedEvent);
        setInitialGallery(fetchedGallery);
        setInitialAlbums(fetchedAlbums);
      } catch (err) {
        console.error("Failed to load gallery data:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [params]);

  if (isLoading || !event || !initialGallery) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-surface-secondary gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary text-sm">Loading gallery...</p>
      </main>
    );
  }

  return (
    <GalleryScreen
      event={event}
      initialData={initialGallery}
      initialAlbums={initialAlbums}
    />
  );
}
