# AGENTS.md — Atelier Platform

## Project Overview
Atelier is a creator community platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.
It is deployed on Vercel. The founder is non-technical — keep code clean, well-commented, and straightforward.

## Tech Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + inline styles (design system uses CSS variables)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (to be implemented in Phase 4)
- **Deployment**: Vercel

## Design System
CSS variables defined in globals.css:
- `--ink`: #0e0d0c (primary text/dark)
- `--paper`: #f5f0e8 (background)
- `--warm`: #f0e6d0 (secondary background)
- `--accent`: #c8502a (primary accent / CTA)
- `--accent2`: #2a4c8a (secondary accent)
- `--muted`: #8a8070 (muted text)
- `--rule`: rgba(14,13,12,0.12) (borders/dividers)

Fonts: Cormorant Garamond (display/body), DM Mono (labels/mono), Syne (headings/UI)

## Code Style
- Use TypeScript interfaces for all data shapes
- Use `"use client"` only when hooks or browser APIs are needed
- Prefer server components by default
- API routes in `/src/app/api/`
- Shared utilities in `/src/lib/`
- Components in `/src/components/`
- Keep components focused — one responsibility per file

## Database (Supabase)
Current tables:
- `waitlist`: id (uuid), email (text, unique), source (text), signed_up_at (timestamptz)

Future tables (Phase 4):
- `profiles`: id, user_id, display_name, role, current_work, skills, location
- `posts`: id, author_id, content, type, created_at

## Rules for Jules
1. Never hardcode secrets or API keys
2. Always use the Supabase service role client for server-side writes
3. Always use the anon client for client-side reads
4. Write tests for any new API route
5. Keep the design system consistent — use CSS variables, not hardcoded hex values
6. When adding new pages, follow the existing layout pattern
7. Open PRs with descriptive titles: [feat], [fix], [chore] prefixes
8. Never break the waitlist form — it is the most critical user flow right now
