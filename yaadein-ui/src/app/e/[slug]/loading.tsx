import { Skeleton } from "@/components/atoms/Skeleton";

export default function EventPageLoading() {
  return (
    <main className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Top Header section 35% of height */}
      <div className="relative h-[35vh] w-full bg-surface-dark flex flex-col justify-end p-6 gap-2">
        <Skeleton className="h-6 w-48 bg-white/20" />
        <Skeleton className="h-4 w-32 bg-white/10" />
        <Skeleton className="h-4 w-40 bg-white/10" />
      </div>
      {/* Bottom screen upload area */}
      <div className="flex-1 p-6 flex flex-col gap-6 items-center justify-center">
        <Skeleton className="h-48 w-full max-w-sm rounded-2xl" />
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
      </div>
    </main>
  );
}
