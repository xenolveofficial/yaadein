export const queryKeys = {
  events: {
    all: () => ['events'] as const,
    detail: (id: string) => ['events', id] as const,
    qr: (id: string) => ['events', id, 'qr'] as const,
  },
  gallery: {
    list: (eventId: string, params?: { albumId?: string; cursor?: string; search?: string; limit?: number }) => 
      ['gallery', eventId, params] as const,
    albums: (eventId: string) => ['gallery', eventId, 'albums'] as const,
  },
  profile: {
    current: () => ['profile', 'current'] as const,
  },
};
