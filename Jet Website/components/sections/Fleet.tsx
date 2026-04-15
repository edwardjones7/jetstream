'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA } from '@/lib/media';

const JETS = [
  {
    name: 'RAVEN-VII',
    verb: 'HUNTS.',
    role: 'AIR DOMINANCE / DEEP STRIKE',
    spec: 'MACH 2.8 · 62,000 FT · STEALTH',
    tint: '#ff5b14',
    img: MEDIA.hero,
    details: {
      crew: '1',
      length: '19.7 m',
      wingspan: '13.6 m',
      height: '5.1 m',
      empty: '19,700 kg',
      max: '38,000 kg',
      powerplant: '2× PW F-119-PW-100',
      thrust: '156 kN w/ A/B',
      radar: 'AN/APG-77 AESA',
      ferry: '3,000 km',
      introduced: '2005',
      units: '195 BUILT',
    },
    arm: ['6× AIM-120D AMRAAM', '2× AIM-9X SIDEWINDER', '8× GBU-39 SDB'],
  },
  {
    name: 'KESTREL',
    verb: 'WAITS.',
    role: 'MULTIROLE / EW',
    spec: 'MACH 2.2 · 55,000 FT · AIR SUP.',
    tint: '#5ec8ff',
    img: MEDIA.jetA,
    details: {
      crew: '1',
      length: '15.6 m',
      wingspan: '10.7 m',
      height: '4.6 m',
      empty: '13,290 kg',
      max: '31,750 kg',
      powerplant: '1× F-135-PW-100',
      thrust: '191 kN w/ A/B',
      radar: 'AN/APG-81 AESA',
      ferry: '2,200 km',
      introduced: '2015',
      units: '980 BUILT',
    },
    arm: ['4× AIM-260 JATM', '2× AIM-9X', '2× JSOW-C', '1× B-61-12'],
  },
  {
    name: 'APEX',
    verb: 'DECIDES.',
    role: 'PROTOTYPE / NGAD',
    spec: 'MACH 3.0+ · 70,000 FT · CLASSIFIED',
    tint: '#eef0f3',
    img: MEDIA.jetB,
    details: {
      crew: '1 · OPT UNMANNED',
      length: '22.3 m',
      wingspan: 'CLASSIFIED',
      height: '5.0 m',
      empty: 'CLASSIFIED',
      max: 'CLASSIFIED',
      powerplant: '2× ADAPTIVE CYCLE',
      thrust: '200+ kN w/ A/B',
      radar: 'DUAL-BAND AESA',
      ferry: '4,800 km',
      introduced: '2029 (proj.)',
      units: '07 PROTOTYPES',
    },
    arm: ['DIRECTED ENERGY', 'AIM-260 JATM', 'AARGM-ER', 'UAS SWARM CTRL'],
  },
];

export default function Fleet() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalWidth = track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalWidth + window.innerHeight * 0.8}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 mono text-[10px] text-[var(--bone)]/50 flex items-center gap-4">
        <span className="h-px w-10 bg-[var(--bone)]/30" />
        <span>IV — THE FLEET / 03 UNITS</span>
        <span className="h-px w-10 bg-[var(--bone)]/30" />
      </div>

      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex items-stretch"
        style={{ willChange: 'transform' }}
      >
        <div className="shrink-0 w-[20vw]" />

        {JETS.map((jet, i) => (
          <article
            key={jet.name}
            className="shrink-0 w-[100vw] h-full relative flex items-center"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${jet.img})`,
                filter: 'brightness(0.35) saturate(0.9) contrast(1.15)',
              }}
            />
            {/* Tint overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${jet.tint}18 0%, transparent 60%), linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.7) 100%)`,
              }}
            />

            <div className="relative w-full h-full flex items-center px-[8vw]">
              {/* LEFT: Spec table */}
              <div className="w-[26%] space-y-5 mono text-[10px] text-[var(--bone)]/80">
                <div>
                  <div className="flex items-center gap-2 text-[9px] text-[var(--bone)]/40 mb-2">
                    <span className="h-px w-6" style={{ background: jet.tint }} />
                    UNIT {String(i + 1).padStart(2, '0')} / 03
                  </div>
                  <div style={{ color: jet.tint }} className="text-[10px]">{jet.role}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">DIMENSIONS</div>
                  {[
                    ['LENGTH', jet.details.length],
                    ['WINGSPAN', jet.details.wingspan],
                    ['HEIGHT', jet.details.height],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[var(--bone)]/40">{k}</span>
                      <span className="tabular-nums">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">MASS</div>
                  {[
                    ['EMPTY', jet.details.empty],
                    ['MAX TAKEOFF', jet.details.max],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[var(--bone)]/40">{k}</span>
                      <span className="tabular-nums">{v}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">INTRODUCED</div>
                  <div className="tabular-nums">{jet.details.introduced} · {jet.details.units}</div>
                </div>
              </div>

              {/* CENTER: Name + photo */}
              <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
                <div
                  className="display text-[var(--bone)] text-center relative z-10"
                  style={{
                    fontSize: 'clamp(3rem, 9vw, 9rem)',
                    lineHeight: 0.9,
                    textShadow: '0 4px 60px rgba(0,0,0,0.8)',
                  }}
                >
                  {jet.name}
                </div>
                <div
                  className="display relative z-10 -mt-2"
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 5rem)',
                    color: jet.tint,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {jet.verb}
                </div>
                <div className="mono text-[10px] mt-4 text-[var(--bone)]/50 tracking-[0.3em] relative z-10">
                  {jet.spec}
                </div>

                {/* Dimensions line diagram */}
                <div className="mt-10 w-full max-w-md relative z-10">
                  <svg viewBox="0 0 400 140" className="w-full h-auto">
                    <defs>
                      <marker id={`arr-${i}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M 0 0 L 6 3 L 0 6 Z" fill={jet.tint} opacity="0.6" />
                      </marker>
                    </defs>
                    <line x1="20" y1="70" x2="380" y2="70" stroke={jet.tint} strokeWidth="0.6" opacity="0.3"
                          markerEnd={`url(#arr-${i})`} markerStart={`url(#arr-${i})`} />
                    <text x="200" y="64" textAnchor="middle" fontSize="9" fill="rgba(238,240,243,0.7)" className="mono">{jet.details.length}</text>

                    <line x1="200" y1="20" x2="200" y2="120" stroke={jet.tint} strokeWidth="0.6" opacity="0.3"
                          markerEnd={`url(#arr-${i})`} markerStart={`url(#arr-${i})`} />
                    <text x="210" y="72" fontSize="9" fill="rgba(238,240,243,0.7)" className="mono">{jet.details.wingspan}</text>

                    {/* Tick marks */}
                    <line x1="20" y1="66" x2="20" y2="74" stroke={jet.tint} opacity="0.4" />
                    <line x1="380" y1="66" x2="380" y2="74" stroke={jet.tint} opacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* RIGHT: Systems + armament */}
              <div className="w-[26%] space-y-5 mono text-[10px] text-[var(--bone)]/80 text-right">
                <div>
                  <div className="flex items-center gap-2 text-[9px] text-[var(--bone)]/40 mb-2 justify-end">
                    SYSTEMS
                    <span className="h-px w-6" style={{ background: jet.tint }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">PROPULSION</div>
                  <div>{jet.details.powerplant}</div>
                  <div className="text-[var(--afterburn)] tabular-nums">{jet.details.thrust}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">RADAR</div>
                  <div className="text-[var(--mach)]">{jet.details.radar}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">RANGE</div>
                  <div className="tabular-nums">{jet.details.ferry}</div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="text-[9px] text-[var(--bone)]/40 mb-1">ARMAMENT</div>
                  {jet.arm.map((a) => (
                    <div key={a} className="text-[10px]">{a}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Corner frame */}
            <div className="absolute top-[10%] left-[6%] h-4 w-4 border-l border-t" style={{ borderColor: jet.tint, opacity: 0.5 }} />
            <div className="absolute top-[10%] right-[6%] h-4 w-4 border-r border-t" style={{ borderColor: jet.tint, opacity: 0.5 }} />
            <div className="absolute bottom-[10%] left-[6%] h-4 w-4 border-l border-b" style={{ borderColor: jet.tint, opacity: 0.5 }} />
            <div className="absolute bottom-[10%] right-[6%] h-4 w-4 border-r border-b" style={{ borderColor: jet.tint, opacity: 0.5 }} />

            {/* Unit index bottom-center */}
            <div
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 display select-none pointer-events-none"
              style={{
                fontSize: 'clamp(5rem, 18vw, 18rem)',
                color: 'transparent',
                WebkitTextStroke: `1px ${jet.tint}30`,
                opacity: 0.4,
                zIndex: 1,
                lineHeight: 1,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
          </article>
        ))}

        <div className="shrink-0 w-[20vw]" />
      </div>
    </section>
  );
}
