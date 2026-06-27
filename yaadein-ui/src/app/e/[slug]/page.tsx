import type { Metadata } from "next";
import { Frown } from "lucide-react";
import Link from "next/link";
import { eventsService } from "@/lib/api/events.service";
import { GuestUploadScreen } from "@/components/organisms/GuestUploadScreen";
import { Button } from "@/components/atoms/Button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await eventsService.getEvent(slug);
    return {
      title: `${event.name} | YAADEIN`,
      description: `Upload your photos from ${event.name} on ${new Date(event.date).toLocaleDateString()}`,
      openGraph: {
        title: event.name,
        description: `Share your moments from ${event.name}`,
        images: event.coverPhotoUrl ? [{ url: event.coverPhotoUrl }] : [],
      },
    };
  } catch {
    return {
      title: "Event | YAADEIN",
      description: "Event photo sharing powered by YAADEIN.",
    };
  }
}

function EventNotFoundScreen() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface-secondary gap-6 p-8 text-center">
      <Frown className="h-16 w-16 text-text-muted" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-semibold text-2xl text-text-primary">
          Event not found
        </h1>
        <p className="text-text-secondary text-sm max-w-xs">
          This event doesn&apos;t exist or has expired. The link may be incorrect or the event may have been removed.
        </p>
      </div>
      <Button variant="primary" asChild>
        <Link href="/">Create your own event &rarr;</Link>
      </Button>
    </main>
  );
}

export default async function EventSlugPage({ params }: PageProps) {
  const { slug } = await params;

  let event;
  try {
    event = await eventsService.getEvent(slug);
  } catch {
    return <EventNotFoundScreen />;
  }

  // Treat expired events the same as not found
  if (!event || event.status === "expired" || event.status === "archived") {
    return <EventNotFoundScreen />;
  }

  return <GuestUploadScreen event={event} />;
}
