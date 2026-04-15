'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA } from '@/lib/media';

const LAYERS = [
  { depth: 0.12, opacity: 0.6, top: -10, img: MEDIA.clouds3 },
  { depth: 0.28, opacity: 0.7, top: 15, img: MEDIA.clouds1 },
  { depth: 0.5, opacity: 0.85, top: 50, img: MEDIA.clouds2 },
  { depth: 0.72, opacity: 0.95, top: 80, img: MEDIA.clouds1 },
];

export default function Ascent() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const altitudeMarkersRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        layerRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = LAYERS[i].depth;
          el.style.transform = `translate3d(0, ${-p * d * 1600}px, 0) scale(${1 + p * 0.4})`;
          el.style.opacity = String(LAYERS[i].opacity * (1 - p * 0.7));
        });
        if (bgRef.current) {
          const r = Math.floor(5 + p * 8);
          const g = Math.floor(10 + p * 18);
          const b = Math.floor(22 + p * 60);
          bgRef.current.style.background = `linear-gradient(to bottom, rgb(${r},${g},${b}) 0%, rgb(${Math.floor(r*0.4)},${Math.floor(g*0.4)},${Math.floor(b*0.4)}) 100%)`;
        }
      },
    });

    const markers = altitudeMarkersRef.current?.querySelectorAll('[data-alt]') ?? [];
    markers.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: 1 },
        }
      );
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ascent"
      className="relative h-[240vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Sky color base */}
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, #050810 0%, #020306 100%)' }}
        />

        {/* Cloud layers from real photos */}
        {LAYERS.map((layer, i) => (
          <div
            key={i}
            ref={(el) => { layerRefs.current[i] = el; }}
            className="pointer-events-none absolute left-[-5%] right-[-5%]"
            style={{
              top: `${layer.top}%`,
              height: '55vh',
              backgroundImage: `url(${layer.img})`,
              backgroundSize: 'cover',
              backgroundPosition: `center ${i * 20}%`,
              opacity: layer.opacity,
              mixBlendMode: 'screen',
              filter: `blur(${i * 1.5 + 1}px) brightness(${0.8 - i * 0.1})`,
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
              willChange: 'transform, opacity',
            }}
          />
        ))}

        {/* Vertical motion streaks */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px"
              style={{
                left: `${(i * 4.5 + 2) % 100}%`,
                top: '-15%',
                height: '130%',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)',
                animation: `ascent-streak ${2 + (i % 5) * 0.3}s linear infinite`,
                animationDelay: `${i * 0.15}s`,
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
            RISE<br/>THROUGH<br/>EVERYTHING
          </h2>
        </div>

        {/* Radar sweep - bottom right */}
        <div className="absolute bottom-24 right-[90px] z-10 w-[180px] h-[180px] mono text-[9px]">
          <div className="mb-2 text-[var(--bone)]/60 flex justify-between">
            <span>NAV / TERRAIN</span>
            <span className="text-[var(--mach)]">ACT</span>
          </div>
          <div className="relative w-full h-[150px] rounded-full border border-[var(--mach)]/30 overflow-hidden" style={{ background: 'radial-gradient(circle, rgba(94,200,255,0.08) 0%, rgba(0,0,0,0.7) 100%)' }}>
            <svg ref={radarRef} viewBox="0 0 150 150" className="absolute inset-0 w-full h-full">
              <circle cx="75" cy="75" r="60" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.5" />
              <circle cx="75" cy="75" r="40" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.5" />
              <circle cx="75" cy="75" r="20" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.5" />
              <line x1="15" y1="75" x2="135" y2="75" stroke="rgba(94,200,255,0.15)" strokeWidth="0.5" />
              <line x1="75" y1="15" x2="75" y2="135" stroke="rgba(94,200,255,0.15)" strokeWidth="0.5" />
              {/* Sweep */}
              <g style={{ transformOrigin: '75px 75px', animation: 'radar-sweep 3.5s linear infinite' }}>
                <path d="M 75 75 L 75 15 A 60 60 0 0 1 131 46 Z" fill="url(#sweep-grad)" />
                <defs>
                  <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(94,200,255,0)" />
                    <stop offset="100%" stopColor="rgba(94,200,255,0.5)" />
                  </linearGradient>
                </defs>
              </g>
              {/* Blips */}
              <circle cx="95" cy="48" r="2" fill="var(--afterburn)"><animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" /></circle>
              <circle cx="52" cy="98" r="1.5" fill="var(--mach)"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" /></circle>
              <circle cx="104" cy="110" r="1.2" fill="var(--bone)"><animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" /></circle>
            </svg>
          </div>
          <div className="mt-2 text-[var(--bone)]/40 text-right">3 CONTACTS · 80 NM</div>
        </div>

        {/* Left: climb profile */}
        <div className="absolute top-[20%] left-[90px] z-10 mono text-[9px] text-[var(--bone)]/60 w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-1 rounded-full bg-[var(--mach)]" style={{ animation: 'hud-pulse 1.2s ease-in-out infinite' }} />
            CLIMB PROFILE
          </div>
          <svg viewBox="0 0 200 90" className="w-full">
            {[0,1,2,3].map(i => (
              <line key={i} x1="0" x2="200" y1={22*i + 4} y2={22*i + 4} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
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
