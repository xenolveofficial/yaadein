# AGENTS.md — Yaadein Project Rules

## Product
Yaadein is an AI-powered event photo and video sharing platform built for
Indian weddings and celebrations. It is mobile-first and engineered for
poor venue wifi. The primary stack is Next.js 15 App Router, TypeScript
strict mode, Tailwind CSS v4, Shadcn/ui (Radix primitives), Framer Motion,
React Hook Form + Zod, Supabase Auth + Postgres + Realtime, and FastAPI
backend. Package manager is pnpm. Deployment is Vercel.

## Architecture rules — never break these
1. The FastAPI backend is the ONLY layer that queries Supabase Postgres
   directly for core domain logic. Never call Supabase REST or GraphQL APIs
   from the frontend for domain data. Use /api/v1/* FastAPI endpoints.
2. Supabase is used from the frontend ONLY for: Auth (session/JWT),
   Realtime subscriptions (gallery live updates), and Row Level Security.
3. Never route media uploads through the backend. Flow is:
   client → presigned URL from FastAPI → Cloudflare R2 multipart → confirm.
4. All heavy processing (thumbnails, NSFW scan, exports) is async via Celery.
   Never await these from the frontend — show optimistic UI with a processing badge.
5. Server Components are the default. Only use 'use client' when the component
   needs browser APIs, event handlers, hooks, or Framer Motion animations.
6. Every API call from the frontend goes through /src/lib/api/ service modules.
   Never call fetch() directly in a component.

## TypeScript rules
- strict: true in tsconfig. No `any`. No `as unknown as X` casts.
- All props interfaces are named `[ComponentName]Props` and exported.
- All Zod schemas are co-located in /src/lib/schemas/[domain].ts.
- All API response types live in /src/types/api/[domain].ts.
- Use `satisfies` operator for object literals where possible.

## Component rules (Atomic Design)
- Atoms: /src/components/atoms/ — single-purpose, zero business logic.
- Molecules: /src/components/molecules/ — 2-4 atoms composed together.
- Organisms: /src/components/organisms/ — section-level, may have local state.
- Templates: /src/components/templates/ — full-page layout wrappers.
- Screens: /src/app/[route]/page.tsx — data fetching + screen composition only.
- Every component file exports: the component (default), its Props type (named).
- Never put data fetching logic inside atoms, molecules, or organisms.

## Styling rules
- Tailwind v4 only. No inline styles. No CSS modules.
- Design tokens are defined in /src/styles/tokens.css as CSS custom properties
  and mapped into tailwind.config.ts as semantic aliases.
- Use cn() utility (clsx + tailwind-merge) for conditional class composition.
- All color references use semantic token names, never raw hex in JSX.
  Correct: `className="bg-surface-primary"`. Wrong: `className="bg-[#FDFCFA]"`.
- Responsive order: mobile-first. Base = mobile. sm: = 640px. lg: = 1024px.

## File naming
- Components: PascalCase.tsx
- Hooks: useX.ts
- Utilities: camelCase.ts
- API services: [domain].service.ts
- Zod schemas: [domain].schema.ts
- Types: [domain].types.ts

## Forbidden patterns
- No `useEffect` for data fetching — use TanStack Query.
- No prop drilling more than 2 levels — use Zustand store or React Context.
- No `console.log` in committed code — use the /src/lib/logger.ts utility.
- No hardcoded strings for user-facing copy — all copy lives in
  /src/content/[screen].content.ts.
- No `any` type — if you don't know the type, use `unknown` and narrow.
- No direct localStorage access — use the /src/lib/storage.ts wrapper.

## State management
- Server state: TanStack Query v5. All query keys in /src/lib/queryKeys.ts.
- Client/UI state: Zustand. Stores in /src/stores/[domain].store.ts.
- Form state: React Hook Form + Zod resolver. No controlled inputs outside RHF.
- Auth state: Supabase Auth client. Accessed via useSession() hook only.

## Environment variables
- Public (client-safe): NEXT_PUBLIC_ prefix only.
- Secret: never expose in client bundles. Use in Server Components or API routes.
- Validate all env vars at startup via /src/env.ts (using zod).