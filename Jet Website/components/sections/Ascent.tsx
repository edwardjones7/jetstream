'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Ascent() {
  const sectionRef = useRef<HTMLElement>(null);
  const altitudeMarkersRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const markers = altitudeMarkersRef.current?.querySelectorAll('[data-alt]') ?? [];
    const triggers: ScrollTrigger[] = [];
    markers.forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 1,
          },
        }
      );
      const st = tween.scrollTrigger;
      if (st) triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ascent"
      className="relative h-[240vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Vertical motion streaks — sense of climb against the global sky */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px"
              style={{
                left: `${(i * 5.5 + 2) % 100}%`,
                top: '-15%',
                height: '130%',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.18), transparent)',
                animation: `ascent-streak ${2 + (i % 5) * 0.3}s linear infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>

        {/* Center headline */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 px-8">
          <h2
            className="display text-center text-[var(--bone)]"
            style={{
              fontSize: 'clamp(2.5rem, 9vw, 9rem)',
              lineHeight: 0.88,
              mixBlendMode: 'difference',
              textShadow: '0 4px 40px rgba(0,0,0,0.6)',
            }}
          >
            RISE<br />THROUGH<br />EVERYTHING
          </h2>
        </div>

        {/* Radar sweep — bottom right */}
        <div className="absolute bottom-24 right-[90px] z-10 w-[180px] h-[180px] mono text-[9px]">
          <div className="mb-2 text-[var(--bone)]/60 flex justify-between">
            <span>NAV / TERRAIN</span>
            <span className="text-[var(--mach)]">ACT</span>
          </div>
          <div
            className="relative w-full h-[150px] rounded-full border border-[var(--mach)]/30 overflow-hidden"
            style={{ background: 'radial-gradient(circle, rgba(94,200,255,0.08) 0%, rgba(0,0,0,0.55) 100%)' }}
          >
            <svg ref={radarRef} viewBox="0 0 150 150" className="absolute inset-0 w-full h-full">
              <circle cx="75" cy="75" r="60" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.5" />
              <circle cx="75" cy="75" r="40" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.5" />
              <circle cx="75" cy="75" r="20" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.5" />
              <line x1="15" y1="75" x2="135" y2="75" stroke="rgba(94,200,255,0.15)" strokeWidth="0.5" />
              <line x1="75" y1="15" x2="75" y2="135" stroke="rgba(94,200,255,0.15)" strokeWidth="0.5" />
              <g style={{ transformOrigin: '75px 75px', animation: 'radar-sweep 3.5s linear infinite' }}>
                <path d="M 75 75 L 75 15 A 60 60 0 0 1 131 46 Z" fill="url(#sweep-grad)" />
                <defs>
                  <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(94,200,255,0)" />
                    <stop offset="100%" stopColor="rgba(94,200,255,0.5)" />
                  </linearGradient>
                </defs>
              </g>
              <circle cx="95" cy="48" r="2" fill="var(--afterburn)">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="52" cy="98" r="1.5" fill="var(--mach)">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle cx="104" cy="110" r="1.2" fill="var(--bone)">
                <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className="mt-2 text-[var(--bone)]/40 text-right">3 CONTACTS · 80 NM</div>
        </div>

        {/* Climb profile — left */}
        <div className="absolute top-[20%] left-[90px] z-10 mono text-[9px] text-[var(--bone)]/60 w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-1 rounded-full bg-[var(--mach)]" style={{ animation: 'hud-pulse 1.2s ease-in-out infinite' }} />
            CLIMB PROFILE
          </div>
          <svg viewBox="0 0 200 90" className="w-full">
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2="200" y1={22 * i + 4} y2={22 * i + 4} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
            <path d="M 0 85 Q 40 80 70 55 T 200 8" fill="none" stroke="var(--mach)" strokeWidth="1.2" />
            <path d="M 0 85 Q 40 80 70 55 T 200 8 L 200 90 L 0 90 Z" fill="rgba(94,200,255,0.12)" />
            <circle cx="120" cy="26" r="3" fill="var(--mach)">
              <animate attributeName="r" values="3;5;3" dur="1.4s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div className="mt-2 flex justify-between">
            <span>V/S +18,400 FPM</span>
            <span>AoA 14.2°</span>
          </div>
        </div>
      </div>

      {/* Altitude markers in the scroll */}
      <div ref={altitudeMarkersRef} className="pointer-events-none absolute inset-0">
        {[
          { alt: '10,000 FT', top: '50%', label: 'CLOUD LINE', sub: '18°C / 12,400 LBS' },
          { alt: '25,000 FT', top: '100%', label: 'CRUISE', sub: '−34°C / 9,200 LBS' },
          { alt: '51,000 FT', top: '150%', label: 'SERVICE CEILING', sub: '−56°C / 5,800 LBS' },
          { alt: '62,000 FT', top: '195%', label: 'COFFIN CORNER', sub: 'MACH 2.2 @ AoA 2°' },
        ].map((m) => (
          <div
            key={m.alt}
            data-alt
            className="absolute mono text-[11px] flex items-center gap-4"
            style={{ top: m.top, left: '8%' }}
          >
            <div className="h-px w-20" style={{ background: 'var(--mach)', opacity: 0.7 }} />
            <div>
              <div className="tabular-nums text-[var(--bone)] text-lg">{m.alt}</div>
              <div className="text-[var(--mach)]/80 text-[9px] mt-1">{m.label}</div>
              <div className="text-[var(--bone)]/40 text-[9px]">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
