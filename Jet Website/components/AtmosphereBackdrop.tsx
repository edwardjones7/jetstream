'use client';

import { useEffect, useRef } from 'react';
import { MEDIA } from '@/lib/media';
import { subscribeScrollProgress } from '@/lib/scrollProgress';

// One persistent fixed-position layer behind every section.
// Renders a continuous sky-to-stratosphere-to-space scene driven by global scroll.
// Compositor-only writes (transform + opacity + background gradient) — no per-frame layout.

type Color = readonly [number, number, number];
type Stop = { p: number; c: Color };

const SKY_TOP: Stop[] = [
  { p: 0.00, c: [4, 6, 12] },
  { p: 0.10, c: [12, 10, 18] },
  { p: 0.22, c: [34, 28, 44] },
  { p: 0.38, c: [22, 56, 110] },
  { p: 0.55, c: [10, 36, 92] },
  { p: 0.72, c: [8, 12, 44] },
  { p: 0.88, c: [2, 4, 14] },
  { p: 1.00, c: [0, 0, 4] },
];

const SKY_BOT: Stop[] = [
  { p: 0.00, c: [10, 12, 18] },
  { p: 0.13, c: [70, 36, 16] },
  { p: 0.25, c: [130, 78, 44] },
  { p: 0.40, c: [90, 140, 190] },
  { p: 0.56, c: [50, 100, 160] },
  { p: 0.72, c: [22, 36, 80] },
  { p: 0.88, c: [4, 8, 22] },
  { p: 1.00, c: [0, 0, 8] },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpC = (a: Color, b: Color, t: number): Color => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];
function pick(stops: Stop[], p: number): Color {
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (p >= a.p && p <= b.p) return lerpC(a.c, b.c, (p - a.p) / (b.p - a.p));
  }
  return stops[stops.length - 1].c;
}
const rgb = (c: Color) => `rgb(${c[0]},${c[1]},${c[2]})`;

export default function AtmosphereBackdrop() {
  const skyRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    const STAR_COUNT = isMobile ? 50 : 90;

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random() * 0.85,
      size: Math.random() * 1.5 + 0.3,
      offset: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.4,
    }));

    let progress = 0;
    let visible = true;
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    let raf = 0;
    let lastDraw = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      // Throttle stars to ~30fps
      if (t - lastDraw < 33) return;
      lastDraw = t;

      const starAlpha = Math.max(0, Math.min(1, (progress - 0.50) / 0.28));
      ctx.clearRect(0, 0, w, h);
      if (starAlpha < 0.02) return;

      const tSec = t / 1000;
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(tSec * s.speed + s.offset);
        const a = starAlpha * (0.35 + 0.65 * tw);
        ctx.fillStyle = `rgba(232,240,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    const unsub = subscribeScrollProgress((p) => {
      progress = p;

      const top = pick(SKY_TOP, p);
      const bot = pick(SKY_BOT, p);
      if (skyRef.current) {
        skyRef.current.style.background = `linear-gradient(to bottom, ${rgb(top)} 0%, ${rgb(bot)} 100%)`;
      }

      // Cloud field — visible during the climb beat
      const cloudVis = (() => {
        if (p < 0.14) return 0;
        if (p < 0.30) return (p - 0.14) / 0.16;
        if (p < 0.55) return 1;
        if (p < 0.70) return 1 - (p - 0.55) / 0.15;
        return 0;
      })();
      const yShift = (mult: number) => `translate3d(0, ${(p - 0.32) * mult}vh, 0)`;
      if (cloud1Ref.current) {
        cloud1Ref.current.style.opacity = String(cloudVis * 0.7);
        cloud1Ref.current.style.transform = yShift(-200);
      }
      if (cloud2Ref.current) {
        cloud2Ref.current.style.opacity = String(cloudVis * 0.5);
        cloud2Ref.current.style.transform = yShift(-340);
      }

      // Horizon glow at takeoff
      if (horizonRef.current) {
        const horizonVis = (() => {
          if (p < 0.05) return 0;
          if (p < 0.18) return (p - 0.05) / 0.13;
          if (p < 0.32) return 1 - (p - 0.18) / 0.14;
          return 0;
        })();
        horizonRef.current.style.opacity = String(horizonVis * 0.85);
      }

      // Sun flare on cruise altitude
      const sunVis = (() => {
        if (p < 0.42) return 0;
        if (p < 0.60) return (p - 0.42) / 0.18;
        if (p < 0.84) return 1 - (p - 0.60) / 0.24;
        return 0;
      })();
      if (sunRef.current) {
        sunRef.current.style.opacity = String(sunVis * 0.9);
        sunRef.current.style.transform = `translate3d(0, ${(p - 0.6) * 50}vh, 0)`;
      }

      // Earth curve on apex
      if (earthRef.current) {
        const earthVis = Math.max(0, Math.min(1, (p - 0.78) / 0.14));
        earthRef.current.style.opacity = String(earthVis);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      unsub();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'rgb(4,6,12)' }}
    >
      {/* Sky gradient */}
      <div
        ref={skyRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgb(4,6,12), rgb(10,12,18))' }}
      />

      {/* Horizon ember (takeoff warmth) — soft gradient, no blend mode, no blur */}
      <div
        ref={horizonRef}
        className="pointer-events-none absolute left-[-15%] right-[-15%] bottom-[-10vh] h-[55vh]"
        style={{
          opacity: 0,
          background:
            'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,120,40,0.55) 0%, rgba(255,80,30,0.22) 35%, transparent 70%)',
          willChange: 'opacity',
        }}
      />

      {/* Cloud layer 2 — lighter compositing budget. No mix-blend-mode, no mask, no filter blur. */}
      <div
        ref={cloud2Ref}
        className="absolute left-[-5%] right-[-5%] top-[48%] h-[70vh]"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 70% at center, rgba(255,255,255,0) 50%, transparent 95%), url(${MEDIA.clouds2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />
      {/* Cloud layer 1 — lowest, sharpest */}
      <div
        ref={cloud1Ref}
        className="absolute left-[-5%] right-[-5%] top-[64%] h-[55vh]"
        style={{
          backgroundImage: `url(${MEDIA.clouds1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Stars */}
      <canvas ref={starCanvasRef} className="absolute inset-0" />

      {/* Sun flare on cruise altitude — gradient only */}
      <div
        ref={sunRef}
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '48%',
          width: '120vw',
          height: '40vh',
          opacity: 0,
          background:
            'radial-gradient(ellipse 50% 80% at center, rgba(255,210,150,0.7) 0%, rgba(255,150,80,0.28) 28%, transparent 62%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Earth curve at apex */}
      <div
        ref={earthRef}
        className="pointer-events-none absolute left-[-25%] right-[-25%]"
        style={{
          bottom: '-45vh',
          height: '90vh',
          opacity: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse 60% 100% at center top, rgba(50,110,180,0.85) 0%, rgba(20,40,90,0.55) 35%, transparent 70%)',
          boxShadow: 'inset 0 60px 80px rgba(120,180,255,0.28)',
          willChange: 'opacity',
        }}
      />
    </div>
  );
}
