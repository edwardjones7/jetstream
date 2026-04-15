'use client';

import { useState } from 'react';
import { MEDIA } from '@/lib/media';

type Part = {
  id: string;
  label: string;
  code: string;
  // hotspot coordinates over the SVG viewBox 0 0 200 300
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

export default function Anatomy() {
  const [active, setActive] = useState<string | null>(null);
  const activePart = PARTS.find((p) => p.id === active) ?? null;

  return (
    <section
      id="anatomy"
      className="relative min-h-screen w-full overflow-hidden py-32"
      style={{
        background:
          'linear-gradient(to bottom, #020306 0%, #050810 40%, #030508 100%)',
      }}
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(94,200,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(94,200,255,0.2) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* Section heading */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-[90px] mb-16">
        <div className="mono text-[10px] text-[var(--bone)]/40 flex items-center gap-4 mb-6">
          <span className="h-px w-10 bg-[var(--bone)]/30" />
          <span>V — ANATOMY / INTERACTIVE</span>
          <span className="h-px flex-1 bg-[var(--bone)]/10" />
          <span className="text-[var(--mach)]">CLICK A SYSTEM →</span>
        </div>
        <h2
          className="display text-[var(--bone)]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', lineHeight: 0.9 }}
        >
          EVERY <span style={{ color: 'var(--afterburn)' }}>BOLT.</span><br />
          EVERY <span style={{ color: 'var(--mach)' }}>DECISION.</span>
        </h2>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-[90px] grid grid-cols-[1fr_1.4fr_1fr] gap-10 items-start">
        {/* LEFT: Part list */}
        <div className="space-y-2">
          <div className="mono text-[9px] text-[var(--bone)]/40 mb-4">SYSTEM INDEX</div>
          {PARTS.map((p, i) => {
            const isActive = active === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActive(isActive ? null : p.id)}
                className="w-full text-left group flex items-center gap-3 py-3 border-b border-white/5 transition-all"
                style={{
                  background: isActive ? 'rgba(255,91,20,0.08)' : 'transparent',
                  paddingLeft: isActive ? '12px' : '0px',
                  borderColor: isActive ? 'var(--afterburn)' : 'rgba(255,255,255,0.05)',
                }}
              >
                <span
                  className="mono text-[9px] tabular-nums w-8"
                  style={{ color: isActive ? 'var(--afterburn)' : 'rgba(238,240,243,0.3)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="mono text-[10px] tracking-[0.2em]"
                       style={{ color: isActive ? 'var(--bone)' : 'rgba(238,240,243,0.6)' }}>
                    {p.label}
                  </div>
                  <div className="mono text-[9px] text-[var(--bone)]/40 mt-0.5">{p.code}</div>
                </div>
                <span
                  className="mono text-[10px] transition-transform"
                  style={{
                    color: isActive ? 'var(--afterburn)' : 'rgba(238,240,243,0.3)',
                    transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                  }}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* CENTER: Diagram with hotspots */}
        <div className="relative aspect-[2/3] w-full">
          {/* Halo */}
          <div
            className="absolute inset-[-10%] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(94,200,255,0.15) 0%, transparent 60%)',
              filter: 'blur(20px)',
            }}
          />

          <svg
            viewBox="0 0 200 300"
            className="relative w-full h-full"
          >
            <defs>
              <linearGradient id="anat-body" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1d222b" />
                <stop offset="50%" stopColor="#0d1015" />
                <stop offset="100%" stopColor="#05070a" />
              </linearGradient>
            </defs>

            {/* Airframe */}
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

            {/* Cockpit */}
            <path d="M 100 32 L 105 56 L 100 78 L 95 56 Z" fill="rgba(94,200,255,0.25)" />

            {/* Centerline */}
            <line x1="100" y1="4" x2="100" y2="278" stroke="rgba(94,200,255,0.15)" strokeDasharray="2 2" strokeWidth="0.4" />

            {/* Dimension ticks */}
            <g className="mono" fontSize="3.2" fill="rgba(94,200,255,0.45)">
              <line x1="3" y1="4" x2="3" y2="278" stroke="rgba(94,200,255,0.2)" strokeWidth="0.3" />
              <text x="4.5" y="12">0.0</text>
              <text x="4.5" y="100">5.2M</text>
              <text x="4.5" y="200">12.8M</text>
              <text x="4.5" y="275">19.7M</text>
            </g>

            {/* Hotspots */}
            {PARTS.map((p) => {
              const isActive = active === p.id;
              return (
                <g
                  key={p.id}
                  onClick={() => setActive(isActive ? null : p.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse ring */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 12 : 6}
                    fill="none"
                    stroke={isActive ? 'var(--afterburn)' : 'var(--mach)'}
                    strokeWidth="0.8"
                    opacity={isActive ? 0.8 : 0.5}
                  >
                    {!isActive && (
                      <animate attributeName="r" values="6;10;6" dur="2.4s" repeatCount="indefinite" />
                    )}
                    {!isActive && (
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
                    )}
                  </circle>
                  {/* Inner dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="2.2"
                    fill={isActive ? 'var(--afterburn)' : 'var(--mach)'}
                  />
                  {/* Connector line + label */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x > 100 ? p.x + 22 : p.x - 22}
                    y2={p.y}
                    stroke={isActive ? 'var(--afterburn)' : 'rgba(94,200,255,0.4)'}
                    strokeWidth="0.5"
                    strokeDasharray="1 1"
                  />
                </g>
              );
            })}
          </svg>

          {/* Hovering labels — absolutely over SVG */}
          {PARTS.map((p) => {
            const isActive = active === p.id;
            const leftSide = p.x < 100;
            return (
              <div
                key={p.id}
                className="absolute mono text-[9px] pointer-events-none transition-opacity"
                style={{
                  left: `${leftSide ? (p.x / 200) * 100 - 8 : (p.x / 200) * 100 + 4}%`,
                  top: `${(p.y / 300) * 100 - 1}%`,
                  color: isActive ? 'var(--afterburn)' : 'rgba(238,240,243,0.7)',
                  textAlign: leftSide ? 'right' : 'left',
                  opacity: isActive ? 1 : 0.75,
                  whiteSpace: 'nowrap',
                }}
              >
                <div className="leading-tight">{p.label}</div>
                <div className="opacity-50 text-[8px]">{p.code}</div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Active part detail */}
        <div className="sticky top-24">
          <div className="mono text-[9px] text-[var(--bone)]/40 mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[var(--afterburn)]" style={{ animation: 'hud-pulse 1s ease-in-out infinite' }} />
            {activePart ? 'SYSTEM DETAIL' : 'AWAITING SELECTION'}
          </div>

          {activePart ? (
            <div key={activePart.id} className="space-y-5" style={{ animation: 'fadein 0.4s ease-out' }}>
              {/* Image */}
              <div
                className="w-full aspect-[4/3] bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url(${activePart.image})`,
                  border: '1px solid rgba(255,91,20,0.3)',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)' }} />
                <div className="absolute top-3 left-3 mono text-[9px] text-[var(--afterburn)] flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[var(--afterburn)]" style={{ animation: 'hud-pulse 0.9s ease-in-out infinite' }} />
                  LIVE FEED
                </div>
                <div className="absolute bottom-3 right-3 mono text-[9px] text-[var(--bone)]/50">{activePart.code}</div>
                {/* Corner ticks on image */}
                <div className="absolute top-2 left-2 h-3 w-3 border-l border-t border-[var(--afterburn)]/60" />
                <div className="absolute top-2 right-2 h-3 w-3 border-r border-t border-[var(--afterburn)]/60" />
                <div className="absolute bottom-2 left-2 h-3 w-3 border-l border-b border-[var(--afterburn)]/60" />
                <div className="absolute bottom-2 right-2 h-3 w-3 border-r border-b border-[var(--afterburn)]/60" />
              </div>

              {/* Title */}
              <div>
                <div
                  className="display text-[var(--bone)]"
                  style={{ fontSize: '2.2rem', lineHeight: 1 }}
                >
                  {activePart.label}
                </div>
                <div className="mono text-[10px] text-[var(--bone)]/50 mt-2 tracking-[0.25em]">
                  {activePart.code}
                </div>
              </div>

              {/* Description */}
              <p className="text-[var(--bone)]/70 text-[13px] leading-relaxed">
                {activePart.desc}
              </p>

              {/* Specs table */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                {activePart.specs.map((s) => (
                  <div key={s.k}>
                    <div className="mono text-[9px] text-[var(--bone)]/40">{s.k}</div>
                    <div className="mono text-[11px] text-[var(--bone)] mt-1">{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button className="mono text-[9px] px-4 py-2.5 border border-[var(--afterburn)]/50 text-[var(--afterburn)] hover:bg-[var(--afterburn)] hover:text-black transition-all">
                  TECHNICAL SHEET →
                </button>
                <button
                  onClick={() => setActive(null)}
                  className="mono text-[9px] px-4 py-2.5 border border-white/10 text-[var(--bone)]/60 hover:border-white/30 hover:text-[var(--bone)] transition-all"
                >
                  DESELECT
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="display text-[var(--bone)]/40"
                style={{ fontSize: '2.2rem', lineHeight: 1 }}
              >
                SELECT <span style={{ color: 'var(--mach)' }}>A SYSTEM</span>
              </div>
              <p className="text-[var(--bone)]/50 text-[13px] leading-relaxed">
                Click any hotspot on the airframe — or choose from the index on
                the left. Each module is a miniature engineering briefing, from
                the AESA nose cone to the twin-vectored exhaust.
              </p>
              <div className="mono text-[9px] text-[var(--bone)]/40 pt-4 border-t border-white/5">
                06 SYSTEMS · 04 FLIGHT REGIMES · 01 AIRFRAME
              </div>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
