---
projectName: RhemaPulse
projectImage: /images/projects/RhemaPulse.webp
description: >-
  Transform your sermons into actionable insights with AI-powered transcription,
  summaries, scripture detection, and action items for pastors and ministry
  leaders.
technologies:
  - React
  - TypeScript
  - Tailwind CSS
  - Supabase
liveUrl: 'https://Rhema-Pulse.com'
featured: true
createdAt: '2025-11-24T00:00:00.000Z'
---
# RhemaPulse — Project Summary

## Description

RhemaPulse is an AI-powered sermon management platform that transforms audio recordings into structured, searchable content. Pastors upload a sermon and receive a full transcript, summary, scripture references, memorable quotes, and discussion questions—in minutes instead of hours.

---

## Key Features

- **AI Transcription** — Upload MP3, WAV, or M4A files; receive accurate transcripts powered by Google Gemini
- **Smart Extraction** — Automatically identifies scriptures, quotes, key points, and action items
- **Collections & Tags** — Organize sermons into series and playlists with drag-and-drop ordering
- **Full-Text Search** — Find any sermon by title, preacher, scripture, or keyword in the transcript
- **Regeneration** — Re-run AI analysis on specific sections with custom instructions
- **Export Options** — Download as TXT, Markdown, or print-friendly format
- **Tiered Subscriptions** — Free, Basic, Pro, and Enterprise plans with Stripe billing

---

## Technical Highlights

| Area | Implementation |
|------|----------------|
| **Frontend** | React 19 + TypeScript, Vite build, TailwindCSS styling |
| **AI Integration** | Google Gemini API with structured JSON output schemas |
| **Database** | Supabase PostgreSQL with Row-Level Security (RLS) |
| **Auth** | Supabase Auth (email/password) + Firebase (Google OAuth) |
| **Payments** | Stripe Checkout + webhooks via Supabase Edge Functions |
| **State Management** | React Context + custom hooks (no Redux) |
| **Drag & Drop** | dnd-kit for collection ordering |
| **Hosting** | Cloudflare Pages (static SPA) |

---

## Development Process

1. **MVP Scope** — Started with core upload → transcribe → display flow using Gemini's audio capabilities

2. **Database Design** — Iterative schema design with Supabase migrations; added collections, tags, and usage tracking as features matured

3. **Auth Integration** — Implemented auth strategy with shared session state

4. **AI Prompt Engineering** — Refined structured output schemas to reliably extract scriptures, quotes, and action items across different sermon styles

5. **Subscription System** — Integrated Stripe with Edge Function webhooks to sync plan tiers and enforce usage limits

6. **Polish & UX** — Added dark mode, accessibility improvements (skip links, ARIA), SEO meta tags, and responsive design

---

## Links

- **Live Site**: [rhema-pulse.com](https://rhema-pulse.com)
