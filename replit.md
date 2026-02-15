# replit.md

## Overview

This is a **Brand Archetype Quiz** web application — a mobile-first, embeddable quiz that helps users discover their primary and secondary brand archetypes from the canonical 12 (Ruler, Hero, Magician, Outlaw, Explorer, Creator, Lover, Caregiver, Everyman, Jester, Sage, Innocent). The quiz consists of 18 questions with weighted scoring (Q1–7: 3pts, Q8–14: 2pts, Q15–18: 1pt per archetype), visual break screens with GIFs between sections, and gates the results behind a lead capture form (first name + email). Leads are stored in PostgreSQL and optionally pushed to a GoHighLevel (GHL) webhook.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React SPA)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two main routes: `/` (landing page) and `/quiz` (quiz flow)
- **Styling**: Tailwind CSS with CSS variables for theming. The design uses a dark gradient background (deep red `#660000` to obsidian `#0f0f1a`) with glass-morphism card effects. Fonts are Cormorant Garamond (headings) and Montserrat (body)
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives. Components live in `client/src/components/ui/`
- **Animations**: Framer Motion for quiz transitions, progress bar animations, and page transitions
- **State Management**: React local state for quiz flow; TanStack React Query for server communication
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Effects**: `canvas-confetti` for celebration on results page
- **Path aliases**: `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`

### Quiz Flow Architecture
The quiz has a state machine with these steps: `break-intro` → `question` (Q1-7) → `break-mid` → `question` (Q8-18) → `gate` (lead form) → `results`. Break screens show motivational GIFs. The scoring engine accumulates points per archetype, then determines primary (highest) and secondary (second highest) with a tie-breaker priority order: Ruler > Hero > Magician > Outlaw > Explorer > Creator > Lover > Caregiver > Everyman > Jester > Sage > Innocent.

### Backend (Express + Node.js)
- **Runtime**: Node.js with Express, written in TypeScript (compiled with tsx in dev, esbuild for production)
- **API**: Single REST endpoint `POST /api/leads` to store quiz results
- **Architecture**: Simple storage interface pattern (`IStorage` → `DatabaseStorage`) in `server/storage.ts`
- **Shared code**: `shared/` directory contains the database schema (`schema.ts`) and API route definitions (`routes.ts`) used by both client and server
- **Dev server**: Vite dev server is integrated as Express middleware via `server/vite.ts` with HMR support
- **Production**: Static files served from `dist/public` after Vite build

### Database
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema**: Single `leads` table storing: id, firstName, email, primaryArchetype, primaryScore, secondaryArchetype, secondaryScore, answers (JSONB with full Q&A), createdAt, syncedToGhl
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database

### Tracking
- **Meta Pixel**: ID `1677244690309336` initialized both in `index.html` and in `App.tsx` for tracking PageView events

## External Dependencies

- **PostgreSQL**: Required database, connection via `DATABASE_URL` environment variable
- **GoHighLevel (GHL) Webhook**: Optional integration via `GHL_WEBHOOK_URL` environment variable. When configured, lead data (name, email, archetypes, scores, formatted answers) is POSTed to the webhook URL on lead creation. The tag format is `quiz_primary_{archetype_lowercase}`
- **Meta (Facebook) Pixel**: Tracking pixel (ID: `1677244690309336`) for PageView events, loaded via script tag and React useEffect
- **Tenor GIFs**: Break screens reference external GIF URLs from `media.tenor.com` for visual interstitials
- **Google Fonts**: Cormorant Garamond, Montserrat, DM Sans, Fira Code, Geist Mono loaded from Google Fonts CDN
- **Replit plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` used in development only