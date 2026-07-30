"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Share2,
  Download,
  Search,
  X,
  ChevronRight,
  Camera,
  CheckSquare,
  Square,
  Link2,
  Loader2,
  Play,
  Upload,
  CheckCircle2,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import Image from "next/image";
import JSZip from "jszip";

import type { Event } from "@/types/api/events.types";
import type { Media } from "@/types/api/media.types";
import type { Album, GalleryResponse } from "@/types/api/gallery.types";

import { eventsService } from "@/lib/api/events.service";
import { mediaService } from "@/lib/api/media.service";
import { uploadFiles } from "@/lib/api/upload.service";
import { subscribeToGallery } from "@/lib/realtime/gallery.realtime";
import { queryKeys } from "@/lib/queryKeys";
import { HOST_PLANS } from "@/content/plans.content";

import { AlbumChip } from "@/components/molecules/AlbumChip";
import { LiveUpdatePill } from "@/components/molecules/LiveUpdatePill";
import { PhotoThumbnail } from "@/components/molecules/PhotoThumbnail";
import { UploadDropzone } from "@/components/molecules/UploadDropzone";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { cn } from "@/lib/utils";

const GALLERY_LIMIT = 30;

interface PageProps {
  params: Promise<{ id: string }>;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  media?: Media;
  preview: string;
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
        <span className="text-sm text-white/60">
          {index + 1} / {media.length}
        </span>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Download"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
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

// ─── Share Link Dialog ────────────────────────────────────────────────────────
function ShareLinkDialog({
  open,
  onClose,
  selectedIds,
  eventId,
}: {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  eventId: string;
}) {
  const [shareLink, setShareLink] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (open && selectedIds.length > 0) {
      generateShareLink();
    }
  }, [open, selectedIds]);

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      const baseUrl = window.location.origin;
      const mediaIdsParam = selectedIds.join(",");
      const link = `${baseUrl}/e/${eventId}/gallery?shared=${encodeURIComponent(mediaIdsParam)}`;
      setShareLink(link);
    } catch (error) {
      toast.error("Failed to generate share link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-surface-primary rounded-2xl shadow-elevated p-6 flex flex-col gap-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="font-display font-semibold text-lg text-text-primary">
            Share Selected Photos
          </Dialog.Title>
          <Dialog.Description className="text-sm text-text-secondary">
            Share {selectedIds.length} selected {selectedIds.length === 1 ? "photo" : "photos"} with others
          </Dialog.Description>

          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-surface-secondary rounded-lg">
                <Link2 className="h-4 w-4 text-text-muted shrink-0" />
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="primary" fullWidth onClick={handleCopyLink}>
                  Copy Link
                </Button>
                <Button variant="secondary" fullWidth onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          )}

          <Dialog.Close asChild>
            <button
              onClick={onClose}
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

// ─── Upload Dialog ────────────────────────────────────────────────────────────
function UploadDialog({
  open,
  onClose,
  eventId,
  onUploadComplete,
}: {
  open: boolean;
  onClose: () => void;
  eventId: string;
  onUploadComplete: () => void;
}) {
  const [uploadingFiles, setUploadingFiles] = React.useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFilesSelected = async (fileList: FileList) => {
    const files = Array.from(fileList);
    
    // Create preview URLs and initial upload state
    const newFiles: UploadingFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
      preview: URL.createObjectURL(file),
    }));

    setUploadingFiles(newFiles);
    setIsUploading(true);

    try {
      await uploadFiles({
        eventId,
        files,
        faceConsent: true,
        onProgress: (fileIndex, progress) => {
          setUploadingFiles((prev) =>
            prev.map((f, i) => (i === fileIndex ? { ...f, progress } : f))
          );
        },
        onFileComplete: (fileIndex, media) => {
          setUploadingFiles((prev) =>
            prev.map((f, i) =>
              i === fileIndex ? { ...f, status: "complete" as const, media } : f
            )
          );
        },
        onError: (fileIndex, error) => {
          console.error(`Upload error for file ${fileIndex}:`, error);
          setUploadingFiles((prev) =>
            prev.map((f, i) => (i === fileIndex ? { ...f, status: "error" as const } : f))
          );
        },
      });

      toast.success("All files uploaded successfully!");
      onUploadComplete();
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose();
        setUploadingFiles([]);
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Some files failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      // Clean up preview URLs
      uploadingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      setUploadingFiles([]);
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-2xl max-h-[80vh] bg-surface-primary rounded-2xl shadow-elevated p-6 flex flex-col gap-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="font-display font-semibold text-lg text-text-primary">
            Upload Photos & Videos
          </Dialog.Title>

          {uploadingFiles.length === 0 ? (
            <UploadDropzone onFilesSelected={handleFilesSelected} />
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3">
              {uploadingFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {file.status === "uploading" && (
                      <ProgressBar value={file.progress} className="mt-2" />
                    )}
                  </div>
                  <div className="shrink-0">
                    {file.status === "complete" && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                    {file.status === "uploading" && (
                      <Loader2 className="h-5 w-5 text-brand-primary animate-spin" />
                    )}
                    {file.status === "error" && (
                      <X className="h-5 w-5 text-error" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isUploading && uploadingFiles.length > 0 && (
            <Button variant="primary" fullWidth onClick={handleClose}>
              Done
            </Button>
          )}

          {!isUploading && uploadingFiles.length === 0 && (
            <Dialog.Close asChild>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Storage Progress Bar ─────────────────────────────────────────────────────
function StorageProgressBar({ event, totalSizeBytes }: { event: Event; totalSizeBytes: number }) {
  const plan = HOST_PLANS.find((p) => p.id === event.plan);
  const storageGB = plan?.storageGB || 20;
  const storageLimitBytes = storageGB * 1024 * 1024 * 1024;
  const usedGB = totalSizeBytes / 1024 / 1024 / 1024;
  const percentage = Math.min((totalSizeBytes / storageLimitBytes) * 100, 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="px-4 py-3 bg-surface-primary border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-text-secondary">Storage Used</span>
        <span className={cn(
          "text-xs font-semibold",
          isAtLimit ? "text-error" : isNearLimit ? "text-warning" : "text-text-primary"
        )}>
          {usedGB.toFixed(2)} GB / {storageGB} GB
        </span>
      </div>
      <ProgressBar
        value={percentage}
        className={cn(
          isAtLimit && "bg-error/20",
          isNearLimit && !isAtLimit && "bg-warning/20"
        )}
      />
      {isAtLimit && (
        <p className="text-xs text-error mt-1">
          Storage limit reached. Upgrade your plan to upload more.
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-warning mt-1">
          You're running low on storage space.
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardEventGalleryPage({ params }: PageProps) {
  const router = useRouter();
  const [event, setEvent] = React.useState<Event | null>(null);
  const [initialGallery, setInitialGallery] = React.useState<GalleryResponse | null>(null);
  const [initialAlbums, setInitialAlbums] = React.useState<Album[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [activeAlbum, setActiveAlbum] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [newMediaCount, setNewMediaCount] = React.useState(0);
  const [realtimeMedia, setRealtimeMedia] = React.useState<Media[]>([]);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [shareLinkOpen, setShareLinkOpen] = React.useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = React.useState(false);

  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  // Load initial data
  React.useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const [fetchedEvent, fetchedGallery, fetchedAlbums] = await Promise.all([
          eventsService.getEvent(id),
          mediaService.getGallery(id, { limit: 30 }),
          mediaService.getAlbums(id).catch(() => []),
        ]);

        if (!isMounted) return;

        setEvent(fetchedEvent);
        setInitialGallery(fetchedGallery);
        setInitialAlbums(fetchedAlbums);
      } catch (err) {
        console.error("Failed to load gallery data:", err);
        toast.error("Failed to load event gallery");
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

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Realtime subscription
  React.useEffect(() => {
    if (!event) return;
    const unsubscribe = subscribeToGallery(event.id, (media) => {
      setRealtimeMedia((prev) => [media, ...prev]);
      setNewMediaCount((c) => c + 1);
    });
    return unsubscribe;
  }, [event?.id]);

  // Infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: queryKeys.gallery.list(event?.id || "", {
      albumId: activeAlbum ?? undefined,
      search: debouncedSearch,
    }),
    queryFn: ({ pageParam }) =>
      mediaService.getGallery(event!.id, {
        limit: GALLERY_LIMIT,
        albumId: activeAlbum ?? undefined,
        search: debouncedSearch || undefined,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData:
      activeAlbum === null && debouncedSearch === "" && initialGallery
        ? {
            pages: [initialGallery],
            pageParams: [undefined],
          }
        : undefined,
    enabled: !!event && !!initialGallery,
  });

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allMedia = React.useMemo(() => {
    const queryMedia = data?.pages.flatMap((p) => p.media) ?? initialGallery?.media ?? [];
    const ids = new Set(queryMedia.map((m) => m.id));
    const deduped = [...realtimeMedia.filter((m) => !ids.has(m.id)), ...queryMedia];
    return deduped;
  }, [data, realtimeMedia, initialGallery?.media]);

  // Calculate total storage used
  const totalStorageBytes = React.useMemo(() => {
    return allMedia.reduce((sum, media) => sum + (media.sizeBytes || 0), 0);
  }, [allMedia]);

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMediaCount(0);
  };

  const toggleSelection = (mediaId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mediaId)) {
        newSet.delete(mediaId);
      } else {
        newSet.add(mediaId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(allMedia.map((m) => m.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Exiting selection mode, clear selections
      setSelectedIds(new Set());
    }
  };

  const handleMediaClick = (index: number) => {
    if (isSelectionMode) {
      toggleSelection(allMedia[index].id);
    } else {
      setLightboxIndex(index);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedIds.size === 0) return;

    setIsDownloading(true);
    try {
      const selectedMedia = allMedia.filter((m) => selectedIds.has(m.id));

      if (selectedMedia.length === 1) {
        const media = selectedMedia[0];
        const a = document.createElement("a");
        a.href = media.url;
        a.download = `photo-${media.id}`;
        a.target = "_blank";
        a.click();
        toast.success("Download started!");
      } else {
        const zip = new JSZip();
        
        toast.info(`Preparing ${selectedMedia.length} files for download...`);

        await Promise.all(
          selectedMedia.map(async (media, index) => {
            try {
              const response = await fetch(media.url);
              const blob = await response.blob();
              const extension = media.type === "video" ? "mp4" : "jpg";
              zip.file(`photo-${index + 1}.${extension}`, blob);
            } catch (error) {
              console.error(`Failed to fetch ${media.id}:`, error);
            }
          })
        );

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${event?.name || "gallery"}-photos.zip`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success(`Downloaded ${selectedMedia.length} files!`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download files");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadComplete = () => {
    refetch();
  };

  // Check if storage limit reached
  const plan = HOST_PLANS.find((p) => p.id === event?.plan);
  const storageGB = plan?.storageGB || 20;
  const storageLimitBytes = storageGB * 1024 * 1024 * 1024;
  const isStorageFull = totalStorageBytes >= storageLimitBytes;

  if (isLoading || !event || !initialGallery) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-surface-secondary gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary text-sm">Loading gallery...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col" ref={topRef}>
      {/* Live Update Pill */}
      <LiveUpdatePill count={newMediaCount} onClick={handleScrollToTop} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface-primary/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-1 -ml-1 rounded-full hover:bg-surface-secondary transition-colors text-text-primary"
            aria-label="Back to dashboard"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-bold text-text-primary truncate flex-1 text-sm">
            {event.name}
          </span>
          {event.status === "active" && <Badge variant="live">Live</Badge>}
          
          {/* Upload Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            disabled={isStorageFull}
            className="shrink-0"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>

          {/* Selection Mode Toggle */}
          <Button
            variant={isSelectionMode ? "primary" : "secondary"}
            size="sm"
            onClick={toggleSelectionMode}
            className="shrink-0"
          >
            {isSelectionMode ? (
              <>
                <CheckSquare className="h-4 w-4 mr-1" />
                Done
              </>
            ) : (
              <>
                <Square className="h-4 w-4 mr-1" />
                Select
              </>
            )}
          </Button>
        </div>

        {/* Storage Progress Bar */}
        <StorageProgressBar event={event} totalSizeBytes={totalStorageBytes} />

        {/* Selection Controls */}
        {isSelectionMode && selectedIds.size > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-brand-primary-subtle border-t border-brand-primary/20">
            <span className="text-sm font-medium text-brand-primary">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={deselectAll}
                className="text-xs"
              >
                Clear
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShareLinkOpen(true)}
                className="text-xs"
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadSelected}
                isLoading={isDownloading}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}

        {/* Album Chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          <AlbumChip
            label="All"
            isActive={activeAlbum === null}
            count={initialGallery.totalCount}
            onClick={() => setActiveAlbum(null)}
          />
          {initialAlbums.map((album) => (
            <AlbumChip
              key={album.id}
              label={album.name}
              icon={album.emoji}
              isActive={activeAlbum === album.id}
              count={album.mediaCount}
              onClick={() => setActiveAlbum(album.id)}
            />
          ))}
        </div>

        {/* Search Bar & Select All */}
        <div className="px-4 pb-3 flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos..."
            leftIcon={<Search className="h-4 w-4 text-text-muted" />}
            className="flex-1"
          />
          {isSelectionMode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={selectedIds.size === allMedia.length ? deselectAll : selectAll}
              className="shrink-0"
            >
              {selectedIds.size === allMedia.length ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>
      </header>

      {/* Masonry Gallery */}
      <main
        className="flex-1 p-1 columns-2 lg:columns-3 gap-[3px] space-y-0"
        aria-label={`Gallery — ${allMedia.length} photos`}
      >
        {allMedia.length === 0 && debouncedSearch ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
            <div className="h-14 w-14 rounded-full bg-surface-secondary flex items-center justify-center">
              <Search className="h-7 w-7 text-text-muted" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">
                No photos match &ldquo;{debouncedSearch}&rdquo;
              </p>
              <p className="text-sm text-text-secondary mt-1">Try a different search term.</p>
            </div>
          </div>
        ) : allMedia.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
            <div className="h-14 w-14 rounded-full bg-brand-primary-subtle flex items-center justify-center">
              <Camera className="h-7 w-7 text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">No photos yet</p>
              <p className="text-sm text-text-secondary mt-1">
                Upload photos or share the QR code with your guests.
              </p>
            </div>
            <Button variant="primary" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        ) : (
          allMedia.map((media, i) => {
            const isSelected = selectedIds.has(media.id);
            return (
              <div
                key={media.id}
                className="break-inside-avoid mb-[3px] relative cursor-pointer"
                onClick={() => handleMediaClick(i)}
              >
                <PhotoThumbnail
                  src={media.thumbnailUrl || media.url}
                  alt={`Event photo ${i + 1}`}
                  status={media.status as "uploading" | "processing" | "ready" | "error" | "rejected"}
                  selectable={isSelectionMode}
                  isSelected={isSelected}
                  className={cn("w-full", isSelected && "ring-2 ring-brand-primary")}
                />
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

      {/* Lightbox */}
      {lightboxIndex !== null && !isSelectionMode && (
        <Lightbox
          media={allMedia}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Share Link Dialog */}
      <ShareLinkDialog
        open={shareLinkOpen}
        onClose={() => setShareLinkOpen(false)}
        selectedIds={Array.from(selectedIds)}
        eventId={event.id}
      />

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        eventId={event.id}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

// Made with Bob
