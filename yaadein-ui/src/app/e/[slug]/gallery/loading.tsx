import { GallerySkeleton } from "@/components/atoms/Skeleton";

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      <header className="sticky top-0 z-40 bg-surface-primary border-b border-border px-4 py-4 flex flex-col gap-3">
        <div className="h-5 w-48 bg-border animate-pulse rounded" />
        <div className="h-8 w-full bg-border animate-pulse rounded-lg" />
      </header>
      <main className="flex-1 p-4">
        <GallerySkeleton />
      </main>
    </div>
  );
}
