"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Share2, ArrowRight, Loader2 } from "lucide-react";
import { eventsService } from "@/lib/api/events.service";
import { queryKeys } from "@/lib/queryKeys";
import { QRCodeFrame } from "@/components/atoms/QRCodeFrame";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export function Step3ShareQR({ eventId }: { eventId: string }) {
  const qrRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.events.qr(eventId),
    queryFn: () => eventsService.getEventQR(eventId),
  });

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const canvas = await html2canvas(qrRef.current, { scale: 2, backgroundColor: null });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `Memora-QR-${eventId}.png`;
      a.click();
      toast.success("QR Code downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download QR code");
    }
  };

  const handleWhatsApp = () => {
    if (!data?.whatsappUrl) return;
    window.open(data.whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="text-sm text-text-muted">Generating your QR code...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <p className="text-sm text-error">Failed to generate QR code. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-text-primary">Event Created!</h2>
        <p className="text-sm text-text-secondary mt-1">
          Your gallery is ready. Print this QR or share the link.
        </p>
      </div>

      <div ref={qrRef} className="mb-8 p-4 bg-white rounded-2xl shadow-card inline-block">
        <QRCodeFrame value={data.qrUrl} size={240} />
      </div>

      <div className="flex flex-col w-full max-w-sm gap-3">
        <Button variant="secondary" fullWidth onClick={handleDownload} leftIcon={<Download className="h-4 w-4" />}>
          Download QR (PNG)
        </Button>
        <Button variant="whatsapp" fullWidth onClick={handleWhatsApp} leftIcon={<Share2 className="h-4 w-4" />}>
          Share on WhatsApp
        </Button>
        <Button variant="ghost" fullWidth asChild className="mt-2 text-text-muted hover:text-text-primary">
          <Link href={`/events/${eventId}`}>
            View gallery <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
