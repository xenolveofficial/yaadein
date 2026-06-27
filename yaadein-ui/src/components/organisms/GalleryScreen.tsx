"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, Share2, Download, Search, ScanFace, Play, X, ChevronRight, Loader2, Camera,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

import type { Event } from "@/types/api/events.types";
import type { Media } from "@/types/api/media.types";
import type { Album, GalleryResponse } from "@/types/api/gallery.types";

import { mediaService } from "@/lib/api/media.service";
import { subscribeToGallery } from "@/lib/realtime/gallery.realtime";
import { queryKeys } from "@/lib/queryKeys";

import { AlbumChip } from "@/components/molecules/AlbumChip";
import { LiveUpdatePill } from "@/components/molecules/LiveUpdatePill";
import { PhotoThumbnail } from "@/components/molecules/PhotoThumbnail";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";

const GALLERY_LIMIT = 30;

interface GalleryScreenProps {
  event: Event;
  initialData: GalleryResponse;
  initialAlbums: Album[];
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  media,
  initialIndex,
  onClose,
}: {
  media: Media[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = React.useState(initialIndex);
  const current = media[index];

  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1) % media.length);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDownload = async () => {
    if (!current?.url) return;
    const a = document.createElement("a");
    a.href = current.url;
    a.download = `photo-${current.id}`;
    a.target = "_blank";
    a.click();
  };

  if (!current) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm text-white/60">{index + 1} / {media.length}</span>
        <div className="flex gap-3">
          <button onClick={handleDownload} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Download">
            <Download className="h-5 w-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <button
          onClick={prev}
          className="absolute left-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="relative w-full h-full"
          >
            {current.type === "video" ? (
              <video
                src={current.url}
                controls
                className="max-h-full max-w-full mx-auto"
                style={{ maxHeight: "calc(100vh - 120px)" }}
              />
            ) : (
              <Image
                src={current.url}
                alt="Gallery photo"
                fill
                className="object-contain"
                unoptimized
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={next}
          className="absolute right-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

// ─── Slideshow Viewer Dynamic Import ──────────────────────────────────────────
const SlideshowViewer = dynamic(() => import("./SlideshowViewer"), {
  ssr: false,
});

// ─── Face Search Dialog ───────────────────────────────────────────────────────
function FaceSearchDialog({
  open,
  onClose,
  onResults,
  eventId,
}: {
  open: boolean;
  onClose: () => void;
  onResults: (ids: string[]) => void;
  eventId: string;
}) {
  const [isSearching, setIsSearching] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      toast.error("Camera access denied. Please allow camera or upload a photo.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "face-capture.jpg", { type: "image/jpeg" });
      await doSearch(file);
      stopCamera();
    }, "image/jpeg");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await doSearch(file);
  };

  const doSearch = async (file: File) => {
    setIsSearching(true);
    try {
      const result = await mediaService.faceSearch(eventId, file);
      onResults(result.mediaIds);
      onClose();
      toast.success(`Found ${result.mediaIds.length} matching photos!`);
    } catch {
      toast.error("Face search failed. Try a clearer photo.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-surface-primary rounded-2xl shadow-elevated p-6 flex flex-col gap-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="font-display font-semibold text-lg text-text-primary">
            Find your photos
          </Dialog.Title>
          <Dialog.Description className="text-sm text-text-secondary">
            Take a selfie or upload a photo to instantly find all your moments.
          </Dialog.Description>

          {stream ? (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            {!stream ? (
              <Button variant="primary" fullWidth onClick={startCamera}>
                Open Camera
              </Button>
            ) : (
              <Button variant="primary" fullWidth onClick={handleCapture} isLoading={isSearching}>
                Capture & Search
              </Button>
            )}
            <Button variant="secondary" fullWidth onClick={() => fileRef.current?.click()} disabled={isSearching}>
              Upload a photo instead
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>

          <Dialog.Close asChild>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function GalleryScreen({ event, initialData, initialAlbums }: GalleryScreenProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [activeAlbum, setActiveAlbum] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [newMediaCount, setNewMediaCount] = React.useState(0);
  const [realtimeMedia, setRealtimeMedia] = React.useState<Media[]>([]);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [showSlideshow, setShowSlideshow] = React.useState(false);
  const [faceSearchOpen, setFaceSearchOpen] = React.useState(false);
  const [faceHighlightIds, setFaceHighlightIds] = React.useState<string[]>([]);

  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Realtime subscription
  React.useEffect(() => {
    const unsubscribe = subscribeToGallery(event.id, (media) => {
      setRealtimeMedia((prev) => [media, ...prev]);
      setNewMediaCount((c) => c + 1);
    });
    return unsubscribe;
  }, [event.id]);

  // Infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKeys.gallery.list(event.id, { albumId: activeAlbum ?? undefined, search: debouncedSearch }),
    queryFn: ({ pageParam }) =>
      mediaService.getGallery(event.id, {
        limit: GALLERY_LIMIT,
        albumId: activeAlbum ?? undefined,
        search: debouncedSearch || undefined,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: activeAlbum === null && debouncedSearch === ""
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
  });

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allMedia = React.useMemo(() => {
    const queryMedia = data?.pages.flatMap((p) => p.media) ?? initialData.media;
    const ids = new Set(queryMedia.map((m) => m.id));
    const deduped = [...realtimeMedia.filter((m) => !ids.has(m.id)), ...queryMedia];
    return deduped;
  }, [data, realtimeMedia, initialData.media]);

  const displayMedia = faceHighlightIds.length > 0
    ? allMedia.filter((m) => faceHighlightIds.includes(m.id))
    : allMedia;

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMediaCount(0);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col" ref={topRef}>
      {/* Live Update Pill */}
      <LiveUpdatePill count={newMediaCount} onClick={handleScrollToTop} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface-primary/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 rounded-full hover:bg-surface-secondary transition-colors text-text-primary"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-bold text-text-primary truncate flex-1 text-sm">{event.name}</span>
          {event.status === "active" && (
            <Badge variant="live">Live</Badge>
          )}
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-surface-secondary transition-colors text-text-secondary" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Album Chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          <AlbumChip
            label="All"
            isActive={activeAlbum === null && faceHighlightIds.length === 0}
            count={initialData.totalCount}
            onClick={() => { setActiveAlbum(null); setFaceHighlightIds([]); }}
          />
          {initialAlbums.map((album) => (
            <AlbumChip
              key={album.id}
              label={album.name}
              icon={album.emoji}
              isActive={activeAlbum === album.id}
              count={album.mediaCount}
              onClick={() => { setActiveAlbum(album.id); setFaceHighlightIds([]); }}
            />
          ))}
          {faceHighlightIds.length > 0 && (
            <AlbumChip
              label="Your Photos"
              icon="🙂"
              isActive={true}
              count={faceHighlightIds.length}
              onClick={() => setFaceHighlightIds([])}
            />
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos... try 'mehendi' or 'stage'"
            leftIcon={<Search className="h-4 w-4 text-text-muted" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setFaceSearchOpen(true)}
                className="text-brand-primary hover:text-brand-primary-hover transition-colors"
                aria-label="Face search"
              >
                <ScanFace className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </header>

      {/* Masonry Gallery — with empty states */}
      <main
        className="flex-1 p-1 columns-2 lg:columns-3 gap-[3px] space-y-0"
        aria-label={`Gallery — ${displayMedia.length} photos`}
      >
        {displayMedia.length === 0 && debouncedSearch ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
            <div className="h-14 w-14 rounded-full bg-surface-secondary flex items-center justify-center">
              <Search className="h-7 w-7 text-text-muted" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">No photos match &ldquo;{debouncedSearch}&rdquo;</p>
              <p className="text-sm text-text-secondary mt-1">Try a different search term.</p>
            </div>
          </div>
        ) : displayMedia.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
            <div className="h-14 w-14 rounded-full bg-brand-primary-subtle flex items-center justify-center">
              <Camera className="h-7 w-7 text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">No photos yet</p>
              <p className="text-sm text-text-secondary mt-1">Share the QR code with your guests to start collecting memories.</p>
            </div>
          </div>
        ) : (
          displayMedia.map((media, i) => {
            const isHighlighted = faceHighlightIds.length > 0 && faceHighlightIds.includes(media.id);
            return (
              <div
                key={media.id}
                role="button"
                tabIndex={0}
                className="break-inside-avoid mb-[3px] relative cursor-pointer"
                onClick={() => setLightboxIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(i);
                  }
                }}
                aria-label={`${media.type === "video" ? "Video" : "Photo"} ${i + 1} of ${displayMedia.length}`}
              >
                <PhotoThumbnail
                  src={media.thumbnailUrl || media.url}
                  alt={`Event photo ${i + 1}`}
                  status={media.status as "uploading" | "processing" | "ready" | "error" | "rejected"}
                  className={cn(
                    "w-full aspect-auto",
                    isHighlighted && "ring-2 ring-brand-primary ring-offset-1"
                  )}
                />
                {/* Video overlay */}
                {media.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-2">
                      <Play className="h-5 w-5 text-white fill-white" aria-hidden="true" />
                    </div>
                    {media.duration && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                        {Math.floor(media.duration / 60)}:{String(media.duration % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-6 flex justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>

      {/* Slideshow FAB */}
      <button
        onClick={() => setShowSlideshow(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3 bg-surface-dark text-white rounded-full shadow-elevated hover:scale-105 active:scale-95 transition-transform font-medium text-sm"
      >
        <Play className="h-4 w-4 fill-white" />
        Slideshow
      </button>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          media={displayMedia}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Slideshow */}
      <AnimatePresence>
        {showSlideshow && (
          <SlideshowViewer media={allMedia} onClose={() => setShowSlideshow(false)} />
        )}
      </AnimatePresence>

      {/* Face Search Dialog */}
      <FaceSearchDialog
        open={faceSearchOpen}
        onClose={() => setFaceSearchOpen(false)}
        onResults={setFaceHighlightIds}
        eventId={event.id}
      />
    </div>
  );
}
