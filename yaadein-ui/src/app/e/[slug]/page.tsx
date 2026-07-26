"use client";

import * as React from "react";
import { Frown } from "lucide-react";
import Link from "next/link";
import { eventsService } from "@/lib/api/events.service";
import { GuestUploadScreen } from "@/components/organisms/GuestUploadScreen";
import { GuestAuthGate } from "@/components/molecules/GuestAuthGate";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import type { Event } from "@/types/api/events.types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const STORAGE_KEY_PREFIX = "yaadein_guest_auth_";

function EventNotFoundScreen() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface-secondary gap-6 p-8 text-center">
      <Frown className="h-16 w-16 text-text-muted" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-semibold text-2xl text-text-primary">
          Event not found
        </h1>
        <p className="text-text-secondary text-sm max-w-xs">
          This event doesn't exist or has expired. The link may be incorrect or the event may have been removed.
        </p>
      </div>
      <Button variant="primary" asChild>
        <Link href="/">Create your own event &rarr;</Link>
      </Button>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface-secondary gap-4">
      <Spinner size="lg" />
      <p className="text-text-secondary text-sm">Loading event...</p>
    </main>
  );
}

export default function EventSlugPage({ params }: PageProps) {
  const [event, setEvent] = React.useState<Event | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [guestName, setGuestName] = React.useState<string>("");
  const [slug, setSlug] = React.useState<string>("");

  // Unwrap params and fetch event
  React.useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      try {
        const resolvedParams = await params;
        const eventSlug = resolvedParams.slug;
        
        if (!isMounted) return;
        setSlug(eventSlug);

        const fetchedEvent = await eventsService.getEvent(eventSlug);
        
        if (!isMounted) return;

        // Check if event is valid
        if (!fetchedEvent || fetchedEvent.status === "expired" || fetchedEvent.status === "archived") {
          setEvent(null);
          setIsLoading(false);
          return;
        }

        setEvent(fetchedEvent);

        // Check localStorage for existing authentication
        const storageKey = `${STORAGE_KEY_PREFIX}${fetchedEvent.id}`;
        const storedAuth = localStorage.getItem(storageKey);

        if (storedAuth) {
          try {
            const authData = JSON.parse(storedAuth);
            if (authData.eventId === fetchedEvent.id && authData.guestName) {
              setGuestName(authData.guestName);
              setIsAuthenticated(true);
            }
          } catch (err) {
            console.error("Failed to parse stored auth:", err);
            localStorage.removeItem(storageKey);
          }
        }
      } catch (err) {
        console.error("Failed to load event:", err);
        if (isMounted) {
          setEvent(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [params]);

  const handleAuthenticated = React.useCallback(() => {
    if (event) {
      // Retrieve guest name from localStorage
      const storageKey = `${STORAGE_KEY_PREFIX}${event.id}`;
      const storedAuth = localStorage.getItem(storageKey);
      
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          setGuestName(authData.guestName);
        } catch (err) {
          console.error("Failed to parse stored auth:", err);
        }
      }
      
      setIsAuthenticated(true);
    }
  }, [event]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!event) {
    return <EventNotFoundScreen />;
  }

  if (!isAuthenticated) {
    return <GuestAuthGate event={event} onAuthenticated={handleAuthenticated} />;
  }

  return <GuestUploadScreen event={event} guestName={guestName} />;
}

// Made with Bob
