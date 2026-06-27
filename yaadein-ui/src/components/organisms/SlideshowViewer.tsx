"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Media } from "@/types/api/media.types";

export interface SlideshowViewerProps {
  media: Media[];
  onClose: () => void;
}

export function SlideshowViewer({ media, onClose }: SlideshowViewerProps) {
  const readyPhotos = media.filter((m) => m.type === "photo" && m.status === "ready");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (readyPhotos.length === 0) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % readyPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [readyPhotos.length]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (readyPhotos.length === 0) return null;
  const current = readyPhotos[index];

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={current.url}
            alt="Slideshow"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors cursor-pointer"
        aria-label="Close slideshow"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
export default SlideshowViewer;
