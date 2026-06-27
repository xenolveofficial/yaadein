"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import type { Event } from "@/types/api/events.types";
import { useUploadStore } from "@/stores/upload.store";
import { uploadFiles } from "@/lib/api/upload.service";

import { ConsentBanner } from "@/components/molecules/ConsentBanner";
import { AvatarGroup } from "@/components/atoms/AvatarGroup";
import { Button } from "@/components/atoms/Button";

// Dynamically import heavy interactive components for faster initial load on slow networks
const UploadDropzone = dynamic(() => import("@/components/molecules/UploadDropzone").then(m => m.UploadDropzone), { ssr: false });
const PhotoThumbnail = dynamic(() => import("@/components/molecules/PhotoThumbnail").then(m => m.PhotoThumbnail), { ssr: false });

interface GuestUploadScreenProps {
  event: Event;
}

export function GuestUploadScreen({ event }: GuestUploadScreenProps) {
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);

  const [faceConsent, setFaceConsent] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileIds, setFileIds] = React.useState<string[]>([]);

  const { uploads, addFiles, updateProgress, setStatus } = useUploadStore();

  const handleFilesSelected = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    if (isUploading) return;
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]); // cleanup memory
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    const ids = addFiles(selectedFiles, event.id);
    setFileIds(ids);

    try {
      await uploadFiles({
        eventId: event.id,
        files: selectedFiles,
        faceConsent,
        onProgress: (index, progress) => {
          updateProgress(ids[index], progress);
        },
        onFileComplete: (index, media) => {
          setStatus(ids[index], 'ready', media);
        },
        onError: (index, error) => {
          setStatus(ids[index], 'error', undefined, error.message);
          toast.error(`Failed to upload ${selectedFiles[index].name}`);
        },
      });

      toast.success("All photos uploaded successfully!");
      router.push(`/e/${event.slug}/gallery`);
    } catch (err) {
      console.error(err);
      toast.error("Upload process encountered an error.");
      setIsUploading(false);
    }
  };

  const completedCount = fileIds.filter(id => uploads[id]?.status === 'ready').length;
  const allCompleted = isUploading && fileIds.length > 0 && completedCount === fileIds.length;

  return (
    <main className="min-h-screen bg-surface-secondary flex flex-col relative pb-32">
      {/* Header section (top 35% of screen) */}
      <div className="relative h-[35vh] min-h-[250px] w-full flex-shrink-0 bg-surface-dark overflow-hidden">
        {event.coverPhotoUrl && (
          <Image
            src={event.coverPhotoUrl}
            alt={event.name}
            fill
            className="object-cover opacity-80 mix-blend-overlay"
            priority
            unoptimized // Allow blob URLs or external URLs without failure
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(26,26,46,0.9)]" />
        <div className="absolute bottom-10 left-6 right-6">
          <h1 className="font-display italic text-3xl text-white drop-shadow-lg">
            {event.name}
          </h1>
          <p className="text-sm text-white/80 mt-1.5 font-medium">
            {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} • {event.city}
          </p>
        </div>
        <p className="absolute bottom-4 right-4 text-[10px] text-white/50 tracking-wide uppercase font-bold">
          Powered by Yaadein
        </p>
      </div>

      {/* Body section */}
      <div className="flex-1 bg-surface-primary rounded-t-3xl -mt-6 relative z-10 p-6 flex flex-col gap-6 shadow-[-4px_0_24px_rgba(0,0,0,0.1)]">
        <h3 className="font-display font-semibold text-xl text-text-primary">
          Add your photos to {event.name}
        </h3>

        {/* ConsentBanner */}
        {event.enableFaceSearch && !isUploading && (
          <ConsentBanner
            eventName={event.name}
            onConsent={setFaceConsent}
          />
        )}

        {/* Upload Dropzone */}
        {!isUploading && (
          <UploadDropzone
            onFilesSelected={handleFilesSelected}
            className="w-full"
            disabled={isUploading}
          />
        )}

        {/* Thumbnail Grid */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {selectedFiles.map((_, i) => {
              const src = previews[i];
              const uploadState = isUploading && fileIds[i] ? uploads[fileIds[i]] : null;

              let status: "uploading" | "processing" | "ready" | "error" | "rejected" = "uploading";
              let progress = 0;

              if (uploadState) {
                status = uploadState.status as "uploading" | "processing" | "ready" | "error" | "rejected";
                progress = uploadState.progress;
              } else if (!isUploading) {
                status = "ready"; // pre-upload visual state is clean
              }

              return (
                <div key={i} className="relative">
                  <PhotoThumbnail
                    src={src}
                    alt="Selected"
                    status={isUploading ? status : "ready"}
                    uploadProgress={progress}
                  />
                  {!isUploading && (
                    <button
                      onClick={() => handleRemoveFile(i)}
                      className="absolute -top-2 -right-2 h-6 w-6 bg-error text-white rounded-full flex items-center justify-center shadow-sm text-xs font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Social Proof */}
        <div className="flex items-center gap-3 bg-surface-secondary/50 p-3 rounded-lg border border-border mt-4">
          <AvatarGroup
            avatars={[
              { fallback: "A" },
              { fallback: "B" },
              { fallback: "C" },
            ]}
            max={3}
            size="sm"
          />
          <p className="text-sm font-medium text-text-secondary">
            {event.guestCount || 0} others uploaded
          </p>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-primary border-t border-border z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <Button
            variant="primary" // The button component handles 'success' mapped to 'primary' unless 'success' is explicitly a variant
            fullWidth
            onClick={allCompleted ? () => router.push(`/e/${event.slug}/gallery`) : handleUpload}
            disabled={selectedFiles.length === 0 || (isUploading && !allCompleted)}
            isLoading={isUploading && !allCompleted}
            className={allCompleted ? "bg-success hover:bg-success" : ""}
          >
            {allCompleted
              ? "All uploaded! View gallery \u2192"
              : isUploading
                ? `Uploading ${completedCount} of ${selectedFiles.length}...`
                : "Upload my photos \u2192"}
          </Button>
          <p className="text-xs text-text-muted text-center font-medium">
            No account needed &middot; Original quality preserved &middot; &#128274; Private to guests only
          </p>
        </div>
      </div>
    </main>
  );
}
