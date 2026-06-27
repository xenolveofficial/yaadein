"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Image as ImageIcon, Video, Hourglass, ArrowRight } from "lucide-react";
import type { Event } from "@/types/api/events.types";
import { Card, CardContent } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";

export interface EventListCardProps {
  event: Event;
  className?: string;
}

export function EventListCard({ event, className }: EventListCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedExpiry = new Date(event.expiresAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Map event status to badge variants
  const statusVariant = 
    event.status === "active" ? "live" : 
    event.status === "expired" ? "error" : "default";

  return (
    <Card className={className}>
      <CardContent className="p-0 flex flex-col h-full overflow-hidden">
        {/* Cover Image Header */}
        <div className="relative h-44 w-full bg-surface-dark overflow-hidden shrink-0">
          {event.coverPhotoUrl ? (
            <Image
              src={event.coverPhotoUrl}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-accent-gold/10 to-surface-dark" />
          )}
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant={statusVariant}>{event.status}</Badge>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1 gap-4 bg-surface-primary">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading text-lg font-bold text-text-primary leading-snug line-clamp-1">
              {event.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary font-medium">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>{event.city}</span>
              </div>
            </div>
          </div>

          {/* Media Count Indicators */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-surface-secondary/40 rounded-xl border border-border/60 text-xs font-semibold text-text-secondary">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-brand-primary/80 shrink-0" />
              <span>{event.photoCount.toLocaleString()} Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-accent-gold/80 shrink-0" />
              <span>{event.videoCount.toLocaleString()} Videos</span>
            </div>
          </div>

          {/* Expiry Bar / Footer */}
          <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-text-muted font-medium">
              <Hourglass className="h-3.5 w-3.5 shrink-0" />
              <span>Expires: {formattedExpiry}</span>
            </div>
            
            <Link
              href={`/dashboard/event/${event.id}`}
              className="flex items-center gap-1 font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-all"
            >
              <span>Manage</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
