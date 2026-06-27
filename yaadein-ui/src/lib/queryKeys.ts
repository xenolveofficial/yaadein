export const queryKeys = {
  events: ["events"] as const,
  event: (id: string) => ["event", id] as const,
  gallery: (eventId: string) => ["gallery", eventId] as const,
  media: (mediaId: string) => ["media", mediaId] as const,
  presignedUrls: ["presignedUrls"] as const,
  userProfile: ["userProfile"] as const,
  subscription: ["subscription"] as const,
} as const;

export type QueryKeys = typeof queryKeys;
