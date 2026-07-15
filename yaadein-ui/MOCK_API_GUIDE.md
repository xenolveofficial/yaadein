# Mock API Guide

This guide explains how to use the mock API to bypass CORS errors during development.

## Overview

The mock API system allows you to develop and test the frontend without needing the backend API to be running or accessible. This is particularly useful when:
- Backend API has CORS issues
- Backend is temporarily unavailable
- You want to work offline
- You need consistent test data

## How to Enable Mock API

### Option 1: Environment Variable (Recommended)

Set the following in your `.env.local` file:

```env
NEXT_PUBLIC_USE_MOCK_API=true
```

### Option 2: Disable Mock API

To use the real API again, set:

```env
NEXT_PUBLIC_USE_MOCK_API=false
```

Or simply remove the line from `.env.local`.

## What Gets Mocked

The mock system currently covers the **Events Service** ([`events.service.ts`](src/lib/api/events.service.ts)):

### Mocked Endpoints

1. **`createEvent(payload)`**
   - Creates a mock event with generated ID and slug
   - Returns realistic event data
   - Simulates 800ms API delay

2. **`getEvent(idOrSlug)`**
   - Returns a sample wedding event
   - Includes realistic photo/video counts
   - Simulates 500ms API delay

3. **`listEvents()`**
   - Returns 2 sample events (wedding + birthday)
   - Includes all event metadata
   - Simulates 600ms API delay

4. **`getEventQR(eventId)`**
   - Generates mock QR code data
   - Returns share URLs and WhatsApp links
   - Simulates 400ms API delay

## Mock Data Structure

### Sample Event Response

```typescript
{
  id: "evt_1234567890_abc123",
  slug: "wedding-ceremony-2024",
  name: "Wedding Ceremony 2024",
  type: "wedding",
  date: "2024-12-15T00:00:00.000Z",
  city: "Mumbai",
  status: "active",
  plan: "premium",
  photoCount: 156,
  videoCount: 12,
  guestCount: 200,
  expiresAt: "2025-03-15T00:00:00.000Z",
  createdAt: "2024-11-01T00:00:00.000Z",
  enableFaceSearch: true,
  shareUrl: "http://localhost:3000/e/wedding-ceremony-2024"
}
```

## Console Logging

When mock API is enabled, you'll see console logs like:

```
🔧 Events Service: Using MOCK API
🔧 MOCK: Creating event with payload: {...}
✅ MOCK: Event created: {...}
```

This helps you verify that the mock system is active.

## Testing the Payment Flow with Mock API

With mock API enabled, you can test the complete payment integration:

1. **Step 0**: Fill event details → Mock event created
2. **Step 1**: Select plan → Payment button appears
3. **Step 2**: Complete payment → Payment saved to Supabase
4. **Step 3**: Continue to customize gallery

The payment system still uses **real Razorpay** even with mock API enabled, so payment records are saved to your actual Supabase database.

## Switching Back to Real API

When your backend is ready:

1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_USE_MOCK_API=false
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Verify in console:
   ```
   🔧 Events Service: Using REAL API
   ```

## Files Modified

- [`src/lib/api/events.service.ts`](src/lib/api/events.service.ts) - Main service with mock toggle
- [`src/lib/api/events.service.mock.ts`](src/lib/api/events.service.mock.ts) - Mock implementation
- [`.env.local`](.env.local) - Environment configuration

## Limitations

- Mock API only covers Events Service
- Other services (Media, Auth) still use real APIs
- Mock data is generated on-the-fly (not persisted)
- QR codes are placeholder images

## Future Enhancements

To mock additional services, follow the same pattern:

1. Create `service-name.service.mock.ts`
2. Implement mock functions with delays
3. Add toggle logic in main service file
4. Use same `NEXT_PUBLIC_USE_MOCK_API` flag

## Troubleshooting

### Mock API not working?

1. Check `.env.local` has `NEXT_PUBLIC_USE_MOCK_API=true`
2. Restart dev server after changing env vars
3. Check browser console for "Using MOCK API" message
4. Clear browser cache if needed

### Still seeing CORS errors?

- CORS errors should only occur with real API
- If you see CORS with mock enabled, check console logs
- Verify the service is actually using mock (check logs)

## Support

For issues or questions, check:
- Console logs for service status
- Network tab to verify no API calls are made
- Mock service implementation for data structure