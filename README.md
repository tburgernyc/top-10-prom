# Top 10 Prom — Phase 1 Digital Showroom

A dark-luxury prom dress discovery platform focused on intent capture and boutique lead generation.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v3, custom Dark Luxury design system
- **Animation**: Motion 12 (`motion/react`)
- **AI Concierge**: Vercel AI SDK + Google Gemini 2.5 Flash (Aria)
- **Database**: Supabase (Postgres + RLS + Auth)
- **State**: Zustand with persistence
- **Email**: Resend

## Design System

Dark Luxury palette — Onyx `#050505`, Gold `#D4AF37`, Platinum `#C0C0C0`, Ivory `#F5F5F5` — with five glassmorphism surface classes (`.glass-1` through `.glass-5`) and a custom cursor (`cursor: none`).

## Getting Started

\`\`\`bash
npm install
npx supabase start   # requires Docker
npm run dev
\`\`\`

Copy \`.env.local\` template and fill in your Supabase, Google AI, and Resend credentials.

## Phase 1 Scope

- Dress catalog browse & filter
- Fitting Room session (local cart, no checkout)
- Boutique availability inquiry form
- Aria AI style concierge (streaming chat)
- Auth (sign up / sign in / dashboard)
- Wishlist & appointment history dashboard
