'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA } from '@/lib/media';

type Part = {
  id: string;
  label: string;
  code: string;
  x: number;
  y: number;
  desc: string;
  specs: { k: string; v: string }[];
  image: string;
};

const PARTS: Part[] = [
  {
    id: 'nose',
    label: 'AESA RADAR',
    code: 'APG-77',
    x: 100, y: 18,
    desc:
      'An electronically-steered antenna with ~1,500 T/R modules. Scans multiple targets at mach-plus closure while remaining passive to hostile detection.',
    specs: [
      { k: 'RANGE', v: '220+ NM' },
      { k: 'MODES', v: 'A-A · A-G · EW · SAR' },
      { k: 'TRACKS', v: 'SIMUL 20+' },
      { k: 'LPI', v: 'LOW-PROBABILITY INTERCEPT' },
    ],
    image: MEDIA.jetD,
  },
  {
    id: 'cockpit',
    label: 'COCKPIT',
    code: 'HMDS-II',
    x: 100, y: 54,
    desc:
      'Single-seat, helmet-mounted display with look-through cueing. 360° sensor fusion presents threats as a unified symbology layer rather than raw sensor feeds.',
    specs: [
      { k: 'CREW', v: '1 PILOT' },
      { k: 'HUD', v: 'FULL-VIEW HMDS' },
      { k: 'G-TOL.', v: 'ANTI-G ON-DEMAND' },
      { k: 'EJECT', v: 'MK-16 ZERO/ZERO' },
    ],
    image: MEDIA.cockpit1,
  },
  {
    id: 'wing-left',
    label: 'PORT WING',
    code: 'ELX-14',
    x: 30, y: 175,
    desc:
      'Clipped-delta wing with leading-edge root extensions. Internal hardpoints preserve radar signature; external pylons swap in for non-contested roles.',
    specs: [
      { k: 'SPAN', v: '13.6 M' },
      { k: 'AREA', v: '78.0 M²' },
      { k: 'SWEEP', v: '42° LE' },
      { k: 'BAY', v: '4× INTERNAL' },
    ],
    image: MEDIA.jetE,
  },
  {
    id: 'wing-right',
    label: 'STARBOARD WING',
    code: 'ELX-14',
    x: 170, y: 175,
    desc:
      'Mirrored to port. Provides flight control via independent ailerons and flaperons. Onboard fuel tanks extend combat radius without drop tanks.',
    specs: [
      { k: 'FUEL INT.', v: '8,220 KG' },
      { k: 'PYLONS', v: '3 EXT · 4 INT' },
      { k: 'MAX ROLL', v: '220°/s' },
      { k: 'G RATING', v: '+9 / −3' },
    ],
    image: MEDIA.jetC,
  },
  {
    id: 'bay',
    label: 'WEAPONS BAY',
    code: 'BAY-01',
    x: 100, y: 155,
    desc:
      'Internal carriage preserves low observability. Primary bay holds AIM-260 or air-to-ground munitions; side bays host Sidewinders for within-visual-range engagements.',
    specs: [
      { k: 'PRIMARY', v: '6× AIM-260' },
      { k: 'SIDE (L)', v: '1× AIM-9X' },
      { k: 'SIDE (R)', v: '1× AIM-9X' },
      { k: 'SWAP', v: 'GBU-39 SDB CAPABLE' },
    ],
    image: MEDIA.jetF,
  },
  {
    id: 'engine',
    label: 'TWIN ENGINE',
    code: 'F119-100',
    x: 100, y: 278,
    desc:
      'Two afterburning turbofans with 2-dimensional thrust vectoring in the pitch axis. Delivers sustained supercruise without reheat and post-stall controllability.',
    specs: [
      { k: 'DRY', v: '104 kN EACH' },
      { k: 'A/B', v: '156 kN EACH' },
      { k: 'VECT.', v: '±20° PITCH' },
      { k: 'SUPERCRUISE', v: 'MACH 1.8' },
    ],
    image: MEDIA.afterburn,
  },
];

// Each part owns 1/N of the scroll. Visibility fades in/out around the center.
const N = PARTS.length;
const visFor = (i: number, p: number) => {
  const center = (i + 0.5) / N;
  const half = 0.5 / N;
  const d = Math.abs(p - center);
  if (d <= half * 0.6) return 1;
  if (d <= half * 1.4) return 1 - (d - half * 0.6) / (half * 0.8);
  return 0;
};
const indexFor = (p: number) => Math.min(N - 1, Math.max(0, Math.floor(p * N)));

export default function Anatomy() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterLabelRef = useRef<HTMLSpanElement>(null);
  const indexItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const indexBarRefs = useRef<Array<HTMLDivElement | null>>([]);
  const detailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hotspotInnerRefs = useRef<Array<SVGCircleElement | null>>([]);
  const hotspotOuterRefs = useRef<Array<SVGCircleElement | null>>([]);
  const hotspotLineRefs = useRef<Array<SVGLineElement | null>>([]);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        const active = indexFor(p);

        if (counterRef.current) {
          counterRef.current.textContent = String(active + 1).padStart(2, '0');
        }
        if (counterLabelRef.current) {
          counterLabelRef.current.textContent = PARTS[active].label;
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${p * 100}%`;
        }

        for (let i = 0; i < N; i++) {
          const v = visFor(i, p);
          // Detail panel
          const d = detailRefs.current[i];
          if (d) {
            d.style.opacity = String(v);
            d.style.transform = `translateY(${(1 - v) * 18}px)`;
            d.style.pointerEvents = v > 0.5 ? 'auto' : 'none';
          }
          // Index bar (left)
          const bar = indexBarRefs.current[i];
          if (bar) bar.style.width = `${4 + v * 56}px`;
          const item = indexItemRefs.current[i];
          if (item) {
            item.style.color = v > 0.5 ? 'var(--bone)' : 'rgba(238,240,243,0.35)';
            item.style.opacity = String(0.55 + v * 0.45);
          }
          // Hotspots on diagram
          const ho = hotspotOuterRefs.current[i];
          const hi = hotspotInnerRefs.current[i];
          const hl = hotspotLineRefs.current[i];
          const hLabel = labelRefs.current[i];
          if (ho) {
            ho.setAttribute('r', String(5 + v * 9));
            ho.setAttribute('opacity', String(0.25 + v * 0.7));
            ho.setAttribute('stroke', v > 0.5 ? 'var(--afterburn)' : 'var(--mach)');
          }
          if (hi) {
            hi.setAttribute('r', String(1.6 + v * 1.4));
            hi.setAttribute('fill', v > 0.5 ? 'var(--afterburn)' : 'var(--mach)');
          }
          if (hl) {
            hl.setAttribute('opacity', String(0.2 + v * 0.6));
            hl.setAttribute('stroke', v > 0.5 ? 'var(--afterburn)' : 'var(--mach)');
          }
          if (hLabel) {
            hLabel.style.color = v > 0.5 ? 'var(--afterburn)' : 'rgba(238,240,243,0.55)';
            hLabel.style.opacity = String(0.5 + v * 0.5);
          }
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anatomy"
      className="relative w-full"
      style={{ height: `${N * 100}vh` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Subtle hairline grid — blueprint vibe, very low intensity */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(94,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(94,200,255,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          }}
        />

        {/* Section header — top bar */}
        <div className="absolute top-[6%] left-[90px] right-[90px] z-10 flex items-center gap-6 mono text-[10px] text-[var(--bone)]/55">
          <span className="h-px w-10 bg-[var(--bone)]/30" />
          <span>V — ANATOMY</span>
          <span className="text-[var(--mach)]">SCROLL TO EXAMINE</span>
          <span className="h-px flex-1 bg-[var(--bone)]/10" />
          <span className="tabular-nums text-[var(--afterburn)] text-[12px]">
            <span ref={counterRef}>01</span>
            <span className="text-[var(--bone)]/30"> / {String(N).padStart(2, '0')}</span>
          </span>
          <span className="text-[var(--bone)]/65" ref={counterLabelRef}>{PARTS[0].label}</span>
        </div>

        {/* Bottom progress bar through the systems */}
        <div className="absolute bottom-[5%] left-[90px] right-[90px] z-10 flex items-center gap-3 mono text-[9px] text-[var(--bone)]/45">
          <span>SYS 01</span>
          <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0"
              style={{
                width: '0%',
                background: 'linear-gradient(90deg, var(--mach), var(--afterburn))',
              }}
            />
          </div>
          <span>SYS {String(N).padStart(2, '0')}</span>
        </div>

        {/* Three-column body */}
        <div className="absolute inset-0 grid grid-cols-[1fr_1.4fr_1.2fr] gap-10 items-center px-[90px]">
          {/* LEFT: System index */}
          <div className="space-y-3">
            <div className="mono text-[9px] text-[var(--bone)]/40 mb-4">SYSTEM INDEX</div>
            {PARTS.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => { indexItemRefs.current[i] = el; }}
                className="flex items-center gap-3 mono text-[10px] py-1.5"
                style={{ color: 'rgba(238,240,243,0.35)', opacity: 0.55 }}
              >
                <span className="tabular-nums text-[9px] w-7 text-[var(--bone)]/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  ref={(el) => { indexBarRefs.current[i] = el; }}
                  className="h-px bg-[var(--afterburn)]"
                  style={{ width: '4px', willChange: 'width' }}
                />
                <div className="flex-1">
                  <div className="tracking-[0.18em]">{p.label}</div>
                  <div className="text-[8px] text-[var(--bone)]/35 mt-0.5">{p.code}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CENTER: Airframe diagram */}
          <div className="relative aspect-[2/3] w-full max-h-[78vh] mx-auto">
            <div
              className="absolute inset-[-10%] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(94,200,255,0.18) 0%, transparent 60%)',
                filter: 'blur(20px)',
              }}
            />
            <svg viewBox="0 0 200 300" className="relative w-full h-full">
              <defs>
                <linearGradient id="anat-body" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1d222b" />
                  <stop offset="50%" stopColor="#0d1015" />
                  <stop offset="100%" stopColor="#05070a" />
                </linearGradient>
              </defs>

              <path
                d="M 100 4
                   L 108 38 L 115 70 L 135 130 L 190 235 L 190 248
                   L 125 220 L 128 272 L 142 288 L 142 294
                   L 100 278 L 58 294 L 58 288 L 72 272 L 75 220
                   L 10 248 L 10 235 L 65 130 L 85 70 L 92 38 Z"
                fill="url(#anat-body)"
                stroke="rgba(94,200,255,0.3)"
                strokeWidth="0.5"
              />
              <path d="M 100 32 L 105 56 L 100 78 L 95 56 Z" fill="rgba(94,200,255,0.25)" />
              <line x1="100" y1="4" x2="100" y2="278" stroke="rgba(94,200,255,0.15)" strokeDasharray="2 2" strokeWidth="0.4" />

              <g fontSize="3.2" fill="rgba(94,200,255,0.45)">
                <line x1="3" y1="4" x2="3" y2="278" stroke="rgba(94,200,255,0.2)" strokeWidth="0.3" />
                <text x="4.5" y="12">0.0</text>
                <text x="4.5" y="100">5.2M</text>
                <text x="4.5" y="200">12.8M</text>
                <text x="4.5" y="275">19.7M</text>
              </g>

              {PARTS.map((p, i) => (
                <g key={p.id}>
                  <circle
                    ref={(el) => { hotspotOuterRefs.current[i] = el; }}
                    cx={p.x} cy={p.y} r={5}
                    fill="none"
                    stroke="var(--mach)"
                    strokeWidth="0.8"
                    opacity={0.25}
                  />
                  <circle
                    ref={(el) => { hotspotInnerRefs.current[i] = el; }}
                    cx={p.x} cy={p.y} r={1.6}
                    fill="var(--mach)"
                  />
                  <line
                    ref={(el) => { hotspotLineRefs.current[i] = el; }}
                    x1={p.x} y1={p.y}
                    x2={p.x > 100 ? p.x + 22 : p.x - 22} y2={p.y}
                    stroke="var(--mach)"
                    strokeWidth="0.5"
                    strokeDasharray="1 1"
                    opacity={0.2}
                  />
                </g>
              ))}
            </svg>

            {PARTS.map((p, i) => {
              const leftSide = p.x < 100;
              return (
                <div
                  key={p.id}
                  ref={(el) => { labelRefs.current[i] = el; }}
                  className="absolute mono text-[9px] pointer-events-none"
                  style={{
                    left: `${leftSide ? (p.x / 200) * 100 - 12 : (p.x / 200) * 100 + 4}%`,
                    top: `${(p.y / 300) * 100 - 1}%`,
                    color: 'rgba(238,240,243,0.55)',
                    textAlign: leftSide ? 'right' : 'left',
                    opacity: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div className="leading-tight">{p.label}</div>
                  <div className="opacity-50 text-[8px]">{p.code}</div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Detail panels (cross-faded) */}
          <div className="relative h-[78vh]">
            {PARTS.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => { detailRefs.current[i] = el; }}
                className="absolute inset-0 space-y-5"
                style={{
                  opacity: 0,
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  className="w-full aspect-[4/3] bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${p.image})`,
                    border: '1px solid rgba(255,91,20,0.3)',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
                    }}
                  />
                  <div className="absolute top-3 left-3 mono text-[9px] text-[var(--afterburn)] flex items-center gap-2">
                    <span
                      className="h-1 w-1 rounded-full bg-[var(--afterburn)]"
                      style={{ animation: 'hud-pulse 0.9s ease-in-out infinite' }}
                    />
                    LIVE FEED
                  </div>
                  <div className="absolute bottom-3 right-3 mono text-[9px] text-[var(--bone)]/55">
                    {p.code}
                  </div>
                  <div className="absolute top-2 left-2 h-3 w-3 border-l border-t border-[var(--afterburn)]/60" />
                  <div className="absolute top-2 right-2 h-3 w-3 border-r border-t border-[var(--afterburn)]/60" />
                  <div className="absolute bottom-2 left-2 h-3 w-3 border-l border-b border-[var(--afterburn)]/60" />
                  <div className="absolute bottom-2 right-2 h-3 w-3 border-r border-b border-[var(--afterburn)]/60" />
                </div>

                <div>
                  <div
                    className="display text-[var(--bone)]"
                    style={{ fontSize: '2.2rem', lineHeight: 1 }}
                  >
                    {p.label}
                  </div>
                  <div className="mono text-[10px] text-[var(--bone)]/55 mt-2 tracking-[0.25em]">
                    {p.code}
                  </div>
                </div>

                <p className="text-[var(--bone)]/75 text-[13px] leading-relaxed">{p.desc}</p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  {p.specs.map((s) => (
                    <div key={s.k}>
                      <div className="mono text-[9px] text-[var(--bone)]/45">{s.k}</div>
                      <div className="mono text-[11px] text-[var(--bone)] mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
