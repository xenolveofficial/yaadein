"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { Event } from "@/types/api/events.types";
import { eventsService } from "@/lib/api/events.service";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

interface GuestAuthGateProps {
  event: Event;
  onAuthenticated: () => void;
}

const STORAGE_KEY_PREFIX = "yaadein_guest_auth_";

export function GuestAuthGate({ event, onAuthenticated }: GuestAuthGateProps) {
  const [guestName, setGuestName] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const response = await eventsService.authenticateGuest(event.id, pin);
      
      if (response.success) {
        // Store authentication in localStorage
        const authData = {
          eventId: event.id,
          guestName: guestName.trim(),
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${event.id}`, JSON.stringify(authData));
        
        toast.success(`Welcome, ${guestName}!`);
        onAuthenticated();
      } else {
        setError(response.message || "Authentication failed. Please check your PIN.");
        toast.error("Authentication failed");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An error occurred. Please try again.");
      toast.error("Authentication error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-secondary flex flex-col relative">
      {/* Header section */}
      <div className="relative h-[35vh] min-h-[250px] w-full flex-shrink-0 bg-surface-dark overflow-hidden">
        {event.coverPhotoUrl && (
          <Image
            src={event.coverPhotoUrl}
            alt={event.name}
            fill
            className="object-cover opacity-80 mix-blend-overlay"
            priority
            unoptimized
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

      {/* Auth Form */}
      <div className="flex-1 bg-surface-primary rounded-t-3xl -mt-6 relative z-10 p-6 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-6 pt-4">
          <div className="text-center">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-2">
              Welcome to {event.name}
            </h2>
            <p className="text-sm text-text-secondary">
              Please enter your name and the event PIN to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="guestName" className="text-sm font-medium text-text-primary">
                Your Name
              </label>
              <Input
                id="guestName"
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setError(null);
                }}
                disabled={isAuthenticating}
                className="w-full"
                autoComplete="name"
              />
            </div>

            {/* PIN Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="pin" className="text-sm font-medium text-text-primary">
                Event PIN
              </label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={handlePinChange}
                disabled={isAuthenticating}
                className="w-full text-center text-2xl tracking-widest font-mono"
                maxLength={4}
                autoComplete="off"
              />
              <p className="text-xs text-text-muted">
                Ask the event host for the PIN if you don't have it
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <p className="text-sm text-error font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isAuthenticating || !guestName.trim() || pin.length !== 4}
              isLoading={isAuthenticating}
              className="mt-2"
            >
              {isAuthenticating ? "Authenticating..." : "Continue to Event →"}
            </Button>
          </form>

          {/* Info Section */}
          <div className="bg-surface-secondary/50 border border-border rounded-lg p-4 mt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              🔒 Privacy & Security
            </h3>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Your photos are private to event guests only</li>
              <li>• No account or sign-up required</li>
              <li>• Original quality preserved</li>
              <li>• PIN protects event privacy</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// Made with Bob
