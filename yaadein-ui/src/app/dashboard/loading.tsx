import { EventListSkeleton } from "@/components/atoms/Skeleton";

export default function DashboardLoading() {
  return (
    <main className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-border animate-pulse rounded" />
          <div className="h-4 w-72 bg-border animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-border animate-pulse rounded-lg" />
      </div>
      <EventListSkeleton />
    </main>
  );
}
