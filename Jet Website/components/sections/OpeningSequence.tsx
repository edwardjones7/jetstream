'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// One continuous takeoff sequence — replaces Hero + Ignition + Ascent.
// 460vh tall with a sticky 100vh viewport. Everything is scroll-driven —
// no static text cards, no video. Sits on top of the global AtmosphereBackdrop.

function reveal(p: number, inA: number, inB: number, outA: number, outB: number) {
  if (p < inA) return inA === 0 ? 1 : 0;
  if (p < inB) return (p - inA) / (inB - inA);
  if (p < outA) return 1;
  if (p < outB) return 1 - (p - outA) / (outB - outA);
  return 0;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Color = readonly [number, number, number, number];
const TINT: { p: number; c: Color }[] = [
  { p: 0.00, c: [0, 0, 0, 0.50] },
  { p: 0.10, c: [40, 18, 8, 0.50] },
  { p: 0.24, c: [120, 40, 12, 0.42] },
  { p: 0.36, c: [180, 70, 20, 0.32] },
  { p: 0.48, c: [80, 50, 30, 0.22] },
  { p: 0.60, c: [20, 35, 60, 0.18] },
  { p: 0.78, c: [12, 26, 60, 0.12] },
  { p: 1.00, c: [6, 16, 44, 0.08] },
];
function pickTint(p: number): Color {
  for (let i = 0; i < TINT.length - 1; i++) {
    const a = TINT[i];
    const b = TINT[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      return [
        Math.round(lerp(a.c[0], b.c[0], t)),
        Math.round(lerp(a.c[1], b.c[1], t)),
        Math.round(lerp(a.c[2], b.c[2], t)),
        lerp(a.c[3], b.c[3], t),
      ];
    }
  }
  return TINT[TINT.length - 1].c;
}

type Line = { text: string; color?: string; sizeFactor?: number };
type Beat = {
  id: string;
  inA: number; inB: number; outA: number; outB: number;
  lines: Line[];
  blend?: 'difference' | 'normal';
  withReticle?: boolean;
};

// Tightened timing — first beat visible immediately, beats overlap into one another.
const BEATS: Beat[] = [
  {
    id: 'open',
    inA: 0.00, inB: 0.00, outA: 0.20, outB: 0.26,
    lines: [
      { text: 'OWN', sizeFactor: 1.0 },
      { text: 'THE SKY', sizeFactor: 1.0, color: 'var(--afterburn)' },
    ],
    withReticle: true,
  },
  {
    id: 'ignition',
    inA: 0.22, inB: 0.30, outA: 0.46, outB: 0.54,
    lines: [
      { text: 'MACH ONE' },
      { text: 'BEGINS', color: 'var(--afterburn)' },
      { text: 'AT ZERO' },
    ],
  },
  {
    id: 'climb',
    inA: 0.54, inB: 0.62, outA: 0.84, outB: 0.94,
    lines: [{ text: 'RISE' }, { text: 'THROUGH' }, { text: 'EVERYTHING' }],
    blend: 'difference',
  },
];

const RUNWAY_LINES = 14;
const STREAKS = 16;

export default function OpeningSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);

  const reticleRef = useRef<HTMLDivElement>(null);
  const jetRef = useRef<SVGSVGElement>(null);

  const tagRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const speedoRef = useRef<HTMLDivElement>(null);
  const altTapeRef = useRef<HTMLDivElement>(null);
  const speedNumRef = useRef<HTMLSpanElement>(null);
  const altNumRef = useRef<HTMLSpanElement>(null);
  const phaseDotRef = useRef<HTMLSpanElement>(null);
  const phaseTextRef = useRef<HTMLSpanElement>(null);
  const beatLabelRef = useRef<HTMLDivElement>(null);

  const [typed, setTyped] = useState('');

  useEffect(() => {
    // Typewriter — runs once
    const msg = '// MISSION 42-ALPHA · ELEMENT LEAD · CLEARED FOR ENGAGEMENT';
    let i = 0;
    const typeI = window.setInterval(() => {
      i++;
      setTyped(msg.slice(0, i));
      if (i >= msg.length) clearInterval(typeI);
    }, 28);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;

        if (tintRef.current) {
          const [r, g, b, a] = pickTint(p);
          tintRef.current.style.background = `rgba(${r},${g},${b},${a})`;
        }

        if (horizonRef.current) {
          const glow = reveal(p, 0.04, 0.22, 0.40, 0.54);
          horizonRef.current.style.opacity = String(glow * 0.95);
          horizonRef.current.style.transform = `scaleY(${0.7 + glow * 0.6})`;
        }

        if (groundRef.current) {
          const groundShift = Math.max(0, (p - 0.42) / 0.18);
          groundRef.current.style.transform = `translateY(${groundShift * 90}vh)`;
          groundRef.current.style.opacity = String(Math.max(0, 1 - groundShift * 1.5));
        }

        if (flashRef.current) {
          const d = Math.abs(p - 0.40);
          flashRef.current.style.opacity = String(Math.max(0, 0.95 - d / 0.04));
        }

        if (runwayRef.current) {
          runwayRef.current.style.opacity = String(reveal(p, 0.30, 0.40, 0.50, 0.60));
        }

        if (streakRef.current) {
          streakRef.current.style.opacity = String(reveal(p, 0.50, 0.60, 0.92, 1.00) * 0.85);
        }

        // Reticle / jet anchor — strong visual at start, transforms with scroll
        if (reticleRef.current) {
          // Stays bright throughout opening, fades as ignition kicks in
          const a = reveal(p, 0.00, 0.00, 0.32, 0.42);
          // Slight scale up + slight rotation as we approach ignition
          const scale = 1 + p * 0.4;
          reticleRef.current.style.opacity = String(a);
          reticleRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        if (jetRef.current) {
          // Jet silhouette: still on tarmac early, lifts and shrinks (perspective) as we climb
          const lift = Math.max(0, (p - 0.36) / 0.18);
          const fade = reveal(p, 0.00, 0.00, 0.50, 0.58);
          jetRef.current.style.opacity = String(fade);
          jetRef.current.style.transform =
            `translate(-50%, calc(-50% - ${lift * 35}vh)) scale(${1 - lift * 0.6}) rotate(${-lift * 8}deg)`;
        }

        // Headline beats
        for (let i = 0; i < BEATS.length; i++) {
          const el = beatRefs.current[i];
          if (!el) continue;
          const b = BEATS[i];
          const a = reveal(p, b.inA, b.inB, b.outA, b.outB);
          el.style.opacity = String(a);
          el.style.transform = `translate(-50%, calc(-50% + ${(1 - a) * 28}px))`;
        }

        // Mono tag (above headline) — visible during opening and ignition beats
        if (tagRef.current) {
          tagRef.current.style.opacity = String(reveal(p, 0.00, 0.00, 0.48, 0.56));
        }

        // Subtitle (below headline, mission tag) — opening only
        if (subtitleRef.current) {
          subtitleRef.current.style.opacity = String(reveal(p, 0.00, 0.04, 0.18, 0.24));
        }

        // Speedo + altimeter
        if (speedoRef.current) {
          speedoRef.current.style.opacity = String(reveal(p, 0.20, 0.30, 0.96, 1.00));
        }
        if (altTapeRef.current) {
          altTapeRef.current.style.opacity = String(reveal(p, 0.42, 0.52, 0.96, 1.00));
        }

        const speed = Math.floor(p < 0.42 ? p * 360 : 360 + (p - 0.42) * 2400);
        if (speedNumRef.current) speedNumRef.current.textContent = speed.toString().padStart(4, '0');
        const alt = Math.floor(p < 0.46 ? 0 : (p - 0.46) * 92000);
        if (altNumRef.current) altNumRef.current.textContent = alt.toString().padStart(6, '0');

        const phase =
          p < 0.20 ? 'CHAPTER I · OPEN'
            : p < 0.46 ? 'CHAPTER II · IGNITION'
              : p < 0.56 ? 'CHAPTER III · ROLLOUT'
                : p < 0.84 ? 'CHAPTER IV · CLIMB'
                  : 'CHAPTER V · ABOVE';
        if (beatLabelRef.current) beatLabelRef.current.textContent = phase;

        if (phaseTextRef.current) {
          phaseTextRef.current.textContent =
            p < 0.20 ? 'STANDBY' :
            p < 0.46 ? 'BURN' :
            p < 0.56 ? 'ROLL' :
            p < 0.84 ? 'CLIMB' : 'NOMINAL';
        }
        if (phaseDotRef.current) {
          const armed = p > 0.20;
          phaseDotRef.current.style.background = armed ? 'var(--afterburn)' : '#fbbf24';
          phaseDotRef.current.style.boxShadow = armed
            ? '0 0 12px var(--afterburn)'
            : '0 0 8px #fbbf24';
        }
      },
    });

    return () => {
      st.kill();
      clearInterval(typeI);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="takeoff"
      className="relative w-full"
      style={{ height: '460vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Local sky tint over the global atmosphere */}
        <div
          ref={tintRef}
          className="pointer-events-none absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.50)', willChange: 'background' }}
        />

        {/* Horizon glow */}
        <div
          ref={horizonRef}
          className="pointer-events-none absolute left-[-10%] right-[-10%] bottom-0 h-[60vh]"
          style={{
            opacity: 0,
            transformOrigin: 'center bottom',
            background:
              'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,150,40,0.85) 0%, rgba(255,90,30,0.45) 25%, rgba(255,60,20,0.18) 50%, transparent 75%)',
            willChange: 'transform, opacity',
          }}
        />

        {/* Ground silhouette band */}
        <div
          ref={groundRef}
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: '14vh',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.95) 100%)',
            willChange: 'transform, opacity',
          }}
        />

        {/* JET SILHOUETTE — anchor visual behind the headline */}
        <svg
          ref={jetRef}
          viewBox="0 0 200 200"
          className="pointer-events-none absolute top-1/2 left-1/2 z-[2]"
          style={{
            width: 'clamp(360px, 42vw, 720px)',
            height: 'clamp(360px, 42vw, 720px)',
            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
            willChange: 'transform, opacity',
          }}
        >
          <defs>
            <linearGradient id="jet-body" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(20,24,32,0.88)" />
              <stop offset="100%" stopColor="rgba(8,10,14,0.95)" />
            </linearGradient>
            <linearGradient id="jet-edge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(94,200,255,0)" />
              <stop offset="50%" stopColor="rgba(94,200,255,0.45)" />
              <stop offset="100%" stopColor="rgba(94,200,255,0)" />
            </linearGradient>
          </defs>
          {/* Top-down jet silhouette */}
          <path
            d="M 100 18
               L 105 56 L 112 86 L 130 130 L 184 178 L 184 188
               L 122 168 L 124 200 L 134 212 L 134 218
               L 100 206 L 66 218 L 66 212 L 76 200 L 78 168
               L 16 188 L 16 178 L 70 130 L 88 86 L 95 56 Z"
            fill="url(#jet-body)"
            stroke="rgba(94,200,255,0.55)"
            strokeWidth="0.6"
          />
          {/* Wing edge accent */}
          <path
            d="M 130 130 L 184 178"
            stroke="url(#jet-edge)"
            strokeWidth="1.2"
          />
          <path
            d="M 70 130 L 16 178"
            stroke="url(#jet-edge)"
            strokeWidth="1.2"
          />
          {/* Cockpit highlight */}
          <path
            d="M 100 38 L 106 60 L 100 86 L 94 60 Z"
            fill="rgba(94,200,255,0.35)"
          />
          {/* Engine intakes */}
          <ellipse cx="92" cy="178" rx="3" ry="6" fill="rgba(255,91,20,0.6)" />
          <ellipse cx="108" cy="178" rx="3" ry="6" fill="rgba(255,91,20,0.6)" />
        </svg>

        {/* Targeting reticle around the jet — corner brackets + rotating rings */}
        <div
          ref={reticleRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[3]"
          style={{
            width: 'clamp(440px, 50vw, 820px)',
            height: 'clamp(440px, 50vw, 820px)',
            transform: 'translate(-50%, -50%) scale(1)',
            willChange: 'transform, opacity',
          }}
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <path d="M 10 40 L 10 10 L 40 10" fill="none" stroke="rgba(255,91,20,0.85)" strokeWidth="1.4" />
            <path d="M 160 10 L 190 10 L 190 40" fill="none" stroke="rgba(255,91,20,0.85)" strokeWidth="1.4" />
            <path d="M 190 160 L 190 190 L 160 190" fill="none" stroke="rgba(255,91,20,0.85)" strokeWidth="1.4" />
            <path d="M 40 190 L 10 190 L 10 160" fill="none" stroke="rgba(255,91,20,0.85)" strokeWidth="1.4" />
            {/* Tick marks at cardinal points */}
            <line x1="100" y1="6" x2="100" y2="14" stroke="rgba(255,91,20,0.6)" strokeWidth="0.8" />
            <line x1="100" y1="186" x2="100" y2="194" stroke="rgba(255,91,20,0.6)" strokeWidth="0.8" />
            <line x1="6" y1="100" x2="14" y2="100" stroke="rgba(255,91,20,0.6)" strokeWidth="0.8" />
            <line x1="186" y1="100" x2="194" y2="100" stroke="rgba(255,91,20,0.6)" strokeWidth="0.8" />
          </svg>
          {/* Rotating outer ring */}
          <div
            className="absolute inset-[16%] rounded-full border border-[var(--mach)]/30"
            style={{ animation: 'spin-slow 32s linear infinite' }}
          />
          {/* Rotating inner ring (counter) */}
          <div
            className="absolute inset-[28%] rounded-full border border-dashed border-[var(--afterburn)]/35"
            style={{ animation: 'spin-rev-slow 22s linear infinite' }}
          />
        </div>

        {/* Runway perspective lines */}
        <div
          ref={runwayRef}
          className="pointer-events-none absolute inset-0 flex items-end justify-center"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          <svg viewBox="0 0 1200 600" className="w-full h-full">
            <defs>
              <linearGradient id="runway-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,210,140,0)" />
                <stop offset="60%" stopColor="rgba(255,210,140,0.4)" />
                <stop offset="100%" stopColor="rgba(255,210,140,0.95)" />
              </linearGradient>
            </defs>
            {Array.from({ length: RUNWAY_LINES }).map((_, i) => {
              const t = i / (RUNWAY_LINES - 1);
              const xLeft = 600 - (1 - t) * 30 - t * 580;
              const xRight = 600 + (1 - t) * 30 + t * 580;
              return (
                <line
                  key={i}
                  x1="600" y1="280"
                  x2={i % 2 === 0 ? xLeft : xRight} y2="600"
                  stroke="url(#runway-fade)"
                  strokeWidth={0.6 + t * 1.4}
                />
              );
            })}
            <line
              x1="600" y1="280" x2="600" y2="600"
              stroke="rgba(255,220,160,0.7)"
              strokeWidth="2"
              strokeDasharray="14 22"
            />
          </svg>
        </div>

        {/* Vertical climb streaks */}
        <div
          ref={streakRef}
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          {Array.from({ length: STREAKS }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px"
              style={{
                left: `${(i * 6.5 + 2) % 100}%`,
                top: '-15%',
                height: '130%',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.22), transparent)',
                animation: `ascent-streak ${1.6 + (i % 5) * 0.3}s linear infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>

        {/* Sonic boom flash */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: 0, mixBlendMode: 'screen', willChange: 'opacity' }}
        />

        {/* Mono tag — small label above the headline */}
        <div
          ref={tagRef}
          className="absolute top-[28%] left-1/2 -translate-x-1/2 z-[5] mono text-[10px] text-[var(--bone)]/55 tracking-[0.42em] flex items-center gap-4"
          style={{ opacity: 1, willChange: 'opacity' }}
        >
          <span className="h-px w-12 bg-[var(--bone)]/30" />
          <span ref={beatLabelRef}>CHAPTER I · OPEN</span>
          <span className="h-px w-12 bg-[var(--bone)]/30" />
        </div>

        {/* Headline beats — each is a multi-line block */}
        <div className="pointer-events-none absolute inset-0 px-8 z-[4]">
          {BEATS.map((b, i) => (
            <div
              key={b.id}
              ref={(el) => { beatRefs.current[i] = el; }}
              className="display absolute left-1/2 top-1/2 text-center text-[var(--bone)] select-none"
              style={{
                fontSize: 'clamp(3rem, 12vw, 12rem)',
                lineHeight: 0.85,
                letterSpacing: '-0.045em',
                transform: 'translate(-50%, -50%)',
                textShadow: '0 2px 22px rgba(0,0,0,0.7)',
                opacity: i === 0 ? 1 : 0,
                whiteSpace: 'nowrap',
                mixBlendMode: b.blend === 'difference' ? 'difference' : undefined,
                willChange: 'transform, opacity',
              }}
            >
              {b.lines.map((line, j) => (
                <div key={j} style={{ color: line.color }}>
                  {line.text}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mission tag (typewriter) — under the headline */}
        <div
          ref={subtitleRef}
          className="absolute top-[68%] left-1/2 -translate-x-1/2 z-[5] mono text-[10px] text-[var(--bone)]/70 tracking-[0.25em] h-4"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          {typed}
          <span
            className="inline-block h-3 w-[2px] bg-[var(--afterburn)] ml-1 align-middle"
            style={{ animation: 'hud-pulse 0.7s steps(2) infinite' }}
          />
        </div>

        {/* Speedo (bottom-left) — fades in once rolling */}
        <div
          ref={speedoRef}
          className="absolute bottom-[16%] left-[90px] z-10 mono text-[10px] w-[210px] space-y-2"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          <div className="flex items-center gap-2 text-[var(--afterburn)]">
            <span
              ref={phaseDotRef}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: '#fbbf24',
                animation: 'hud-pulse 1.1s ease-in-out infinite',
                boxShadow: '0 0 8px #fbbf24',
              }}
            />
            <span ref={phaseTextRef}>STANDBY</span>
          </div>
          <div>
            <div className="text-[var(--bone)]/40 text-[9px] mb-1">GROUND SPEED</div>
            <div className="text-[var(--bone)] text-2xl tabular-nums">
              <span ref={speedNumRef}>0000</span>
              <span className="text-[var(--bone)]/50 text-[10px] ml-2">KN</span>
            </div>
          </div>
        </div>

        {/* Altitude tape (right) */}
        <div
          ref={altTapeRef}
          className="absolute top-1/2 -translate-y-1/2 right-[90px] z-10 mono text-[10px] w-[120px]"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          <div className="text-right text-[var(--bone)]/40 text-[9px] mb-2">ALT (FT)</div>
          <div className="relative h-[260px] border-l border-white/15 pl-3">
            {[0, 10, 25, 40, 55, 62].map((alt, i) => (
              <div
                key={alt}
                className="absolute flex items-center gap-2"
                style={{ top: `${(i / 5) * 100}%`, transform: 'translateY(-50%)' }}
              >
                <div className="absolute -left-3 h-px w-2 bg-white/30" />
                <span className="tabular-nums text-[var(--bone)]/50">
                  {alt.toString().padStart(2, '0')},000
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right tabular-nums text-[var(--mach)] text-sm">
            <span ref={altNumRef}>000000</span>
          </div>
        </div>
      </div>
    </section>
  );
}
