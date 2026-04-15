# SR-71 Blackbird — A Cinematic Scroll Experience

A single-page, scroll-driven tribute to the Lockheed SR-71. Built as a portfolio piece to explore what's possible when you treat the scroll bar like a film reel: every pixel of vertical travel is a frame in a story about the fastest aircraft ever flown.

> The viewer never clicks a button. They scroll, and an entire flight unfolds — taxi to ignition, climb to the edge of space, mach 3.3, retirement.

---

## What it demonstrates

This project is intentionally narrow in scope and deep in craft. It is a single page with one job: feel cinematic. Skills shown:

- **Scroll-driven motion design** — orchestrating GSAP timelines against `ScrollTrigger`, with smooth-scroll bridging via Lenis so animation frames stay locked to scroll position
- **Performant layered compositing** — eight visual layers (atmosphere, nebula, horizon curve, clouds, parallax stars, vapor contrails, HUD, vignette + grain) composited with `mix-blend-mode` and CSS filters, no canvas
- **Hand-authored SVG illustration** — the Blackbird airframe is a hand-coded SVG path with afterburner shock diamonds animated via inline SMIL, no model file
- **Component architecture for narrative pacing** — a 620vh sticky hero followed by act-two sections (Specifications, Pilot Quote, Legacy) each with their own scoped scroll triggers
- **Type-safe Next.js 14 App Router** — server components by default, `'use client'` boundaries drawn carefully around motion code
- **Design system thinking** — color and typography expressed as CSS custom properties (`--void`, `--mach`, `--afterburn`) so the palette is one source of truth

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components + edge-ready, modern React patterns |
| Language | TypeScript | Strict typing across refs, GSAP timelines, and props |
| Styling | Tailwind CSS v3.4 | Utility-first, with a small layer of CSS custom properties for tokens |
| Animation | GSAP 3.12 + ScrollTrigger | Industry standard for scroll-linked motion |
| Smooth scroll | Lenis 1.1 | Bridges native scroll with GSAP's ticker for buttery 60fps |
| Fonts | Inter + JetBrains Mono via `next/font` | Self-hosted, zero CLS |

No 3D library, no headless CMS, no state manager. Everything you see is composed from primitives.

---

## Architecture highlights

A few decisions worth a closer look:

**The Lenis ↔ GSAP bridge** (`components/LenisProvider.tsx`)
Lenis emits a custom `scroll` event that drives `ScrollTrigger.update()`, while GSAP's ticker drives `lenis.raf()`. This is what keeps every scroll-linked animation perfectly synced to the smooth scroll engine — without it, GSAP triggers fire on stale scroll positions and the experience jitters.

**Sticky-pin storytelling** (`components/Experience.tsx`)
The hero is a 620vh tall section containing a single `position: sticky` viewport. As the user scrolls 6.2 screens, a master GSAP timeline scrubs through five narrative beats — each one re-positioning the jet, swapping the headline copy, and modulating background layers (clouds dissipate, stars brighten, nebula intensifies, lens flare blooms at mach).

**Transform composition for the jet**
The Blackbird SVG is wrapped in a transform container so vapor contrails inherit its rotation and translation — when the jet banks at mach 3, the trails bank with it. This is a small detail that requires deliberate ref discipline.

**Pure CSS atmospheric depth**
The "Earth from 85,000 ft" effect is a stack of radial gradients, a glowing horizon line with a breathing keyframe, and a subtle border-radius arc representing the planet's curvature. No images, no shaders.

---

## Run it locally

```bash
cd "Jet Website"
npm install      # if node_modules isn't present
npm run dev      # http://localhost:3000
```

For the cinematic version (recommended — dev mode is 2-3× slower):

```bash
npm run build && npm run start
```

---

## Project layout

```
Jet Website/
├── app/
│   ├── layout.tsx          # Lenis provider + global fonts
│   ├── page.tsx            # Composes Experience → Specs → Quote → Legacy
│   └── globals.css         # Tokens + keyframes
├── components/
│   ├── Experience.tsx      # The 620vh hero with the master timeline
│   ├── Blackbird.tsx       # Hand-coded SVG airframe
│   ├── LenisProvider.tsx   # Smooth scroll + GSAP bridge
│   └── sections/
│       ├── Specs.tsx       # Telemetry-style spec sheet
│       ├── Quote.tsx       # Pilot quote (Brian Shul)
│       └── Legacy.tsx      # Records + outro
└── tailwind.config.ts
```

---

## A note for recruiters

I built this without a designer's mockup and without copying a reference site. The brief I gave myself: *make scrolling feel like flying.* Every visible decision — typography, color palette, motion curves, copy beats, the choice to use SVG over a 3D model — is mine. If you want to see how I think about polish, narrative pacing, and the line between "impressive" and "tasteful," this is that work.

Happy to walk through any layer of the implementation in an interview.
