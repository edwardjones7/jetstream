# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project location

The Next.js app lives in the nested `Jet Website/` subdirectory, not the repo root. All commands and paths below are relative to `Jet Website/Jet Website/`.

## Commands

There is **no `package.json`, `tsconfig.json`, `tailwind.config.*`, or `postcss.config.*`** checked in, but `node_modules/` is present (Next 14.2, React, Tailwind v3.4, GSAP 3.15, Lenis 1.3). Run binaries directly via `node_modules/.bin` or `npx`:

- Dev server: `npx next dev`
- Production build: `npx next build`
- Start built app: `npx next start`
- Type-check: `npx tsc --noEmit` (no tsconfig present — will need one if type-checking is required)

There is no test runner, linter, or formatter configured. If a future task requires Tailwind utility classes to actually generate, a `tailwind.config.{js,ts}` with `content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']` and a `postcss.config.js` registering `tailwindcss` + `autoprefixer` will need to be created — `app/globals.css` already contains the `@tailwind` directives.

## Architecture

Single-page cinematic scroll site themed as a fighter-jet HUD. The user scrolls vertically through eight chapter sections, while a persistent HUD overlay reads scroll progress to drive synthetic telemetry (altitude, mach, status).

**Render tree** (`app/layout.tsx`):
1. `<Preloader />` — boot animation
2. `<LenisProvider>` wraps the page and owns smooth scroll
3. `app/page.tsx` renders the eight section components in order: `Hero` → `Ignition` → `Ascent` → `Fleet` → `Anatomy` → `Mach` → `Apex` → `Legacy`
4. `<HUD />` and `<ChapterNav />` are fixed overlays that sit above all sections

**Scroll/animation pipeline (load-bearing — most sections depend on it):**
- `components/LenisProvider.tsx` instantiates a single `Lenis` smooth-scroll engine, registers GSAP's `ScrollTrigger` plugin, and **bridges the two**: `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t * 1000))`. Without this bridge, GSAP scroll-driven animations will not fire correctly.
- The Lenis instance is exposed as `window.__lenis` so other components (e.g. `hooks/useScrollVelocity.ts`) can read `velocity` without prop-drilling.
- Section components are `'use client'` and create their own `ScrollTrigger`s scoped to their section ref. They remember to `.kill()` on unmount.
- `<HUD />` and `<ChapterNav />` deliberately use plain `window.scroll` listeners (not GSAP) to compute progress — they're independent of any one section.

**Visual system:**
- Color tokens are CSS custom properties on `:root` in `app/globals.css` (`--void`, `--steel`, `--ash`, `--bone`, `--afterburn`, `--mach`, `--vapor`). Use these via `var(--token)` rather than introducing new colors — they encode the project's palette identity.
- Two utility classes — `.mono` (uppercase tracked monospace) and `.display` (tight heavy display) — apply the brand typography. Fonts are loaded via `next/font/google` (Inter + JetBrains Mono) and exposed as `--font-display` / `--font-mono`.
- All custom keyframes (`hud-pulse`, `horizon-breathe`, `flicker`, `spin-slow`, `ticker-scroll`, `ignition-streak`, `ascent-streak`, `radar-sweep`, `twinkle`, `fadein`) are defined in `globals.css`. Reuse them via `style={{ animation: '...' }}` rather than redefining keyframes per-component.
- Tailwind utility classes are used heavily throughout components (see the missing-config note above).

**Media:**
- `lib/media.ts` centralizes all external image URLs (Unsplash with sized query params) and the hero video (a public-domain USAF B-52 clip on Wikimedia). Always import from `MEDIA` rather than hardcoding URLs in sections — this keeps hotlink choices reviewable in one place.
- A local `videos/jet.mp4` exists but the hero currently uses the Wikimedia URL.

**Path alias:** `@/...` resolves to the project root (e.g. `@/components/...`, `@/lib/...`). Used everywhere; preserve this when adding files.

**Section conventions:** each `components/sections/*.tsx` is its own self-contained chapter — owns its refs, its GSAP timelines, and its DOM `id` (the id matches the entries in `ChapterNav.tsx`'s `CHAPTERS` array). When adding or renaming a section, update both `app/page.tsx` and `components/hud/ChapterNav.tsx`.
