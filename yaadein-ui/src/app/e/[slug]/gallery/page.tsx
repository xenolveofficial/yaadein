import type { Metadata } from "next";
import { eventsService } from "@/lib/api/events.service";
import { mediaService } from "@/lib/api/media.service";
import dynamic from "next/dynamic";

const GalleryScreen = dynamic(() => import("@/components/organisms/GalleryScreen").then((mod) => mod.GalleryScreen), {
  ssr: false,
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await eventsService.getEvent(slug);
    return {
      title: `${event.name} Gallery | YAADEIN`,
      description: `Browse all photos and videos from ${event.name}.`,
      openGraph: {
        title: `${event.name} Gallery`,
        images: event.coverPhotoUrl ? [{ url: event.coverPhotoUrl }] : [],
      },
    };
  } catch {
    return { title: "Gallery | YAADEIN" };
  }
}

export default async function GalleryPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch event + initial gallery + albums in parallel
  const [event, initialGallery, initialAlbums] = await Promise.all([
    eventsService.getEvent(slug),
    mediaService.getGallery(slug, { limit: 30 }),
    mediaService.getAlbums(slug).catch(() => [] as Awaited<ReturnType<typeof mediaService.getAlbums>>),
  ]);

  return (
    <GalleryScreen
      event={event}
      initialData={initialGallery}
      initialAlbums={initialAlbums}
    />
  );
}
