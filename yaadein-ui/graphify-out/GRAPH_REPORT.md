# Graph Report - yaadein-ui  (2026-07-09)

## Corpus Check
- 101 files · ~31,079 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 547 nodes · 943 edges · 34 communities (30 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d38c9b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- Button.tsx
- Card.tsx
- page.tsx
- GalleryScreen.tsx
- dependencies
- components.json
- devDependencies
- compilerOptions
- razorpay.ts
- Yaadein - Technical Flow Documentation
- Skeleton.tsx
- AGENTS.md — Yaadein Project Rules
- API Architecture
- layout.tsx
- Security Considerations
- Performance Optimizations
- Technology Stack
- Core User Flows
- Implementation Details
- Data Models
- Atomic Design Structure
- razorpay-button.tsx
- README.md
- State Management
- Deployment & DevOps
- next.config.ts
- Appendix
- File Upload System
- Executive Summary
- Future Enhancements
- eslint.config.mjs
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 77 edges
2. `Yaadein - Technical Flow Documentation` - 21 edges
3. `react` - 17 edges
4. `compilerOptions` - 16 edges
5. `Button` - 15 edges
6. `Media` - 13 edges
7. `AGENTS.md — Yaadein Project Rules` - 10 edges
8. `Badge()` - 9 edges
9. `Event` - 9 edges
10. `Card` - 8 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --references--> `react`  [EXTRACTED]
  src/app/login/page.tsx → package.json
- `SignupPage()` --references--> `react`  [EXTRACTED]
  src/app/signup/page.tsx → package.json
- `OfflineBanner()` --references--> `react`  [EXTRACTED]
  src/components/atoms/OfflineBanner.tsx → package.json
- `UploadDropzone()` --references--> `react`  [EXTRACTED]
  src/components/molecules/UploadDropzone.tsx → package.json
- `Step3ShareQR()` --references--> `react`  [EXTRACTED]
  src/components/organisms/create-event/Step3ShareQR.tsx → package.json

## Import Cycles
- None detected.

## Communities (34 total, 4 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (58): Badge(), BadgeProps, badgeVariants, ProgressBar, ProgressBarProps, Spinner(), SpinnerProps, spinnerVariants (+50 more)

### Community 1 - "Button.tsx"
Cohesion: 0.05
Nodes (34): metadata, GalleryScreen, PageProps, PageProps, AvatarGroup(), AvatarGroupProps, Button, ButtonProps (+26 more)

### Community 2 - "Card.tsx"
Cohesion: 0.05
Nodes (43): CreateEventClient(), CreateEventWizard, CreateEventPage(), metadata, DashboardLayout(), DashboardPage(), LoginFormData, LoginPage() (+35 more)

### Community 3 - "page.tsx"
Cohesion: 0.08
Nodes (30): metadata, FAQ_ITEMS, metadata, MotifBackground, MotifBackgroundProps, SectionLabel, SectionLabelProps, FeatureRow() (+22 more)

### Community 4 - "GalleryScreen.tsx"
Cohesion: 0.10
Nodes (32): react, LiveUpdatePill(), LiveUpdatePillProps, CreateEventWizard(), FaceSearchDialog(), GalleryScreen(), GalleryScreenProps, Lightbox() (+24 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, class-variance-authority, clsx, date-fns, framer-motion, @hookform/resolvers, html2canvas, lucide-react (+23 more)

### Community 6 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "devDependencies"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, @next/bundle-analyzer, tailwindcss, @tailwindcss/postcss, @types/node, @types/qrcode (+11 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "razorpay.ts"
Cohesion: 0.22
Nodes (10): razorpay, POST(), POST(), POST(), CreateOrderParams, createRazorpayOrder(), getRazorpayInstance(), VerifyPaymentParams (+2 more)

### Community 10 - "Yaadein - Technical Flow Documentation"
Cohesion: 0.14
Nodes (13): Architecture Patterns, Contact & Support, Design Patterns, High-Level Architecture, Middleware Configuration, Project Structure, Real-time Features, Route Structure (+5 more)

### Community 11 - "Skeleton.tsx"
Cohesion: 0.21
Nodes (4): EventListSkeleton(), GallerySkeleton(), Skeleton(), SkeletonProps

### Community 12 - "AGENTS.md — Yaadein Project Rules"
Cohesion: 0.18
Nodes (10): AGENTS.md — Yaadein Project Rules, Architecture rules — never break these, Component rules (Atomic Design), Environment variables, File naming, Forbidden patterns, Product, State management (+2 more)

### Community 13 - "API Architecture"
Cohesion: 0.20
Nodes (10): 1. Events Service ([`src/lib/api/events.service.ts`](src/lib/api/events.service.ts)), 2. Media Service ([`src/lib/api/media.service.ts`](src/lib/api/media.service.ts)), 3. Auth Service ([`src/lib/api/auth.service.ts`](src/lib/api/auth.service.ts)), API Architecture, API Client, API Endpoints (Backend Contract), Auth, Events (+2 more)

### Community 14 - "layout.tsx"
Cohesion: 0.28
Nodes (6): cormorantGaramond, metadata, plusJakartaSans, RootLayout(), OfflineBanner(), QueryProvider()

### Community 15 - "Security Considerations"
Cohesion: 0.25
Nodes (8): 1. Authentication, 2. API Security, 3. File Upload Security, 4. XSS Prevention, 5. CSRF Protection, 6. Environment Variables, 7. Data Privacy, Security Considerations

### Community 16 - "Performance Optimizations"
Cohesion: 0.25
Nodes (8): 1. Code Splitting, 2. Image Optimization, 3. Infinite Scroll, 4. Debouncing, 5. Memoization, 6. Server Components, 7. Bundle Analysis, Performance Optimizations

### Community 17 - "Technology Stack"
Cohesion: 0.25
Nodes (8): Authentication & Backend, Development Tools, Frontend Core, State Management, Technology Stack, UI Components, Utilities, Validation & Forms

### Community 18 - "Core User Flows"
Cohesion: 0.29
Nodes (7): 1. Event Creation Flow, 2. Guest Upload Flow, 3. Gallery Viewing Flow, Core User Flows, Implementation, Implementation, Implementation

### Community 19 - "Implementation Details"
Cohesion: 0.29
Nodes (7): 1. Supabase Client Setup, 2. Login Flow, 3. Middleware Protection, 4. API Authentication, Authentication & Authorization, Authentication Flow, Implementation Details

### Community 20 - "Data Models"
Cohesion: 0.29
Nodes (7): Album, Data Models, Event, Gallery Response, Media, Plan Content, Upload Types

### Community 21 - "Atomic Design Structure"
Cohesion: 0.29
Nodes (7): Atomic Design Structure, Atoms (Basic Building Blocks), Component Architecture, Component Patterns, Design System, Molecules (Composite Components), Organisms (Complex Components)

### Community 22 - "razorpay-button.tsx"
Cohesion: 0.40
Nodes (3): RazorpayButton(), RazorpayButtonProps, Window

### Community 23 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 24 - "State Management"
Cohesion: 0.50
Nodes (4): 1. Server State (React Query), 2. Client State (Zustand), 3. Form State (React Hook Form), State Management

### Community 25 - "Deployment & DevOps"
Cohesion: 0.50
Nodes (4): Build & Deploy, Deployment & DevOps, Environment Variables, Recommended Hosting

### Community 27 - "Appendix"
Cohesion: 0.67
Nodes (3): Appendix, Glossary, Key Files Reference

### Community 28 - "File Upload System"
Cohesion: 0.67
Nodes (3): Chunked Multipart Upload Architecture, File Upload System, Implementation Details

### Community 29 - "Executive Summary"
Cohesion: 0.67
Nodes (3): Executive Summary, Key Features, Target Users

### Community 30 - "Future Enhancements"
Cohesion: 0.67
Nodes (3): Future Enhancements, Planned Features, Technical Debt

## Knowledge Gaps
- **255 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+250 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button.tsx`, `Card.tsx`, `page.tsx`, `GalleryScreen.tsx`, `Skeleton.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `razorpay.ts`, `GalleryScreen.tsx`, `devDependencies`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `react` connect `GalleryScreen.tsx` to `cn`, `Button.tsx`, `Card.tsx`, `page.tsx`, `dependencies`, `layout.tsx`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _255 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.054363796650014694 - nodes in this community are weakly interconnected._
- **Should `Button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05129561078794289 - nodes in this community are weakly interconnected._
- **Should `Card.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05028248587570622 - nodes in this community are weakly interconnected._