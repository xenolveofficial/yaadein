import type { Event } from "@/types/api/events.types";
import { Suspense } from "react";
import Link from "next/link";
import { Camera, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventsService } from "@/lib/api/events.service";
import { EventListCard } from "@/components/molecules/EventListCard";
import { Button } from "@/components/atoms/Button";
import { EventListSkeleton } from "@/components/atoms/Skeleton";
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary";

export const metadata = {
  title: "My Events | Yaadein",
  description: "Manage your events and guest photo galleries.",
};

async function EventGrid({ token }: { token: string | undefined }) {
  let events: Event[] = [];
  try {
    events = await eventsService.listEvents({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    });
  } catch {
    events = [];
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 md:p-20 text-center bg-surface-primary shadow-sm gap-6">
        <div className="h-16 w-16 rounded-full bg-brand-primary-subtle flex items-center justify-center text-brand-primary">
          <Camera className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <h2 className="font-heading text-xl font-bold text-text-primary">
            Create your first event
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Create your first event — it takes 2 minutes. Set up your wedding, birthday, or corporate celebration and start collecting guest photos instantly.
          </p>
        </div>
        <Button variant="primary" asChild leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
          <Link href="/dashboard/create-event">Create Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventListCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return (
    <main className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
            My Events
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your photo sharing experiences and track uploads
          </p>
        </div>
        <Button variant="primary" asChild leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
          <Link href="/dashboard/create-event">Create Event</Link>
        </Button>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<EventListSkeleton />}>
          <EventGrid token={token} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

